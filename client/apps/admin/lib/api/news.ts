import { get, post, patch, del } from "./client";
import type { NewsArticle } from "../types";

export async function fetchNews(params?: {
  page?: number;
  limit?: number;
  articleType?: string;
  publishStatus?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.articleType) query.set("articleType", params.articleType);
  if (params?.publishStatus) query.set("publishStatus", params.publishStatus);

  const qs = query.toString();
  return get<NewsArticle[]>(`/admin/news${qs ? `?${qs}` : ""}`);
}

export async function createNews(data: {
  title: string;
  content: string;
  articleType: string;
  publishDate?: string;
  imageUrl?: string;
}) {
  return post<NewsArticle>("/admin/news", data);
}

export async function updateNews(id: number, data: Record<string, unknown>) {
  return patch<NewsArticle>(`/admin/news/${id}`, data);
}

export async function updateNewsStatus(id: number, publishStatus: string) {
  return patch<NewsArticle>(`/admin/news/${id}/status`, { publishStatus });
}

export async function deleteNews(id: number) {
  return del<void>(`/admin/news/${id}`);
}
