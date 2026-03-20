import { Router } from "express";
import {
  getProducts,
  getProductById,
  getCategories,
  getToppings,
  getToppingsByCategory,
  getSizes,
} from "../controllers/products.controller";

const router = Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List products
 *     description: Returns a paginated list of products with optional filtering by category, search term, and sales status
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name (case-insensitive)
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page (max 100)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, unavailable, discontinued]
 *           default: available
 *         description: Filter by sales status
 *     responses:
 *       200:
 *         description: Paginated product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       basePrice:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       salesStatus:
 *                         type: string
 *                       categoryId:
 *                         type: integer
 *                       categoryName:
 *                         type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Invalid query parameters
 */
router.get("/api/products", getProducts);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get product by ID
 *     description: Returns a single product with category information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     basePrice:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *                     salesStatus:
 *                       type: string
 *                     categoryId:
 *                       type: integer
 *                     categoryName:
 *                       type: string
 *       404:
 *         description: Product not found
 */
router.get("/api/products/:id", getProductById);

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: List all categories
 *     description: Returns all product categories with product count
 *     responses:
 *       200:
 *         description: Category list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       productCount:
 *                         type: integer
 */
router.get("/api/categories", getCategories);

/**
 * @openapi
 * /api/toppings:
 *   get:
 *     tags:
 *       - Toppings
 *     summary: List available toppings
 *     description: Returns all toppings with status 'available'
 *     responses:
 *       200:
 *         description: Topping list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: string
 *                       status:
 *                         type: string
 */
router.get("/api/toppings", getToppings);

/**
 * @openapi
 * /api/categories/{categoryId}/toppings:
 *   get:
 *     tags:
 *       - Categories
 *     summary: List allowed toppings for a category
 *     description: Returns toppings that are allowed for the given product category. If no restrictions are configured, returns all available toppings.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product category ID
 *     responses:
 *       200:
 *         description: Allowed topping list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: string
 *                       status:
 *                         type: string
 *       400:
 *         description: Invalid category ID
 */
router.get("/api/categories/:categoryId/toppings", getToppingsByCategory);

/**
 * @openapi
 * /api/sizes:
 *   get:
 *     tags:
 *       - Sizes
 *     summary: List all sizes
 *     description: Returns all sizes ordered by additional price
 *     responses:
 *       200:
 *         description: Size list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       additionalPrice:
 *                         type: string
 */
router.get("/api/sizes", getSizes);

export default router;
