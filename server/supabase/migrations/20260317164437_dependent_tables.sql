-- Migration 002: Tables with foreign key dependencies on core tables
-- Tables: employees, products, branch_product_status, loyalty_history, customer_vouchers, news

-- Employees (FK: accounts, branches)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    account_id INT UNIQUE REFERENCES accounts(id) ON DELETE SET NULL,
    branch_id INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'barista', 'cashier', 'delivery')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Products (FK: product_categories)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    sales_status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (sales_status IN ('available', 'unavailable', 'discontinued')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Branch Product Status (FK: branches, products)
CREATE TABLE branch_product_status (
    id SERIAL PRIMARY KEY,
    branch_id INT NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'unavailable', 'out_of_stock')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (branch_id, product_id)
);

CREATE TRIGGER update_branch_product_status_updated_at
    BEFORE UPDATE ON branch_product_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Loyalty History (FK: customers)
CREATE TABLE loyalty_history (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    points_changed INT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired', 'adjusted')),
    previous_points INT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customer Vouchers (FK: customers, vouchers)
CREATE TABLE customer_vouchers (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    voucher_id INT NOT NULL REFERENCES vouchers(id) ON DELETE CASCADE,
    received_date DATE NOT NULL DEFAULT CURRENT_DATE,
    used_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'used', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_customer_vouchers_updated_at
    BEFORE UPDATE ON customer_vouchers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- News
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    article_type VARCHAR(50) NOT NULL CHECK (article_type IN ('promotion', 'announcement', 'blog')),
    publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
    publish_status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (publish_status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
