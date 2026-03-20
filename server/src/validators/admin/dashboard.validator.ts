import { z } from "zod";

const MIN_DAYS = 1;
const MAX_DAYS = 90;
const DEFAULT_DAYS = 7;

const MIN_LIMIT = 1;
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

export const revenueChartQuerySchema = z.object({
  days: z.coerce.number().int().min(MIN_DAYS).max(MAX_DAYS).default(DEFAULT_DAYS),
});

export const topProductsQuerySchema = z.object({
  limit: z.coerce.number().int().min(MIN_LIMIT).max(MAX_LIMIT).default(DEFAULT_LIMIT),
});

export type RevenueChartQuery = z.infer<typeof revenueChartQuerySchema>;
export type TopProductsQuery = z.infer<typeof topProductsQuerySchema>;
