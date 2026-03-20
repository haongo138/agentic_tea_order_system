import { Router } from "express";
import {
  getBranches,
  getBranchById,
  getNearestBranches,
} from "../controllers/branches.controller";

const router = Router();

/**
 * @openapi
 * /api/branches:
 *   get:
 *     tags:
 *       - Branches
 *     summary: List all branches
 *     description: Returns a paginated list of branches, optionally filtered by operating status
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed, maintenance]
 *         description: Filter by operating status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of branches
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
 *                     $ref: '#/components/schemas/Branch'
 *                 meta:
 *                   $ref: '#/components/schemas/PaginationMeta'
 */
router.get("/api/branches", getBranches);

/**
 * @openapi
 * /api/branches/nearest:
 *   get:
 *     tags:
 *       - Branches
 *     summary: Find nearest open branches
 *     description: Returns open branches sorted by distance from the given coordinates using the Haversine formula
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *         description: Latitude of the user's location
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *         description: Longitude of the user's location
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         description: Maximum number of branches to return
 *     responses:
 *       200:
 *         description: List of nearest open branches with distance
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
 *                     allOf:
 *                       - $ref: '#/components/schemas/Branch'
 *                       - type: object
 *                         properties:
 *                           distance_km:
 *                             type: number
 *                             description: Distance in kilometers
 *                             example: 2.34
 *       400:
 *         description: Invalid coordinates
 */
router.get("/api/branches/nearest", getNearestBranches);

/**
 * @openapi
 * /api/branches/{id}:
 *   get:
 *     tags:
 *       - Branches
 *     summary: Get branch by ID
 *     description: Returns a single branch by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Branch details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Branch'
 *       404:
 *         description: Branch not found
 */
router.get("/api/branches/:id", getBranchById);

/**
 * @openapi
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Chi nhanh Quan 1"
 *         address:
 *           type: string
 *           example: "123 Nguyen Hue, Quan 1, TP.HCM"
 *         longitude:
 *           type: number
 *           nullable: true
 *           example: 106.7009
 *         latitude:
 *           type: number
 *           nullable: true
 *           example: 10.7769
 *         operatingStatus:
 *           type: string
 *           enum: [open, closed, maintenance]
 *           example: open
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         totalPages:
 *           type: integer
 */

export default router;
