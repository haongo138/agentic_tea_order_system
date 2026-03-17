"use client";

import { useState, useMemo } from "react";
import { Search, ShieldCheck, User } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { MOCK_STAFF, MOCK_BRANCHES } from "@/lib/mock-data";
import type { UserRole } from "@/lib/types";

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  super_admin: { label: "Super Admin", color: "text-admin-gold bg-admin-gold/15" },
  branch_manager: { label: "Quản Lý", color: "text-admin-sky bg-admin-sky/15" },
  staff: { label: "Nhân Viên", color: "text-admin-muted bg-admin-surface2" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");

  const filtered = useMemo(() => {
    return MOCK_STAFF.filter((s) => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
      const matchBranch = branchFilter === "all" || s.branchId === branchFilter;
      const matchRole = roleFilter === "all" || s.role === roleFilter;
      return matchSearch && matchBranch && matchRole;
    });
  }, [search, branchFilter, roleFilter]);

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Nhân Viên" subtitle={`${MOCK_STAFF.filter((s) => s.isActive).length} nhân viên hoạt động`} />

      <div className="p-6 space-y-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm nhân viên..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-admin-surface border border-admin-border rounded-lg text-admin-text placeholder-admin-muted focus:outline-none focus:border-admin-gold/40"
            />
          </div>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="text-sm bg-admin-surface border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:outline-none focus:border-admin-gold/40"
          >
            <option value="all">Tất Cả Chi Nhánh</option>
            {MOCK_BRANCHES.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <div className="flex items-center gap-1.5">
            {(["all", "branch_manager", "staff"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  roleFilter === role
                    ? "bg-admin-gold text-white"
                    : "bg-admin-surface border border-admin-border text-admin-muted hover:text-admin-text"
                }`}
              >
                {role === "all" ? "Tất Cả" : role === "branch_manager" ? "Quản Lý" : "Nhân Viên"}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((member) => {
              const roleConfig = ROLE_CONFIG[member.role];
              return (
                <div key={member.id} className={`admin-card p-4 hover:border-admin-border/80 transition-all ${!member.isActive ? "opacity-50" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-admin-surface2 to-admin-border flex items-center justify-center flex-shrink-0">
                      {member.role === "branch_manager" ? (
                        <ShieldCheck size={18} className="text-admin-sky" />
                      ) : (
                        <User size={18} className="text-admin-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-admin-text">{member.name}</div>
                      <div className="text-xs text-admin-muted truncate">{member.email}</div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${roleConfig.color}`}>
                      {roleConfig.label}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-admin-border space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-admin-muted">Chi Nhánh</span>
                      <span className="text-admin-text font-medium">{member.branchName}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-admin-muted">Điện Thoại</span>
                      <span className="data-value text-admin-text">{member.phone}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-admin-muted">Ngày Vào</span>
                      <span className="data-value text-admin-text">{formatDate(member.joinedAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="admin-card p-12 text-center text-admin-muted text-sm">
            Không tìm thấy nhân viên phù hợp
          </div>
        )}
      </div>
    </div>
  );
}
