import { Router } from "express";
import {
  getDashboardStats,
  getRevenueChart,
  getTopProducts,
  getSentimentSummary,
} from "../../controllers/admin/dashboard.controller";

const router = Router();

/**
 * @openapi
 * /api/admin/dashboard/stats:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Get dashboard statistics
 *     description: Returns today's revenue, orders count, branch stats, and average rating
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     revenueToday:
 *                       type: number
 *                     ordersToday:
 *                       type: number
 *                     activeBranches:
 *                       type: number
 *                     totalBranches:
 *                       type: number
 *                     avgRating:
 *                       type: number
 */
router.get("/api/admin/dashboard/stats", getDashboardStats);

/**
 * @openapi
 * /api/admin/dashboard/revenue:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Get revenue chart data
 *     description: Returns daily revenue and order count for the last N days
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 7
 *           minimum: 1
 *           maximum: 90
 *         description: Number of days to look back
 *     responses:
 *       200:
 *         description: Revenue chart data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                       revenue:
 *                         type: number
 *                       orders:
 *                         type: number
 */
router.get("/api/admin/dashboard/revenue", getRevenueChart);

/**
 * @openapi
 * /api/admin/dashboard/top-products:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Get top selling products
 *     description: Returns products ranked by total quantity sold
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         description: Number of products to return
 *     responses:
 *       200:
 *         description: Top products list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: number
 *                       productName:
 *                         type: string
 *                       imageUrl:
 *                         type: string
 *                       totalQuantity:
 *                         type: number
 *                       totalRevenue:
 *                         type: number
 */
router.get("/api/admin/dashboard/top-products", getTopProducts);

/**
 * @openapi
 * /api/admin/dashboard/sentiment:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Get review sentiment summary
 *     description: Returns counts of positive, neutral, and negative reviews
 *     responses:
 *       200:
 *         description: Sentiment summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     positive:
 *                       type: number
 *                     neutral:
 *                       type: number
 *                     negative:
 *                       type: number
 */
router.get("/api/admin/dashboard/sentiment", getSentimentSummary);

export default router;
