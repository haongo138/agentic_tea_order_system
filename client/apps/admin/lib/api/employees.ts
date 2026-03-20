import { get, post, patch } from "./client";
import type { StaffMember } from "../types";

export async function fetchEmployees(params?: {
  page?: number;
  limit?: number;
  branchId?: number;
  role?: string;
  status?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.branchId) query.set("branchId", String(params.branchId));
  if (params?.role) query.set("role", params.role);
  if (params?.status) query.set("status", params.status);

  const qs = query.toString();
  return get<StaffMember[]>(`/admin/employees${qs ? `?${qs}` : ""}`);
}

export async function fetchEmployeeById(id: number) {
  return get<StaffMember>(`/admin/employees/${id}`);
}

export async function createEmployee(data: {
  accountId?: number;
  branchId: number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  role: string;
}) {
  return post<StaffMember>("/admin/employees", data);
}

export async function updateEmployee(id: number, data: Record<string, unknown>) {
  return patch<StaffMember>(`/admin/employees/${id}`, data);
}

export async function updateEmployeeStatus(id: number, status: string) {
  return patch<StaffMember>(`/admin/employees/${id}/status`, { status });
}
