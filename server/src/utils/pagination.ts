import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export function getPaginationMeta(total: number, input: PaginationInput) {
  return {
    total,
    page: input.page,
    limit: input.limit,
    totalPages: Math.ceil(total / input.limit),
  } as const;
}

export function getOffset(input: PaginationInput): number {
  return (input.page - 1) * input.limit;
}
