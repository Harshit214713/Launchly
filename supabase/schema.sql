-- ==============================================================================
-- Launchly — Production Database Schema for Supabase PostgreSQL
-- Tailored for NSOC, GSOC & Open-Source Production Deployment
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- 2. Sites / Published Websites Table
CREATE TABLE IF NOT EXISTS public.sites (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  template_id TEXT NOT NULL,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'draft', 'building')),
  views INTEGER NOT NULL DEFAULT 1,
  site_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sites_subdomain ON public.sites (subdomain);
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON public.sites (user_id);

-- 3. Payments / Transactions Table (QR Code & UPI Purchases)
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  amount TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  billing_cycle TEXT DEFAULT 'monthly',
  txn_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'failed')),
  payment_method TEXT NOT NULL DEFAULT 'qr_upi',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_email ON public.payments (user_email);
CREATE INDEX IF NOT EXISTS idx_payments_txn_id ON public.payments (txn_id);

-- 4. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'frontpage',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers (email);

-- 5. Contact & Feedback Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read on published sites
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view live sites') THEN
    CREATE POLICY "Public can view live sites" ON public.sites FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on users') THEN
    CREATE POLICY "Service role full access on users" ON public.users FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on sites') THEN
    CREATE POLICY "Service role full access on sites" ON public.sites FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on payments') THEN
    CREATE POLICY "Service role full access on payments" ON public.payments FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on subscribers') THEN
    CREATE POLICY "Service role full access on subscribers" ON public.subscribers FOR ALL USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access on contact_messages') THEN
    CREATE POLICY "Service role full access on contact_messages" ON public.contact_messages FOR ALL USING (true);
  END IF;

  -- Allow authenticated & anon select on public entities if needed
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated read users') THEN
    CREATE POLICY "Allow authenticated read users" ON public.users FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated read payments') THEN
    CREATE POLICY "Allow authenticated read payments" ON public.payments FOR SELECT USING (true);
  END IF;
END $$;

-- Explicit schema permissions for Supabase Studio, PostgREST and roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- Ensure table ownership for Supabase Dashboard Table Editor
ALTER TABLE public.users OWNER TO postgres;
ALTER TABLE public.sites OWNER TO postgres;
ALTER TABLE public.payments OWNER TO postgres;
ALTER TABLE public.subscribers OWNER TO postgres;
ALTER TABLE public.contact_messages OWNER TO postgres;

-- Notify PostgREST to reload schema cache so tables immediately reflect in Supabase Studio
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
