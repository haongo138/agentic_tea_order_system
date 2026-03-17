-- Migration 004: Indexes for query performance

-- Employees
CREATE INDEX idx_employees_branch_id ON employees(branch_id);
CREATE INDEX idx_employees_account_id ON employees(account_id);

-- Products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_sales_status ON products(sales_status);

-- Branch Product Status
CREATE INDEX idx_branch_product_status_branch_id ON branch_product_status(branch_id);
CREATE INDEX idx_branch_product_status_product_id ON branch_product_status(product_id);

-- Loyalty History
CREATE INDEX idx_loyalty_history_customer_id ON loyalty_history(customer_id);
CREATE INDEX idx_loyalty_history_date ON loyalty_history(date);

-- Customer Vouchers
CREATE INDEX idx_customer_vouchers_customer_id ON customer_vouchers(customer_id);
CREATE INDEX idx_customer_vouchers_voucher_id ON customer_vouchers(voucher_id);
CREATE INDEX idx_customer_vouchers_status ON customer_vouchers(status);

-- Orders
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_branch_id ON orders(branch_id);
CREATE INDEX idx_orders_voucher_id ON orders(voucher_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);

-- Order Details
CREATE INDEX idx_order_details_order_id ON order_details(order_id);
CREATE INDEX idx_order_details_product_id ON order_details(product_id);
CREATE INDEX idx_order_details_size_id ON order_details(size_id);

-- Order Toppings
CREATE INDEX idx_order_toppings_order_detail_id ON order_toppings(order_detail_id);
CREATE INDEX idx_order_toppings_topping_id ON order_toppings(topping_id);

-- Reviews
CREATE INDEX idx_reviews_order_id ON reviews(order_id);
CREATE INDEX idx_reviews_star_rating ON reviews(star_rating);

-- Media
CREATE INDEX idx_media_review_id ON media(review_id);
CREATE INDEX idx_media_news_id ON media(news_id);

-- News
CREATE INDEX idx_news_publish_status ON news(publish_status);
CREATE INDEX idx_news_publish_date ON news(publish_date);

-- Vouchers
CREATE INDEX idx_vouchers_expiration_date ON vouchers(expiration_date);
CREATE INDEX idx_vouchers_code ON vouchers(code);
