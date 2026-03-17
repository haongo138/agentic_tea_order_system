"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { PRODUCTS, CATEGORY_LABELS } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import type { ProductCategory } from "@/lib/types";

const ALL_CATEGORIES = ["all", ...Object.keys(CATEGORY_LABELS).filter((k) => k !== "all")] as const;

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCat = activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        search.trim() === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameVi.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.includes(search.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20">
      {/* Page header */}
      <div className="bg-lam-green-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-lam-green-800/60 blur-3xl" />
          <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full bg-lam-gold-500/10 blur-3xl" />
        </div>
        <div className="container-wide section-padding relative z-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-400 mb-3">
            Our Menu
          </p>
          <h1
            className="text-display text-5xl lg:text-6xl xl:text-7xl font-semibold text-lam-cream-50 mb-4"
          >
            Thực Đơn <span className="italic font-medium text-lam-gold-400">Lam Trà</span>
          </h1>
          <p className="text-lam-cream-100/60 max-w-md mx-auto">
            {PRODUCTS.length} thức uống được chế tác từ nguyên liệu tươi chọn lọc
          </p>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-lam-cream-200 shadow-sm">
        <div className="container-wide section-padding py-3">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-shrink-0 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lam-green-600/40" />
              <input
                type="search"
                placeholder="Tìm thức uống..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 h-9 rounded-full border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 w-48 transition-all focus:w-60"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-3.5 h-3.5 text-lam-green-600/40 hover:text-lam-green-700" />
                </button>
              )}
            </div>

            {/* Category scroll */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
              {ALL_CATEGORIES.map((cat) => {
                const label = CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? "Tất Cả";
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-lam-green-800 text-white shadow-sm"
                        : "text-lam-green-700 hover:bg-lam-cream-100 border border-lam-cream-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Filter icon */}
            <button className="flex-shrink-0 flex items-center gap-1.5 text-sm font-medium text-lam-green-700 hover:text-lam-green-900 border border-lam-cream-300 rounded-full px-3 py-1.5 transition-colors hover:border-lam-green-500">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lọc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden bg-white border-b border-lam-cream-200 px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lam-green-600/40" />
          <input
            type="search"
            placeholder="Tìm thức uống..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-full border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15"
          />
        </div>
      </div>

      {/* Products grid */}
      <div className="container-wide section-padding py-10 lg:py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🍃</span>
            <p className="text-lam-green-700 font-medium">Không tìm thấy thức uống nào.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("all"); }}
              className="mt-4 text-sm text-lam-terracotta-500 hover:text-lam-terracotta-600 font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-lam-green-700/60">
                Hiển thị{" "}
                <span className="font-semibold text-lam-green-800">{filtered.length}</span>{" "}
                thức uống
                {activeCategory !== "all" && (
                  <> trong <span className="font-semibold text-lam-green-800">{CATEGORY_LABELS[activeCategory as keyof typeof CATEGORY_LABELS]}</span></>
                )}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
