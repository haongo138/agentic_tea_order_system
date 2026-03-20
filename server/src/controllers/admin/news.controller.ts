import { Request, Response, NextFunction } from "express";
import { eq, and, count, desc } from "drizzle-orm";
import { db } from "../../db";
import { news } from "../../db/schema";
import { sendSuccess, sendPaginated, sendNotFound, sendError } from "../../utils/response";
import { getPaginationMeta, getOffset } from "../../utils/pagination";
import {
  getNewsQuerySchema,
  newsIdParamSchema,
  createNewsBodySchema,
  updateNewsBodySchema,
  updateNewsStatusBodySchema,
} from "../../validators/admin/news.validator";

export async function getNewsList(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = getNewsQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      sendError(res, "Invalid query parameters");
      return;
    }

    const query = parsed.data;
    const offset = getOffset(query);

    const conditions = [];

    if (query.articleType) {
      conditions.push(eq(news.articleType, query.articleType));
    }

    if (query.publishStatus) {
      conditions.push(eq(news.publishStatus, query.publishStatus));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(news)
        .where(whereClause)
        .orderBy(desc(news.publishDate))
        .limit(query.limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(news)
        .where(whereClause),
    ]);

    const total = totalResult[0]?.value ?? 0;
    const meta = getPaginationMeta(total, query);

    sendPaginated(res, rows, meta);
  } catch (err) {
    next(err);
  }
}

export async function createNews(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createNewsBodySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const [created] = await db
      .insert(news)
      .values(parsed.data)
      .returning();

    sendSuccess(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateNews(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const paramParsed = newsIdParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      sendError(res, "Invalid news ID");
      return;
    }

    const bodyParsed = updateNewsBodySchema.safeParse(req.body);

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
      .update(news)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(news.id, paramParsed.data.id))
      .returning();

    if (!updated) {
      sendNotFound(res, "News article");
      return;
    }

    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
}

export async function updateNewsStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const paramParsed = newsIdParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      sendError(res, "Invalid news ID");
      return;
    }

    const bodyParsed = updateNewsStatusBodySchema.safeParse(req.body);

    if (!bodyParsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: bodyParsed.error.flatten().fieldErrors,
      });
      return;
    }

    const [updated] = await db
      .update(news)
      .set({ publishStatus: bodyParsed.data.publishStatus, updatedAt: new Date() })
      .where(eq(news.id, paramParsed.data.id))
      .returning();

    if (!updated) {
      sendNotFound(res, "News article");
      return;
    }

    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteNews(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = newsIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      sendError(res, "Invalid news ID");
      return;
    }

    const [deleted] = await db
      .delete(news)
      .where(eq(news.id, parsed.data.id))
      .returning();

    if (!deleted) {
      sendNotFound(res, "News article");
      return;
    }

    sendSuccess(res, deleted);
  } catch (err) {
    next(err);
  }
}
