"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Loader2 } from "lucide-react";
import { fetchBranches } from "@/lib/api/branches";
import { apiBranchToBranch } from "@/lib/transforms";
import type { Branch } from "@/lib/types";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  open: { label: "Đang Mở", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  closed: { label: "Đã Đóng", className: "bg-red-50 text-red-700 border-red-200" },
  maintenance: { label: "Bảo Trì", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBranches()
      .then((res) => setBranches(res.data.map(apiBranchToBranch)))
      .catch((err) => setError(err instanceof Error ? err.message : "Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20">
      {/* Header */}
      <div className="bg-lam-green-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-lam-green-800/60 blur-3xl" />
          <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full bg-lam-gold-500/10 blur-3xl" />
        </div>
        <div className="container-wide section-padding relative z-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-400 mb-3">
            Hệ Thống Cửa Hàng
          </p>
          <h1
            className="text-display text-5xl lg:text-6xl font-semibold text-lam-cream-50 mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Cửa Hàng <span className="italic font-medium text-lam-gold-400">Lam Trà</span>
          </h1>
          <p className="text-lam-cream-100/60 max-w-md mx-auto">
            Tìm cửa hàng Lam Trà gần bạn nhất
          </p>
        </div>
      </div>

      <div className="container-wide section-padding py-10 lg:py-14">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-lam-green-600/40" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-lam-terracotta-500 text-sm mb-2">{error}</p>
            <button onClick={() => window.location.reload()} className="text-sm text-lam-green-700 hover:underline">
              Thử lại
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => {
              const status = STATUS_LABELS[branch.operatingStatus] ?? STATUS_LABELS.closed;
              return (
                <article
                  key={branch.id}
                  className="bg-white rounded-2xl p-6 shadow-product hover:shadow-product-hover transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className="font-semibold text-lam-green-900 text-lg"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {branch.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.className}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {branch.address && (
                      <div className="flex items-start gap-2.5 text-sm text-lam-green-700/70">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-lam-green-600/50" />
                        <span>{branch.address}</span>
                      </div>
                    )}
                    {branch.phoneNumber && (
                      <div className="flex items-center gap-2.5 text-sm text-lam-green-700/70">
                        <Phone className="w-4 h-4 flex-shrink-0 text-lam-green-600/50" />
                        <span>{branch.phoneNumber}</span>
                      </div>
                    )}
                    {(branch.openingTime || branch.closingTime) && (
                      <div className="flex items-center gap-2.5 text-sm text-lam-green-700/70">
                        <Clock className="w-4 h-4 flex-shrink-0 text-lam-green-600/50" />
                        <span>
                          {branch.openingTime ?? "?"} - {branch.closingTime ?? "?"}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
