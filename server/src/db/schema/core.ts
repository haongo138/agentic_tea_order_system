import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  date,
  timestamp,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const accountRoleEnum = pgEnum("account_role", ["admin", "manager", "staff"]);
export const accountStatusEnum = pgEnum("account_status", ["active", "inactive", "suspended"]);
export const membershipTierEnum = pgEnum("membership_tier", ["bronze", "silver", "gold", "platinum"]);
export const branchStatusEnum = pgEnum("branch_status", ["open", "closed", "maintenance"]);
export const voucherTypeEnum = pgEnum("voucher_type", ["percentage", "fixed"]);
export const voucherScopeEnum = pgEnum("voucher_scope", ["all", "specific_products", "specific_categories"]);
export const toppingStatusEnum = pgEnum("topping_status", ["available", "unavailable"]);

// Accounts
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: accountRoleEnum("role").notNull(),
  status: accountStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Customers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  phoneNumber: varchar("phone_number", { length: 20 }).unique(),
  externalId: varchar("external_id", { length: 255 }).unique(),
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
  membershipTier: membershipTierEnum("membership_tier").notNull().default("bronze"),
  dateOfBirth: date("date_of_birth"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Branches
export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  longitude: doublePrecision("longitude"),
  latitude: doublePrecision("latitude"),
  operatingStatus: branchStatusEnum("operating_status").notNull().default("open"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Product Categories
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Sizes
export const sizes = pgTable("sizes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  additionalPrice: decimal("additional_price", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Toppings
export const toppings = pgTable("toppings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  status: toppingStatusEnum("status").notNull().default("available"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Vouchers
export const vouchers = pgTable("vouchers", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  programName: varchar("program_name", { length: 255 }).notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  type: voucherTypeEnum("type").notNull(),
  minOrderValue: decimal("min_order_value", { precision: 10, scale: 2 }).notNull().default("0"),
  expirationDate: date("expiration_date").notNull(),
  scope: voucherScopeEnum("scope").notNull().default("all"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
