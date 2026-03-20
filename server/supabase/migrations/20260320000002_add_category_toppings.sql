-- Category-topping restrictions: controls which toppings are allowed per product category
CREATE TABLE category_toppings (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  topping_id INTEGER NOT NULL REFERENCES toppings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, topping_id)
);

-- Index for fast lookup by category
CREATE INDEX idx_category_toppings_category_id ON category_toppings(category_id);
