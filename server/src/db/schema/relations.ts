import { relations } from "drizzle-orm";
import { accounts, customers, branches, productCategories, sizes, toppings, vouchers } from "./core";
import { employees, products, branchProductStatus, loyaltyHistory, customerVouchers, categoryToppings, news } from "./dependent";
import { orders, orderDetails, orderToppings, reviews, media } from "./orders";

export const accountsRelations = relations(accounts, ({ one }) => ({
  employee: one(employees, { fields: [accounts.id], references: [employees.accountId] }),
}));

export const branchesRelations = relations(branches, ({ many }) => ({
  employees: many(employees),
  orders: many(orders),
  branchProductStatuses: many(branchProductStatus),
}));

export const employeesRelations = relations(employees, ({ one }) => ({
  account: one(accounts, { fields: [employees.accountId], references: [accounts.id] }),
  branch: one(branches, { fields: [employees.branchId], references: [branches.id] }),
}));

export const productCategoriesRelations = relations(productCategories, ({ many }) => ({
  products: many(products),
  categoryToppings: many(categoryToppings),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, { fields: [products.categoryId], references: [productCategories.id] }),
  branchProductStatuses: many(branchProductStatus),
  orderDetails: many(orderDetails),
}));

export const branchProductStatusRelations = relations(branchProductStatus, ({ one }) => ({
  branch: one(branches, { fields: [branchProductStatus.branchId], references: [branches.id] }),
  product: one(products, { fields: [branchProductStatus.productId], references: [products.id] }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  loyaltyHistory: many(loyaltyHistory),
  customerVouchers: many(customerVouchers),
}));

export const vouchersRelations = relations(vouchers, ({ many }) => ({
  orders: many(orders),
  customerVouchers: many(customerVouchers),
}));

export const loyaltyHistoryRelations = relations(loyaltyHistory, ({ one }) => ({
  customer: one(customers, { fields: [loyaltyHistory.customerId], references: [customers.id] }),
}));

export const customerVouchersRelations = relations(customerVouchers, ({ one }) => ({
  customer: one(customers, { fields: [customerVouchers.customerId], references: [customers.id] }),
  voucher: one(vouchers, { fields: [customerVouchers.voucherId], references: [vouchers.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  branch: one(branches, { fields: [orders.branchId], references: [branches.id] }),
  voucher: one(vouchers, { fields: [orders.voucherId], references: [vouchers.id] }),
  orderDetails: many(orderDetails),
  review: one(reviews),
}));

export const orderDetailsRelations = relations(orderDetails, ({ one, many }) => ({
  order: one(orders, { fields: [orderDetails.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderDetails.productId], references: [products.id] }),
  size: one(sizes, { fields: [orderDetails.sizeId], references: [sizes.id] }),
  orderToppings: many(orderToppings),
}));

export const sizesRelations = relations(sizes, ({ many }) => ({
  orderDetails: many(orderDetails),
}));

export const toppingsRelations = relations(toppings, ({ many }) => ({
  orderToppings: many(orderToppings),
  categoryToppings: many(categoryToppings),
}));

export const categoryToppingsRelations = relations(categoryToppings, ({ one }) => ({
  category: one(productCategories, { fields: [categoryToppings.categoryId], references: [productCategories.id] }),
  topping: one(toppings, { fields: [categoryToppings.toppingId], references: [toppings.id] }),
}));

export const orderToppingsRelations = relations(orderToppings, ({ one }) => ({
  orderDetail: one(orderDetails, { fields: [orderToppings.orderDetailId], references: [orderDetails.id] }),
  topping: one(toppings, { fields: [orderToppings.toppingId], references: [toppings.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
  media: many(media),
}));

export const newsRelations = relations(news, ({ many }) => ({
  media: many(media),
}));

export const mediaRelations = relations(media, ({ one }) => ({
  review: one(reviews, { fields: [media.reviewId], references: [reviews.id] }),
  news: one(news, { fields: [media.newsId], references: [news.id] }),
}));
