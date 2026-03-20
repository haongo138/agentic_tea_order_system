import { get, post, patch, del } from "./client";

interface ApiProduct {
  id: number;
  name: string;
  description: string | null;
  basePrice: string;
  imageUrl: string | null;
  salesStatus: string;
  categoryId: number;
  categoryName: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiCategory {
  id: number;
  name: string;
  description: string | null;
  productCount: number;
}

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

export async function fetchCategories() {
  return get<ApiCategory[]>("/categories");
}

export async function createProduct(data: {
  name: string;
  description?: string;
  basePrice: string;
  categoryId: number;
  imageUrl?: string;
}) {
  return post<ApiProduct>("/admin/products", data);
}

export async function updateProduct(id: number, data: Record<string, unknown>) {
  return patch<ApiProduct>(`/admin/products/${id}`, data);
}

export async function deleteProduct(id: number) {
  return del<void>(`/admin/products/${id}`);
}

export async function updateBranchProductStatus(
  productId: number,
  branchId: number,
  status: string,
) {
  return patch<void>(`/admin/products/${productId}/branches/${branchId}/status`, { status });
}
