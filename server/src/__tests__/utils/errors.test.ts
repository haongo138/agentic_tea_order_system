import { describe, it, expect } from "vitest";
import {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} from "../../utils/errors";

describe("AppError", () => {
  it("creates error with message and default status 400", () => {
    const error = new AppError("Something went wrong");

    expect(error.message).toBe("Something went wrong");
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("AppError");
  });

  it("creates error with custom status code", () => {
    const error = new AppError("Conflict", 409);

    expect(error.message).toBe("Conflict");
    expect(error.statusCode).toBe(409);
  });

  it("is an instance of Error", () => {
    const error = new AppError("test");
    expect(error).toBeInstanceOf(Error);
  });

  it("has readonly statusCode", () => {
    const error = new AppError("test", 422);
    expect(error.statusCode).toBe(422);
  });
});

describe("NotFoundError", () => {
  it("creates error with default resource message", () => {
    const error = new NotFoundError();

    expect(error.message).toBe("Resource not found");
    expect(error.statusCode).toBe(404);
  });

  it("creates error with custom resource name", () => {
    const error = new NotFoundError("Product");

    expect(error.message).toBe("Product not found");
    expect(error.statusCode).toBe(404);
  });

  it("is an instance of AppError", () => {
    const error = new NotFoundError();
    expect(error).toBeInstanceOf(AppError);
  });
});

describe("UnauthorizedError", () => {
  it("creates error with default message", () => {
    const error = new UnauthorizedError();

    expect(error.message).toBe("Unauthorized");
    expect(error.statusCode).toBe(401);
  });

  it("creates error with custom message", () => {
    const error = new UnauthorizedError("Token expired");

    expect(error.message).toBe("Token expired");
    expect(error.statusCode).toBe(401);
  });

  it("is an instance of AppError", () => {
    const error = new UnauthorizedError();
    expect(error).toBeInstanceOf(AppError);
  });
});

describe("ForbiddenError", () => {
  it("creates error with default message", () => {
    const error = new ForbiddenError();

    expect(error.message).toBe("Forbidden");
    expect(error.statusCode).toBe(403);
  });

  it("creates error with custom message", () => {
    const error = new ForbiddenError("Admin access required");

    expect(error.message).toBe("Admin access required");
    expect(error.statusCode).toBe(403);
  });

  it("is an instance of AppError", () => {
    const error = new ForbiddenError();
    expect(error).toBeInstanceOf(AppError);
  });
});
