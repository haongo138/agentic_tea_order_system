import { z } from "zod";

const SALES_STATUSES = ["available", "unavailable", "discontinued"] as const;
const BRANCH_PRODUCT_STATUSES = ["available", "unavailable", "out_of_stock"] as const;

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const branchProductParamSchema = z.object({
  productId: z.coerce.number().int().positive(),
  branchId: z.coerce.number().int().positive(),
});

export const createProductBodySchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be a valid price"),
  imageUrl: z.string().url().optional(),
});

export const updateProductBodySchema = z.object({
  categoryId: z.number().int().positive().optional(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  basePrice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Must be a valid price").optional(),
  imageUrl: z.string().url().optional(),
  salesStatus: z.enum(SALES_STATUSES).optional(),
});

export const updateBranchProductStatusBodySchema = z.object({
  status: z.enum(BRANCH_PRODUCT_STATUSES),
});

export type ProductIdParam = z.infer<typeof productIdParamSchema>;
export type BranchProductParam = z.infer<typeof branchProductParamSchema>;
export type CreateProductBody = z.infer<typeof createProductBodySchema>;
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
export type UpdateBranchProductStatusBody = z.infer<typeof updateBranchProductStatusBodySchema>;
