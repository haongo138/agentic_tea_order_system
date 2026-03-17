"use client";

import { useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  MapPin,
  Star,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { StatsCard } from "@/components/StatsCard";
import { OrderCard } from "@/components/OrderCard";
import { RevenueChart } from "@/components/RevenueChart";
import {
  DASHBOARD_STATS,
  MOCK_ORDERS,
  MOCK_PRODUCTS,
  MOCK_REVENUE,
  MOCK_SENTIMENT,
} from "@/lib/mock-data";
import type { AdminOrder, OrderStatus } from "@/lib/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
  };

  const liveOrders = orders.filter((o) => ["pending", "preparing", "ready"].includes(o.status));

  const sentimentPct = Math.round((MOCK_SENTIMENT.positive / MOCK_SENTIMENT.total) * 100);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Tổng Quan" subtitle="Thứ Sáu, 13 tháng 3 năm 2026" />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Doanh Thu Hôm Nay"
            value={formatCurrency(DASHBOARD_STATS.revenueToday)}
            change={DASHBOARD_STATS.revenueTodayChange}
            icon={DollarSign}
            accent="gold"
          />
          <StatsCard
            label="Đơn Hôm Nay"
            value={String(DASHBOARD_STATS.ordersToday)}
            change={DASHBOARD_STATS.ordersTodayChange}
            icon={ShoppingBag}
            accent="emerald"
          />
          <StatsCard
            label="Chi Nhánh Hoạt Động"
            value={`${DASHBOARD_STATS.activeBranches}/${DASHBOARD_STATS.totalBranches}`}
            icon={MapPin}
            accent="sky"
          />
          <StatsCard
            label="Đánh Giá TB"
            value={`${DASHBOARD_STATS.avgRating} ★`}
            change={DASHBOARD_STATS.avgRatingChange}
            icon={Star}
            accent="gold"
          />
        </div>

        {/* Chart + Sentiment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 admin-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-admin-text">Doanh Thu 7 Ngày</div>
                <div className="text-xs text-admin-muted mt-0.5">T2 – CN tuần này</div>
              </div>
              <div className="flex items-center gap-4 text-xs text-admin-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-admin-gold inline-block" />
                  Doanh Thu
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-admin-emerald inline-block" />
                  Đơn Hàng
                </span>
              </div>
            </div>
            <RevenueChart data={MOCK_REVENUE} />
          </div>

          {/* Sentiment */}
          <div className="admin-card p-5 flex flex-col">
            <div className="text-sm font-semibold text-admin-text mb-1">Cảm Xúc Khách Hàng</div>
            <div className="text-xs text-admin-muted mb-4">{MOCK_SENTIMENT.total} đánh giá tháng này</div>

            <div className="flex-1 flex flex-col justify-center space-y-4">
              {/* Positive */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-admin-muted">Tích Cực</span>
                  <span className="data-value text-admin-emerald font-semibold">{MOCK_SENTIMENT.positive}</span>
                </div>
                <div className="h-1.5 rounded-full bg-admin-surface2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-admin-emerald transition-all"
                    style={{ width: `${(MOCK_SENTIMENT.positive / MOCK_SENTIMENT.total) * 100}%` }}
                  />
                </div>
              </div>
              {/* Neutral */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-admin-muted">Trung Tính</span>
                  <span className="data-value text-admin-muted font-semibold">{MOCK_SENTIMENT.neutral}</span>
                </div>
                <div className="h-1.5 rounded-full bg-admin-surface2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-admin-muted transition-all"
                    style={{ width: `${(MOCK_SENTIMENT.neutral / MOCK_SENTIMENT.total) * 100}%` }}
                  />
                </div>
              </div>
              {/* Negative */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-admin-muted">Tiêu Cực</span>
                  <span className="data-value text-admin-rose font-semibold">{MOCK_SENTIMENT.negative}</span>
                </div>
                <div className="h-1.5 rounded-full bg-admin-surface2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-admin-rose transition-all"
                    style={{ width: `${(MOCK_SENTIMENT.negative / MOCK_SENTIMENT.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-admin-border text-center">
              <div className="data-value text-3xl font-bold text-admin-emerald">{sentimentPct}%</div>
              <div className="text-xs text-admin-muted mt-0.5">Hài Lòng</div>
            </div>
          </div>
        </div>

        {/* Live Orders + Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Live Orders */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="status-dot-ready" />
                <span className="text-sm font-semibold text-admin-text">Đơn Đang Hoạt Động</span>
                <span className="data-value text-xs px-1.5 py-0.5 rounded bg-admin-surface2 text-admin-muted">{liveOrders.length}</span>
              </div>
            </div>
            <div className="space-y-3">
              {liveOrders.length > 0 ? (
                liveOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={handleStatusChange}
                    compact
                  />
                ))
              ) : (
                <div className="admin-card p-8 text-center text-admin-muted text-sm">
                  Không có đơn hàng đang xử lý
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div>
            <div className="text-sm font-semibold text-admin-text mb-3">Sản Phẩm Bán Chạy</div>
            <div className="admin-card divide-y divide-admin-border">
              {MOCK_PRODUCTS.filter((p) => p.totalSold > 0)
                .sort((a, b) => b.totalSold - a.totalSold)
                .slice(0, 5)
                .map((product, i) => (
                  <div key={product.id} className="flex items-center gap-3 p-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${product.colorAccent} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-admin-text truncate">{product.name}</div>
                      <div className="text-[10px] text-admin-muted">{product.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="data-value text-xs font-semibold text-admin-text">{product.totalSold.toLocaleString()}</div>
                      <div className="text-[10px] text-admin-muted">đã bán</div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-admin-surface2 flex items-center justify-center text-[9px] text-admin-muted font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
