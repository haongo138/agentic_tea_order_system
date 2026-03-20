import { get } from "./client";
import type { ApiProduct, ApiCategory, ApiTopping, ApiSize } from "../types";

export async function fetchProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  status?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.categoryId) query.set("categoryId", String(params.categoryId));
  if (params?.status) query.set("status", params.status);

  const qs = query.toString();
  return get<ApiProduct[]>(`/products${qs ? `?${qs}` : ""}`);
}

export async function fetchProductById(id: number) {
  return get<ApiProduct>(`/products/${id}`);
}

export async function fetchCategories() {
  return get<ApiCategory[]>("/categories");
}

export async function fetchToppings() {
  return get<ApiTopping[]>("/toppings");
}

export async function fetchToppingsByCategory(categoryId: number) {
  return get<ApiTopping[]>(`/categories/${categoryId}/toppings`);
}

export async function fetchSizes() {
  return get<ApiSize[]>("/sizes");
}
