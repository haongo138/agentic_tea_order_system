"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ShieldCheck, User, Loader2, Plus, Pencil } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { fetchEmployees, updateEmployeeStatus } from "@/lib/api/employees";
import type { StaffMember } from "@/lib/types";

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  admin: { label: "Admin", color: "text-admin-gold bg-admin-gold/15" },
  manager: { label: "Quản Lý", color: "text-admin-sky bg-admin-sky/15" },
  staff: { label: "Nhân Viên", color: "text-admin-muted bg-admin-surface2" },
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Hoạt Động", color: "text-admin-emerald" },
  inactive: { label: "Nghỉ Việc", color: "text-admin-rose" },
  on_leave: { label: "Nghỉ Phép", color: "text-admin-muted" },
};

const NEXT_STATUS: Record<string, string> = {
  active: "on_leave",
  on_leave: "inactive",
  inactive: "active",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function StaffPage() {
  const [employees, setEmployees] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const empRes = await fetchEmployees();
        setEmployees(empRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    return employees.filter((s) => {
      const matchSearch = !search ||
        s.fullName.toLowerCase().includes(search.toLowerCase()) ||
        (s.email ?? "").toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || s.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [employees, search, roleFilter]);

  const activeCount = employees.filter((s) => s.status === "active").length;

  async function handleToggleStatus(member: StaffMember) {
    const nextStatus = NEXT_STATUS[member.status] ?? "active";
    setTogglingIds((prev) => new Set([...prev, member.id]));

    try {
      await updateEmployeeStatus(member.id, nextStatus);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === member.id ? { ...emp, status: nextStatus } : emp
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật trạng thái");
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(member.id);
        return next;
      });
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Nhân Viên" subtitle="Đang tải..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Nhân Viên" subtitle="" />
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
      <TopBar title="Nhân Viên" subtitle={`${activeCount} nhân viên hoạt động`} />

      <div className="p-6 space-y-5">
        {/* Add Employee Button */}
        <div className="flex justify-end">
          <Link
            href="/staff/create"
            className="flex items-center gap-2 px-4 py-2 bg-admin-gold text-white text-sm font-medium rounded-lg hover:bg-admin-gold/90 transition-colors"
          >
            <Plus size={16} />
            Thêm Nhân Viên
          </Link>
        </div>

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

          <div className="flex items-center gap-1.5">
            {(["all", "manager", "staff"] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  roleFilter === role
                    ? "bg-admin-gold text-white"
                    : "bg-admin-surface border border-admin-border text-admin-muted hover:text-admin-text"
                }`}
              >
                {role === "all" ? "Tất Cả" : role === "manager" ? "Quản Lý" : "Nhân Viên"}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((member) => {
              const roleConfig = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.staff;
              const statusConfig = STATUS_CONFIG[member.status] ?? STATUS_CONFIG.active;
              const isToggling = togglingIds.has(member.id);
              const isActive = member.status === "active";
              return (
                <div key={member.id} className={`admin-card p-4 hover:border-admin-border/80 transition-all ${!isActive ? "opacity-50" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-admin-surface2 to-admin-border flex items-center justify-center flex-shrink-0">
                      {member.role === "manager" ? (
                        <ShieldCheck size={18} className="text-admin-sky" />
                      ) : (
                        <User size={18} className="text-admin-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-admin-text">{member.fullName}</div>
                      <div className="text-xs text-admin-muted truncate">{member.email ?? "\u2014"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/staff/${member.id}/edit`}
                        className="text-admin-muted hover:text-admin-gold transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${roleConfig.color}`}>
                        {roleConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-admin-border space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-admin-muted">Điện Thoại</span>
                      <span className="data-value text-admin-text">{member.phoneNumber ?? "\u2014"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-admin-muted">Ngày Vào</span>
                      <span className="data-value text-admin-text">{formatDate(member.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-admin-muted">Trạng Thái</span>
                      <button
                        onClick={() => handleToggleStatus(member)}
                        disabled={isToggling}
                        className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors hover:opacity-80 disabled:opacity-50 ${statusConfig.color}`}
                      >
                        {isToggling ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          statusConfig.label
                        )}
                      </button>
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
