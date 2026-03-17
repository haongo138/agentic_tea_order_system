"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { OrderCard } from "@/components/OrderCard";
import { MOCK_ORDERS, MOCK_BRANCHES } from "@/lib/mock-data";
import type { AdminOrder, OrderStatus } from "@/lib/types";

const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất Cả" },
  { value: "pending", label: "Chờ Xử Lý" },
  { value: "preparing", label: "Đang Pha" },
  { value: "ready", label: "Sẵn Sàng" },
  { value: "completed", label: "Hoàn Thành" },
  { value: "cancelled", label: "Đã Huỷ" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [branchFilter, setBranchFilter] = useState("all");

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const matchBranch = branchFilter === "all" || o.branchId === branchFilter;
      return matchStatus && matchBranch;
    });
  }, [orders, statusFilter, branchFilter]);

  const counts = useMemo(() => {
    return orders.reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [orders]);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title="Đơn Hàng"
        subtitle={`${orders.length} đơn hàng hôm nay`}
      />

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status pills */}
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

          {/* Branch filter */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <Filter size={14} className="text-admin-muted" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="text-sm bg-admin-surface border border-admin-border rounded-lg px-3 py-1.5 text-admin-text focus:outline-none focus:border-admin-gold/40"
            >
              <option value="all">Tất Cả Chi Nhánh</option>
              {MOCK_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
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
