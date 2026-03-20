import { describe, it, expect } from "vitest";
import {
  paginationSchema,
  getPaginationMeta,
  getOffset,
  PaginationInput,
} from "../../utils/pagination";

describe("paginationSchema", () => {
  it("applies defaults when no input provided", () => {
    const result = paginationSchema.parse({});
    expect(result).toEqual({ page: 1, limit: 20 });
  });

  it("parses valid numeric inputs", () => {
    const result = paginationSchema.parse({ page: 3, limit: 50 });
    expect(result).toEqual({ page: 3, limit: 50 });
  });

  it("coerces string inputs to numbers", () => {
    const result = paginationSchema.parse({ page: "2", limit: "10" });
    expect(result).toEqual({ page: 2, limit: 10 });
  });

  it("rejects page less than 1", () => {
    expect(() => paginationSchema.parse({ page: 0 })).toThrow();
  });

  it("rejects negative page", () => {
    expect(() => paginationSchema.parse({ page: -1 })).toThrow();
  });

  it("rejects limit less than 1", () => {
    expect(() => paginationSchema.parse({ limit: 0 })).toThrow();
  });

  it("rejects limit greater than 100", () => {
    expect(() => paginationSchema.parse({ limit: 101 })).toThrow();
  });

  it("rejects non-integer page", () => {
    expect(() => paginationSchema.parse({ page: 1.5 })).toThrow();
  });

  it("accepts boundary values", () => {
    const result = paginationSchema.parse({ page: 1, limit: 100 });
    expect(result).toEqual({ page: 1, limit: 100 });
  });
});

describe("getPaginationMeta", () => {
  it("calculates meta for first page", () => {
    const input: PaginationInput = { page: 1, limit: 20 };
    const meta = getPaginationMeta(100, input);

    expect(meta).toEqual({
      total: 100,
      page: 1,
      limit: 20,
      totalPages: 5,
    });
  });

  it("calculates meta for middle page", () => {
    const input: PaginationInput = { page: 3, limit: 10 };
    const meta = getPaginationMeta(45, input);

    expect(meta).toEqual({
      total: 45,
      page: 3,
      limit: 10,
      totalPages: 5,
    });
  });

  it("returns totalPages 0 for empty results", () => {
    const input: PaginationInput = { page: 1, limit: 20 };
    const meta = getPaginationMeta(0, input);

    expect(meta).toEqual({
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });
  });

  it("calculates correctly for a single item", () => {
    const input: PaginationInput = { page: 1, limit: 20 };
    const meta = getPaginationMeta(1, input);

    expect(meta).toEqual({
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    });
  });

  it("rounds up totalPages for partial last page", () => {
    const input: PaginationInput = { page: 1, limit: 10 };
    const meta = getPaginationMeta(21, input);

    expect(meta.totalPages).toBe(3);
  });
});

describe("getOffset", () => {
  it("returns 0 for first page", () => {
    expect(getOffset({ page: 1, limit: 20 })).toBe(0);
  });

  it("calculates offset for second page", () => {
    expect(getOffset({ page: 2, limit: 20 })).toBe(20);
  });

  it("calculates offset for arbitrary page and limit", () => {
    expect(getOffset({ page: 5, limit: 10 })).toBe(40);
  });

  it("handles limit of 1", () => {
    expect(getOffset({ page: 3, limit: 1 })).toBe(2);
  });
});
