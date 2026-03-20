import { Router } from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  createReview,
  trackOrder,
} from "../controllers/orders.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order
 *     description: Places a new order with items, toppings, and optional voucher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [branchId, paymentMethod, deliveryAddress, items]
 *             properties:
 *               customerId:
 *                 type: integer
 *               branchId:
 *                 type: integer
 *               voucherCode:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: ["cod", "bank_transfer"]
 *               deliveryAddress:
 *                 type: string
 *               note:
 *                 type: string
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [productId, quantity, sugarLevel, iceLevel]
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     sizeId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                     sugarLevel:
 *                       type: string
 *                       enum: ["0%", "25%", "50%", "75%", "100%"]
 *                     iceLevel:
 *                       type: string
 *                       enum: ["0%", "25%", "50%", "75%", "100%"]
 *                     toppingIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *       400:
 *         description: Validation error
 */
router.post("/api/orders", createOrder);

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: List orders for a customer
 *     description: Returns paginated orders filtered by customer and optional status
 *     parameters:
 *       - in: query
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["pending", "preparing", "ready", "delivering", "delivered", "completed", "cancelled"]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of orders
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
 */
router.get("/api/orders", getOrders);

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get order details
 *     description: Returns full order with items, toppings, branch info, and review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
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
 *       404:
 *         description: Order not found
 */
router.get("/api/orders/:id", getOrderById);

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Update order status
 *     description: Advances or cancels an order with validated status transitions
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["pending", "preparing", "ready", "delivering", "delivered", "completed", "cancelled"]
 *     responses:
 *       200:
 *         description: Order status updated
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
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Order not found
 */
router.patch("/api/orders/:id/status", authenticate, updateOrderStatus);

/**
 * @openapi
 * /api/orders/{id}/review:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Submit a review for an order
 *     description: Creates a review for a paid order (one review per order)
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
 *             required: [starRating]
 *             properties:
 *               starRating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
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
 *       400:
 *         description: Order not paid or validation error
 *       404:
 *         description: Order not found
 *       409:
 *         description: Review already exists
 */
router.post("/api/orders/:id/review", authenticate, createReview);

/**
 * @openapi
 * /api/orders/track:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Track a guest order
 *     description: Look up a guest order by order ID and phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderId, phone]
 *             properties:
 *               orderId:
 *                 type: integer
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 */
router.post("/api/orders/track", trackOrder);

export default router;
