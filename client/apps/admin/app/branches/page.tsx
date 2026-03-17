"use client";

import { MapPin, Phone, TrendingUp, Star, Users } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { MOCK_BRANCHES } from "@/lib/mock-data";

function formatCurrency(amount: number) {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ₫`;
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}

export default function BranchesPage() {
  const activeBranches = MOCK_BRANCHES.filter((b) => b.isActive).length;

  return (
    <div className="flex flex-col min-h-full">
      <TopBar
        title="Chi Nhánh"
        subtitle={`${activeBranches}/${MOCK_BRANCHES.length} chi nhánh đang hoạt động`}
      />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_BRANCHES.map((branch) => (
            <div
              key={branch.id}
              className={`admin-card p-5 transition-all duration-200 hover:border-admin-border/80 ${
                !branch.isActive ? "opacity-60" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold text-admin-text">{branch.name}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-admin-muted">
                    <MapPin size={11} />
                    <span>{branch.address}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${
                  branch.isActive
                    ? "bg-admin-emerald/15 text-admin-emerald"
                    : "bg-admin-muted/10 text-admin-muted"
                }`}>
                  <div className={branch.isActive ? "status-dot-ready" : "status-dot-completed"} />
                  {branch.isActive ? "Hoạt Động" : "Tạm Nghỉ"}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2.5 rounded-lg bg-admin-surface2">
                  <div className="data-value text-sm font-bold text-admin-gold">
                    {formatCurrency(branch.revenue.today)}
                  </div>
                  <div className="text-[10px] text-admin-muted mt-0.5">Hôm Nay</div>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-admin-surface2">
                  <div className="data-value text-sm font-bold text-admin-text">
                    {branch.ordersToday}
                  </div>
                  <div className="text-[10px] text-admin-muted mt-0.5">Đơn</div>
                </div>
                <div className="text-center p-2.5 rounded-lg bg-admin-surface2">
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="data-value text-sm font-bold text-admin-text">{branch.rating}</span>
                    <Star size={10} className="text-admin-gold fill-admin-gold" />
                  </div>
                  <div className="text-[10px] text-admin-muted mt-0.5">Đánh Giá</div>
                </div>
              </div>

              {/* Revenue bars */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[10px] text-admin-muted mb-1">
                  <span>Tuần</span>
                  <span className="data-value">{formatCurrency(branch.revenue.week)}</span>
                </div>
                <div className="h-1 rounded-full bg-admin-surface2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-admin-gold/70"
                    style={{ width: `${Math.min((branch.revenue.week / 30000000) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-admin-muted mb-1 mt-2">
                  <span>Tháng</span>
                  <span className="data-value">{formatCurrency(branch.revenue.month)}</span>
                </div>
                <div className="h-1 rounded-full bg-admin-surface2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-admin-emerald/70"
                    style={{ width: `${Math.min((branch.revenue.month / 120000000) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Manager + phone */}
              <div className="pt-3 border-t border-admin-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-admin-surface2 flex items-center justify-center">
                    <Users size={11} className="text-admin-muted" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-admin-text">{branch.managerName}</div>
                    <div className="text-[10px] text-admin-muted">Quản Lý</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-admin-muted">
                  <Phone size={11} />
                  <span>{branch.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
