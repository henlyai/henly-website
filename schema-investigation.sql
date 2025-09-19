-- Schema Investigation Queries
-- Please run these in your Supabase SQL Editor and return the results

-- 1. Get the complete profiles table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Get all constraints on the profiles table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass
ORDER BY conname;

-- 3. Get the complete invitations table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'invitations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Get all constraints on the invitations table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'invitations'::regclass
ORDER BY conname;

-- 5. Check if there are any custom fields or columns that might be missing from the TypeScript types
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'invitations', 'organizations')
AND column_name NOT IN (
    'id', 'email', 'full_name', 'organization_id', 'role', 'is_active', 
    'librechat_user_id', 'last_login', 'created_at', 'updated_at',
    'name', 'slug', 'domain', 'subscription_status', 'plan_type', 
    'max_users', 'max_chat_sessions', 'monthly_token_limit', 
    'librechat_config', 'n8n_webhook_url',
    'token', 'invited_by', 'expires_at', 'status', 'magic_link_token',
    'magic_link_expires_at', 'accepted_at', 'accepted_by', 'email_sent',
    'email_sent_at'
)
ORDER BY table_name, ordinal_position;

-- 6. Check current RLS policies on profiles table
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
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 7. Check if there are any triggers on the profiles table
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'profiles'
AND event_object_schema = 'public';

-- 8. Sample data from profiles table (first 3 rows)
SELECT * FROM profiles LIMIT 3;

-- 9. Sample data from invitations table (first 3 rows)  
SELECT * FROM invitations LIMIT 3;

-- 10. Check if there are any views that might be relevant
SELECT 
    table_name,
    view_definition
FROM information_schema.views 
WHERE table_schema = 'public'
AND table_name LIKE '%profile%' OR table_name LIKE '%invitation%';
