-- Migration: Update order_status enum to support full delivery workflow
-- Old statuses: received, prepared, collected, paid, cancelled
-- New statuses: pending, preparing, ready, delivering, delivered, completed, cancelled

-- Step 1: Add new enum values
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'preparing';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'ready';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'delivering';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'delivered';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'completed';

-- Step 2: Map existing orders from old statuses to new statuses
UPDATE orders SET status = 'pending' WHERE status = 'received';
UPDATE orders SET status = 'ready' WHERE status = 'prepared';
UPDATE orders SET status = 'delivered' WHERE status = 'collected';
UPDATE orders SET status = 'completed' WHERE status = 'paid';

-- Step 3: Update default value for status column
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';

-- Note: PostgreSQL does not support removing enum values.
-- Old values (received, prepared, collected, paid) will remain in the enum
-- but should not be used by the application going forward.
