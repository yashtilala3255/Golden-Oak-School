-- ============================================================
-- GOLDEN OAK SCHOOL — PAGE VIEW TRACKING TABLE
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

CREATE TABLE IF NOT EXISTS public.page_views (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page       TEXT NOT NULL,
  device     TEXT NOT NULL DEFAULT 'desktop',  -- mobile | tablet | desktop
  source     TEXT NOT NULL DEFAULT 'direct',   -- direct | google | facebook | etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone (public website visitor) can INSERT
DROP POLICY IF EXISTS "Anyone can log page view" ON public.page_views;
CREATE POLICY "Anyone can log page view" ON public.page_views
  FOR INSERT WITH CHECK (true);

-- Only admins can read analytics data
DROP POLICY IF EXISTS "Admins read page views" ON public.page_views;
CREATE POLICY "Admins read page views" ON public.page_views
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));
