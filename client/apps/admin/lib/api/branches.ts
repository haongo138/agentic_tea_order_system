import { get } from "./client";

interface ApiBranch {
  id: number;
  name: string;
  address: string | null;
  phoneNumber: string | null;
  latitude: string | null;
  longitude: string | null;
  operatingStatus: string;
  openingTime: string | null;
  closingTime: string | null;
  createdAt: string;
  updatedAt: string;
}

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
