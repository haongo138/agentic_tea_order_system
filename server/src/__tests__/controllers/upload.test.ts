import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { handleUpload, handleDelete } from "../../controllers/upload.controller";
import { asyncHandler } from "../../middleware/async-handler";
import { errorHandler } from "../../middleware/error-handler";

const { mockUploadImage, mockDeleteImage, mockExtractPathFromUrl } = vi.hoisted(() => ({
  mockUploadImage: vi.fn(),
  mockDeleteImage: vi.fn(),
  mockExtractPathFromUrl: vi.fn(),
}));

vi.mock("../../utils/storage", () => ({
  isValidBucket: (b: string) => ["products", "news", "branches"].includes(b),
  isValidMimeType: (m: string) =>
    ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(m),
  isValidFileSize: (s: number) => s > 0 && s <= 5 * 1024 * 1024,
  uploadImage: mockUploadImage,
  deleteImage: mockDeleteImage,
  extractPathFromUrl: mockExtractPathFromUrl,
}));

type MockFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

function makeFile(overrides: Partial<MockFile> = {}): MockFile {
  return {
    fieldname: "file",
    originalname: "test-image.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    buffer: Buffer.from("fake image data"),
    size: 1024,
    ...overrides,
  };
}

function createTestApp(file?: MockFile) {
  const app = express();
  app.use(express.json());

  app.use((req: express.Request & { file?: unknown }, _res, next) => {
    if (file !== undefined) req.file = file as never;
    next();
  });

  app.post("/api/admin/upload/:bucket", asyncHandler(handleUpload));
  app.delete("/api/admin/upload/:bucket", asyncHandler(handleDelete));
  app.use(errorHandler);

  return app;
}

describe("upload controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/admin/upload/:bucket", () => {
    it("uploads a valid image and returns 201 with URL and path", async () => {
      const file = makeFile();
      mockUploadImage.mockResolvedValueOnce({
        url: "https://test.supabase.co/storage/v1/object/public/products/uuid.jpg",
        path: "uuid.jpg",
      });

      const res = await request(createTestApp(file)).post("/api/admin/upload/products");

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.url).toContain("products");
      expect(res.body.data.path).toBe("uuid.jpg");
      expect(mockUploadImage).toHaveBeenCalledWith(
        "products",
        file.buffer,
        file.originalname,
        file.mimetype,
      );
    });

    it("returns 400 when no file is attached", async () => {
      const res = await request(createTestApp()).post("/api/admin/upload/products");

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/no file/i);
    });

    it("returns 400 for an unknown bucket", async () => {
      const res = await request(createTestApp(makeFile())).post(
        "/api/admin/upload/avatars",
      );

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid bucket/i);
    });

    it("returns 400 for an unsupported MIME type", async () => {
      const file = makeFile({ mimetype: "application/pdf", originalname: "doc.pdf" });

      const res = await request(createTestApp(file)).post("/api/admin/upload/products");

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid file type/i);
    });

    it("returns 400 for a file exceeding the size limit", async () => {
      const file = makeFile({ size: 10 * 1024 * 1024 }); // 10 MB

      const res = await request(createTestApp(file)).post("/api/admin/upload/products");

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/file too large/i);
    });

    it("returns 500 when Supabase storage throws", async () => {
      const file = makeFile();
      mockUploadImage.mockRejectedValueOnce(
        new Error("Storage upload failed: network error"),
      );

      const res = await request(createTestApp(file)).post("/api/admin/upload/products");

      expect(res.status).toBe(500);
    });
  });

  describe("DELETE /api/admin/upload/:bucket", () => {
    it("deletes a file by URL and returns 200", async () => {
      mockExtractPathFromUrl.mockReturnValueOnce("uuid.jpg");
      mockDeleteImage.mockResolvedValueOnce(undefined);

      const res = await request(createTestApp())
        .delete("/api/admin/upload/products")
        .send({
          url: "https://test.supabase.co/storage/v1/object/public/products/uuid.jpg",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.deleted).toBe(true);
      expect(mockDeleteImage).toHaveBeenCalledWith("products", "uuid.jpg");
    });

    it("returns 400 for an unknown bucket", async () => {
      const res = await request(createTestApp())
        .delete("/api/admin/upload/avatars")
        .send({
          url: "https://test.supabase.co/storage/v1/object/public/avatars/f.jpg",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid bucket/i);
    });

    it("returns 400 when the url field is missing", async () => {
      const res = await request(createTestApp())
        .delete("/api/admin/upload/products")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/missing.*url/i);
    });

    it("returns 400 when the URL doesn't match the bucket path", async () => {
      mockExtractPathFromUrl.mockReturnValueOnce(null);

      const res = await request(createTestApp())
        .delete("/api/admin/upload/products")
        .send({ url: "https://example.com/other/path.jpg" });

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/could not extract/i);
    });
  });
});
