-- =============================================
-- SUPABASE SCHEMA CLEANUP FOR LIBRECHAT NATIVE BUILDER
-- =============================================

-- Since we're using LibreChat's native builder, we can simplify the marketplace tables
-- and focus on organization-based access control

-- 1. DROP MARKETPLACE TABLES (since LibreChat handles this natively)
-- =============================================

DROP TABLE IF EXISTS public.marketplace_access CASCADE;
DROP TABLE IF EXISTS public.marketplace_usage CASCADE;

-- We'll keep agent_library and prompt_library for organization sync,
-- but simplify them significantly

-- 2. SIMPLIFY AGENT_LIBRARY (for org sync only)
-- =============================================

-- Update category constraints to match our new business categories
ALTER TABLE public.agent_library 
DROP CONSTRAINT IF EXISTS agent_library_category_check;

ALTER TABLE public.agent_library 
ADD CONSTRAINT agent_library_category_check 
CHECK (category = ANY (ARRAY[
  'general'::text, 
  'sales_marketing'::text, 
  'customer_support'::text, 
  'data_analytics'::text,
  'content_creation'::text,
  'project_management'::text,
  'finance_accounting'::text,
  'hr_recruitment'::text,
  'operations'::text,
  'other'::text
]));

-- Remove is_public since LibreChat handles sharing
ALTER TABLE public.agent_library DROP COLUMN IF EXISTS is_public;

-- Add sync status for LibreChat integration
ALTER TABLE public.agent_library 
ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sync_status text DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'error'));

-- 3. SIMPLIFY PROMPT_LIBRARY (for org sync only)
-- =============================================

-- First, check if the column exists and add it if it doesn't
ALTER TABLE public.prompt_library 
ADD COLUMN IF NOT EXISTS prompt_text text;

-- Update category constraints to match our new business categories
ALTER TABLE public.prompt_library 
DROP CONSTRAINT IF EXISTS prompt_library_category_check;

ALTER TABLE public.prompt_library 
ADD CONSTRAINT prompt_library_category_check 
CHECK (category = ANY (ARRAY[
  'general'::text, 
  'sales_marketing'::text, 
  'customer_support'::text, 
  'data_analytics'::text,
  'content_creation'::text,
  'project_management'::text,
  'finance_accounting'::text,
  'hr_recruitment'::text,
  'operations'::text,
  'other'::text
]));

-- Remove is_public since LibreChat handles sharing
ALTER TABLE public.prompt_library DROP COLUMN IF EXISTS is_public;

-- Add sync status for LibreChat integration
ALTER TABLE public.prompt_library 
ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sync_status text DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'error'));

-- 4. UPDATE ORGANIZATIONS TABLE
-- =============================================

-- The marketplace_settings column is already good, but let's ensure it has the right default
UPDATE public.organizations 
SET marketplace_settings = '{
  "enabled": true,
  "allow_agent_creation": true,
  "allow_prompt_creation": true,
  "max_agents_per_org": 100,
  "max_prompts_per_org": 200
}'::jsonb
WHERE marketplace_settings IS NULL OR marketplace_settings = '{}';

-- 5. CREATE SIMPLIFIED INDEXES
-- =============================================

-- Indexes for efficient organization-based queries
CREATE INDEX IF NOT EXISTS idx_agent_library_org_id ON public.agent_library(organization_id);
CREATE INDEX IF NOT EXISTS idx_agent_library_category ON public.agent_library(category);
CREATE INDEX IF NOT EXISTS idx_agent_library_librechat_id ON public.agent_library(librechat_agent_id);

CREATE INDEX IF NOT EXISTS idx_prompt_library_org_id ON public.prompt_library(organization_id);
CREATE INDEX IF NOT EXISTS idx_prompt_library_category ON public.prompt_library(category);
CREATE INDEX IF NOT EXISTS idx_prompt_library_librechat_id ON public.prompt_library(librechat_group_id);

-- 6. UPDATE RLS POLICIES
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Organizations can view all public agents" ON public.agent_library;
DROP POLICY IF EXISTS "Organizations can view their own agents" ON public.agent_library;
DROP POLICY IF EXISTS "Organizations can insert their own agents" ON public.agent_library;
DROP POLICY IF EXISTS "Organizations can update their own agents" ON public.agent_library;
DROP POLICY IF EXISTS "Organizations can delete their own agents" ON public.agent_library;

DROP POLICY IF EXISTS "Organizations can view all public prompts" ON public.prompt_library;
DROP POLICY IF EXISTS "Organizations can view their own prompts" ON public.prompt_library;
DROP POLICY IF EXISTS "Organizations can insert their own prompts" ON public.prompt_library;
DROP POLICY IF EXISTS "Organizations can update their own prompts" ON public.prompt_library;
DROP POLICY IF EXISTS "Organizations can delete their own prompts" ON public.prompt_library;

-- Simplified RLS policies for organization isolation
CREATE POLICY "Users can view their organization's agents" ON public.agent_library
  FOR SELECT USING (organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage their organization's agents" ON public.agent_library
  FOR ALL USING (organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view their organization's prompts" ON public.prompt_library
  FOR SELECT USING (organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can manage their organization's prompts" ON public.prompt_library
  FOR ALL USING (organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- 7. FUNCTIONS FOR DEFAULT CONTENT SETUP
-- =============================================

-- Function to check if organization has default content
CREATE OR REPLACE FUNCTION public.organization_has_default_content(org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.agent_library 
    WHERE organization_id = org_id AND is_default = true
  ) AND EXISTS (
    SELECT 1 FROM public.prompt_library 
    WHERE organization_id = org_id AND is_default = true
  );
END;
$$;

-- Function to mark content as default for an organization
CREATE OR REPLACE FUNCTION public.mark_as_default_content(org_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark recently created agents as default
  UPDATE public.agent_library 
  SET is_default = true 
  WHERE organization_id = org_id 
    AND created_at > NOW() - INTERVAL '1 hour'
    AND is_default = false;
    
  -- Mark recently created prompts as default  
  UPDATE public.prompt_library 
  SET is_default = true 
  WHERE organization_id = org_id 
    AND created_at > NOW() - INTERVAL '1 hour'
    AND is_default = false;
END;
$$;

-- 8. CLEAN UP EXISTING DATA
-- =============================================

-- Since tables are empty, no data cleanup needed
-- Just ensure all organizations have the updated marketplace_settings

UPDATE public.organizations 
SET marketplace_settings = jsonb_set(
  COALESCE(marketplace_settings, '{}'::jsonb),
  '{agent_builder_enabled}',
  'true'::jsonb
);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify the cleanup
SELECT 'Cleanup completed successfully' as status;

-- Check table structures
SELECT 
  'agent_library' as table_name,
  COUNT(*) as row_count,
  array_agg(DISTINCT category) as categories
FROM public.agent_library
UNION ALL
SELECT 
  'prompt_library' as table_name,
  COUNT(*) as row_count,
  array_agg(DISTINCT category) as categories  
FROM public.prompt_library;

-- Check organizations marketplace settings
SELECT 
  name,
  marketplace_settings
FROM public.organizations;
