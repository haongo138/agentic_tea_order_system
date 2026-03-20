import { randomUUID } from "node:crypto";
import path from "node:path";
import { supabase } from "../config/supabase";
import { env } from "../config/env";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const VALID_BUCKETS = ["products", "news", "branches"] as const;
export type StorageBucket = (typeof VALID_BUCKETS)[number];

export function isValidBucket(bucket: string): bucket is StorageBucket {
  return (VALID_BUCKETS as readonly string[]).includes(bucket);
}

export function isValidMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

export function isValidFileSize(size: number): boolean {
  return size > 0 && size <= MAX_FILE_SIZE;
}

function generateFilePath(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || ".jpg";
  return `${randomUUID()}${ext}`;
}

function getPublicUrl(bucket: string, filePath: string): string {
  return `${env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
}

export async function uploadImage(
  bucket: StorageBucket,
  fileBuffer: Buffer,
  originalName: string,
  mimeType: string,
): Promise<{ url: string; path: string }> {
  const filePath = generateFilePath(originalName);

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  return {
    url: getPublicUrl(bucket, filePath),
    path: filePath,
  };
}

export async function deleteImage(
  bucket: StorageBucket,
  filePath: string,
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error(`Storage delete failed for ${bucket}/${filePath}:`, error.message);
  }
}

export function extractPathFromUrl(url: string, bucket: string): string | null {
  const prefix = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(prefix);
  if (idx === -1) return null;
  return url.slice(idx + prefix.length);
}
