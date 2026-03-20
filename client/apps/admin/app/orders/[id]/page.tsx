"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Clock,
  CreditCard,
  ChevronRight,
  User,
  FileText,
  Star,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { OrderProgressStepper } from "@/components/OrderProgressStepper";
import { fetchOrderById, updateOrderStatus } from "@/lib/api/orders";
import {
  ORDER_STATUS_CONFIG,
  NEXT_STATUS,
  PAYMENT_LABELS,
  formatCurrency,
  normalizeStatus,
} from "@/lib/mock-data";
import type { AdminOrderDetail, OrderStatus } from "@/lib/types";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
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
  }, [orderId]);

  const handleStatusChange = useCallback(async (nextStatus: OrderStatus) => {
    if (!order || updating) return;
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, nextStatus);
      setOrder((prev) => prev ? { ...prev, status: nextStatus } : prev);
    } catch (err) {
      console.error("Failed to update order status:", err);
    } finally {
      setUpdating(false);
    }
  }, [order, updating]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Chi Tiết Đơn" subtitle="Đang tải..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Chi Tiết Đơn" subtitle="" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-admin-rose text-sm mb-2">{error ?? "Không tìm thấy đơn hàng"}</p>
            <Link href="/orders" className="text-xs text-admin-gold hover:underline">
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayStatus = normalizeStatus(order.status);
  const statusConfig = ORDER_STATUS_CONFIG[displayStatus];
  const nextStatus = NEXT_STATUS[displayStatus];

  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title={`Đơn #${order.id}`}
        subtitle={statusConfig.label}
      />

      <main className="flex-1 p-6 space-y-5 max-w-4xl">
        {/* Back link */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-admin-muted hover:text-admin-text text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại đơn hàng
        </Link>

        {/* Progress Stepper */}
        <div className="admin-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-admin-text">Tiến Trình Đơn Hàng</h2>
            <div className="flex items-center gap-1.5">
              <div className={statusConfig.dotClass} />
              <span className={`text-xs font-medium ${statusConfig.textClass}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>
          <OrderProgressStepper currentStatus={displayStatus} />

          {nextStatus && (
            <div className="mt-5 pt-4 border-t border-admin-border flex items-center justify-end">
              <button
                onClick={() => handleStatusChange(nextStatus)}
                disabled={updating}
                className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-admin-gold/15 text-admin-gold hover:bg-admin-gold/25 disabled:opacity-50 transition-colors font-medium"
              >
                {updating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Chuyển sang: {ORDER_STATUS_CONFIG[nextStatus].label}</span>
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Order Info + Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Order Info */}
          <div className="admin-card p-5 space-y-4">
            <h2 className="text-sm font-semibold text-admin-text">Thông Tin</h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-admin-muted">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Khách #{order.customerId}</span>
              </div>
              <div className="flex items-center gap-2 text-admin-muted">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{formatDateTime(order.orderDate)}</span>
              </div>
              {order.branchName && (
                <div className="flex items-center gap-2 text-admin-muted">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{order.branchName}</span>
                </div>
              )}
              {order.deliveryAddress && (
                <div className="flex items-start gap-2 text-admin-muted">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{order.deliveryAddress}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-admin-muted">
                <CreditCard className="w-3.5 h-3.5 shrink-0" />
                <span>{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</span>
              </div>
              {order.note && (
                <div className="flex items-start gap-2 text-admin-muted">
                  <FileText className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span className="italic">{order.note}</span>
                </div>
              )}
            </div>

            {/* Payment summary */}
            <div className="pt-3 border-t border-admin-border space-y-1.5 text-xs">
              <div className="flex justify-between text-admin-muted">
                <span>Tạm tính</span>
                <span className="data-value">{formatCurrency(order.subtotal)}</span>
              </div>
              {parseFloat(order.discountAmount) > 0 && (
                <div className="flex justify-between text-admin-emerald">
                  <span>Giảm giá</span>
                  <span className="data-value">-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-admin-text font-bold text-sm pt-1.5 border-t border-admin-border">
                <span>Tổng</span>
                <span className="data-value text-admin-gold">{formatCurrency(order.totalPayment)}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="lg:col-span-2 admin-card p-5">
            <h2 className="text-sm font-semibold text-admin-text mb-4">
              Sản Phẩm ({order.items.length})
            </h2>
            <div className="divide-y divide-admin-border">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-admin-text">
                        {item.productName ?? `SP #${item.productId}`}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-admin-muted">
                        {item.sizeName && <span>Size {item.sizeName}</span>}
                        <span>x{item.quantity}</span>
                        <span>Đường {item.sugarLevel}%</span>
                        <span>Đá {item.iceLevel}%</span>
                      </div>
                      {item.toppings.length > 0 && (
                        <p className="text-[10px] text-admin-muted/70 mt-1">
                          + {item.toppings.map((t) => t.toppingName).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="data-value text-xs font-semibold text-admin-text">
                        {formatCurrency(item.totalPrice)}
                      </p>
                      <p className="text-[10px] text-admin-muted mt-0.5">
                        @ {formatCurrency(item.priceAtOrderTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review */}
        {order.review && (
          <div className="admin-card p-5">
            <h2 className="text-sm font-semibold text-admin-text mb-3">Đánh Giá Khách Hàng</h2>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${s <= order.review!.starRating ? "fill-admin-gold text-admin-gold" : "text-admin-border"}`}
                />
              ))}
              <span className="ml-2 data-value text-xs text-admin-muted">
                {order.review.starRating}/5
              </span>
            </div>
            {order.review.content && (
              <p className="text-xs text-admin-muted italic">{order.review.content}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
