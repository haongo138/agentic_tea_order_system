"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DollarSign,
  ShoppingBag,
  Store,
  Star,
  Loader2,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { StatsCard } from "@/components/StatsCard";
import { OrderCard } from "@/components/OrderCard";
import { RevenueChart } from "@/components/RevenueChart";
import { fetchDashboardStats, fetchRevenueChart, fetchTopProducts, fetchSentiment } from "@/lib/api/dashboard";
import { fetchOrders, updateOrderStatus } from "@/lib/api/orders";
import { formatCurrency, formatCurrencyShort, getProductColorAccent } from "@/lib/mock-data";
import type { AdminOrder, OrderStatus, DashboardStats, RevenueDataPoint, TopProduct, SentimentData } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenue, setRevenue] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, revenueRes, topRes, sentRes, ordersRes] = await Promise.all([
          fetchDashboardStats(),
          fetchRevenueChart(7),
          fetchTopProducts(5),
          fetchSentiment(),
          fetchOrders({ limit: 20 }),
        ]);
        setStats(statsRes.data);
        setRevenue(revenueRes.data.map((d: RevenueDataPoint) => ({
          date: d.date,
          revenue: parseFloat(d.revenue) || 0,
          orders: d.orders,
        })));
        setTopProducts(topRes.data);
        setSentiment(sentRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleStatusChange = useCallback(async (id: number, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  }, []);

  const liveOrders = orders.filter((o) => ["pending", "preparing", "ready", "delivering"].includes(o.status));

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Tổng Quan" subtitle={today} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Tổng Quan" subtitle={today} />
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

  const chartData = revenue.map((r) => ({
    date: new Date(r.date).toLocaleDateString("vi-VN", { weekday: "short" }),
    revenue: r.revenue,
    orders: r.orders,
  }));

  const sentimentPct = sentiment && sentiment.total > 0
    ? Math.round((sentiment.positive / sentiment.total) * 100)
    : 0;

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Tổng Quan" subtitle={today} />

      <main className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Doanh Thu Hôm Nay"
            value={formatCurrency(stats?.revenueToday ?? "0")}
            icon={DollarSign}
            accent="gold"
          />
          <StatsCard
            label="Đơn Hôm Nay"
            value={String(stats?.ordersToday ?? 0)}
            icon={ShoppingBag}
            accent="emerald"
          />
          <StatsCard
            label="Cửa Hàng"
            value="Hanoi Centre"
            icon={Store}
            accent="sky"
          />
          <StatsCard
            label="Đánh Giá TB"
            value={stats?.avgRating ? `${stats.avgRating} ★` : "N/A"}
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
                <div className="text-xs text-admin-muted mt-0.5">Tuần này</div>
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
            <RevenueChart data={chartData} />
          </div>

          {/* Sentiment */}
          {sentiment && sentiment.total > 0 && (
            <div className="admin-card p-5 flex flex-col">
              <div className="text-sm font-semibold text-admin-text mb-1">Cảm Xúc Khách Hàng</div>
              <div className="text-xs text-admin-muted mb-4">{sentiment.total} đánh giá tháng này</div>

              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-admin-muted">Tích Cực</span>
                    <span className="data-value text-admin-emerald font-semibold">{sentiment.positive}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-admin-surface2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-admin-emerald transition-all"
                      style={{ width: `${(sentiment.positive / sentiment.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-admin-muted">Trung Tính</span>
                    <span className="data-value text-admin-muted font-semibold">{sentiment.neutral}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-admin-surface2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-admin-muted transition-all"
                      style={{ width: `${(sentiment.neutral / sentiment.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-admin-muted">Tiêu Cực</span>
                    <span className="data-value text-admin-rose font-semibold">{sentiment.negative}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-admin-surface2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-admin-rose transition-all"
                      style={{ width: `${(sentiment.negative / sentiment.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-admin-border text-center">
                <div className="data-value text-3xl font-bold text-admin-emerald">{sentimentPct}%</div>
                <div className="text-xs text-admin-muted mt-0.5">Hài Lòng</div>
              </div>
            </div>
          )}
        </div>

        {/* Live Orders + Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
              {topProducts.length > 0 ? (
                topProducts.map((product, i) => (
                  <div key={product.productId} className="flex items-center gap-3 p-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getProductColorAccent(product.productName)} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-admin-text truncate">{product.productName}</div>
                      <div className="text-[10px] text-admin-muted">{formatCurrencyShort(product.totalRevenue)}</div>
                    </div>
                    <div className="text-right">
                      <div className="data-value text-xs font-semibold text-admin-text">{product.totalQuantity.toLocaleString()}</div>
                      <div className="text-[10px] text-admin-muted">đã bán</div>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-admin-surface2 flex items-center justify-center text-[9px] text-admin-muted font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-admin-muted text-xs">Chưa có dữ liệu</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
