import { Router } from "express";
import {
  getNewsList,
  createNews,
  updateNews,
  updateNewsStatus,
  deleteNews,
} from "../../controllers/admin/news.controller";

const router = Router();

/**
 * @openapi
 * /api/admin/news:
 *   get:
 *     tags:
 *       - Admin News
 *     summary: List news articles
 *     description: Returns paginated list of news articles with optional filters
 *     parameters:
 *       - in: query
 *         name: articleType
 *         schema:
 *           type: string
 *           enum: [promotion, announcement, blog]
 *         description: Filter by article type
 *       - in: query
 *         name: publishStatus
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filter by publish status
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
 *         description: Paginated news list
 */
router.get("/api/admin/news", getNewsList);

/**
 * @openapi
 * /api/admin/news:
 *   post:
 *     tags:
 *       - Admin News
 *     summary: Create a news article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content, articleType]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               articleType:
 *                 type: string
 *                 enum: [promotion, announcement, blog]
 *               publishDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: News article created
 */
router.post("/api/admin/news", createNews);

/**
 * @openapi
 * /api/admin/news/{id}:
 *   patch:
 *     tags:
 *       - Admin News
 *     summary: Update a news article
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               articleType:
 *                 type: string
 *                 enum: [promotion, announcement, blog]
 *               publishDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: News article updated
 *       404:
 *         description: News article not found
 */
router.patch("/api/admin/news/:id", updateNews);

/**
 * @openapi
 * /api/admin/news/{id}/status:
 *   patch:
 *     tags:
 *       - Admin News
 *     summary: Update news publish status
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
 *             required: [publishStatus]
 *             properties:
 *               publishStatus:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: News status updated
 *       404:
 *         description: News article not found
 */
router.patch("/api/admin/news/:id/status", updateNewsStatus);

/**
 * @openapi
 * /api/admin/news/{id}:
 *   delete:
 *     tags:
 *       - Admin News
 *     summary: Delete a news article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: News article deleted
 *       404:
 *         description: News article not found
 */
router.delete("/api/admin/news/:id", deleteNews);

export default router;
