import { get } from "./client";
import type { DashboardStats, RevenueDataPoint, TopProduct, SentimentData } from "../types";

export async function fetchDashboardStats() {
  return get<DashboardStats>("/admin/dashboard/stats");
}

export async function fetchRevenueChart(days: number = 7) {
  return get<RevenueDataPoint[]>(`/admin/dashboard/revenue?days=${days}`);
}

export async function fetchTopProducts(limit: number = 5) {
  return get<TopProduct[]>(`/admin/dashboard/top-products?limit=${limit}`);
}

export async function fetchSentiment() {
  return get<SentimentData>("/admin/dashboard/sentiment");
}
