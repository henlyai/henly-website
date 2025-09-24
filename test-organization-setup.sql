-- =============================================
-- TEST ORGANIZATION SETUP
-- =============================================

-- Test the default content setup for your existing organizations
-- Run this after running the cleanup script

-- 1. Check current organizations
SELECT 
  id,
  name,
  marketplace_settings,
  created_at
FROM public.organizations;

-- 2. Check if any organizations have default content
SELECT 
  o.name as organization_name,
  public.organization_has_default_content(o.id) as has_default_content,
  (SELECT COUNT(*) FROM public.agent_library WHERE organization_id = o.id) as agent_count,
  (SELECT COUNT(*) FROM public.prompt_library WHERE organization_id = o.id) as prompt_count
FROM public.organizations o;

-- 3. Test data for your specific organizations
-- Replace with your actual organization IDs from the data you provided

-- ScaleWize AI (Tobias, Fabio, Toby, Sebbydkeating)
SELECT 'ScaleWize AI Org Check' as test_name;
SELECT * FROM public.profiles WHERE organization_id = 'ad82fce8-ba9a-438f-9fe2-956a86f479a5';

-- Seb's Organization  
SELECT 'Seb Org Check' as test_name;
SELECT * FROM public.profiles WHERE organization_id = '681dec0c-eb2a-4457-bc59-818ef658d282';

-- 4. Verify categories are updated correctly
SELECT 
  'Category validation' as test_name,
  unnest(enum_range(NULL::text)) as available_categories
FROM (
  SELECT NULL::text
) t;

-- 5. Check RLS policies are working
SET ROLE authenticated;
-- This should only show agents for the user's organization
-- (Note: This won't work in SQL editor, but will work when called from your app)
-- SELECT * FROM public.agent_library;

RESET ROLE;
