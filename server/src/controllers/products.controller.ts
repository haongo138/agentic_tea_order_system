import { Request, Response } from "express";
import { eq, ilike, and, sql, count, asc, inArray } from "drizzle-orm";
import { db } from "../db";
import { products, productCategories, sizes, toppings, categoryToppings } from "../db/schema";
import {
  productListQuerySchema,
  productIdParamSchema,
  categoryIdParamSchema,
} from "../validators/products.validator";

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const parsed = productListQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { search, category, page, limit, status } = parsed.data;
    const offset = (page - 1) * limit;

    const conditions = [eq(products.salesStatus, status)];

    if (category) {
      conditions.push(eq(products.categoryId, category));
    }

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }

    const whereClause = and(...conditions);

    const [items, [{ total }]] = await Promise.all([
      db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          basePrice: products.basePrice,
          imageUrl: products.imageUrl,
          salesStatus: products.salesStatus,
          categoryId: products.categoryId,
          categoryName: productCategories.name,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
        })
        .from(products)
        .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
        .where(whereClause)
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(products).where(whereClause),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: items,
      meta: { total, page, limit, totalPages },
    });
  } catch (err) {
    console.error("[products] Failed to list products:", err);
    res.status(500).json({ success: false, error: "Failed to retrieve products" });
  }
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  try {
    const parsed = productIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid product ID",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { id } = parsed.data;

    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        basePrice: products.basePrice,
        imageUrl: products.imageUrl,
        salesStatus: products.salesStatus,
        categoryId: products.categoryId,
        categoryName: productCategories.name,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .where(eq(products.id, id))
      .limit(1);

    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    res.json({ success: true, data: product });
  } catch (err) {
    console.error("[products] Failed to get product:", err);
    res.status(500).json({ success: false, error: "Failed to retrieve product" });
  }
}

export async function getCategories(_req: Request, res: Response): Promise<void> {
  try {
    const categories = await db
      .select({
        id: productCategories.id,
        name: productCategories.name,
        description: productCategories.description,
        productCount: count(products.id),
        createdAt: productCategories.createdAt,
        updatedAt: productCategories.updatedAt,
      })
      .from(productCategories)
      .leftJoin(products, eq(productCategories.id, products.categoryId))
      .groupBy(
        productCategories.id,
        productCategories.name,
        productCategories.description,
        productCategories.createdAt,
        productCategories.updatedAt,
      );

    res.json({ success: true, data: categories });
  } catch (err) {
    console.error("[products] Failed to list categories:", err);
    res.status(500).json({ success: false, error: "Failed to retrieve categories" });
  }
}

export async function getToppings(_req: Request, res: Response): Promise<void> {
  try {
    const items = await db
      .select({
        id: toppings.id,
        name: toppings.name,
        price: toppings.price,
        status: toppings.status,
      })
      .from(toppings)
      .where(eq(toppings.status, "available"));

    res.json({ success: true, data: items });
  } catch (err) {
    console.error("[products] Failed to list toppings:", err);
    res.status(500).json({ success: false, error: "Failed to retrieve toppings" });
  }
}

export async function getSizes(_req: Request, res: Response): Promise<void> {
  try {
    const items = await db
      .select({
        id: sizes.id,
        name: sizes.name,
        additionalPrice: sizes.additionalPrice,
      })
      .from(sizes)
      .orderBy(asc(sizes.additionalPrice));

    res.json({ success: true, data: items });
  } catch (err) {
    console.error("[products] Failed to list sizes:", err);
    res.status(500).json({ success: false, error: "Failed to retrieve sizes" });
  }
}

export async function getToppingsByCategory(req: Request, res: Response): Promise<void> {
  try {
    const parsed = categoryIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid category ID",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { categoryId } = parsed.data;

    // Check if category has any topping restrictions configured
    const restrictions = await db
      .select({ toppingId: categoryToppings.toppingId })
      .from(categoryToppings)
      .where(eq(categoryToppings.categoryId, categoryId));

    let items;

    if (restrictions.length === 0) {
      // No restrictions configured — return all available toppings
      items = await db
        .select({
          id: toppings.id,
          name: toppings.name,
          price: toppings.price,
          status: toppings.status,
        })
        .from(toppings)
        .where(eq(toppings.status, "available"));
    } else {
      // Return only toppings allowed for this category
      const allowedIds = restrictions.map((r) => r.toppingId);
      items = await db
        .select({
          id: toppings.id,
          name: toppings.name,
          price: toppings.price,
          status: toppings.status,
        })
        .from(toppings)
        .where(and(eq(toppings.status, "available"), inArray(toppings.id, allowedIds)));
    }

    res.json({ success: true, data: items });
  } catch (err) {
    console.error("[products] Failed to list toppings by category:", err);
    res.status(500).json({ success: false, error: "Failed to retrieve toppings" });
  }
}
