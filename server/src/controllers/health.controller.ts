import { Request, Response } from "express";
import { sql } from "drizzle-orm";
import { db } from "../db";

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const start = Date.now();

  let dbStatus: "ok" | "error" = "error";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await db.execute(sql`SELECT 1`);
    dbLatencyMs = Date.now() - dbStart;
    dbStatus = "ok";
  } catch (err) {
    console.error("[health] Database ping failed:", err);
  }

  const status = dbStatus === "ok" ? "healthy" : "degraded";
  const httpStatus = dbStatus === "ok" ? 200 : 503;

  res.status(httpStatus).json({
    success: true,
    data: {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      responseTimeMs: Date.now() - start,
      services: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
        },
      },
    },
  });
}
