import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockUpload, mockRemove, mockFrom } = vi.hoisted(() => {
  const mockUpload = vi.fn();
  const mockRemove = vi.fn();
  const mockFrom = vi.fn(() => ({ upload: mockUpload, remove: mockRemove }));
  return { mockUpload, mockRemove, mockFrom };
});

vi.mock("../../config/env", () => ({
  env: {
    SUPABASE_URL: "https://test-project.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  },
}));

vi.mock("../../config/supabase", () => ({
  supabase: { storage: { from: mockFrom } },
}));

import {
  isValidBucket,
  isValidMimeType,
  isValidFileSize,
  extractPathFromUrl,
  uploadImage,
  deleteImage,
} from "../../utils/storage";

describe("storage utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({ upload: mockUpload, remove: mockRemove });
  });

  describe("isValidBucket", () => {
    it("accepts valid buckets", () => {
      expect(isValidBucket("products")).toBe(true);
      expect(isValidBucket("news")).toBe(true);
      expect(isValidBucket("branches")).toBe(true);
    });

    it("rejects unknown buckets", () => {
      expect(isValidBucket("avatars")).toBe(false);
      expect(isValidBucket("")).toBe(false);
      expect(isValidBucket("PRODUCTS")).toBe(false);
    });
  });

  describe("isValidMimeType", () => {
    it("accepts allowed image MIME types", () => {
      expect(isValidMimeType("image/jpeg")).toBe(true);
      expect(isValidMimeType("image/png")).toBe(true);
      expect(isValidMimeType("image/webp")).toBe(true);
      expect(isValidMimeType("image/gif")).toBe(true);
    });

    it("rejects non-image types", () => {
      expect(isValidMimeType("application/pdf")).toBe(false);
      expect(isValidMimeType("text/html")).toBe(false);
      expect(isValidMimeType("video/mp4")).toBe(false);
    });
  });

  describe("isValidFileSize", () => {
    it("accepts files within the 5MB limit", () => {
      expect(isValidFileSize(1024)).toBe(true);
      expect(isValidFileSize(5 * 1024 * 1024)).toBe(true);
    });

    it("rejects zero-byte files", () => {
      expect(isValidFileSize(0)).toBe(false);
    });

    it("rejects files exceeding 5MB", () => {
      expect(isValidFileSize(5 * 1024 * 1024 + 1)).toBe(false);
    });
  });

  describe("extractPathFromUrl", () => {
    it("extracts file path from a valid Supabase Storage URL", () => {
      const url =
        "https://test-project.supabase.co/storage/v1/object/public/products/abc123.jpg";
      expect(extractPathFromUrl(url, "products")).toBe("abc123.jpg");
    });

    it("returns null for a URL that doesn't match the bucket path", () => {
      const url = "https://example.com/other/path/file.jpg";
      expect(extractPathFromUrl(url, "products")).toBeNull();
    });

    it("handles paths with subdirectories", () => {
      const url =
        "https://test.supabase.co/storage/v1/object/public/news/2024/article.png";
      expect(extractPathFromUrl(url, "news")).toBe("2024/article.png");
    });
  });

  describe("uploadImage", () => {
    it("uploads a file and returns its public URL and path", async () => {
      mockUpload.mockResolvedValueOnce({ error: null });

      const buffer = Buffer.from("fake image data");
      const result = await uploadImage("products", buffer, "photo.jpg", "image/jpeg");

      expect(mockFrom).toHaveBeenCalledWith("products");
      expect(mockUpload).toHaveBeenCalledWith(
        expect.stringMatching(/\.jpg$/),
        buffer,
        { contentType: "image/jpeg", upsert: false },
      );
      expect(result.url).toContain("test-project.supabase.co");
      expect(result.url).toContain("products");
      expect(result.path).toMatch(/\.jpg$/);
    });

    it("uses .jpg as fallback extension when original filename has none", async () => {
      mockUpload.mockResolvedValueOnce({ error: null });

      const result = await uploadImage("products", Buffer.from(""), "noext", "image/jpeg");

      expect(result.path).toMatch(/\.jpg$/);
    });

    it("throws when Supabase returns an upload error", async () => {
      mockUpload.mockResolvedValueOnce({ error: { message: "Bucket not found" } });

      await expect(
        uploadImage("products", Buffer.from(""), "photo.jpg", "image/jpeg"),
      ).rejects.toThrow("Storage upload failed: Bucket not found");
    });
  });

  describe("deleteImage", () => {
    it("calls remove with the correct bucket and path", async () => {
      mockRemove.mockResolvedValueOnce({ error: null });

      await deleteImage("products", "abc123.jpg");

      expect(mockFrom).toHaveBeenCalledWith("products");
      expect(mockRemove).toHaveBeenCalledWith(["abc123.jpg"]);
    });

    it("logs the error but does not throw when delete fails", async () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockRemove.mockResolvedValueOnce({ error: { message: "File not found" } });

      await expect(deleteImage("products", "missing.jpg")).resolves.toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
