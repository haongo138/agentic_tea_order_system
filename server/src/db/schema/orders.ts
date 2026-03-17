import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  pgEnum,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { customers, branches, vouchers, sizes, toppings } from "./core";
import { products, news } from "./dependent";

// Enums
export const paymentMethodEnum = pgEnum("payment_method", ["cod", "bank_transfer"]);
export const orderStatusEnum = pgEnum("order_status", ["received", "prepared", "collected", "paid", "cancelled"]);
export const sugarLevelEnum = pgEnum("sugar_level", ["0%", "25%", "50%", "75%", "100%"]);
export const iceLevelEnum = pgEnum("ice_level", ["0%", "25%", "50%", "75%", "100%"]);
export const fileTypeEnum = pgEnum("file_type", ["image", "video"]);

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id, { onDelete: "restrict" }),
  branchId: integer("branch_id").notNull().references(() => branches.id, { onDelete: "restrict" }),
  voucherId: integer("voucher_id").references(() => vouchers.id, { onDelete: "set null" }),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  totalPayment: decimal("total_payment", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  status: orderStatusEnum("status").notNull().default("received"),
  deliveryAddress: text("delivery_address"),
  orderDate: timestamp("order_date", { withTimezone: true }).notNull().defaultNow(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Order Details
export const orderDetails = pgTable("order_details", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  sizeId: integer("size_id").references(() => sizes.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull(),
  sugarLevel: sugarLevelEnum("sugar_level").notNull().default("100%"),
  iceLevel: iceLevelEnum("ice_level").notNull().default("100%"),
  priceAtOrderTime: decimal("price_at_order_time", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [check("quantity_positive", sql`${t.quantity} > 0`)]);

// Order Toppings
export const orderToppings = pgTable("order_toppings", {
  id: serial("id").primaryKey(),
  orderDetailId: integer("order_detail_id").notNull().references(() => orderDetails.id, { onDelete: "cascade" }),
  toppingId: integer("topping_id").notNull().references(() => toppings.id, { onDelete: "restrict" }),
  unitPriceAtSaleTime: decimal("unit_price_at_sale_time", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().unique().references(() => orders.id, { onDelete: "cascade" }),
  starRating: integer("star_rating").notNull(),
  content: text("content"),
  date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [check("valid_star_rating", sql`${t.starRating} BETWEEN 1 AND 5`)]);

// Media
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").references(() => reviews.id, { onDelete: "cascade" }),
  newsId: integer("news_id").references(() => news.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  fileType: fileTypeEnum("file_type").notNull(),
  uploadDate: timestamp("upload_date", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
