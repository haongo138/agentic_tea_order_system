"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, User, LogOut, Search } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";

const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Tin Tức", href: "/news" },
  { label: "Về Lamtra", href: "/about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-lam-cream-50/95 backdrop-blur-sm shadow-navbar"
            : "bg-transparent"
        }`}
      >
        <div className="container-wide section-padding">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="Lam Trà Home"
            >
              <div className="w-9 h-9 rounded-full bg-lam-green-800 flex items-center justify-center flex-shrink-0 group-hover:bg-lam-green-700 transition-colors">
                <span className="text-lam-gold-400 text-sm font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                  L
                </span>
              </div>
              <span
                className="text-2xl font-semibold text-lam-green-900 tracking-tight"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Lam Trà
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-lam-green-700 hover:text-lam-green-900 transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-lam-gold-500 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-lam-green-800/8 transition-colors group"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5 text-lam-green-800 group-hover:text-lam-green-900" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-lam-terracotta-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated && user ? (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    href="/orders"
                    className="flex items-center gap-1.5 text-sm font-medium text-lam-green-700 hover:text-lam-green-900 transition-colors px-3 py-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.username}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-lam-green-800/8 transition-colors"
                    aria-label="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4 text-lam-green-700" />
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    href="/track"
                    className="flex items-center gap-1.5 text-sm font-medium text-lam-green-700 hover:text-lam-green-900 transition-colors px-3 py-2"
                  >
                    <Search className="w-4 h-4" />
                    Tra cứu đơn
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 bg-lam-green-800 text-lam-cream-50 hover:bg-lam-green-700 transition-colors px-4 py-2 rounded-full text-sm font-medium"
                  >
                    Đăng Nhập
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-lam-green-800/8 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5 text-lam-green-800" />
                ) : (
                  <Menu className="w-5 h-5 text-lam-green-800" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-lam-green-950/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={`absolute top-0 right-0 h-full w-72 bg-lam-cream-50 shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-lam-cream-200">
            <span
              className="text-2xl font-semibold text-lam-green-900"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Lam Trà
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-lam-green-800/10 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-lam-green-800" />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center py-3 px-4 rounded-xl text-lam-green-800 hover:bg-lam-green-800/8 hover:text-lam-green-900 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="absolute bottom-8 left-6 right-6">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  href="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full border border-lam-cream-300 text-lam-green-800 hover:bg-lam-cream-100 transition-colors py-3 rounded-xl font-medium"
                >
                  Đơn Hàng Của Tôi
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center justify-center w-full text-lam-green-700 hover:text-lam-green-900 transition-colors py-3 rounded-xl font-medium"
                >
                  Đăng Xuất
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/track"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full border border-lam-cream-300 text-lam-green-800 hover:bg-lam-cream-100 transition-colors py-3 rounded-xl font-medium"
                >
                  Tra Cứu Đơn Hàng
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full bg-lam-green-800 text-lam-cream-50 hover:bg-lam-green-700 transition-colors py-3 rounded-xl font-medium"
                >
                  Đăng Nhập
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
