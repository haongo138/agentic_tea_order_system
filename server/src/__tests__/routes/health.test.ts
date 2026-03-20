/**
 * Integration tests for GET /health endpoint.
 *
 * These tests require:
 * - DATABASE_URL environment variable set
 * - JWT_SECRET environment variable set (min 32 chars)
 *
 * If the environment is not configured, tests are skipped automatically.
 */
import { describe, it, expect } from "vitest";

const hasRequiredEnv =
  Boolean(process.env.DATABASE_URL) &&
  Boolean(process.env.JWT_SECRET) &&
  (process.env.JWT_SECRET?.length ?? 0) >= 32;

const describeWithEnv = hasRequiredEnv ? describe : describe.skip;

describeWithEnv("GET /api/health", () => {
  it("returns 200 with success shape", async () => {
    const request = (await import("supertest")).default;
    const { createApp } = await import("../../app");
    const app = createApp();

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("status");
    expect(response.body.data).toHaveProperty("timestamp");
    expect(response.body.data).toHaveProperty("uptime");
  });

  it("includes services status in response", async () => {
    const request = (await import("supertest")).default;
    const { createApp } = await import("../../app");
    const app = createApp();

    const response = await request(app).get("/api/health");

    expect(response.body.data).toHaveProperty("services");
    expect(response.body.data.services).toHaveProperty("database");
  });
});
