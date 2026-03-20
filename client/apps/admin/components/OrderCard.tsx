"use client";

import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import type { AdminOrder, OrderStatus } from "@/lib/types";
import { ORDER_STATUS_CONFIG, NEXT_STATUS, PAYMENT_LABELS, formatCurrency, normalizeStatus } from "@/lib/mock-data";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

interface OrderCardProps {
  order: AdminOrder;
  onStatusChange?: (id: number, status: OrderStatus) => void;
  compact?: boolean;
}

export function OrderCard({ order, onStatusChange, compact = false }: OrderCardProps) {
  const displayStatus = normalizeStatus(order.status);
  const config = ORDER_STATUS_CONFIG[displayStatus];
  const next = NEXT_STATUS[displayStatus];
  const isPaid = displayStatus === "completed";

  return (
    <Link href={`/orders/${order.id}`} className="block admin-card p-4 hover:border-admin-border/80 transition-all duration-200 animate-order-in">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="data-value text-sm font-semibold text-admin-text">#{order.id}</span>
            {!isPaid && order.status !== "cancelled" && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-admin-rose/15 text-admin-rose font-medium">Chưa TT</span>
            )}
          </div>
          <div className="text-xs text-admin-muted mt-0.5">Hanoi Centre</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={config.dotClass} />
          <span className={`text-xs font-medium ${config.textClass}`}>{config.label}</span>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm text-admin-text font-medium">Khách #{order.customerId}</div>
        {order.deliveryAddress && (
          <div className="text-xs text-admin-muted truncate">{order.deliveryAddress}</div>
        )}
      </div>

      {!compact && order.note && (
        <div className="mb-3 text-xs text-admin-muted italic">
          Ghi chú: {order.note}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-admin-border">
        <div className="flex items-center gap-3">
          <div className="data-value text-sm font-bold text-admin-gold">{formatCurrency(order.totalPayment)}</div>
          <div className="text-xs text-admin-muted">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-admin-muted">
            <Clock size={10} />
            <span>{formatTime(order.orderDate)}</span>
          </div>
          {next && onStatusChange && (
            <button
              onClick={(e) => { e.preventDefault(); onStatusChange(order.id, next); }}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-admin-gold/15 text-admin-gold hover:bg-admin-gold/25 transition-colors font-medium"
            >
              <span>Tiếp theo</span>
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
