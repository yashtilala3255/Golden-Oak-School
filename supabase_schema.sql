-- ============================================================
-- GOLDEN OAK SCHOOL — SUPABASE SCHEMA (idempotent, safe to re-run)
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- ── 1. PROFILES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role       TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'teacher', 'parent')),
  full_name  TEXT NOT NULL DEFAULT '',
  phone      TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile"    ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles"  ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile"  ON public.profiles;

CREATE POLICY "Users can read own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users    can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 2. STUDENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.students (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_no     TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  grade       TEXT NOT NULL,
  section     TEXT NOT NULL DEFAULT 'A',
  parent_name TEXT,
  phone       TEXT,
  status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage students"  ON public.students;
DROP POLICY IF EXISTS "Teachers read students"  ON public.students;

CREATE POLICY "Admins manage students" ON public.students FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Teachers read students" ON public.students FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher')));


-- ── 3. TEACHERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.teachers (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  emp_id     TEXT NOT NULL UNIQUE,
  full_name  TEXT NOT NULL,
  subject    TEXT,
  grade      TEXT,
  section    TEXT DEFAULT 'A',
  phone      TEXT,
  email      TEXT,
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage teachers"    ON public.teachers;
DROP POLICY IF EXISTS "Teachers read own record"  ON public.teachers;

CREATE POLICY "Admins manage teachers" ON public.teachers FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Teachers read own record" ON public.teachers FOR SELECT
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── 4. CLASSES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.classes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  sections   TEXT[] NOT NULL DEFAULT ARRAY['A'],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage classes"  ON public.classes;
DROP POLICY IF EXISTS "Teachers read classes"  ON public.classes;

CREATE POLICY "Admins manage classes" ON public.classes FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Teachers read classes" ON public.classes FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher')));


-- ── 5. ATTENDANCE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.attendance (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  date       DATE NOT NULL,
  status     TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, date)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers manage attendance"    ON public.attendance;
DROP POLICY IF EXISTS "Parents read child attendance" ON public.attendance;

CREATE POLICY "Teachers manage attendance" ON public.attendance FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher')));


-- ── 6. ADMISSION INQUIRIES ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admission_inquiries (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name    TEXT NOT NULL,
  student_name   TEXT NOT NULL,
  grade_applying TEXT NOT NULL,
  phone          TEXT NOT NULL,
  email          TEXT,
  message        TEXT,
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'admitted', 'rejected')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.admission_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.admission_inquiries;
DROP POLICY IF EXISTS "Admins manage inquiries"   ON public.admission_inquiries;

CREATE POLICY "Anyone can submit inquiry" ON public.admission_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage inquiries"   ON public.admission_inquiries FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── 7. CONTACT MESSAGES ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT,
  subject    TEXT,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can send message" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins read messages"    ON public.contact_messages;

CREATE POLICY "Anyone can send message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read messages"    ON public.contact_messages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ── 8. SEED DATA ─────────────────────────────────────────────
INSERT INTO public.classes (name, sections) VALUES
  ('Nursery',  ARRAY['A']),
  ('KG',       ARRAY['A','B']),
  ('Grade 1',  ARRAY['A','B']),
  ('Grade 2',  ARRAY['A']),
  ('Grade 3',  ARRAY['A','B']),
  ('Grade 4',  ARRAY['A']),
  ('Grade 5',  ARRAY['A','B']),
  ('Grade 6',  ARRAY['A','B']),
  ('Grade 7',  ARRAY['A','B']),
  ('Grade 8',  ARRAY['A','B']),
  ('Grade 9',  ARRAY['A','B']),
  ('Grade 10', ARRAY['A'])
ON CONFLICT DO NOTHING;

INSERT INTO public.students (roll_no, full_name, grade, section, parent_name, phone) VALUES
  ('701', 'Aarav Shah',    'Grade 7', 'A', 'Rajesh Shah',   '9876543210'),
  ('702', 'Divya Kapoor',  'Grade 7', 'A', 'Suresh Kapoor', '9765432109'),
  ('703', 'Farhan Shaikh', 'Grade 7', 'A', 'Imran Shaikh',  '9654321098'),
  ('704', 'Gita Sharma',   'Grade 7', 'A', 'Vijay Sharma',  '9543210987'),
  ('523', 'Priya Patel',   'Grade 5', 'B', 'Nilesh Patel',  '9432109876'),
  ('907', 'Mohit Raval',   'Grade 9', 'A', 'Suresh Raval',  '9321098765'),
  ('312', 'Sneha Joshi',   'Grade 3', 'A', 'Meera Joshi',   '9210987654'),
  ('614', 'Arjun Mehta',   'Grade 6', 'B', 'Kiran Mehta',   '9109876543'),
  ('102', 'Divya Sharma',  'Grade 1', 'A', 'Asha Sharma',   '9098765432'),
  ('814', 'Ravi Kumar',    'Grade 8', 'B', 'Vijay Kumar',   '9087654321')
ON CONFLICT DO NOTHING;

INSERT INTO public.teachers (emp_id, full_name, subject, grade, section, phone, email) VALUES
  ('T001', 'Mrs. Anita Desai',  'Mathematics',   'Grade 7', 'A', '9812345670', 'anita@goldenoakschool.in'),
  ('T002', 'Mr. Rakesh Mishra', 'Science',        'Grade 9', 'A', '9801234567', 'rakesh@goldenoakschool.in'),
  ('T003', 'Ms. Pooja Trivedi', 'English',        'Grade 5', 'B', '9790123456', 'pooja@goldenoakschool.in'),
  ('T004', 'Mr. Sunil Pandya',  'Social Science', 'Grade 6', 'A', '9789012345', 'sunil@goldenoakschool.in')
ON CONFLICT DO NOTHING;
