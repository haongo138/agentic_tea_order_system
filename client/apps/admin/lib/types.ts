export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type UserRole = "super_admin" | "branch_manager" | "staff";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  branchId: string;
  branchName: string;
  paymentMethod: "cod" | "vnpay" | "momo";
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: "S" | "M" | "L";
  iceLevel: number;
  sugarLevel: number;
  toppings: string[];
  quantity: number;
  unitPrice: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  nameVi: string;
  category: string;
  price: number;
  isAvailable: boolean;
  badge?: string;
  rating: number;
  reviewCount: number;
  totalSold: number;
  colorAccent: string;
}

export interface AdminBranch {
  id: string;
  name: string;
  address: string;
  district: string;
  managerId: string;
  managerName: string;
  phone: string;
  isActive: boolean;
  revenue: { today: number; week: number; month: number };
  ordersToday: number;
  rating: number;
}

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  branchId: string;
  branchName: string;
  email: string;
  phone: string;
  joinedAt: string;
  isActive: boolean;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}
