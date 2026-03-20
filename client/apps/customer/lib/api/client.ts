const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type RequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

async function request<T>(
  path: string,
  init?: RequestInit & RequestOptions,
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, body.error ?? body.message ?? res.statusText);
  }

  return res.json();
}

export function get<T>(path: string, opts?: RequestOptions): Promise<ApiResponse<T>> {
  return request<T>(path, { method: "GET", ...opts });
}

export function post<T>(path: string, body: unknown, opts?: RequestOptions): Promise<ApiResponse<T>> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body), ...opts });
}

export function patch<T>(path: string, body: unknown, opts?: RequestOptions): Promise<ApiResponse<T>> {
  return request<T>(path, { method: "PATCH", body: JSON.stringify(body), ...opts });
}

function withAuth(opts?: RequestOptions): RequestOptions {
  if (typeof window === "undefined") return opts ?? {};
  const token = localStorage.getItem("lamtra_token");
  if (!token) return opts ?? {};
  return {
    ...opts,
    headers: {
      ...opts?.headers,
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getAuth<T>(path: string, opts?: RequestOptions): Promise<ApiResponse<T>> {
  return get<T>(path, withAuth(opts));
}

export function postAuth<T>(path: string, body: unknown, opts?: RequestOptions): Promise<ApiResponse<T>> {
  return post<T>(path, body, withAuth(opts));
}

export function patchAuth<T>(path: string, body: unknown, opts?: RequestOptions): Promise<ApiResponse<T>> {
  return patch<T>(path, body, withAuth(opts));
}
