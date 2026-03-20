"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Loader2, ChevronRight, Star, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { fetchOrders, createReview } from "@/lib/api/orders";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES, normalizeStatus } from "@/lib/mock-data";
import type { ApiOrder, OrderStatus } from "@/lib/types";

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "all", label: "Tất Cả" },
  { value: "pending", label: "Chờ Xử Lý" },
  { value: "preparing", label: "Đang Pha" },
  { value: "delivering", label: "Đang Giao" },
  { value: "delivered", label: "Đã Giao" },
  { value: "completed", label: "Hoàn Thành" },
  { value: "cancelled", label: "Đã Hủy" },
];

function formatCurrency(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Review modal component
function ReviewModal({
  orderId,
  onClose,
  onSubmit,
}: {
  orderId: number;
  onClose: () => void;
  onSubmit: (orderId: number, rating: number, content: string) => Promise<void>;
}) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(orderId, rating, content);
      onClose();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3
          className="text-xl font-semibold text-lam-green-900 mb-4"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Đánh Giá Đơn Hàng
        </h3>

        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-7 h-7 ${star <= rating ? "fill-lam-gold-500 text-lam-gold-500" : "text-lam-cream-300"}`}
              />
            </button>
          ))}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Chia sẻ cảm nhận của bạn (tùy chọn)..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 transition-all resize-none mb-4"
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-lam-cream-300 text-sm font-medium text-lam-green-700 hover:bg-lam-cream-100 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 rounded-xl bg-lam-green-800 hover:bg-lam-green-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gửi Đánh Giá"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [reviewOrderId, setReviewOrderId] = useState<number | null>(null);
  const [reviewedOrderIds, setReviewedOrderIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const res = await fetchOrders({ customerId: user!.id, limit: 50 });
        setOrders(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authLoading, isAuthenticated, user, router]);

  const handleReviewSubmit = async (orderId: number, rating: number, content: string) => {
    await createReview(orderId, { starRating: rating, content: content || undefined });
    setReviewedOrderIds((prev) => new Set([...prev, orderId]));
    setReviewOrderId(null);
  };

  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((o) => normalizeStatus(o.status) === activeTab);

  if (authLoading || (!isAuthenticated && !loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-lam-green-600/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20">
      {/* Header */}
      <div className="bg-lam-green-900 py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-lam-green-800/60 blur-3xl" />
        </div>
        <div className="container-wide section-padding relative z-10 text-center">
          <h1
            className="text-display text-4xl lg:text-5xl font-semibold text-lam-cream-50 mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-lam-cream-100/60 text-sm">
            Theo dõi và quản lý các đơn hàng của bạn
          </p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="sticky top-16 lg:top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-lam-cream-200 shadow-sm">
        <div className="container-wide section-padding py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.value
                    ? "bg-lam-green-800 text-white shadow-sm"
                    : "text-lam-green-700 hover:bg-lam-cream-100 border border-lam-cream-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders list */}
      <div className="container-wide section-padding py-8 lg:py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-lam-green-600/40" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-lam-terracotta-500 text-sm mb-2">{error}</p>
            <button onClick={() => window.location.reload()} className="text-sm text-lam-green-700 hover:underline">
              Thử lại
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-lam-green-600/20 mx-auto mb-4" />
            <p className="text-lam-green-700 font-medium mb-2">Không có đơn hàng nào.</p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm text-lam-terracotta-500 hover:text-lam-terracotta-600 font-medium"
            >
              Đặt hàng ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {filteredOrders.map((order) => {
              const normalized = normalizeStatus(order.status);
              const statusStyle = ORDER_STATUS_STYLES[normalized] ?? ORDER_STATUS_STYLES.pending;
              const statusLabel = ORDER_STATUS_LABELS[normalized] ?? order.status;
              const canReview = order.status === "completed" && !order.hasReview && !reviewedOrderIds.has(order.id);

              return (
                <Link key={order.id} href={`/orders/${order.id}`} className="block bg-white rounded-2xl p-5 shadow-product hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-sm font-semibold text-lam-green-900">
                        Đơn #{order.id}
                      </p>
                      <p className="text-xs text-lam-green-600/50 mt-0.5">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm border-t border-lam-cream-200 pt-3">
                    <div>
                      {order.branchName && (
                        <p className="text-xs text-lam-green-600/50 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {order.branchName}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-lam-green-900">
                      {formatCurrency(order.totalPayment)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-lam-cream-200">
                    {canReview ? (
                      <button
                        onClick={(e) => { e.preventDefault(); setReviewOrderId(order.id); }}
                        className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl border border-lam-gold-500/30 text-lam-gold-600 hover:bg-lam-gold-400/10 text-xs font-medium transition-colors"
                      >
                        <Star className="w-3.5 h-3.5" />
                        Đánh giá
                      </button>
                    ) : <div />}
                    <div className="flex items-center gap-1 text-xs text-lam-green-600/40">
                      <span>Chi tiết</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Review modal */}
      {reviewOrderId !== null && (
        <ReviewModal
          orderId={reviewOrderId}
          onClose={() => setReviewOrderId(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
