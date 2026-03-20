"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { fetchEmployeeById, updateEmployee } from "@/lib/api/employees";
import { fetchBranches } from "@/lib/api/branches";
import type { AdminBranch } from "@/lib/types";

const ROLE_OPTIONS = [
  { value: "manager", label: "Quản Lý" },
  { value: "barista", label: "Barista" },
  { value: "cashier", label: "Thu Ngân" },
  { value: "delivery", label: "Giao Hàng" },
] as const;

const inputClass =
  "w-full px-3 py-2 text-sm bg-admin-surface border border-admin-border rounded-lg text-admin-text placeholder-admin-muted focus:outline-none focus:border-admin-gold/40";
const labelClass = "block text-xs font-medium text-admin-muted mb-1.5";

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [branches, setBranches] = useState<AdminBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [branchId, setBranchId] = useState<number | "">("");
  const [role, setRole] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [empRes, branchRes] = await Promise.all([
          fetchEmployeeById(Number(id)),
          fetchBranches(),
        ]);
        const emp = empRes.data;
        setFullName(emp.fullName);
        setEmail(emp.email ?? "");
        setPhoneNumber(emp.phoneNumber ?? "");
        setBranchId(emp.branchId);
        setRole(emp.role);
        setBranches(branchRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải thông tin nhân viên");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || branchId === "" || !role) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateEmployee(Number(id), {
        fullName: fullName.trim(),
        email: email.trim() || null,
        phoneNumber: phoneNumber.trim() || null,
        branchId: Number(branchId),
        role,
      });
      router.push("/staff");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật nhân viên");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Chỉnh Sửa Nhân Viên" subtitle="Đang tải..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <TopBar title="Chỉnh Sửa Nhân Viên" subtitle="Cập nhật thông tin nhân viên" />

      <div className="p-6 max-w-lg">
        <Link
          href="/staff"
          className="inline-flex items-center gap-1.5 text-xs text-admin-muted hover:text-admin-text transition-colors mb-5"
        >
          <ArrowLeft size={14} />
          Quay lại danh sách
        </Link>

        {error && (
          <div className="mb-4 p-3 text-sm text-admin-rose bg-admin-rose/10 border border-admin-rose/20 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-card p-5 space-y-4">
          <div>
            <label className={labelClass}>Họ và tên *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Số điện thoại</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0901234567"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Chi nhánh *</label>
            <select
              required
              value={branchId}
              onChange={(e) => setBranchId(e.target.value ? Number(e.target.value) : "")}
              className={inputClass}
            >
              <option value="">Chọn chi nhánh</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Vai trò *</label>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
            >
              <option value="">Chọn vai trò</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 bg-admin-gold text-white text-sm font-medium rounded-lg hover:bg-admin-gold/90 transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              Cập Nhật
            </button>
            <Link
              href="/staff"
              className="px-4 py-2 text-sm text-admin-muted hover:text-admin-text transition-colors"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
