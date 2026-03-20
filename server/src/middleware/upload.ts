import multer from "multer";
import type { Request, Response, NextFunction } from "express";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

function isMulterError(err: unknown): err is Error {
  return (
    err instanceof Error &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string" &&
    (err as { code: string }).code.startsWith("LIMIT_")
  );
}

export function uploadSingle(req: Request, res: Response, next: NextFunction): void {
  upload.single("file")(req, res, (err: unknown) => {
    if (isMulterError(err)) {
      const appError = Object.assign(new Error(err.message), { statusCode: 400 });
      return next(appError);
    }
    if (err) return next(err);
    next();
  });
}
