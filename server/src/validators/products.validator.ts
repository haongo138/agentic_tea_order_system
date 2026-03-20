import { z } from "zod";

const SALES_STATUS_VALUES = ["available", "unavailable", "discontinued"] as const;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MIN_PAGE = 1;
const MIN_LIMIT = 1;

export const productListQuerySchema = z.object({
  search: z.string().optional(),
  category: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().min(MIN_PAGE).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(MIN_LIMIT).max(MAX_LIMIT).default(DEFAULT_LIMIT),
  status: z.enum(SALES_STATUS_VALUES).default("available"),
});

export const productIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const categoryIdParamSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export type ProductIdParam = z.infer<typeof productIdParamSchema>;
export type CategoryIdParam = z.infer<typeof categoryIdParamSchema>;
