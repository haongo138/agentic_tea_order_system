"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, Package, ArrowLeft } from "lucide-react";
import { trackGuestOrder } from "@/lib/api/orders";
import type { ApiOrder } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  preparing: "Đang pha chế",
  ready: "Sẵn sàng giao",
  delivering: "Đang giao hàng",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-indigo-100 text-indigo-800",
  delivering: "bg-purple-100 text-purple-800",
  delivered: "bg-emerald-100 text-emerald-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatCurrency(amount: string): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<ApiOrder | null>(null);

  const doTrack = useCallback(async (id: number, phoneValue: string) => {
    setError(null);
    setLoading(true);
    setOrder(null);
    try {
      const res = await trackGuestOrder(id, phoneValue);
      setOrder(res.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when navigating from cart success with query params
  useEffect(() => {
    const qOrderId = searchParams.get("orderId");
    const qPhone = searchParams.get("phone");
    if (qOrderId && qPhone) {
      setOrderId(qOrderId);
      setPhone(qPhone);
      const id = Number(qOrderId);
      if (id > 0 && qPhone.length >= 9) {
        doTrack(id, qPhone);
      }
    }
  }, [searchParams, doTrack]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Number(orderId);
    if (!id || id <= 0) {
      setError("Vui lòng nhập mã đơn hàng hợp lệ.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      setError("Vui lòng nhập số điện thoại hợp lệ.");
      return;
    }
    doTrack(id, phone.trim());
  };

  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20">
      <div className="container-wide section-padding py-8 lg:py-12 max-w-lg mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-lam-green-700 hover:text-lam-green-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Trang chủ
        </Link>

        <h1
          className="text-3xl font-semibold text-lam-green-900 mb-2"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Theo Dõi Đơn Hàng
        </h1>
        <p className="text-sm text-lam-green-700/60 mb-8">
          Nhập mã đơn hàng và số điện thoại để xem trạng thái.
        </p>

        <form onSubmit={handleTrack} className="bg-white rounded-2xl p-5 shadow-product space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-lam-green-800 mb-1.5">
              Mã Đơn Hàng
            </label>
            <input
              type="number"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Ví dụ: 123"
              min={1}
              className="w-full px-3 py-2.5 rounded-xl border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-lam-green-800 mb-1.5">
              Số Điện Thoại
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại đã đặt hàng"
              className="w-full px-3 py-2.5 rounded-xl border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-lam-green-800 hover:bg-lam-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tìm...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Tra Cứu
              </>
            )}
          </button>
        </form>

        {order && (
          <div className="bg-white rounded-2xl p-5 shadow-product space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-lam-green-700" />
                <h2 className="font-semibold text-lam-green-900">
                  Đơn #{order.id}
                </h2>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                  STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-800"
                }`}
              >
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-lam-green-700/60">Chi nhánh</span>
                <span className="text-lam-green-900 font-medium">{order.branchName ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lam-green-700/60">Ngày đặt</span>
                <span className="text-lam-green-900 font-medium">{formatDate(order.orderDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-lam-green-700/60">Thanh toán</span>
                <span className="text-lam-green-900 font-medium">
                  {order.paymentMethod === "cod" ? "Tiền mặt" : "Chuyển khoản"}
                </span>
              </div>
              {order.deliveryAddress && (
                <div className="flex justify-between">
                  <span className="text-lam-green-700/60">Địa chỉ</span>
                  <span className="text-lam-green-900 font-medium text-right max-w-[60%]">
                    {order.deliveryAddress}
                  </span>
                </div>
              )}
              <div className="border-t border-lam-cream-200 pt-2 flex justify-between">
                <span className="font-semibold text-lam-green-900">Tổng cộng</span>
                <span className="font-bold text-lam-green-900">{formatCurrency(order.totalPayment)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
