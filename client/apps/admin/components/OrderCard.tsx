"use client";

import { Clock, ChevronRight } from "lucide-react";
import type { AdminOrder, OrderStatus } from "@/lib/types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; dotClass: string; textClass: string }> = {
  pending: { label: "Chờ Xử Lý", dotClass: "status-dot-pending", textClass: "text-amber-400" },
  preparing: { label: "Đang Pha", dotClass: "status-dot-preparing", textClass: "text-sky-400" },
  ready: { label: "Sẵn Sàng", dotClass: "status-dot-ready", textClass: "text-admin-emerald" },
  completed: { label: "Hoàn Thành", dotClass: "status-dot-completed", textClass: "text-admin-muted" },
  cancelled: { label: "Đã Huỷ", dotClass: "status-dot-cancelled", textClass: "text-admin-rose" },
};

const PAYMENT_LABELS: Record<string, string> = {
  momo: "MoMo",
  vnpay: "VNPay",
  cod: "COD",
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

interface OrderCardProps {
  order: AdminOrder;
  onStatusChange?: (id: string, status: OrderStatus) => void;
  compact?: boolean;
}

export function OrderCard({ order, onStatusChange, compact = false }: OrderCardProps) {
  const config = STATUS_CONFIG[order.status];
  const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
    pending: "preparing",
    preparing: "ready",
    ready: "completed",
  };
  const next = nextStatus[order.status];

  return (
    <div className="admin-card p-4 hover:border-admin-border/80 transition-all duration-200 animate-order-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="data-value text-sm font-semibold text-admin-text">{order.orderNumber}</span>
            {!order.isPaid && order.status !== "cancelled" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-admin-rose/15 text-admin-rose font-medium">Chưa TT</span>
            )}
          </div>
          <div className="text-xs text-admin-muted mt-0.5">{order.branchName}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={config.dotClass} />
          <span className={`text-xs font-medium ${config.textClass}`}>{config.label}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm text-admin-text font-medium">{order.customerName}</div>
        <div className="text-xs text-admin-muted">{order.customerPhone}</div>
      </div>

      {!compact && (
        <div className="mb-3 space-y-1">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-admin-muted">
                {item.quantity}x {item.productName} ({item.size})
              </span>
              <span className="data-value text-admin-text">{formatCurrency(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-admin-border">
        <div className="flex items-center gap-3">
          <div className="data-value text-sm font-bold text-admin-gold">{formatCurrency(order.total)}</div>
          <div className="text-xs text-admin-muted">{PAYMENT_LABELS[order.paymentMethod]}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-admin-muted">
            <Clock size={10} />
            <span>{formatTime(order.createdAt)}</span>
          </div>
          {next && onStatusChange && (
            <button
              onClick={() => onStatusChange(order.id, next)}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-admin-gold/15 text-admin-gold hover:bg-admin-gold/25 transition-colors font-medium"
            >
              <span>Tiếp theo</span>
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
