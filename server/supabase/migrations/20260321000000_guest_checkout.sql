-- Migration: Enable guest checkout
-- Allow customers to place orders without an account

-- Step 1: Make customer_id nullable (guests don't have an account)
ALTER TABLE orders ALTER COLUMN customer_id DROP NOT NULL;

-- Step 2: Add guest information fields
ALTER TABLE orders ADD COLUMN guest_name VARCHAR(100);
ALTER TABLE orders ADD COLUMN guest_phone VARCHAR(20);
ALTER TABLE orders ADD COLUMN guest_email VARCHAR(100);
ALTER TABLE orders ADD COLUMN is_guest BOOLEAN NOT NULL DEFAULT false;

-- Step 3: Add constraint — guest orders must have guest_name and guest_phone
ALTER TABLE orders ADD CONSTRAINT guest_info_required
  CHECK (
    (is_guest = false) OR
    (is_guest = true AND guest_name IS NOT NULL AND guest_phone IS NOT NULL)
  );
