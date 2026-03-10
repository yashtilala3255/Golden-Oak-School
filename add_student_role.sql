    -- Add student role support (run in Supabase SQL Editor)
    -- Safe to run after the main schema

    -- 1. Update profiles role check to include 'student'
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('admin', 'teacher', 'parent', 'student'));

    -- 2. Add user_id link to students table
    ALTER TABLE public.students ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

    -- 3. Update students RLS — students can see their own record
    DROP POLICY IF EXISTS "Students read own record" ON public.students;
    CREATE POLICY "Students read own record" ON public.students FOR SELECT
    USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher')));

    -- 4. Students can read their own attendance
    DROP POLICY IF EXISTS "Students read own attendance" ON public.attendance;
    CREATE POLICY "Students read own attendance" ON public.attendance FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.students WHERE id = attendance.student_id AND user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    );
