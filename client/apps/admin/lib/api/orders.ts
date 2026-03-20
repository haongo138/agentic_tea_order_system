import { get, patch } from "./client";
import type { AdminOrder, AdminOrderDetail, OrderStatus } from "../types";

export async function fetchOrders(params?: {
  customerId?: number;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.customerId) query.set("customerId", String(params.customerId));
  if (params?.status) query.set("status", params.status);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  return get<AdminOrder[]>(`/orders${qs ? `?${qs}` : ""}`);
}

export async function fetchOrderById(id: number) {
  return get<AdminOrderDetail>(`/orders/${id}`);
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  return patch<AdminOrder>(`/orders/${id}/status`, { status });
}
