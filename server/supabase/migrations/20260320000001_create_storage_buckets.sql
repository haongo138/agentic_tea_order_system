-- Create Supabase Storage buckets for image assets
-- Buckets are public to allow unauthenticated read access from customer/admin apps
-- Uploads are restricted to service role (API server uses SUPABASE_SERVICE_ROLE_KEY)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'products',
    'products',
    TRUE,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  ),
  (
    'news',
    'news',
    TRUE,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  ),
  (
    'branches',
    'branches',
    TRUE,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
  )
ON CONFLICT (id) DO NOTHING;
