import type { OrderStatus } from "./types";

// Legacy status normalization (map old DB values → new status values)
const LEGACY_STATUS_MAP: Record<string, OrderStatus> = {
  received: "pending",
  prepared: "ready",
  collected: "delivered",
  paid: "completed",
};

export function normalizeStatus(status: string): OrderStatus {
  return LEGACY_STATUS_MAP[status] ?? (status as OrderStatus);
}

// Display helpers — all data now comes from API

export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; dotClass: string; textClass: string }
> = {
  pending: { label: "Chờ Xử Lý", dotClass: "status-dot-pending", textClass: "text-amber-400" },
  preparing: { label: "Đang Pha", dotClass: "status-dot-preparing", textClass: "text-sky-400" },
  ready: { label: "Sẵn Sàng", dotClass: "status-dot-ready", textClass: "text-indigo-400" },
  delivering: { label: "Đang Giao", dotClass: "status-dot-delivering", textClass: "text-orange-400" },
  delivered: { label: "Đã Giao", dotClass: "status-dot-delivered", textClass: "text-admin-emerald" },
  completed: { label: "Hoàn Thành", dotClass: "status-dot-completed", textClass: "text-admin-muted" },
  cancelled: { label: "Đã Huỷ", dotClass: "status-dot-cancelled", textClass: "text-admin-rose" },
  // Legacy statuses (before migration)
  received: { label: "Đã Nhận", dotClass: "status-dot-pending", textClass: "text-amber-400" },
  prepared: { label: "Đã Pha Chế", dotClass: "status-dot-preparing", textClass: "text-sky-400" },
  collected: { label: "Đã Lấy Hàng", dotClass: "status-dot-delivered", textClass: "text-admin-emerald" },
  paid: { label: "Đã Thanh Toán", dotClass: "status-dot-completed", textClass: "text-admin-muted" },
};

export const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất Cả" },
  { value: "pending", label: "Chờ Xử Lý" },
  { value: "preparing", label: "Đang Pha" },
  { value: "ready", label: "Sẵn Sàng" },
  { value: "delivering", label: "Đang Giao" },
  { value: "delivered", label: "Đã Giao" },
  { value: "completed", label: "Hoàn Thành" },
  { value: "cancelled", label: "Đã Huỷ" },
];

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "preparing",
  preparing: "ready",
  ready: "delivering",
  delivering: "delivered",
  delivered: "completed",
};

export const OPERATING_STATUS_LABELS: Record<string, string> = {
  open: "Hoạt Động",
  closed: "Đã Đóng",
  maintenance: "Bảo Trì",
};

export const PAYMENT_LABELS: Record<string, string> = {
  cash: "Tiền Mặt",
  momo: "MoMo",
  vnpay: "VNPay",
  bank_transfer: "Chuyển Khoản",
  cod: "COD",
};

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
}

export function formatCurrencyShort(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M ₫`;
  return new Intl.NumberFormat("vi-VN").format(num) + " ₫";
}

export function getProductColorAccent(productName: string): string {
  const lower = productName.toLowerCase();
  const accents: Record<string, string> = {
    matcha: "from-emerald-800 via-emerald-500 to-lime-400",
    peach: "from-rose-400 via-pink-300 to-amber-200",
    taro: "from-purple-700 via-violet-500 to-purple-300",
    "brown sugar": "from-stone-800 via-amber-700 to-amber-400",
    blueberry: "from-indigo-700 via-blue-500 to-violet-300",
    oolong: "from-stone-600 via-amber-500 to-yellow-300",
    strawberry: "from-rose-500 via-pink-400 to-rose-200",
    coconut: "from-green-700 via-emerald-400 to-lime-200",
    macchiato: "from-red-700 via-rose-500 to-pink-300",
    passion: "from-yellow-500 via-orange-400 to-yellow-200",
  };
  for (const [key, value] of Object.entries(accents)) {
    if (lower.includes(key)) return value;
  }
  return "from-amber-800 via-amber-600 to-amber-400";
}
