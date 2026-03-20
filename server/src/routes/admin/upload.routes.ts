import { Router } from "express";
import { uploadSingle } from "../../middleware/upload";
import { handleUpload, handleDelete } from "../../controllers/upload.controller";
import { asyncHandler } from "../../middleware/async-handler";

const router = Router();

/**
 * @swagger
 * /api/admin/upload/{bucket}:
 *   post:
 *     summary: Upload an image to a storage bucket
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bucket
 *         required: true
 *         schema:
 *           type: string
 *           enum: [products, news, branches]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file or bucket
 *       401:
 *         description: Unauthorized
 */
router.post("/api/admin/upload/:bucket", uploadSingle, asyncHandler(handleUpload));

/**
 * @swagger
 * /api/admin/upload/{bucket}:
 *   delete:
 *     summary: Delete an image from a storage bucket
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bucket
 *         required: true
 *         schema:
 *           type: string
 *           enum: [products, news, branches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Invalid bucket or URL
 *       401:
 *         description: Unauthorized
 */
router.delete("/api/admin/upload/:bucket", asyncHandler(handleDelete));

export default router;
