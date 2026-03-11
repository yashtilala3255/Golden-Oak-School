-- 1. Add is_super_admin to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'profiles'
      AND column_name  = 'is_super_admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- 2. Add maintenance_mode to site_settings table
INSERT INTO public.site_settings (key, value)
VALUES ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;
