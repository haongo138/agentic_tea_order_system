import { get, getAuth, post, postAuth, patchAuth } from "./client";
import type { ApiOrder, ApiOrderDetail } from "../types";

interface OrderItem {
  productId: number;
  sizeId?: number;
  quantity: number;
  sugarLevel: string;
  iceLevel: string;
  toppingIds: number[];
}

interface GuestInfo {
  name: string;
  phone: string;
  email?: string;
}

interface CreateOrderPayload {
  customerId?: number;
  branchId: number;
  paymentMethod: string;
  deliveryAddress: string;
  note?: string;
  voucherCode?: string;
  items: OrderItem[];
  guestInfo?: GuestInfo;
}

export async function createOrder(payload: CreateOrderPayload) {
  // Use post (no auth) — backend no longer requires authenticate for this route
  return post<ApiOrder>("/orders", payload);
}

export async function fetchOrders(params: {
  customerId: number;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams({ customerId: String(params.customerId) });
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return getAuth<ApiOrder[]>(`/orders?${query}`);
}

export async function fetchOrderById(id: number) {
  return get<ApiOrderDetail>(`/orders/${id}`);
}

export async function updateOrderStatus(id: number, status: string) {
  return patchAuth<ApiOrder>(`/orders/${id}/status`, { status });
}

export async function createReview(orderId: number, data: { starRating: number; content?: string }) {
  return postAuth<unknown>(`/orders/${orderId}/review`, data);
}

export async function trackGuestOrder(orderId: number, phone: string) {
  return post<ApiOrder>("/orders/track", { orderId, phone });
}
