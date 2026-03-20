import { z } from "zod";

const SUGAR_LEVELS = ["0%", "25%", "50%", "75%", "100%"] as const;
const ICE_LEVELS = ["0%", "25%", "50%", "75%", "100%"] as const;
const PAYMENT_METHODS = ["cod", "bank_transfer"] as const;
const ORDER_STATUSES = [
  "pending", "preparing", "ready", "delivering", "delivered", "completed", "cancelled",
] as const;

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const MIN_PAGE = 1;
const MIN_LIMIT = 1;
const MIN_STAR_RATING = 1;
const MAX_STAR_RATING = 5;

const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  sizeId: z.number().int().positive().optional(),
  quantity: z.number().int().positive(),
  sugarLevel: z.enum(SUGAR_LEVELS),
  iceLevel: z.enum(ICE_LEVELS),
  toppingIds: z.array(z.number().int().positive()).default([]),
});

const guestInfoSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ").max(15),
  email: z.string().email("Email không hợp lệ").optional(),
});

export const createOrderBodySchema = z.object({
  customerId: z.number().int().positive().optional(),
  branchId: z.number().int().positive(),
  voucherCode: z.string().min(1).optional(),
  paymentMethod: z.enum(PAYMENT_METHODS),
  deliveryAddress: z.string().min(1, "Vui lòng nhập địa chỉ giao hàng"),
  note: z.string().optional(),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  guestInfo: guestInfoSchema.optional(),
}).refine(
  (data) => data.customerId !== undefined || data.guestInfo !== undefined,
  { message: "Vui lòng đăng nhập hoặc cung cấp thông tin khách hàng", path: ["customerId"] },
);

export const orderListQuerySchema = z.object({
  customerId: z.coerce.number().int().positive().optional(),
  status: z.enum(ORDER_STATUSES).optional(),
  page: z.coerce.number().int().min(MIN_PAGE).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(MIN_LIMIT).max(MAX_LIMIT).default(DEFAULT_LIMIT),
});

export const orderIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateOrderStatusBodySchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export const createReviewBodySchema = z.object({
  starRating: z.number().int().min(MIN_STAR_RATING).max(MAX_STAR_RATING),
  content: z.string().min(1).optional(),
});

export const trackOrderBodySchema = z.object({
  orderId: z.number().int().positive(),
  phone: z.string().min(9).max(15),
});

export type CreateOrderBody = z.infer<typeof createOrderBodySchema>;
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
export type OrderIdParam = z.infer<typeof orderIdParamSchema>;
export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusBodySchema>;
export type TrackOrderBody = z.infer<typeof trackOrderBodySchema>;
export type CreateReviewBody = z.infer<typeof createReviewBodySchema>;
