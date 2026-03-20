import type { NewsArticle, OrderStatus } from "./types";

// Color accents for product image placeholders (mapped by product name patterns)
export const PRODUCT_COLOR_ACCENTS: Record<string, string> = {
  default: "from-amber-800 via-amber-600 to-amber-400",
  matcha: "from-emerald-800 via-emerald-500 to-lime-400",
  peach: "from-rose-400 via-pink-300 to-amber-200",
  taro: "from-purple-700 via-violet-500 to-purple-300",
  "brown sugar": "from-stone-800 via-amber-700 to-amber-400",
  blueberry: "from-indigo-700 via-blue-500 to-violet-300",
  oolong: "from-stone-600 via-amber-500 to-yellow-300",
  strawberry: "from-rose-500 via-pink-400 to-rose-200",
  coconut: "from-green-700 via-emerald-400 to-lime-200",
  "cold brew": "from-lime-700 via-yellow-500 to-lime-200",
  macchiato: "from-red-700 via-rose-500 to-pink-300",
  passion: "from-yellow-500 via-orange-400 to-yellow-200",
};

export function getColorAccent(productName: string): string {
  const lower = productName.toLowerCase();
  for (const [key, value] of Object.entries(PRODUCT_COLOR_ACCENTS)) {
    if (key !== "default" && lower.includes(key)) return value;
  }
  return PRODUCT_COLOR_ACCENTS.default;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    title: "Nghệ Thuật Pha Trà Hoàn Hảo: Hành Trình Tìm Kiếm Nguyên Liệu",
    excerpt: "Từ những đồi chè sương mù ở Lâm Đồng đến những vườn trà cổ thụ Thái Nguyên — câu chuyện nguồn gốc của chúng tôi.",
    category: "Nghệ Thuật",
    publishedAt: "2026-03-10",
    imageGradient: "from-emerald-900 via-green-700 to-teal-500",
    featured: true,
  },
  {
    id: "2",
    title: "Menu Mùa Xuân 2026: Mùa Sakura & Vải Thiều Đã Đến",
    excerpt: "Bộ sưu tập mùa xuân giới hạn tôn vinh hương hoa Việt Nam với bốn sáng tạo theo mùa.",
    category: "Sản Phẩm Mới",
    publishedAt: "2026-03-08",
    imageGradient: "from-rose-700 via-pink-500 to-rose-200",
    featured: false,
  },
  {
    id: "3",
    title: "Ra Mắt Lam Trà Loyalty: Uống Nhiều, Tích Nhiều",
    excerpt: "Chương trình khách hàng thân thiết mới với điểm tích lũy đổi thức uống miễn phí.",
    category: "Ưu Đãi",
    publishedAt: "2026-03-05",
    imageGradient: "from-amber-800 via-yellow-500 to-amber-200",
    featured: false,
  },
];

export const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500000,
  gold: 2000000,
};

export const TIER_POINTS_PER_VND = 1 / 10000;

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

// Order status display mapping (backend → Vietnamese)
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ Xử Lý",
  preparing: "Đang Pha Chế",
  ready: "Sẵn Sàng",
  delivering: "Đang Giao Hàng",
  delivered: "Đã Giao",
  completed: "Hoàn Thành",
  cancelled: "Đã Hủy",
  // Legacy statuses (before migration)
  received: "Đã Nhận",
  prepared: "Đã Pha Chế",
  collected: "Đã Lấy Hàng",
  paid: "Đã Thanh Toán",
};

// Payment method display mapping (backend → Vietnamese)
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Tiền Mặt",
  momo: "MoMo",
  vnpay: "VNPay",
  bank_transfer: "Chuyển Khoản",
  cod: "Thanh Toán Khi Nhận Hàng",
};

// Order status badge styles (bg + text + border)
export const ORDER_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  preparing: "bg-blue-50 text-blue-700 border-blue-200",
  ready: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivering: "bg-orange-50 text-orange-700 border-orange-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-gray-50 text-gray-700 border-gray-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  // Legacy statuses (before migration)
  received: "bg-amber-50 text-amber-700 border-amber-200",
  prepared: "bg-blue-50 text-blue-700 border-blue-200",
  collected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  paid: "bg-gray-50 text-gray-700 border-gray-200",
};
