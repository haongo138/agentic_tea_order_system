"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Search, ToggleLeft, ToggleRight, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { fetchProducts, updateProduct, deleteProduct } from "@/lib/api/products";
import { formatCurrency, getProductColorAccent } from "@/lib/mock-data";
import type { AdminProduct, AdminCategory } from "@/lib/types";

export default function MenuPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchProducts();
        setProducts(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((p) => p.categoryName).filter((c): c is string => c != null)))],
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "all" || p.categoryName === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, search, categoryFilter]);

  const handleDelete = useCallback(async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${name}"?`)) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  }, []);

  const toggleAvailability = useCallback(async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "available" ? "unavailable" : "available";
    try {
      await updateProduct(id, { salesStatus: newStatus });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, salesStatus: newStatus } : p))
      );
    } catch (err) {
      console.error("Failed to toggle availability:", err);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Thực Đơn" subtitle="Đang tải..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Thực Đơn" subtitle="" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-admin-rose text-sm mb-2">{error}</p>
            <button onClick={() => window.location.reload()} className="text-xs text-admin-gold hover:underline">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Thực Đơn" subtitle={`${products.length} sản phẩm`} />

      <div className="p-6 space-y-5">
        {/* Actions */}
        <div className="flex justify-end">
          <Link
            href="/menu/create"
            className="flex items-center gap-2 px-4 py-2 bg-admin-gold text-white text-sm font-medium rounded-lg hover:bg-admin-gold/90 transition-colors"
          >
            <Plus size={16} />
            Tạo Sản Phẩm
          </Link>
        </div>

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
          <div className="flex items-center gap-1.5 flex-wrap">
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
            <span>Trạng Thái</span>
            <span>Thao Tác</span>
          </div>

          {filtered.length > 0 ? (
            <div className="divide-y divide-admin-border">
              {filtered.map((product) => {
                const isAvailable = product.salesStatus === "available";
                return (
                  <div
                    key={product.id}
                    className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-x-4 items-center px-4 py-3.5 hover:bg-admin-surface/50 transition-colors ${
                      !isAvailable ? "opacity-50" : ""
                    }`}
                  >
                    {/* Product thumbnail */}
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getProductColorAccent(product.name)}`} />
                    )}

                    {/* Name */}
                    <div>
                      <div className="text-sm font-medium text-admin-text">{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-admin-muted truncate max-w-xs">{product.description}</div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="text-xs text-admin-muted">{product.categoryName ?? "—"}</div>

                    {/* Price */}
                    <div className="data-value text-sm font-semibold text-admin-text">
                      {formatCurrency(product.basePrice)}
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => toggleAvailability(product.id, product.salesStatus)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        isAvailable ? "text-admin-emerald" : "text-admin-muted"
                      }`}
                    >
                      {isAvailable ? (
                        <ToggleRight size={20} />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                      <span className="hidden sm:inline">
                        {isAvailable ? "Mở" : "Tắt"}
                      </span>
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/menu/${product.id}/edit`}
                        className="p-1.5 rounded-lg text-admin-muted hover:text-admin-gold hover:bg-admin-surface transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 rounded-lg text-admin-muted hover:text-admin-rose hover:bg-admin-surface transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
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
