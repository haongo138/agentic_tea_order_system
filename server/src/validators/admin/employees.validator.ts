import { z } from "zod";
import { paginationSchema } from "../../utils/pagination";

const EMPLOYEE_ROLES = ["manager", "barista", "cashier", "delivery"] as const;
const EMPLOYEE_STATUSES = ["active", "inactive", "on_leave"] as const;

export const getEmployeesQuerySchema = paginationSchema.extend({
  branchId: z.coerce.number().int().positive().optional(),
  role: z.enum(EMPLOYEE_ROLES).optional(),
  status: z.enum(EMPLOYEE_STATUSES).optional(),
});

export const employeeIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createEmployeeBodySchema = z.object({
  branchId: z.number().int().positive(),
  fullName: z.string().min(1).max(255),
  email: z.string().email().max(255).optional(),
  phoneNumber: z.string().max(20).optional(),
  role: z.enum(EMPLOYEE_ROLES),
});

export const updateEmployeeBodySchema = z.object({
  branchId: z.number().int().positive().optional(),
  fullName: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  phoneNumber: z.string().max(20).optional(),
  role: z.enum(EMPLOYEE_ROLES).optional(),
});

export const updateEmployeeStatusBodySchema = z.object({
  status: z.enum(EMPLOYEE_STATUSES),
});

export type GetEmployeesQuery = z.infer<typeof getEmployeesQuerySchema>;
export type EmployeeIdParam = z.infer<typeof employeeIdParamSchema>;
export type CreateEmployeeBody = z.infer<typeof createEmployeeBodySchema>;
export type UpdateEmployeeBody = z.infer<typeof updateEmployeeBodySchema>;
export type UpdateEmployeeStatusBody = z.infer<typeof updateEmployeeStatusBodySchema>;
