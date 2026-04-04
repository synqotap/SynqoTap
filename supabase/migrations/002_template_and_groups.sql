-- ============================================================
-- Migration 002: profile template + button groups
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Add template column to profiles (default 'minimal' for existing rows)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS template TEXT NOT NULL DEFAULT 'minimal';

-- Create button_groups table (if not already created)
CREATE TABLE IF NOT EXISTS public.button_groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT 'Section',
  position    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS for button_groups
ALTER TABLE public.button_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "button_groups_select"
  ON public.button_groups FOR SELECT
  USING (
    profile_id IN (
      SELECT id FROM public.profiles WHERE is_published = true
    )
    OR profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.customers c ON c.id = p.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY IF NOT EXISTS "button_groups_insert"
  ON public.button_groups FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.customers c ON c.id = p.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY IF NOT EXISTS "button_groups_update"
  ON public.button_groups FOR UPDATE
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.customers c ON c.id = p.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY IF NOT EXISTS "button_groups_delete"
  ON public.button_groups FOR DELETE
  USING (
    profile_id IN (
      SELECT p.id FROM public.profiles p
      JOIN public.customers c ON c.id = p.customer_id
      WHERE c.user_id = auth.uid()
    )
    OR public.is_admin()
  );
