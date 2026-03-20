import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

interface ValidationSchemas {
  readonly body?: ZodSchema;
  readonly query?: ZodSchema;
  readonly params?: ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((i) => `body.${i.path.join(".")}: ${i.message}`),
        );
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((i) => `query.${i.path.join(".")}: ${i.message}`),
        );
      } else {
        (req as unknown as Record<string, unknown>).validatedQuery = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map((i) => `params.${i.path.join(".")}: ${i.message}`),
        );
      } else {
        (req as unknown as Record<string, unknown>).validatedParams = result.data;
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ success: false, error: "Validation failed", details: errors });
      return;
    }

    next();
  };
}
