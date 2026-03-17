"use client";

import { useState, useMemo } from "react";
import { Search, ToggleLeft, ToggleRight, Star } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { AdminProduct } from "@/lib/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function MenuPage() {
  const [products, setProducts] = useState<AdminProduct[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category)))],
    []
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameVi.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, search, categoryFilter]);

  const toggleAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Thực Đơn" subtitle={`${products.length} sản phẩm`} />

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-admin-surface border border-admin-border rounded-lg text-admin-text placeholder-admin-muted focus:outline-none focus:border-admin-gold/40"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  categoryFilter === cat
                    ? "bg-admin-gold text-white"
                    : "bg-admin-surface border border-admin-border text-admin-muted hover:text-admin-text"
                }`}
              >
                {cat === "all" ? "Tất Cả" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table-style List */}
        <div className="admin-card overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-4 px-4 py-2.5 border-b border-admin-border text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
            <span>Sản Phẩm</span>
            <span />
            <span>Danh Mục</span>
            <span>Giá</span>
            <span>Đã Bán</span>
            <span>Trạng Thái</span>
          </div>

          {filtered.length > 0 ? (
            <div className="divide-y divide-admin-border">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-4 items-center px-4 py-3.5 hover:bg-admin-surface/50 transition-colors ${
                    !product.isAvailable ? "opacity-50" : ""
                  }`}
                >
                  {/* Color swatch */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${product.colorAccent}`} />

                  {/* Name */}
                  <div>
                    <div className="text-sm font-medium text-admin-text">{product.name}</div>
                    <div className="text-xs text-admin-muted">{product.nameVi}</div>
                    {product.badge && (
                      <span className="inline-block mt-0.5 text-[9px] px-1.5 py-0.5 rounded bg-admin-gold/15 text-admin-gold font-semibold uppercase tracking-wide">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="text-xs text-admin-muted">{product.category}</div>

                  {/* Price */}
                  <div className="data-value text-sm font-semibold text-admin-text">
                    {formatCurrency(product.price)}
                  </div>

                  {/* Sold + Rating */}
                  <div className="text-right">
                    <div className="data-value text-xs font-semibold text-admin-text">{product.totalSold.toLocaleString()}</div>
                    <div className="flex items-center gap-0.5 justify-end mt-0.5">
                      <Star size={9} className="text-admin-gold fill-admin-gold" />
                      <span className="data-value text-[10px] text-admin-muted">{product.rating}</span>
                    </div>
                  </div>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleAvailability(product.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      product.isAvailable ? "text-admin-emerald" : "text-admin-muted"
                    }`}
                  >
                    {product.isAvailable ? (
                      <ToggleRight size={20} />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                    <span className="hidden sm:inline">
                      {product.isAvailable ? "Mở" : "Tắt"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-admin-muted text-sm">
              Không tìm thấy sản phẩm
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
