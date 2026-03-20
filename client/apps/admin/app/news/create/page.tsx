"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { ImageUpload } from "@/components/ImageUpload";
import { createNews } from "@/lib/api/news";

const ARTICLE_TYPES = [
  { value: "promotion", label: "Khuyến Mãi" },
  { value: "announcement", label: "Thông Báo" },
  { value: "blog", label: "Blog" },
] as const;

const inputClass =
  "w-full px-3 py-2 text-sm bg-admin-surface border border-admin-border rounded-lg text-admin-text placeholder-admin-muted focus:outline-none focus:border-admin-gold/40";
const labelClass = "block text-xs font-medium text-admin-muted mb-1.5";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CreateNewsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [articleType, setArticleType] = useState<string>("promotion");
  const [publishDate, setPublishDate] = useState(todayISO);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      setError("Vui lòng điền đầy đủ tiêu đề và nội dung.");
      return;
    }

    setSubmitting(true);
    try {
      await createNews({
        title: title.trim(),
        content: content.trim(),
        articleType,
        publishDate,
        imageUrl: imageUrl ?? undefined,
      });
      router.push("/news");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Không thể tạo bài viết.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title="Tạo Bài Viết" subtitle="Tin tức mới" />

      <main className="flex-1 p-6">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm text-admin-muted hover:text-admin-text mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Quay lại
        </Link>

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="bg-admin-surface border border-admin-border rounded-xl p-6 space-y-5">
            {error && (
              <div className="px-4 py-3 text-sm text-admin-rose bg-admin-rose/10 border border-admin-rose/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className={labelClass}>
                Tiêu đề
              </label>
              <input
                id="title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài viết..."
                className={inputClass}
              />
            </div>

            {/* Article Type */}
            <div>
              <label htmlFor="articleType" className={labelClass}>
                Loại bài viết
              </label>
              <select
                id="articleType"
                value={articleType}
                onChange={(e) => setArticleType(e.target.value)}
                className={inputClass}
              >
                {ARTICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Publish Date */}
            <div>
              <label htmlFor="publishDate" className={labelClass}>
                Ngày đăng
              </label>
              <input
                id="publishDate"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className={labelClass}>Ảnh bìa</label>
              <ImageUpload
                bucket="news"
                value={imageUrl}
                onChange={setImageUrl}
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className={labelClass}>
                Nội dung
              </label>
              <textarea
                id="content"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung bài viết..."
                rows={8}
                className={`${inputClass} min-h-[200px] resize-y`}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-admin-gold text-admin-bg hover:bg-admin-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                Tạo Bài Viết
              </button>
              <Link
                href="/news"
                className="px-5 py-2 text-sm font-medium rounded-lg border border-admin-border text-admin-muted hover:text-admin-text hover:border-admin-gold/40 transition-colors"
              >
                Hủy
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
