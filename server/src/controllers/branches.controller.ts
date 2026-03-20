import { Request, Response, NextFunction } from "express";
import { eq, sql, count } from "drizzle-orm";
import { db } from "../db";
import { branches } from "../db/schema";
import { sendSuccess, sendPaginated, sendNotFound } from "../utils/response";
import { getPaginationMeta, getOffset } from "../utils/pagination";
import {
  getBranchesQuerySchema,
  nearestBranchesQuerySchema,
} from "../validators/branches.validator";

export async function getBranches(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = getBranchesQuerySchema.parse(req.query);
    const offset = getOffset(query);

    const whereClause = query.status
      ? eq(branches.operatingStatus, query.status)
      : undefined;

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(branches)
        .where(whereClause)
        .limit(query.limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(branches)
        .where(whereClause),
    ]);

    const total = totalResult[0]?.value ?? 0;
    const meta = getPaginationMeta(total, query);

    sendPaginated(res, rows, meta);
  } catch (err) {
    next(err);
  }
}

export async function getBranchById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id < 1) {
      sendNotFound(res, "Branch");
      return;
    }

    const rows = await db
      .select()
      .from(branches)
      .where(eq(branches.id, id))
      .limit(1);

    const branch = rows[0];

    if (!branch) {
      sendNotFound(res, "Branch");
      return;
    }

    sendSuccess(res, branch);
  } catch (err) {
    next(err);
  }
}

export async function getNearestBranches(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const query = nearestBranchesQuerySchema.parse(req.query);

    const distanceExpression = sql<number>`(
      6371 * acos(
        cos(radians(${query.lat})) * cos(radians(${branches.latitude})) *
        cos(radians(${branches.longitude}) - radians(${query.lng})) +
        sin(radians(${query.lat})) * sin(radians(${branches.latitude}))
      )
    )`;

    const rows = await db
      .select({
        id: branches.id,
        name: branches.name,
        address: branches.address,
        longitude: branches.longitude,
        latitude: branches.latitude,
        operatingStatus: branches.operatingStatus,
        createdAt: branches.createdAt,
        updatedAt: branches.updatedAt,
        distance_km: distanceExpression,
      })
      .from(branches)
      .where(eq(branches.operatingStatus, "open"))
      .orderBy(distanceExpression)
      .limit(query.limit);

    sendSuccess(res, rows);
  } catch (err) {
    next(err);
  }
}
