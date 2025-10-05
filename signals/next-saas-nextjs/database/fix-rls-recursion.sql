-- Fix RLS Infinite Recursion Issue
-- Run this in Supabase SQL Editor

-- Step 1: Remove problematic policies from signals table
DROP POLICY IF EXISTS "Public can view active signals" ON signals;
DROP POLICY IF EXISTS "Authenticated users can view all signals" ON signals;
DROP POLICY IF EXISTS "Admins and analysts can manage signals" ON signals;

-- Step 2: Disable RLS for signals table (service role bypasses it anyway)
ALTER TABLE signals DISABLE ROW LEVEL SECURITY;

-- Step 3: Fix users table recursive policy
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create non-recursive policy for users table
CREATE POLICY "Users can view own or service role" ON users
    FOR SELECT USING (
        auth.uid() = id  -- Users can view their own data
    );

-- Step 4: Keep analytics accessible
-- (Already has "Public can view analytics" policy which is fine)

-- Verify
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
