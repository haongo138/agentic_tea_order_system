import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../middleware/async-handler";

function createMockReqResNext() {
  const req = {} as Request;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe("asyncHandler", () => {
  it("calls the wrapped async function with req, res, next", async () => {
    const { req, res, next } = createMockReqResNext();
    const fn = vi.fn().mockResolvedValue(undefined);

    const handler = asyncHandler(fn);
    await handler(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it("does not call next when async function resolves", async () => {
    const { req, res, next } = createMockReqResNext();
    const fn = vi.fn().mockResolvedValue(undefined);

    const handler = asyncHandler(fn);
    await handler(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it("calls next with error when async function rejects", async () => {
    const { req, res, next } = createMockReqResNext();
    const error = new Error("Something failed");
    const fn = vi.fn().mockRejectedValue(error);

    const handler = asyncHandler(fn);
    await handler(req, res, next);

    // Allow microtask queue to flush
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(next).toHaveBeenCalledWith(error);
  });

  it("catches synchronous errors thrown in async function", async () => {
    const { req, res, next } = createMockReqResNext();
    const error = new Error("Sync throw inside async");
    const fn = vi.fn().mockImplementation(async () => {
      throw error;
    });

    const handler = asyncHandler(fn);
    await handler(req, res, next);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(next).toHaveBeenCalledWith(error);
  });
});
