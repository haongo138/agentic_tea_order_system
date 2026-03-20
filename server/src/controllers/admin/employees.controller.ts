import { Request, Response, NextFunction } from "express";
import { eq, and, count } from "drizzle-orm";
import { db } from "../../db";
import { employees, branches } from "../../db/schema";
import { sendSuccess, sendPaginated, sendNotFound, sendError } from "../../utils/response";
import { getPaginationMeta, getOffset } from "../../utils/pagination";
import {
  getEmployeesQuerySchema,
  employeeIdParamSchema,
  createEmployeeBodySchema,
  updateEmployeeBodySchema,
  updateEmployeeStatusBodySchema,
} from "../../validators/admin/employees.validator";

export async function getEmployees(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = getEmployeesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      sendError(res, "Invalid query parameters");
      return;
    }

    const query = parsed.data;
    const offset = getOffset(query);

    const conditions = [];

    if (query.branchId) {
      conditions.push(eq(employees.branchId, query.branchId));
    }

    if (query.role) {
      conditions.push(eq(employees.role, query.role));
    }

    if (query.status) {
      conditions.push(eq(employees.status, query.status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, totalResult] = await Promise.all([
      db
        .select({
          id: employees.id,
          accountId: employees.accountId,
          branchId: employees.branchId,
          branchName: branches.name,
          fullName: employees.fullName,
          email: employees.email,
          phoneNumber: employees.phoneNumber,
          role: employees.role,
          status: employees.status,
          createdAt: employees.createdAt,
          updatedAt: employees.updatedAt,
        })
        .from(employees)
        .leftJoin(branches, eq(employees.branchId, branches.id))
        .where(whereClause)
        .limit(query.limit)
        .offset(offset),
      db
        .select({ value: count() })
        .from(employees)
        .where(whereClause),
    ]);

    const total = totalResult[0]?.value ?? 0;
    const meta = getPaginationMeta(total, query);

    sendPaginated(res, rows, meta);
  } catch (err) {
    next(err);
  }
}

export async function getEmployeeById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = employeeIdParamSchema.safeParse(req.params);

    if (!parsed.success) {
      sendError(res, "Invalid employee ID");
      return;
    }

    const [employee] = await db
      .select({
        id: employees.id,
        accountId: employees.accountId,
        branchId: employees.branchId,
        branchName: branches.name,
        fullName: employees.fullName,
        email: employees.email,
        phoneNumber: employees.phoneNumber,
        role: employees.role,
        status: employees.status,
        createdAt: employees.createdAt,
        updatedAt: employees.updatedAt,
      })
      .from(employees)
      .leftJoin(branches, eq(employees.branchId, branches.id))
      .where(eq(employees.id, parsed.data.id))
      .limit(1);

    if (!employee) {
      sendNotFound(res, "Employee");
      return;
    }

    sendSuccess(res, employee);
  } catch (err) {
    next(err);
  }
}

export async function createEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = createEmployeeBodySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const [created] = await db
      .insert(employees)
      .values(parsed.data)
      .returning();

    sendSuccess(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function updateEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const paramParsed = employeeIdParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      sendError(res, "Invalid employee ID");
      return;
    }

    const bodyParsed = updateEmployeeBodySchema.safeParse(req.body);

    if (!bodyParsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: bodyParsed.error.flatten().fieldErrors,
      });
      return;
    }

    const updateData = bodyParsed.data;

    if (Object.keys(updateData).length === 0) {
      sendError(res, "No fields to update");
      return;
    }

    const [updated] = await db
      .update(employees)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(employees.id, paramParsed.data.id))
      .returning();

    if (!updated) {
      sendNotFound(res, "Employee");
      return;
    }

    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
}

export async function updateEmployeeStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const paramParsed = employeeIdParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      sendError(res, "Invalid employee ID");
      return;
    }

    const bodyParsed = updateEmployeeStatusBodySchema.safeParse(req.body);

    if (!bodyParsed.success) {
      res.status(400).json({
        success: false,
        error: "Invalid request body",
        details: bodyParsed.error.flatten().fieldErrors,
      });
      return;
    }

    const [updated] = await db
      .update(employees)
      .set({ status: bodyParsed.data.status, updatedAt: new Date() })
      .where(eq(employees.id, paramParsed.data.id))
      .returning();

    if (!updated) {
      sendNotFound(res, "Employee");
      return;
    }

    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
}
