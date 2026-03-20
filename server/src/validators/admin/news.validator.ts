import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

const ARTICLE_TYPES = ["promotion", "announcement", "blog"] as const;
const PUBLISH_STATUSES = ["draft", "published", "archived"] as const;

export const getNewsQuerySchema = paginationSchema.extend({
  articleType: z.enum(ARTICLE_TYPES).optional(),
  publishStatus: z.enum(PUBLISH_STATUSES).optional(),
});

export const newsIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createNewsBodySchema = z.object({
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  imageUrl: z.string().url().optional(),
  articleType: z.enum(ARTICLE_TYPES),
  publishDate: z.string().date().optional(),
});

export const updateNewsBodySchema = z.object({
  title: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  imageUrl: z.string().url().nullable().optional(),
  articleType: z.enum(ARTICLE_TYPES).optional(),
  publishDate: z.string().date().optional(),
});

export const updateNewsStatusBodySchema = z.object({
  publishStatus: z.enum(PUBLISH_STATUSES),
});

export type GetNewsQuery = z.infer<typeof getNewsQuerySchema>;
export type NewsIdParam = z.infer<typeof newsIdParamSchema>;
export type CreateNewsBody = z.infer<typeof createNewsBodySchema>;
export type UpdateNewsBody = z.infer<typeof updateNewsBodySchema>;
export type UpdateNewsStatusBody = z.infer<typeof updateNewsStatusBodySchema>;
