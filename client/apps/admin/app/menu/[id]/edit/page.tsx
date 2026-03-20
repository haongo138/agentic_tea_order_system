"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { fetchProducts, fetchCategories, updateProduct } from "@/lib/api/products";
import { ImageUpload } from "@/components/ImageUpload";
import type { AdminCategory } from "@/lib/types";

interface FormState {
  readonly name: string;
  readonly categoryId: string;
  readonly basePrice: string;
  readonly imageUrl: string;
  readonly description: string;
}

const inputClass =
  "w-full px-3 py-2 text-sm bg-admin-surface border border-admin-border rounded-lg text-admin-text placeholder-admin-muted focus:outline-none focus:border-admin-gold/40";
const labelClass = "block text-xs font-medium text-admin-muted mb-1.5";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = Number(id);
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    categoryId: "",
    basePrice: "",
    imageUrl: "",
    description: "",
  });
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        setCategories(categoriesRes.data);

        const product = productsRes.data.find((p) => p.id === productId);
        if (!product) {
          setError("Không tìm thấy sản phẩm");
          setLoading(false);
          return;
        }

        setForm({
          name: product.name,
          categoryId: String(product.categoryId),
          basePrice: product.basePrice,
          imageUrl: product.imageUrl ?? "",
          description: product.description ?? "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  function updateField(field: keyof FormState, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Tên sản phẩm là bắt buộc");
      return;
    }
    if (!form.categoryId) {
      setError("Vui lòng chọn danh mục");
      return;
    }
    if (!form.basePrice.trim()) {
      setError("Giá gốc là bắt buộc");
      return;
    }

    setSubmitting(true);
    try {
      await updateProduct(productId, {
        name: form.name.trim(),
        categoryId: Number(form.categoryId),
        basePrice: form.basePrice.trim(),
        imageUrl: form.imageUrl.trim() || null,
        description: form.description.trim() || null,
      });
      router.push("/menu");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật sản phẩm");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Chỉnh Sửa Sản Phẩm" subtitle="Đang tải..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Chỉnh Sửa Sản Phẩm" subtitle={form.name || "Sản phẩm"} />

      <div className="p-6 max-w-2xl">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-xs text-admin-muted hover:text-admin-text transition-colors mb-6"
        >
          <ArrowLeft size={14} />
          Quay lại thực đơn
        </Link>

        <form onSubmit={handleSubmit} className="admin-card p-6 space-y-5">
          {error && (
            <div className="text-sm text-admin-rose bg-admin-rose/10 border border-admin-rose/20 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className={labelClass}>
              Tên sản phẩm <span className="text-admin-rose">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Trà sữa trân châu"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="categoryId" className={labelClass}>
              Danh mục <span className="text-admin-rose">*</span>
            </label>
            <select
              id="categoryId"
              required
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className={inputClass}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="basePrice" className={labelClass}>
              Giá gốc <span className="text-admin-rose">*</span>
            </label>
            <input
              id="basePrice"
              type="text"
              required
              value={form.basePrice}
              onChange={(e) => updateField("basePrice", e.target.value)}
              placeholder="45000"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Hình ảnh</label>
            <ImageUpload
              bucket="products"
              value={form.imageUrl || null}
              onChange={(url) => updateField("imageUrl", url ?? "")}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Mô tả
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Mô tả sản phẩm..."
              rows={3}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-admin-gold text-white text-sm font-medium rounded-lg hover:bg-admin-gold/90 transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Cập Nhật
            </button>
            <Link
              href="/menu"
              className="px-5 py-2 text-sm text-admin-muted hover:text-admin-text border border-admin-border rounded-lg transition-colors"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
