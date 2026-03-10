-- Run this in Supabase SQL Editor FIRST before the other steps
-- Adds portal credential columns so auto-generated logins can be stored

ALTER TABLE public.students ADD COLUMN IF NOT EXISTS portal_email TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS portal_password TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS portal_email TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS portal_password TEXT;
