import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  date,
  timestamp,
  pgEnum,
  unique,
} from "drizzle-orm/pg-core";
import { accounts, branches, productCategories, customers, vouchers, toppings } from "./core";

// Enums
export const employeeRoleEnum = pgEnum("employee_role", ["manager", "barista", "cashier", "delivery"]);
export const employeeStatusEnum = pgEnum("employee_status", ["active", "inactive", "on_leave"]);
export const salesStatusEnum = pgEnum("sales_status", ["available", "unavailable", "discontinued"]);
export const branchProductStatusEnum = pgEnum("branch_product_status_val", ["available", "unavailable", "out_of_stock"]);
export const loyaltyTypeEnum = pgEnum("loyalty_type", ["earned", "redeemed", "expired", "adjusted"]);
export const customerVoucherStatusEnum = pgEnum("customer_voucher_status", ["available", "used", "expired"]);
export const articleTypeEnum = pgEnum("article_type", ["promotion", "announcement", "blog"]);
export const publishStatusEnum = pgEnum("publish_status", ["draft", "published", "archived"]);

// Employees
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").references(() => accounts.id, { onDelete: "set null" }).unique(),
  branchId: integer("branch_id").notNull().references(() => branches.id, { onDelete: "cascade" }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  role: employeeRoleEnum("role").notNull(),
  status: employeeStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => productCategories.id, { onDelete: "restrict" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  salesStatus: salesStatusEnum("sales_status").notNull().default("available"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Branch Product Status
export const branchProductStatus = pgTable("branch_product_status", {
  id: serial("id").primaryKey(),
  branchId: integer("branch_id").notNull().references(() => branches.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  status: branchProductStatusEnum("status").notNull().default("available"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique().on(t.branchId, t.productId)]);

// Loyalty History
export const loyaltyHistory = pgTable("loyalty_history", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  pointsChanged: integer("points_changed").notNull(),
  type: loyaltyTypeEnum("type").notNull(),
  previousPoints: integer("previous_points").notNull(),
  date: date("date").notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Customer Vouchers
export const customerVouchers = pgTable("customer_vouchers", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  voucherId: integer("voucher_id").notNull().references(() => vouchers.id, { onDelete: "cascade" }),
  receivedDate: date("received_date").notNull().defaultNow(),
  usedDate: date("used_date"),
  status: customerVoucherStatusEnum("status").notNull().default("available"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Category Toppings (which toppings are allowed per product category)
export const categoryToppings = pgTable("category_toppings", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => productCategories.id, { onDelete: "cascade" }),
  toppingId: integer("topping_id").notNull().references(() => toppings.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique().on(t.categoryId, t.toppingId)]);

// News
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  articleType: articleTypeEnum("article_type").notNull(),
  publishDate: date("publish_date").notNull().defaultNow(),
  publishStatus: publishStatusEnum("publish_status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
