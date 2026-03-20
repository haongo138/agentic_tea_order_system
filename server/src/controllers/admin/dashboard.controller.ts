import { Request, Response, NextFunction } from "express";
import { eq, gte, lte, and, sql, count, avg, sum, ne } from "drizzle-orm";
import { db } from "../../db";
import { orders, reviews, orderDetails, products } from "../../db/schema";
import { sendSuccess } from "../../utils/response";
import {
  revenueChartQuerySchema,
  topProductsQuerySchema,
} from "../../validators/admin/dashboard.validator";

function getTodayRange(): { readonly start: Date; readonly end: Date } {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  return { start: todayStart, end: todayEnd };
}

export async function getDashboardStats(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { start, end } = getTodayRange();

    const todayFilter = and(
      gte(orders.orderDate, start),
      lte(orders.orderDate, end),
    );

    const todayNonCancelledFilter = and(
      todayFilter,
      ne(orders.status, "cancelled"),
    );

    const [
      revenueResult,
      ordersResult,
      ratingResult,
    ] = await Promise.all([
      db
        .select({ value: sum(orders.totalPayment) })
        .from(orders)
        .where(todayNonCancelledFilter),
      db
        .select({ value: count() })
        .from(orders)
        .where(todayFilter),
      db
        .select({ value: avg(reviews.starRating) })
        .from(reviews),
    ]);

    const stats = {
      revenueToday: Number(revenueResult[0]?.value ?? 0),
      ordersToday: ordersResult[0]?.value ?? 0,
      avgRating: Number(Number(ratingResult[0]?.value ?? 0).toFixed(1)),
    };

    sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
}

export async function getRevenueChart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = revenueChartQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { days } = parsed.data;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const rows = await db
      .select({
        date: sql<string>`DATE(${orders.orderDate})`.as("date"),
        revenue: sum(orders.totalPayment).as("revenue"),
        orders: count().as("orders"),
      })
      .from(orders)
      .where(
        and(
          gte(orders.orderDate, startDate),
          ne(orders.status, "cancelled"),
        ),
      )
      .groupBy(sql`DATE(${orders.orderDate})`)
      .orderBy(sql`DATE(${orders.orderDate})`);

    const data = rows.map((row) => ({
      date: row.date,
      revenue: Number(row.revenue ?? 0),
      orders: row.orders,
    }));

    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getTopProducts(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = topProductsQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { limit } = parsed.data;

    const rows = await db
      .select({
        productId: orderDetails.productId,
        productName: products.name,
        imageUrl: products.imageUrl,
        totalQuantity: sum(orderDetails.quantity).as("total_quantity"),
        totalRevenue: sum(orderDetails.totalPrice).as("total_revenue"),
      })
      .from(orderDetails)
      .innerJoin(products, eq(orderDetails.productId, products.id))
      .groupBy(orderDetails.productId, products.name, products.imageUrl)
      .orderBy(sql`total_quantity DESC`)
      .limit(limit);

    const data = rows.map((row) => ({
      productId: row.productId,
      productName: row.productName,
      imageUrl: row.imageUrl,
      totalQuantity: Number(row.totalQuantity ?? 0),
      totalRevenue: Number(row.totalRevenue ?? 0),
    }));

    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}

export async function getSentimentSummary(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const [totalResult] = await db
      .select({ value: count() })
      .from(reviews);

    const [positiveResult] = await db
      .select({ value: count() })
      .from(reviews)
      .where(gte(reviews.starRating, 4));

    const [neutralResult] = await db
      .select({ value: count() })
      .from(reviews)
      .where(eq(reviews.starRating, 3));

    const [negativeResult] = await db
      .select({ value: count() })
      .from(reviews)
      .where(lte(reviews.starRating, 2));

    const data = {
      total: totalResult?.value ?? 0,
      positive: positiveResult?.value ?? 0,
      neutral: neutralResult?.value ?? 0,
      negative: negativeResult?.value ?? 0,
    };

    sendSuccess(res, data);
  } catch (err) {
    next(err);
  }
}
