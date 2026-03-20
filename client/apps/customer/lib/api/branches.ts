import { get } from "./client";
import type { ApiBranch } from "../types";

export async function fetchBranches(params?: {
  page?: number;
  limit?: number;
  operatingStatus?: string;
}) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.operatingStatus) query.set("operatingStatus", params.operatingStatus);

  const qs = query.toString();
  return get<ApiBranch[]>(`/branches${qs ? `?${qs}` : ""}`);
}

export async function fetchBranchById(id: number) {
  return get<ApiBranch>(`/branches/${id}`);
}

export async function fetchNearestBranches(lat: number, lng: number, limit?: number) {
  const query = new URLSearchParams({ lat: String(lat), lng: String(lng) });
  if (limit) query.set("limit", String(limit));
  return get<(ApiBranch & { distance: number })[]>(`/branches/nearest?${query}`);
}
