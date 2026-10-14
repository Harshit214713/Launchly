import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.SUPABASE_URL || 
  'https://ciyujgkhytxgolxkukay.supabase.co';

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpeXVqZ2toeXR4Z29seGt1a2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMDcyNTUsImV4cCI6MjEwNzU4MzI1NX0.hlLqRc-fjo1giyjGeBpNK2KFeZ8zoUsdC0y5pJ055RY';

const supabaseServiceRoleKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpeXVqZ2toeXR4Z29seGt1a2F5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjAwNzI1NSwiZXhwIjoyMTA3NTgzMjU1fQ.W2Iqyae3hnNkSZbT0IgvPKeoLj3LSiKF-jqZSNrq8ME';

// Client-side browser Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side privileged Supabase client for API routes & backend operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export default supabase;
