import { Request, Response, NextFunction } from "express";
import { eq, and, desc, sql, count, inArray } from "drizzle-orm";
import { db } from "../db";
import {
  orders,
  orderDetails,
  orderToppings,
  reviews,
  products,
  sizes,
  toppings,
  vouchers,
  branches,
  categoryToppings,
} from "../db/schema";
import { isNotNull } from "drizzle-orm";
import {
  createOrderBodySchema,
  orderListQuerySchema,
  orderIdParamSchema,
  updateOrderStatusBodySchema,
  createReviewBodySchema,
  trackOrderBodySchema,
} from "../validators/orders.validator";
import type { AppError } from "../middleware/error-handler";
import { emitNewOrder, emitOrderStatusChanged } from "../sockets/events";

type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "completed"
  | "cancelled";

// Map legacy DB statuses to current status values
const LEGACY_STATUS_MAP: Record<string, OrderStatus> = {
  received: "pending",
  prepared: "ready",
  collected: "delivered",
  paid: "completed",
};

function normalizeStatus(status: string): OrderStatus {
  return LEGACY_STATUS_MAP[status] ?? (status as OrderStatus);
}

const VALID_STATUS_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["delivering", "completed", "cancelled"], // "completed" for in-store pickup
  delivering: ["delivered", "cancelled"],
  delivered: ["completed"],
  completed: [],
  cancelled: [],
};

function createError(message: string, statusCode: number): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  return error;
}

function toNumber(value: string): number {
  return Number(value);
}

function toDecimalString(value: number): string {
  return value.toFixed(2);
}

export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = createOrderBodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw createError(parsed.error.issues.map((i) => i.message).join(", "), 400);
    }
    const body = parsed.data;

    const result = await db.transaction(async (tx) => {
      // Fetch all product prices and category IDs
      const productIds = [...new Set(body.items.map((item) => item.productId))];
      const fetchedProducts = await tx
        .select({ id: products.id, basePrice: products.basePrice, categoryId: products.categoryId })
        .from(products)
        .where(inArray(products.id, productIds));

      const productPriceMap = new Map(
        fetchedProducts.map((p) => [p.id, toNumber(p.basePrice)])
      );
      const productCategoryMap = new Map(
        fetchedProducts.map((p) => [p.id, p.categoryId])
      );

      // Validate all products exist
      const missingProducts = productIds.filter((id) => !productPriceMap.has(id));
      if (missingProducts.length > 0) {
        throw createError(`Products not found: ${missingProducts.join(", ")}`, 400);
      }

      // Validate toppings are allowed for each product's category
      const categoryIds = [...new Set(fetchedProducts.map((p) => p.categoryId))];
      const categoryToppingRows = categoryIds.length > 0
        ? await tx
            .select({ categoryId: categoryToppings.categoryId, toppingId: categoryToppings.toppingId })
            .from(categoryToppings)
            .where(inArray(categoryToppings.categoryId, categoryIds))
        : [];

      // Build map: categoryId -> Set of allowed topping IDs (empty set = no restrictions)
      const categoryToppingMap = new Map<number, Set<number>>();
      for (const row of categoryToppingRows) {
        const existing = categoryToppingMap.get(row.categoryId) ?? new Set();
        categoryToppingMap.set(row.categoryId, existing.add(row.toppingId));
      }

      for (const item of body.items) {
        if (item.toppingIds.length === 0) continue;
        const catId = productCategoryMap.get(item.productId)!;
        const allowedToppings = categoryToppingMap.get(catId);
        // If no restrictions configured for this category, all toppings are allowed
        if (!allowedToppings) continue;
        const invalidToppings = item.toppingIds.filter((tid) => !allowedToppings.has(tid));
        if (invalidToppings.length > 0) {
          throw createError(
            `Toppings [${invalidToppings.join(", ")}] are not allowed for product ${item.productId}'s category`,
            400
          );
        }
      }

      // Fetch all size prices
      const sizeIds = [
        ...new Set(body.items.filter((i) => i.sizeId).map((i) => i.sizeId!)),
      ];
      const sizePriceMap = new Map<number, number>();
      if (sizeIds.length > 0) {
        const fetchedSizes = await tx
          .select({ id: sizes.id, additionalPrice: sizes.additionalPrice })
          .from(sizes)
          .where(inArray(sizes.id, sizeIds));

        for (const s of fetchedSizes) {
          sizePriceMap.set(s.id, toNumber(s.additionalPrice));
        }

        const missingSizes = sizeIds.filter((id) => !sizePriceMap.has(id));
        if (missingSizes.length > 0) {
          throw createError(`Sizes not found: ${missingSizes.join(", ")}`, 400);
        }
      }

      // Fetch all topping prices
      const allToppingIds = [
        ...new Set(body.items.flatMap((i) => i.toppingIds)),
      ];
      const toppingPriceMap = new Map<number, number>();
      if (allToppingIds.length > 0) {
        const fetchedToppings = await tx
          .select({ id: toppings.id, price: toppings.price })
          .from(toppings)
          .where(inArray(toppings.id, allToppingIds));

        for (const t of fetchedToppings) {
          toppingPriceMap.set(t.id, toNumber(t.price));
        }

        const missingToppings = allToppingIds.filter((id) => !toppingPriceMap.has(id));
        if (missingToppings.length > 0) {
          throw createError(`Toppings not found: ${missingToppings.join(", ")}`, 400);
        }
      }

      // Calculate item prices
      const itemCalculations = body.items.map((item) => {
        const basePrice = productPriceMap.get(item.productId)!;
        const sizePrice = item.sizeId ? (sizePriceMap.get(item.sizeId) ?? 0) : 0;
        const toppingsTotal = item.toppingIds.reduce(
          (sum, tid) => sum + (toppingPriceMap.get(tid) ?? 0),
          0
        );
        const unitPrice = basePrice + sizePrice + toppingsTotal;
        const totalPrice = unitPrice * item.quantity;

        return {
          ...item,
          priceAtOrderTime: unitPrice,
          totalPrice,
          toppingPrices: item.toppingIds.map((tid) => ({
            toppingId: tid,
            unitPrice: toppingPriceMap.get(tid) ?? 0,
          })),
        };
      });

      const subtotal = itemCalculations.reduce((sum, ic) => sum + ic.totalPrice, 0);

      // Voucher handling
      let discountAmount = 0;
      let voucherId: number | null = null;

      if (body.voucherCode) {
        const [voucher] = await tx
          .select()
          .from(vouchers)
          .where(eq(vouchers.code, body.voucherCode))
          .limit(1);

        if (!voucher) {
          throw createError("Voucher not found", 400);
        }

        const today = new Date().toISOString().split("T")[0]!;
        if (voucher.expirationDate < today) {
          throw createError("Voucher has expired", 400);
        }

        const minOrderValue = toNumber(voucher.minOrderValue);
        if (subtotal < minOrderValue) {
          throw createError(
            `Order subtotal ${subtotal} does not meet minimum ${minOrderValue} for this voucher`,
            400
          );
        }

        if (voucher.type === "percentage") {
          discountAmount = subtotal * (toNumber(voucher.discountValue) / 100);
        } else {
          discountAmount = toNumber(voucher.discountValue);
        }

        discountAmount = Math.min(discountAmount, subtotal);
        voucherId = voucher.id;
      }

      const totalPayment = subtotal - discountAmount;

      // Insert order
      const isGuest = body.guestInfo !== undefined && body.customerId === undefined;
      const [createdOrder] = await tx
        .insert(orders)
        .values({
          customerId: body.customerId ?? null,
          branchId: body.branchId,
          voucherId,
          subtotal: toDecimalString(subtotal),
          discountAmount: toDecimalString(discountAmount),
          totalPayment: toDecimalString(totalPayment),
          paymentMethod: body.paymentMethod,
          deliveryAddress: body.deliveryAddress ?? null,
          note: body.note ?? null,
          isGuest,
          guestName: body.guestInfo?.name ?? null,
          guestPhone: body.guestInfo?.phone ?? null,
          guestEmail: body.guestInfo?.email ?? null,
        })
        .returning();

      // Insert order details and toppings
      for (const calc of itemCalculations) {
        const [detail] = await tx
          .insert(orderDetails)
          .values({
            orderId: createdOrder!.id,
            productId: calc.productId,
            sizeId: calc.sizeId ?? null,
            quantity: calc.quantity,
            sugarLevel: calc.sugarLevel,
            iceLevel: calc.iceLevel,
            priceAtOrderTime: toDecimalString(calc.priceAtOrderTime),
            totalPrice: toDecimalString(calc.totalPrice),
          })
          .returning();

        if (calc.toppingPrices.length > 0) {
          await tx.insert(orderToppings).values(
            calc.toppingPrices.map((tp) => ({
              orderDetailId: detail!.id,
              toppingId: tp.toppingId,
              unitPriceAtSaleTime: toDecimalString(tp.unitPrice),
            }))
          );
        }
      }

      return createdOrder!;
    });

    emitNewOrder(result);

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = orderListQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw createError(parsed.error.issues.map((i) => i.message).join(", "), 400);
    }
    const { customerId, status, page, limit } = parsed.data;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (customerId) {
      conditions.push(eq(orders.customerId, customerId));
    }
    if (status) {
      conditions.push(eq(orders.status, status));
    }
    const whereClause = conditions.length === 0
      ? undefined
      : conditions.length === 1
        ? conditions[0]!
        : and(...conditions)!;

    const [orderRows, countResult] = await Promise.all([
      db
        .select({
          id: orders.id,
          customerId: orders.customerId,
          branchId: orders.branchId,
          branchName: branches.name,
          subtotal: orders.subtotal,
          discountAmount: orders.discountAmount,
          totalPayment: orders.totalPayment,
          paymentMethod: orders.paymentMethod,
          status: orders.status,
          deliveryAddress: orders.deliveryAddress,
          orderDate: orders.orderDate,
          note: orders.note,
          isGuest: orders.isGuest,
          guestName: orders.guestName,
          guestPhone: orders.guestPhone,
          hasReview: sql<boolean>`${reviews.id} IS NOT NULL`.as("has_review"),
        })
        .from(orders)
        .leftJoin(branches, eq(orders.branchId, branches.id))
        .leftJoin(reviews, eq(orders.id, reviews.orderId))
        .where(whereClause)
        .orderBy(desc(orders.orderDate))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(orders)
        .where(whereClause),
    ]);

    const total = countResult[0]?.total ?? 0;

    res.json({
      success: true,
      data: orderRows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = orderIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      throw createError("Invalid order ID", 400);
    }
    const { id } = parsed.data;

    // Fetch order with branch
    const [order] = await db
      .select({
        id: orders.id,
        customerId: orders.customerId,
        branchId: orders.branchId,
        branchName: branches.name,
        voucherId: orders.voucherId,
        subtotal: orders.subtotal,
        discountAmount: orders.discountAmount,
        totalPayment: orders.totalPayment,
        paymentMethod: orders.paymentMethod,
        status: orders.status,
        deliveryAddress: orders.deliveryAddress,
        orderDate: orders.orderDate,
        note: orders.note,
        isGuest: orders.isGuest,
        guestName: orders.guestName,
        guestPhone: orders.guestPhone,
        guestEmail: orders.guestEmail,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(branches, eq(orders.branchId, branches.id))
      .where(eq(orders.id, id))
      .limit(1);

    if (!order) {
      throw createError("Order not found", 404);
    }

    // Fetch order details with product and size names
    const details = await db
      .select({
        id: orderDetails.id,
        productId: orderDetails.productId,
        productName: products.name,
        sizeId: orderDetails.sizeId,
        sizeName: sizes.name,
        quantity: orderDetails.quantity,
        sugarLevel: orderDetails.sugarLevel,
        iceLevel: orderDetails.iceLevel,
        priceAtOrderTime: orderDetails.priceAtOrderTime,
        totalPrice: orderDetails.totalPrice,
      })
      .from(orderDetails)
      .leftJoin(products, eq(orderDetails.productId, products.id))
      .leftJoin(sizes, eq(orderDetails.sizeId, sizes.id))
      .where(eq(orderDetails.orderId, id));

    // Fetch toppings for all details
    const detailIds = details.map((d) => d.id);
    const toppingRows =
      detailIds.length > 0
        ? await db
            .select({
              id: orderToppings.id,
              orderDetailId: orderToppings.orderDetailId,
              toppingId: orderToppings.toppingId,
              toppingName: toppings.name,
              unitPriceAtSaleTime: orderToppings.unitPriceAtSaleTime,
            })
            .from(orderToppings)
            .leftJoin(toppings, eq(orderToppings.toppingId, toppings.id))
            .where(inArray(orderToppings.orderDetailId, detailIds))
        : [];

    // Group toppings by detail ID
    const toppingsByDetailId = new Map<number, typeof toppingRows>();
    for (const row of toppingRows) {
      const existing = toppingsByDetailId.get(row.orderDetailId) ?? [];
      toppingsByDetailId.set(row.orderDetailId, [...existing, row]);
    }

    const detailsWithToppings = details.map((detail) => ({
      ...detail,
      toppings: toppingsByDetailId.get(detail.id) ?? [],
    }));

    // Fetch review if exists
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.orderId, id))
      .limit(1);

    res.json({
      success: true,
      data: {
        ...order,
        items: detailsWithToppings,
        review: review ?? null,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const paramParsed = orderIdParamSchema.safeParse(req.params);
    if (!paramParsed.success) {
      throw createError("Invalid order ID", 400);
    }
    const { id } = paramParsed.data;

    const bodyParsed = updateOrderStatusBodySchema.safeParse(req.body);
    if (!bodyParsed.success) {
      throw createError(bodyParsed.error.issues.map((i) => i.message).join(", "), 400);
    }
    const { status: newStatus } = bodyParsed.data;

    const [existingOrder] = await db
      .select({ id: orders.id, status: orders.status })
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!existingOrder) {
      throw createError("Order not found", 404);
    }

    const currentStatus = normalizeStatus(existingOrder.status);
    const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(newStatus as OrderStatus)) {
      throw createError(
        `Cannot transition from "${currentStatus}" to "${newStatus}". Allowed: ${allowedTransitions.join(", ") || "none (terminal state)"}`,
        400
      );
    }

    const [updated] = await db
      .update(orders)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    emitOrderStatusChanged(updated!);

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function createReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const paramParsed = orderIdParamSchema.safeParse(req.params);
    if (!paramParsed.success) {
      throw createError("Invalid order ID", 400);
    }
    const { id: orderId } = paramParsed.data;

    const bodyParsed = createReviewBodySchema.safeParse(req.body);
    if (!bodyParsed.success) {
      throw createError(bodyParsed.error.issues.map((i) => i.message).join(", "), 400);
    }
    const { starRating, content } = bodyParsed.data;

    // Validate order exists and is paid
    const [order] = await db
      .select({ id: orders.id, status: orders.status })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw createError("Order not found", 404);
    }

    if (order.status !== "completed") {
      throw createError("Reviews can only be submitted for completed orders", 400);
    }

    // Check for existing review
    const [existingReview] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.orderId, orderId))
      .limit(1);

    if (existingReview) {
      throw createError("A review already exists for this order", 409);
    }

    const [review] = await db
      .insert(reviews)
      .values({
        orderId,
        starRating,
        content: content ?? null,
      })
      .returning();

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
}

export async function trackOrder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = trackOrderBodySchema.safeParse(req.body);
    if (!parsed.success) {
      throw createError(parsed.error.issues.map((i) => i.message).join(", "), 400);
    }
    const { orderId, phone } = parsed.data;

    const [order] = await db
      .select({
        id: orders.id,
        branchId: orders.branchId,
        branchName: branches.name,
        subtotal: orders.subtotal,
        discountAmount: orders.discountAmount,
        totalPayment: orders.totalPayment,
        paymentMethod: orders.paymentMethod,
        status: orders.status,
        deliveryAddress: orders.deliveryAddress,
        orderDate: orders.orderDate,
        note: orders.note,
        isGuest: orders.isGuest,
        guestName: orders.guestName,
        guestPhone: orders.guestPhone,
      })
      .from(orders)
      .leftJoin(branches, eq(orders.branchId, branches.id))
      .where(and(eq(orders.id, orderId), eq(orders.guestPhone, phone)))
      .limit(1);

    if (!order) {
      throw createError("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại.", 404);
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}
