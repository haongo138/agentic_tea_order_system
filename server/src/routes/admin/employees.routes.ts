import { Router } from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
} from "../../controllers/admin/employees.controller";

const router = Router();

/**
 * @openapi
 * /api/admin/employees:
 *   get:
 *     tags:
 *       - Admin Employees
 *     summary: List employees
 *     description: Returns paginated list of employees with optional filters
 *     parameters:
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: integer
 *         description: Filter by branch ID
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [manager, barista, cashier, delivery]
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, on_leave]
 *         description: Filter by status
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
 *         description: Paginated employee list
 */
router.get("/api/admin/employees", getEmployees);

/**
 * @openapi
 * /api/admin/employees/{id}:
 *   get:
 *     tags:
 *       - Admin Employees
 *     summary: Get employee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee details
 *       404:
 *         description: Employee not found
 */
router.get("/api/admin/employees/:id", getEmployeeById);

/**
 * @openapi
 * /api/admin/employees:
 *   post:
 *     tags:
 *       - Admin Employees
 *     summary: Create a new employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [branchId, fullName, role]
 *             properties:
 *               branchId:
 *                 type: integer
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [manager, barista, cashier, delivery]
 *     responses:
 *       201:
 *         description: Employee created
 */
router.post("/api/admin/employees", createEmployee);

/**
 * @openapi
 * /api/admin/employees/{id}:
 *   patch:
 *     tags:
 *       - Admin Employees
 *     summary: Update employee details
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
 *               branchId:
 *                 type: integer
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [manager, barista, cashier, delivery]
 *     responses:
 *       200:
 *         description: Employee updated
 *       404:
 *         description: Employee not found
 */
router.patch("/api/admin/employees/:id", updateEmployee);

/**
 * @openapi
 * /api/admin/employees/{id}/status:
 *   patch:
 *     tags:
 *       - Admin Employees
 *     summary: Update employee status
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
 *                 enum: [active, inactive, on_leave]
 *     responses:
 *       200:
 *         description: Employee status updated
 *       404:
 *         description: Employee not found
 */
router.patch("/api/admin/employees/:id/status", updateEmployeeStatus);

export default router;
