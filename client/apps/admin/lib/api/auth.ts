import { post, get } from "./client";

interface LoginResponse {
  token: string;
  account: {
    id: number;
    username: string;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function login(username: string, password: string) {
  // Temporarily bypass auth header for login
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? "Login failed");
  }

  const data: { success: boolean; data: LoginResponse } = await res.json();
  if (data.data.token) {
    localStorage.setItem("lamtra_admin_token", data.data.token);
  }
  return data;
}

export async function getProfile() {
  return get<LoginResponse["account"]>("/auth/profile");
}

export function logout() {
  localStorage.removeItem("lamtra_admin_token");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lamtra_admin_token");
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
