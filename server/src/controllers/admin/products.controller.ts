import { Request, Response, NextFunction } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "../../db";
import { products, branchProductStatus } from "../../db/schema";
import { sendSuccess, sendNotFound, sendError } from "../../utils/response";
import {
  productIdParamSchema,
  branchProductParamSchema,
  createProductBodySchema,
  updateProductBodySchema,
  updateBranchProductStatusBodySchema,
} from "../../validators/admin/products.validator";

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createProductBodySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const [created] = await db
      .insert(products)
      .values(parsed.data)
      .returning();

    sendSuccess(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const paramParsed = productIdParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      sendError(res, "Invalid product ID");
      return;
    }

    const bodyParsed = updateProductBodySchema.safeParse(req.body);

    if (!bodyParsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: bodyParsed.error.flatten().fieldErrors,
      });
      return;
    }

    const updateData = bodyParsed.data;

    if (Object.keys(updateData).length === 0) {
      sendError(res, "No fields to update");
      return;
    }

    const [updated] = await db
      .update(products)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(products.id, paramParsed.data.id))
      .returning();

    if (!updated) {
      sendNotFound(res, "Product");
      return;
    }

    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = productIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      sendError(res, "Invalid product ID");
      return;
    }

    const [updated] = await db
      .update(products)
      .set({ salesStatus: "discontinued", updatedAt: new Date() })
      .where(eq(products.id, parsed.data.id))
      .returning();

    if (!updated) {
      sendNotFound(res, "Product");
      return;
    }

    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
}

export async function updateBranchProductStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const paramParsed = branchProductParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      sendError(res, "Invalid product or branch ID");
      return;
    }

    const bodyParsed = updateBranchProductStatusBodySchema.safeParse(req.body);

    if (!bodyParsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: bodyParsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { productId, branchId } = paramParsed.data;
    const { status } = bodyParsed.data;

    // Check if record exists
    const [existing] = await db
      .select({ id: branchProductStatus.id })
      .from(branchProductStatus)
      .where(
        and(
          eq(branchProductStatus.productId, productId),
          eq(branchProductStatus.branchId, branchId),
        ),
      )
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(branchProductStatus)
        .set({ status, updatedAt: new Date() })
        .where(eq(branchProductStatus.id, existing.id))
        .returning();

      sendSuccess(res, updated);
    } else {
      const [created] = await db
        .insert(branchProductStatus)
        .values({ productId, branchId, status })
        .returning();

      sendSuccess(res, created, 201);
    }
  } catch (err) {
    next(err);
  }
}
