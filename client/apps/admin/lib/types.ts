// --- Types matching backend API response shapes ---

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "completed"
  | "cancelled";

export type UserRole = "admin" | "manager" | "staff";

export interface AdminOrder {
  id: number;
  customerId: number;
  branchId: number;
  branchName: string | null;
  voucherId: number | null;
  subtotal: string;
  discountAmount: string;
  totalPayment: string;
  paymentMethod: string;
  status: OrderStatus;
  deliveryAddress: string | null;
  orderDate: string;
  note: string | null;
  createdAt?: string;
}

export interface AdminOrderDetail extends AdminOrder {
  items: OrderItem[];
  review: Review | null;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string | null;
  sizeId: number | null;
  sizeName: string | null;
  quantity: number;
  sugarLevel: number;
  iceLevel: number;
  priceAtOrderTime: string;
  totalPrice: string;
  toppings: OrderTopping[];
}

export interface OrderTopping {
  id: number;
  orderDetailId: number;
  toppingId: number;
  toppingName: string | null;
  unitPriceAtSaleTime: string;
}

export interface Review {
  id: number;
  orderId: number;
  starRating: number;
  content: string | null;
  createdAt: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  description: string | null;
  basePrice: string;
  imageUrl: string | null;
  salesStatus: string;
  categoryId: number;
  categoryName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: number;
  name: string;
  description: string | null;
  productCount: number;
}

export interface AdminBranch {
  id: number;
  name: string;
  address: string | null;
  phoneNumber: string | null;
  latitude: string | null;
  longitude: string | null;
  operatingStatus: string;
  openingTime: string | null;
  closingTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffMember {
  id: number;
  accountId: number | null;
  branchId: number;
  branchName: string | null;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  revenueToday: string;
  ordersToday: number;
  avgRating: string | null;
}

export interface RevenueDataPoint {
  date: string;
  revenue: string;
  orders: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  imageUrl: string | null;
  totalQuantity: number;
  totalRevenue: string;
}

export interface SentimentData {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}

export interface AuthAccount {
  id: number;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type ArticleType = "promotion" | "announcement" | "blog";
export type PublishStatus = "draft" | "published" | "archived";

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  articleType: ArticleType;
  publishDate: string;
  publishStatus: PublishStatus;
  createdAt: string;
  updatedAt: string;
}
