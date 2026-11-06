-- ============================================================
-- Supabase Database Setup for Mosaddik Hasan Portfolio
-- Run this entire script in Supabase → SQL Editor → New Query
-- ============================================================

-- 1. Admin credentials table (stores hashed password)
CREATE TABLE IF NOT EXISTS admin_credentials (
  id TEXT PRIMARY KEY DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Portfolio config table (stores ALL your portfolio content)
CREATE TABLE IF NOT EXISTS portfolio_config (
  id TEXT PRIMARY KEY DEFAULT 'main',
  personal_info JSONB,
  about JSONB,
  skills JSONB,
  projects JSONB,
  experience JSONB,
  education JSONB,
  blog_posts JSONB,
  social_links JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Disable Row Level Security so the service key can read/write freely
ALTER TABLE admin_credentials DISABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_config DISABLE ROW LEVEL SECURITY;

-- 4. Confirm setup
SELECT 'Tables created successfully!' AS status;
