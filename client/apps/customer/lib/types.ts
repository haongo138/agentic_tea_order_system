// --- API response types (match backend exactly) ---

export interface ApiProduct {
  id: number;
  name: string;
  description: string | null;
  basePrice: string; // decimal string e.g. "35000.00"
  imageUrl: string | null;
  salesStatus: string; // "available" | "unavailable" | "discontinued"
  categoryId: number;
  categoryName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  description: string | null;
  productCount: number;
}

export interface ApiTopping {
  id: number;
  name: string;
  price: string; // decimal string
  status: string;
}

export interface ApiSize {
  id: number;
  name: string; // "S", "M", "L"
  additionalPrice: string; // decimal string
}

export interface ApiBranch {
  id: number;
  name: string;
  address: string | null;
  phoneNumber: string | null;
  latitude: string | null;
  longitude: string | null;
  operatingStatus: string; // "open" | "closed" | "maintenance"
  openingTime: string | null;
  closingTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiOrder {
  id: number;
  customerId: number | null;
  branchId: number;
  branchName: string | null;
  voucherId: number | null;
  subtotal: string;
  discountAmount: string;
  totalPayment: string;
  paymentMethod: string;
  status: string; // "pending" | "preparing" | "ready" | "delivering" | "delivered" | "completed" | "cancelled"
  deliveryAddress: string | null;
  orderDate: string;
  note: string | null;
  isGuest?: boolean;
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  hasReview?: boolean;
  createdAt?: string;
}

export interface ApiOrderDetail extends ApiOrder {
  items: ApiOrderItem[];
  review: ApiReview | null;
}

export interface ApiOrderItem {
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
  toppings: ApiOrderTopping[];
}

export interface ApiOrderTopping {
  id: number;
  orderDetailId: number;
  toppingId: number;
  toppingName: string | null;
  unitPriceAtSaleTime: string;
}

export interface ApiReview {
  id: number;
  orderId: number;
  starRating: number;
  content: string | null;
  createdAt: string;
}

export interface ApiAccount {
  id: number;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// --- UI-enriched types (frontend presentation) ---

export type ProductCategory = string; // dynamic from API categories

export interface Product {
  id: number;
  name: string;
  nameVi: string;
  description: string;
  category: string;
  categoryId: number;
  price: number;
  imageUrl: string | null;
  salesStatus: string;
  colorAccent: string;
  badge?: string;
}

export interface Topping {
  id: number;
  name: string;
  price: number;
}

export interface Size {
  id: number;
  name: string;
  additionalPrice: number;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  operatingStatus: string;
  openingTime: string | null;
  closingTime: string | null;
}

export interface CartItem {
  productId: number;
  product: Product;
  sizeId: number | null;
  sizeName: string;
  iceLevel: number;
  sugarLevel: number;
  toppingIds: number[];
  toppingNames: string[];
  quantity: number;
  unitPrice: number;
}

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "completed"
  | "cancelled";

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  imageGradient: string;
  featured: boolean;
}

export type MemberTier = "bronze" | "silver" | "gold";

export interface UserProfile {
  id: number;
  username: string;
  role: string;
  status: string;
}
