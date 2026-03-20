import { Request, Response, NextFunction } from "express";
import { sendSuccess, sendError } from "../utils/response";
import {
  uploadImage,
  deleteImage,
  isValidBucket,
  isValidMimeType,
  isValidFileSize,
  extractPathFromUrl,
  type StorageBucket,
} from "../utils/storage";

export async function handleUpload(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bucket = req.params.bucket as string;

    if (!isValidBucket(bucket)) {
      sendError(res, `Invalid bucket. Must be one of: products, news, branches`);
      return;
    }

    const file = req.file;

    if (!file) {
      sendError(res, "No file provided");
      return;
    }

    if (!isValidMimeType(file.mimetype)) {
      sendError(res, "Invalid file type. Allowed: jpg, png, webp, gif");
      return;
    }

    if (!isValidFileSize(file.size)) {
      sendError(res, "File too large. Maximum size: 5MB");
      return;
    }

    const result = await uploadImage(
      bucket as StorageBucket,
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function handleDelete(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const bucket = req.params.bucket as string;

    if (!isValidBucket(bucket)) {
      sendError(res, `Invalid bucket. Must be one of: products, news, branches`);
      return;
    }

    const { url } = req.body as { url?: string };

    if (!url || typeof url !== "string") {
      sendError(res, "Missing 'url' in request body");
      return;
    }

    const filePath = extractPathFromUrl(url, bucket);

    if (!filePath) {
      sendError(res, "Could not extract file path from URL");
      return;
    }

    await deleteImage(bucket as StorageBucket, filePath);

    sendSuccess(res, { deleted: true });
  } catch (err) {
    next(err);
  }
}
