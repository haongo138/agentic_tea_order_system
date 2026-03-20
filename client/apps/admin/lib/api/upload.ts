import { ApiError } from "./client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("lamtra_admin_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export type StorageBucket = "products" | "news" | "branches";

interface UploadResult {
  url: string;
  path: string;
}

export async function uploadImage(
  file: File,
  bucket: StorageBucket,
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/admin/upload/${bucket}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error ?? res.statusText);
  }

  const json = await res.json();
  return json.data;
}

export async function deleteImage(
  url: string,
  bucket: StorageBucket,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/upload/${bucket}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error ?? res.statusText);
  }
}
