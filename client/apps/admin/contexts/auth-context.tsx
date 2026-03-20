"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { login as apiLogin, getProfile, logout as apiLogout, getToken } from "@/lib/api/auth";
import type { AuthAccount } from "@/lib/types";

interface AuthState {
  readonly account: AuthAccount | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    account: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setState({ account: null, isLoading: false, isAuthenticated: false });
      return;
    }

    getProfile()
      .then((res) => {
        setState({ account: res.data, isLoading: false, isAuthenticated: true });
      })
      .catch(() => {
        apiLogout();
        setState({ account: null, isLoading: false, isAuthenticated: false });
      });
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await apiLogin(username, password);
    setState({
      account: res.data.account,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setState({ account: null, isLoading: false, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
