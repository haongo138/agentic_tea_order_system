"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Loader2, FileText, ArrowRight, Trash2, Calendar, Pencil } from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { fetchNews, updateNewsStatus, deleteNews } from "@/lib/api/news";
import type { NewsArticle, ArticleType, PublishStatus } from "@/lib/types";

const ARTICLE_TYPE_LABELS: Record<string, string> = {
  promotion: "Khuyến Mãi",
  announcement: "Thông Báo",
  blog: "Blog",
};

const PUBLISH_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: "Nháp", color: "text-admin-muted bg-admin-surface2" },
  published: { label: "Đã Đăng", color: "text-admin-emerald bg-admin-emerald/15" },
  archived: { label: "Lưu Trữ", color: "text-admin-rose bg-admin-rose/15" },
};

const NEXT_PUBLISH_STATUS: Record<string, string> = {
  draft: "published",
  published: "archived",
  archived: "draft",
};

const ARTICLE_TYPE_FILTERS: { value: ArticleType | "all"; label: string }[] = [
  { value: "all", label: "Tất Cả" },
  { value: "promotion", label: "Khuyến Mãi" },
  { value: "announcement", label: "Thông Báo" },
  { value: "blog", label: "Blog" },
];

const PUBLISH_STATUS_FILTERS: { value: PublishStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất Cả" },
  { value: "draft", label: "Nháp" },
  { value: "published", label: "Đã Đăng" },
  { value: "archived", label: "Lưu Trữ" },
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<ArticleType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PublishStatus | "all">("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchNews();
        setArticles(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchType = typeFilter === "all" || a.articleType === typeFilter;
      const matchStatus = statusFilter === "all" || a.publishStatus === statusFilter;
      return matchType && matchStatus;
    });
  }, [articles, typeFilter, statusFilter]);

  const typeCounts = useMemo(() => {
    return articles.reduce(
      (acc, a) => {
        acc[a.articleType] = (acc[a.articleType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [articles]);

  const statusCounts = useMemo(() => {
    return articles.reduce(
      (acc, a) => {
        acc[a.publishStatus] = (acc[a.publishStatus] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [articles]);

  const handleStatusToggle = useCallback(async (id: number, currentStatus: string) => {
    const nextStatus = NEXT_PUBLISH_STATUS[currentStatus] as PublishStatus;
    try {
      await updateNewsStatus(id, nextStatus);
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, publishStatus: nextStatus } : a))
      );
    } catch (err) {
      console.error("Failed to update article status:", err);
    }
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteNews(id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  }, []);

  const formatDate = useCallback((dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Tin Tức" subtitle="Đang tải..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Tin Tức" subtitle="" />
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
      <TopBar title="Tin Tức" subtitle={`${articles.length} bài viết`} />

      <div className="p-6 space-y-5">
        {/* Create Button */}
        <div className="flex justify-end">
          <Link
            href="/news/create"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-admin-gold text-white text-sm font-medium hover:bg-admin-gold/90 transition-colors"
          >
            <Plus size={16} />
            <span>Tạo Bài Viết</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          {/* Article Type Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <FileText size={14} className="text-admin-muted mr-1" />
            {ARTICLE_TYPE_FILTERS.map(({ value, label }) => {
              const count = value === "all" ? articles.length : typeCounts[value] || 0;
              const active = typeFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => setTypeFilter(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-admin-gold text-white"
                      : "bg-admin-surface border border-admin-border text-admin-muted hover:text-admin-text hover:border-admin-gold/30"
                  }`}
                >
                  <span>{label}</span>
                  <span className={`data-value text-[10px] ${active ? "opacity-80" : "opacity-60"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Publish Status Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Calendar size={14} className="text-admin-muted mr-1" />
            {PUBLISH_STATUS_FILTERS.map(({ value, label }) => {
              const count = value === "all" ? articles.length : statusCounts[value] || 0;
              const active = statusFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-admin-gold text-white"
                      : "bg-admin-surface border border-admin-border text-admin-muted hover:text-admin-text hover:border-admin-gold/30"
                  }`}
                >
                  <span>{label}</span>
                  <span className={`data-value text-[10px] ${active ? "opacity-80" : "opacity-60"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Articles Table */}
        <div className="admin-card overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 px-4 py-2.5 border-b border-admin-border text-[10px] font-semibold uppercase tracking-wider text-admin-muted">
            <span>Tiêu Đề</span>
            <span>Ngày Đăng</span>
            <span>Trạng Thái</span>
            <span>Thao Tác</span>
          </div>

          {filtered.length > 0 ? (
            <div className="divide-y divide-admin-border">
              {filtered.map((article) => {
                const statusConfig = PUBLISH_STATUS_CONFIG[article.publishStatus];
                const typeLabel = ARTICLE_TYPE_LABELS[article.articleType];
                return (
                  <div
                    key={article.id}
                    className="grid grid-cols-[1fr_auto_auto_auto] gap-x-4 items-center px-4 py-3.5 hover:bg-admin-surface/50 transition-colors"
                  >
                    {/* Title + Type Badge */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-admin-text truncate">
                          {article.title}
                        </span>
                        {typeLabel && (
                          <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-medium bg-admin-sky/15 text-admin-sky">
                            {typeLabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Publish Date */}
                    <div className="text-xs text-admin-muted whitespace-nowrap">
                      {article.publishDate ? formatDate(article.publishDate) : "—"}
                    </div>

                    {/* Status Badge */}
                    <div>
                      {statusConfig && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/news/${article.id}/edit`}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-admin-muted hover:text-admin-gold hover:bg-admin-gold/10 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleStatusToggle(article.id, article.publishStatus)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-admin-gold hover:bg-admin-gold/10 transition-colors"
                        title={`Chuyển sang ${PUBLISH_STATUS_CONFIG[NEXT_PUBLISH_STATUS[article.publishStatus]]?.label}`}
                      >
                        <ArrowRight size={14} />
                        <span className="hidden sm:inline">
                          {PUBLISH_STATUS_CONFIG[NEXT_PUBLISH_STATUS[article.publishStatus]]?.label}
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-admin-rose hover:bg-admin-rose/10 transition-colors"
                        title="Xóa bài viết"
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
              Không tìm thấy bài viết
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
