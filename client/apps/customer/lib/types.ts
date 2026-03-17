export type ProductCategory =
  | "milk-tea"
  | "fruit-tea"
  | "blended"
  | "cold-brew"
  | "seasonal"
  | "cheese-foam";

export type ProductBadge = "best-seller" | "new" | "seasonal" | "limited";

export interface Topping {
  id: string;
  name: string;
  nameVi: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  category: ProductCategory;
  price: number;
  badge?: ProductBadge;
  rating: number;
  reviewCount: number;
  tags: string[];
  colorAccent: string; // CSS gradient for image placeholder
  available: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  district: string;
  phone: string;
  hours: string;
  rating: number;
  isOpen: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  size: "S" | "M" | "L";
  iceLevel: 0 | 50 | 100;
  sugarLevel: 0 | 50 | 100;
  toppings: string[];
  quantity: number;
  unitPrice: number;
}

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
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: MemberTier;
  totalSpent: number;
  orderCount: number;
  joinedAt: string;
}
