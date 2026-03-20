import { Router } from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  updateBranchProductStatus,
} from "../../controllers/admin/products.controller";

const router = Router();

/**
 * @openapi
 * /api/admin/products:
 *   post:
 *     tags:
 *       - Admin Products
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryId, name, basePrice]
 *             properties:
 *               categoryId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               basePrice:
 *                 type: string
 *                 example: "45000.00"
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/api/admin/products", createProduct);

/**
 * @openapi
 * /api/admin/products/{id}:
 *   patch:
 *     tags:
 *       - Admin Products
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               basePrice:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               salesStatus:
 *                 type: string
 *                 enum: [available, unavailable, discontinued]
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.patch("/api/admin/products/:id", updateProduct);

/**
 * @openapi
 * /api/admin/products/{id}:
 *   delete:
 *     tags:
 *       - Admin Products
 *     summary: Soft delete a product
 *     description: Sets the product salesStatus to discontinued
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product discontinued
 *       404:
 *         description: Product not found
 */
router.delete("/api/admin/products/:id", deleteProduct);

/**
 * @openapi
 * /api/admin/products/{productId}/branches/{branchId}/status:
 *   patch:
 *     tags:
 *       - Admin Products
 *     summary: Update branch-specific product availability
 *     description: Upserts the product status for a specific branch
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: branchId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, unavailable, out_of_stock]
 *     responses:
 *       200:
 *         description: Branch product status updated
 *       201:
 *         description: Branch product status created
 */
router.patch("/api/admin/products/:productId/branches/:branchId/status", updateBranchProductStatus);

export default router;
