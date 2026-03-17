-- Migration 003: Order system and related tables
-- Tables: orders, order_details, order_toppings, reviews, media

-- Orders (FK: customers, branches, vouchers)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    branch_id INT NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    voucher_id INT REFERENCES vouchers(id) ON DELETE SET NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_payment DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cod', 'bank_transfer')),
    status VARCHAR(50) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'prepared', 'collected', 'paid', 'cancelled')),
    delivery_address TEXT,
    order_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Order Details (FK: orders, products, sizes)
CREATE TABLE order_details (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    size_id INT REFERENCES sizes(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    sugar_level VARCHAR(50) NOT NULL DEFAULT '100%' CHECK (sugar_level IN ('0%', '25%', '50%', '75%', '100%')),
    ice_level VARCHAR(50) NOT NULL DEFAULT '100%' CHECK (ice_level IN ('0%', '25%', '50%', '75%', '100%')),
    price_at_order_time DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Toppings (FK: order_details, toppings)
CREATE TABLE order_toppings (
    id SERIAL PRIMARY KEY,
    order_detail_id INT NOT NULL REFERENCES order_details(id) ON DELETE CASCADE,
    topping_id INT NOT NULL REFERENCES toppings(id) ON DELETE RESTRICT,
    unit_price_at_sale_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reviews (FK: orders) — one review per order
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    star_rating INT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
    content TEXT,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Media (FK: reviews, news) — polymorphic via nullable FKs
CREATE TABLE media (
    id SERIAL PRIMARY KEY,
    review_id INT REFERENCES reviews(id) ON DELETE CASCADE,
    news_id INT REFERENCES news(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('image', 'video')),
    upload_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT media_belongs_to_one CHECK (
        (review_id IS NOT NULL AND news_id IS NULL) OR
        (review_id IS NULL AND news_id IS NOT NULL)
    )
);
