"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Loader2 } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { fetchBranches } from "@/lib/api/branches";
import { OPERATING_STATUS_LABELS } from "@/lib/mock-data";
import type { AdminBranch } from "@/lib/types";

export default function BranchesPage() {
  const [branches, setBranches] = useState<AdminBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchBranches();
        setBranches(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeBranches = branches.filter((b) => b.operatingStatus === "open").length;

  if (loading) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Chi Nhánh" subtitle="Đang tải..." />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-admin-muted" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-full">
        <TopBar title="Chi Nhánh" subtitle="" />
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
        title="Chi Nhánh"
        subtitle={`${activeBranches}/${branches.length} chi nhánh đang hoạt động`}
      />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {branches.map((branch) => {
            const isOpen = branch.operatingStatus === "open";
            return (
              <div
                key={branch.id}
                className={`admin-card p-5 transition-all duration-200 hover:border-admin-border/80 ${
                  !isOpen ? "opacity-60" : ""
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm font-semibold text-admin-text">{branch.name}</div>
                    {branch.address && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-admin-muted">
                        <MapPin size={11} />
                        <span>{branch.address}</span>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold ${
                    isOpen
                      ? "bg-admin-emerald/15 text-admin-emerald"
                      : "bg-admin-muted/10 text-admin-muted"
                  }`}>
                    <div className={isOpen ? "status-dot-ready" : "status-dot-completed"} />
                    {OPERATING_STATUS_LABELS[branch.operatingStatus] ?? branch.operatingStatus}
                  </div>
                </div>

                {/* Operating hours */}
                {(branch.openingTime || branch.closingTime) && (
                  <div className="mb-4 p-3 rounded-lg bg-admin-surface2">
                    <div className="text-[10px] text-admin-muted mb-1">Giờ Hoạt Động</div>
                    <div className="data-value text-sm font-semibold text-admin-text">
                      {branch.openingTime ?? "—"} – {branch.closingTime ?? "—"}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="pt-3 border-t border-admin-border flex items-center justify-between">
                  {branch.phoneNumber && (
                    <div className="flex items-center gap-1 text-xs text-admin-muted">
                      <Phone size={11} />
                      <span>{branch.phoneNumber}</span>
                    </div>
                  )}
                  <div className="text-[10px] text-admin-muted">
                    ID: {branch.id}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
