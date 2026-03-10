-- ============================================================
-- GOLDEN OAK SCHOOL — CMS TABLES MIGRATION
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- ── 1. SITE SETTINGS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site_settings"  ON public.site_settings;
DROP POLICY IF EXISTS "Admins write site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings"  ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins write site_settings" ON public.site_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

INSERT INTO public.site_settings (key, value) VALUES
  ('school_name',    'Golden Oak School'),
  ('tagline',        'Nurturing Young Minds for a Golden Future'),
  ('hero_sub',       'Golden Oak School — a premium CBSE-style campus offering Gujarati & English medium education from Playhouse to Grade 12. Shaping confident, curious learners in Kotharia, Gujarat.'),
  ('address',        'Arjun Park, behind Swati Park, Swati Park, Kotharia, Gujarat 360002'),
  ('phone',          '07777053054'),
  ('email',          'school.goldenoak@gmail.com'),
  ('timing',         'Monday – Saturday, 9:00 AM – 7:30 PM'),
  ('whatsapp',       '917777053054'),
  ('admission_year', '2025–26'),
  ('about_short',    'Founded with a vision to transform education in Kotharia, Golden Oak School has been a beacon of quality learning. We believe in nurturing not just academics, but character, confidence, and creativity.'),
  ('logo_url',       '/logo.png'),
  ('map_embed',      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.923717542176!2d70.81178109999999!3d22.242972899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb0076aa2db9%3A0x2f2bd7f517aca987!2sGolden%20Oak%20School!5e0!3m2!1sen!2sin!4v1773034159086!5m2!1sen!2sin'),
  ('facebook',       'https://www.facebook.com/goldenoak.school1/'),
  ('instagram',      'https://www.instagram.com/goldenoak_school/'),
  ('youtube',        'https://www.youtube.com/@tgos2024'),
  ('about_years',    '15+'),
  ('about_badge',    'Years of Excellence')
ON CONFLICT (key) DO NOTHING;

-- ── 2. SITE STATS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_stats (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number     TEXT NOT NULL,
  label      TEXT NOT NULL,
  sort       INT  NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site_stats"  ON public.site_stats;
DROP POLICY IF EXISTS "Admins write site_stats" ON public.site_stats;
CREATE POLICY "Public read site_stats"  ON public.site_stats FOR SELECT USING (true);
CREATE POLICY "Admins write site_stats" ON public.site_stats FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

INSERT INTO public.site_stats (number, label, sort) VALUES
  ('500+', 'Students Enrolled', 0),
  ('12',   'Smart Classrooms',  1),
  ('35+',  'Expert Teachers',   2),
  ('98%',  'Pass Rate',         3)
ON CONFLICT DO NOTHING;

-- ── 3. GALLERY ITEMS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  emoji      TEXT NOT NULL DEFAULT '📸',
  category   TEXT NOT NULL DEFAULT 'cultural',
  bg         TEXT NOT NULL DEFAULT 'linear-gradient(135deg,#667EEA,#764BA2)',
  img_url    TEXT,
  date       TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read gallery_items"  ON public.gallery_items;
DROP POLICY IF EXISTS "Admins write gallery_items" ON public.gallery_items;
CREATE POLICY "Public read gallery_items"  ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Admins write gallery_items" ON public.gallery_items FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Add img_url column if it doesn't already exist (safe to re-run)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'gallery_items'
      AND column_name  = 'img_url'
  ) THEN
    ALTER TABLE public.gallery_items ADD COLUMN img_url TEXT;
  END IF;
END $$;

INSERT INTO public.gallery_items (title, emoji, category, bg, img_url, date) VALUES
  ('Golden Oak Campus',  '🏫', 'academic', 'linear-gradient(135deg,#1B4332,#40916C)', '/gallery-1.png', 'Mar 2026'),
  ('School Celebration', '🎉', 'cultural', 'linear-gradient(135deg,#FF6B6B,#FEE140)', '/gallery-2.jpg', 'Mar 2026'),
  ('Campus Life',        '📚', 'academic', 'linear-gradient(135deg,#667EEA,#764BA2)', '/gallery-3.jpg', 'Mar 2026'),
  ('Sports & Events',    '🏅', 'sports',   'linear-gradient(135deg,#11998e,#38ef7d)', '/gallery-4.jpg', 'Mar 2026')
ON CONFLICT DO NOTHING;

-- ── 4. TESTIMONIALS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'Parent',
  quote      TEXT NOT NULL,
  stars      INT  NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read testimonials"  ON public.testimonials;
DROP POLICY IF EXISTS "Admins write testimonials" ON public.testimonials;
CREATE POLICY "Public read testimonials"  ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins write testimonials" ON public.testimonials FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

INSERT INTO public.testimonials (name, role, quote, stars) VALUES
  ('Priya Sharma', 'Parent of Grade 5 student', 'Golden Oak School has transformed my child''s love for learning. The teachers are incredibly dedicated and the environment is truly nurturing.', 5),
  ('Rakesh Patel', 'Parent of Grade 8 student', 'My daughter has grown tremendously in confidence and academics since joining. The holistic approach here is unmatched in the region.', 5),
  ('Meera Desai',  'Parent of Grade 2 student', 'The smart classrooms and modern facilities make learning exciting for my son every day. Best decision we made for his education.', 5)
ON CONFLICT DO NOTHING;

-- ── 5. ANNOUNCEMENTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.announcements (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL DEFAULT '',
  category   TEXT NOT NULL DEFAULT 'General',
  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read active announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins manage announcements"      ON public.announcements;
CREATE POLICY "Public read active announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Admins manage announcements"      ON public.announcements FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── 6. STORAGE BUCKET FOR GALLERY IMAGES ─────────────────────
INSERT INTO storage.buckets (id, name, public)
  VALUES ('gallery', 'gallery', true)
  ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Gallery images public read"   ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload gallery"     ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete gallery"     ON storage.objects;

CREATE POLICY "Gallery images public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Admin can upload gallery" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admin can delete gallery" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
