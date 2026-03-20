"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MapPin,
  Loader2,
  Check,
  ArrowLeft,
  User,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { fetchBranches } from "@/lib/api/branches";
import { createOrder } from "@/lib/api/orders";
import { apiBranchToBranch } from "@/lib/transforms";

const PAYMENT_METHODS = [
  { value: "cod", label: "Thanh toán khi nhận hàng" },
  { value: "momo", label: "Ví MoMo" },
  { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clear } = useCart();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [branchId, setBranchId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Guest info fields
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const isGuest = !isAuthenticated && !authLoading;

  useEffect(() => {
    fetchBranches({ operatingStatus: "open" })
      .then((res) => {
        const branches = res.data.map(apiBranchToBranch);
        if (branches.length > 0) setBranchId(branches[0].id);
      })
      .catch(() => {});
  }, []);

  const handleSubmitOrder = async () => {
    if (!branchId || items.length === 0) return;
    if (!deliveryAddress.trim()) {
      setError("Vui lòng nhập địa chỉ giao hàng.");
      return;
    }

    // Validate guest info if not authenticated
    if (isGuest) {
      if (!guestName.trim() || guestName.trim().length < 2) {
        setError("Vui lòng nhập họ tên (ít nhất 2 ký tự).");
        return;
      }
      if (!guestPhone.trim() || guestPhone.trim().length < 9) {
        setError("Vui lòng nhập số điện thoại hợp lệ.");
        return;
      }
    }

    setError(null);
    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        sizeId: item.sizeId ?? undefined,
        quantity: item.quantity,
        sugarLevel: `${item.sugarLevel}%`,
        iceLevel: `${item.iceLevel}%`,
        toppingIds: [...item.toppingIds],
      }));

      const res = await createOrder({
        ...(isAuthenticated && user ? { customerId: user.id } : {}),
        branchId,
        paymentMethod,
        deliveryAddress: deliveryAddress.trim(),
        note: note.trim() || undefined,
        items: orderItems,
        ...(isGuest
          ? {
              guestInfo: {
                name: guestName.trim(),
                phone: guestPhone.trim(),
                ...(guestEmail.trim() ? { email: guestEmail.trim() } : {}),
              },
            }
          : {}),
      });
      setOrderId(res.data.id);
      setOrderSuccess(true);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-lam-cream-50 pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1
            className="text-3xl font-semibold text-lam-green-900 mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-sm text-lam-green-700/60 mb-2">
            Đơn hàng của bạn đã được gửi. Bạn có thể theo dõi trạng thái đơn hàng.
          </p>
          {orderId && (
            <p className="text-sm font-semibold text-lam-green-800 mb-6">
              Mã đơn hàng: #{orderId}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthenticated ? (
              <Link
                href="/orders"
                className="inline-flex items-center justify-center gap-2 bg-lam-green-800 hover:bg-lam-green-700 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors"
              >
                Xem Đơn Hàng
              </Link>
            ) : (
              <Link
                href={`/track?orderId=${orderId}&phone=${encodeURIComponent(guestPhone.trim())}`}
                className="inline-flex items-center justify-center gap-2 bg-lam-green-800 hover:bg-lam-green-700 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors"
              >
                Theo Dõi Đơn Hàng
              </Link>
            )}
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 border border-lam-cream-300 hover:border-lam-green-500 text-lam-green-800 font-medium text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Tiếp Tục Mua
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-lam-cream-50 pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-lam-green-600/20 mx-auto mb-4" />
          <h1
            className="text-2xl font-semibold text-lam-green-900 mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Giỏ Hàng Trống
          </h1>
          <p className="text-sm text-lam-green-700/60 mb-6">
            Bạn chưa có sản phẩm nào trong giỏ hàng.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-lam-green-800 hover:bg-lam-green-700 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Khám Phá Thực Đơn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20">
      <div className="container-wide section-padding py-8 lg:py-12">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-medium text-lam-green-700 hover:text-lam-green-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Tiếp tục mua sắm
        </Link>

        <h1
          className="text-3xl lg:text-4xl font-semibold text-lam-green-900 mb-8"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Giỏ Hàng ({totalItems} sản phẩm)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.sizeName}-${index}`}
                className="bg-white rounded-2xl p-4 shadow-product flex gap-4"
              >
                {/* Product image placeholder */}
                <div
                  className={`w-20 h-20 rounded-xl flex-shrink-0 bg-gradient-to-br ${item.product.colorAccent} flex items-center justify-center`}
                >
                  <span className="text-2xl">🧋</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lam-green-900 text-sm leading-tight">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-lam-green-600/60 mt-0.5">
                        {[
                          item.sizeName && `Size ${item.sizeName}`,
                          `Đá ${item.iceLevel}%`,
                          `Đường ${item.sugarLevel}%`,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {item.toppingNames.length > 0 && (
                        <p className="text-xs text-lam-green-600/50 mt-0.5">
                          + {item.toppingNames.join(", ")}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(index)}
                      className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-lam-cream-300 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 rounded-full hover:bg-lam-cream-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3 text-lam-green-800" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold text-lam-green-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-6 h-6 rounded-full hover:bg-lam-cream-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3 text-lam-green-800" />
                      </button>
                    </div>
                    <p className="font-semibold text-lam-green-900 text-sm">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:sticky lg:top-28 space-y-4">
            {/* Delivery address */}
            <div className="bg-white rounded-2xl p-5 shadow-product">
              <p className="text-sm font-semibold text-lam-green-800 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Địa Chỉ Giao Hàng <span className="text-red-500">*</span>
              </p>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Nhập địa chỉ giao hàng..."
                rows={2}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:ring-2 transition-all resize-none ${
                  error && !deliveryAddress.trim()
                    ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-red-500/15"
                    : "border-lam-cream-300 bg-lam-cream-50 focus:border-lam-green-500 focus:ring-lam-green-500/15"
                }`}
              />
              {error && !deliveryAddress.trim() && (
                <p className="text-xs text-red-500 mt-1.5">Vui lòng nhập địa chỉ giao hàng</p>
              )}
            </div>

            {/* Guest info (shown when not authenticated) */}
            {isGuest && (
              <div className="bg-white rounded-2xl p-5 shadow-product">
                <p className="text-sm font-semibold text-lam-green-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông Tin Khách Hàng <span className="text-red-500">*</span>
                </p>
                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Họ tên *"
                      className="w-full px-3 py-2.5 rounded-xl border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="Số điện thoại *"
                      className="w-full px-3 py-2.5 rounded-xl border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="Email (tùy chọn)"
                      className="w-full px-3 py-2.5 rounded-xl border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment method */}
            <div className="bg-white rounded-2xl p-5 shadow-product">
              <p className="text-sm font-semibold text-lam-green-800 mb-3">Phương Thức Thanh Toán</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((pm) => (
                  <button
                    key={pm.value}
                    onClick={() => setPaymentMethod(pm.value)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      paymentMethod === pm.value
                        ? "border-lam-green-800 bg-lam-green-800/5 text-lam-green-900"
                        : "border-lam-cream-300 text-lam-green-700 hover:border-lam-green-400"
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="bg-white rounded-2xl p-5 shadow-product">
              <p className="text-sm font-semibold text-lam-green-800 mb-3">Ghi Chú</p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Thêm ghi chú cho đơn hàng (tùy chọn)..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-lam-cream-300 bg-lam-cream-50 text-sm text-lam-green-900 placeholder:text-lam-green-600/40 focus:outline-none focus:border-lam-green-500 focus:ring-2 focus:ring-lam-green-500/15 transition-all resize-none"
              />
            </div>

            {/* Summary + checkout */}
            <div className="bg-white rounded-2xl p-5 shadow-product-hover border border-lam-cream-200">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-lam-green-700/60">Tạm tính ({totalItems} sản phẩm)</span>
                  <span className="text-lam-green-900 font-medium">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-lam-green-700/60">Phí giao hàng</span>
                  <span className="text-emerald-600 font-medium">Miễn phí</span>
                </div>
                <div className="border-t border-lam-cream-200 pt-2 flex justify-between">
                  <span className="font-semibold text-lam-green-900">Tổng cộng</span>
                  <span className="font-bold text-lg text-lam-green-900">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2 mb-3">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmitOrder}
                disabled={submitting || !branchId || !deliveryAddress.trim() || (isGuest && (!guestName.trim() || !guestPhone.trim()))}
                className="w-full flex items-center justify-center gap-2 bg-lam-green-800 hover:bg-lam-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Đặt Hàng · {formatCurrency(totalPrice)}
                  </>
                )}
              </button>

              {isGuest && (
                <p className="text-xs text-center text-lam-green-600/50 mt-2">
                  Bạn đang đặt hàng với tư cách khách.{" "}
                  <Link href="/login" className="text-lam-green-700 underline hover:text-lam-green-900">
                    Đăng nhập
                  </Link>{" "}
                  để tích điểm thành viên.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
