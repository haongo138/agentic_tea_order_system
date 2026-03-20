"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Clock,
  CreditCard,
  Star,
  Package,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { fetchOrderById, createReview } from "@/lib/api/orders";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES, PAYMENT_METHOD_LABELS, normalizeStatus } from "@/lib/mock-data";
import { OrderProgressStepper } from "@/components/OrderProgressStepper";
import type { ApiOrderDetail, OrderStatus } from "@/lib/types";

function formatCurrency(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ReviewSection({
  orderId,
  existingReview,
  onSubmitted,
}: {
  readonly orderId: number;
  readonly existingReview: ApiOrderDetail["review"];
  readonly onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (existingReview || submitted) {
    const review = existingReview;
    return (
      <div className="bg-lam-gold-400/10 rounded-2xl p-5">
        <h3
          className="text-lg font-semibold text-lam-green-900 mb-3"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Đánh Giá Của Bạn
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-5 h-5 ${s <= (review?.starRating ?? rating) ? "fill-lam-gold-500 text-lam-gold-500" : "text-lam-cream-300"}`}
            />
          ))}
        </div>
        {(review?.content ?? content) && (
          <p className="text-sm text-lam-green-700">{review?.content ?? content}</p>
        )}
      </div>
    );
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await createReview(orderId, { starRating: rating, content: content || undefined });
      setSubmitted(true);
      onSubmitted();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-product">
      <h3
        className="text-lg font-semibold text-lam-green-900 mb-4"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        Đánh Giá Đơn Hàng
      </h3>
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onClick={() => setRating(s)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-7 h-7 ${s <= rating ? "fill-lam-gold-500 text-lam-gold-500" : "text-lam-cream-300"}`}
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
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-2.5 rounded-xl bg-lam-green-800 hover:bg-lam-green-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Gửi Đánh Giá"}
      </button>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<ApiOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = Number(params.id);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const res = await fetchOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải đơn hàng");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [authLoading, isAuthenticated, user, router, orderId]);

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
      <div className="bg-lam-green-900 py-10 lg:py-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-lam-green-800/60 blur-3xl" />
        </div>
        <div className="container-wide section-padding relative z-10">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-lam-cream-100/60 hover:text-lam-cream-100 text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Link>
          <h1
            className="text-display text-3xl lg:text-4xl font-semibold text-lam-cream-50"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Đơn Hàng #{orderId}
          </h1>
        </div>
      </div>

      <div className="container-wide section-padding py-8 lg:py-10 max-w-2xl mx-auto space-y-6">
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
        ) : order ? (
          <>
            {/* Progress Stepper */}
            <div className="bg-white rounded-2xl p-5 shadow-product">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-lg font-semibold text-lam-green-900"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Trạng Thái Đơn Hàng
                </h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${ORDER_STATUS_STYLES[normalizeStatus(order.status)] ?? ORDER_STATUS_STYLES.pending}`}>
                  {ORDER_STATUS_LABELS[normalizeStatus(order.status)] ?? order.status}
                </span>
              </div>
              <OrderProgressStepper currentStatus={normalizeStatus(order.status)} />
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-2xl p-5 shadow-product space-y-4">
              <h2
                className="text-lg font-semibold text-lam-green-900"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Thông Tin Đơn Hàng
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-lam-green-700">
                  <Clock className="w-4 h-4 text-lam-green-600/50 shrink-0" />
                  <span>{formatDate(order.orderDate)}</span>
                </div>
                {order.branchName && (
                  <div className="flex items-center gap-2 text-lam-green-700">
                    <MapPin className="w-4 h-4 text-lam-green-600/50 shrink-0" />
                    <span>{order.branchName}</span>
                  </div>
                )}
                {order.deliveryAddress && (
                  <div className="flex items-start gap-2 text-lam-green-700">
                    <MapPin className="w-4 h-4 text-lam-green-600/50 shrink-0 mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-lam-green-700">
                  <CreditCard className="w-4 h-4 text-lam-green-600/50 shrink-0" />
                  <span>{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</span>
                </div>
                {order.note && (
                  <div className="flex items-start gap-2 text-lam-green-700">
                    <Package className="w-4 h-4 text-lam-green-600/50 shrink-0 mt-0.5" />
                    <span className="italic">{order.note}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl p-5 shadow-product">
              <h2
                className="text-lg font-semibold text-lam-green-900 mb-4"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Sản Phẩm
              </h2>
              <div className="divide-y divide-lam-cream-200">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-lam-green-900">
                          {item.productName ?? `SP #${item.productId}`}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-lam-green-600/60">
                          {item.sizeName && <span>Size {item.sizeName}</span>}
                          <span>x{item.quantity}</span>
                          <span>Đường {item.sugarLevel}%</span>
                          <span>Đá {item.iceLevel}%</span>
                        </div>
                        {item.toppings.length > 0 && (
                          <p className="text-xs text-lam-green-600/50 mt-1">
                            + {item.toppings.map((t) => t.toppingName).join(", ")}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-lam-green-900 shrink-0">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t border-lam-cream-200 space-y-2 text-sm">
                <div className="flex justify-between text-lam-green-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {parseFloat(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-lam-terracotta-500">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lam-green-900 text-base pt-2 border-t border-lam-cream-200">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(order.totalPayment)}</span>
                </div>
              </div>
            </div>

            {/* Review Section - only for completed orders */}
            {order.status === "completed" && (
              <ReviewSection
                orderId={order.id}
                existingReview={order.review}
                onSubmitted={() => {
                  setOrder((prev) => prev ? { ...prev, hasReview: true } : prev);
                }}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
