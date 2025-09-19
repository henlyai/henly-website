-- Debug profiles constraint violation
-- Run these queries in Supabase SQL Editor to gather context

-- 1. Check the current profiles table structure and constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass
AND conname LIKE '%status%';

-- 2. Check the profiles table schema
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check current RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 4. Check if profiles table has RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 5. Check the current status values in profiles table
SELECT 
    status,
    COUNT(*) as count
FROM profiles 
GROUP BY status
ORDER BY count DESC;

-- 6. Check the specific constraint definition for status
SELECT 
    conname,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass
AND conname = 'profiles_status_check';

-- 7. Check what values are being inserted (if any recent attempts)
SELECT 
    id,
    full_name,
    email,
    status,
    role,
    is_verified,
    email_verification_required,
    is_active,
    created_at
FROM profiles 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC
LIMIT 10;

-- 8. Check invitation data for the specific token (replace with actual token)
-- Replace '6a21900f-7734-4aa8-856a-b0aa2dd39d16' with the actual token from the URL
SELECT 
    i.*,
    o.name as organization_name
FROM invitations i
LEFT JOIN organizations o ON i.organization_id = o.id
WHERE i.token = '6a21900f-7734-4aa8-856a-b0aa2dd39d16';

-- 9. Check if there are any existing profiles with the same email
SELECT 
    id,
    full_name,
    email,
    status,
    role,
    organization_id,
    is_verified,
    email_verification_required,
    is_active,
    created_at
FROM profiles 
WHERE email = 'seb@scalewize.ai';
