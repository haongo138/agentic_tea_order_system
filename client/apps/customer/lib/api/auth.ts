import { post, getAuth } from "./client";
import type { ApiAccount } from "../types";

interface LoginResponse {
  token: string;
  account: ApiAccount;
}

export async function login(username: string, password: string) {
  const res = await post<LoginResponse>("/auth/login", { username, password });
  if (res.data.token) {
    localStorage.setItem("lamtra_token", res.data.token);
  }
  return res;
}

export async function getProfile() {
  return getAuth<ApiAccount>("/auth/profile");
}

export function logout() {
  localStorage.removeItem("lamtra_token");
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lamtra_token");
}
