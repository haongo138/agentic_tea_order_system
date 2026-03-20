"use client";

import { useState, useRef } from "react";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { uploadImage, deleteImage, type StorageBucket } from "@/lib/api/upload";

interface ImageUploadProps {
  bucket: StorageBucket;
  value: string | null;
  onChange: (url: string | null) => void;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif";
const MAX_SIZE_MB = 5;

export function ImageUpload({ bucket, value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Kích thước tối đa ${MAX_SIZE_MB}MB`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadImage(file, bucket);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải ảnh lên");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!value) return;

    try {
      await deleteImage(value, bucket);
    } catch {
      // Image may already be deleted from storage — that's fine
    }
    onChange(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = "";
  }

  if (value) {
    return (
      <div className="relative group w-fit">
        <img
          src={value}
          alt="Preview"
          className="w-40 h-40 object-cover rounded-lg border border-admin-border"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-admin-rose text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-admin-border rounded-lg text-sm text-admin-muted hover:border-admin-gold/40 hover:text-admin-text transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Upload size={16} />
        )}
        {uploading ? "Đang tải lên..." : "Chọn ảnh"}
      </button>
      {error && (
        <p className="mt-1.5 text-xs text-admin-rose">{error}</p>
      )}
      <p className="mt-1 text-[10px] text-admin-muted">
        JPG, PNG, WebP, GIF — tối đa {MAX_SIZE_MB}MB
      </p>
    </div>
  );
}
