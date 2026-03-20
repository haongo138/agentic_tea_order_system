"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { OrderCard } from "@/components/OrderCard";
import { fetchOrders, updateOrderStatus } from "@/lib/api/orders";
import { STATUS_FILTERS, normalizeStatus } from "@/lib/mock-data";
import type { AdminOrder, OrderStatus } from "@/lib/types";

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const ordersRes = await fetchOrders();
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

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      return statusFilter === "all" || normalizeStatus(o.status) === statusFilter;
    });
  }, [orders, statusFilter]);

  const counts = useMemo(() => {
    return orders.reduce(
      (acc, o) => {
        const ns = normalizeStatus(o.status);
        acc[ns] = (acc[ns] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [orders]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Đơn Hàng" subtitle="Đang tải..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Đơn Hàng" subtitle="" />
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
      <TopBar
        title="Đơn Hàng"
        subtitle={`${orders.length} đơn hàng`}
      />

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(({ value, label }) => {
              const count = value === "all" ? orders.length : counts[value] || 0;
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

        {/* Orders Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="admin-card p-16 text-center">
            <div className="text-admin-muted text-sm">Không tìm thấy đơn hàng phù hợp</div>
          </div>
        )}
      </div>
    </div>
  );
}
