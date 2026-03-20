"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-lam-green-600/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-lam-green-800 flex items-center justify-center mx-auto mb-4">
            <span
              className="text-lam-gold-400 text-2xl font-bold"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              L
            </span>
          </div>
          <h1
            className="text-3xl font-semibold text-lam-green-900"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Đăng Nhập
          </h1>
          <p className="text-sm text-lam-green-700/60 mt-2">
            Đăng nhập để đặt hàng và theo dõi đơn hàng
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-product space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-lam-green-800 mb-1.5">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="w-full h-11 px-4 rounded-xl border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 transition-all"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-lam-green-800 mb-1.5">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                className="w-full h-11 px-4 pr-11 rounded-xl border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 transition-all"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-lam-green-600/40 hover:text-lam-green-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className="w-full h-11 bg-lam-green-800 hover:bg-lam-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Đăng Nhập"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-lam-green-700/50 mt-6">
          Chưa có tài khoản?{" "}
          <Link href="/" className="text-lam-terracotta-500 hover:text-lam-terracotta-600 font-medium">
            Liên hệ cửa hàng
          </Link>
        </p>
      </div>
    </div>
  );
}
