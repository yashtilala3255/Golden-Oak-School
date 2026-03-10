-- ============================================================
-- RLS FIX — Run in Supabase SQL Editor
-- Separates INSERT WITH CHECK from SELECT USING so inserts work
-- ============================================================

-- STUDENTS
DROP POLICY IF EXISTS "Admins manage students"  ON public.students;
DROP POLICY IF EXISTS "Teachers read students"  ON public.students;
DROP POLICY IF EXISTS "Students read own record" ON public.students;

CREATE POLICY "Admins insert students" ON public.students FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins update students" ON public.students FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins delete students" ON public.students FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff read students" ON public.students FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    OR user_id = auth.uid()
  );

-- TEACHERS
DROP POLICY IF EXISTS "Admins manage teachers"   ON public.teachers;
DROP POLICY IF EXISTS "Teachers read own record" ON public.teachers;

CREATE POLICY "Admins insert teachers" ON public.teachers FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins update teachers" ON public.teachers FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins delete teachers" ON public.teachers FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff read teachers" ON public.teachers FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    OR user_id = auth.uid()
  );

-- CLASSES
DROP POLICY IF EXISTS "Admins manage classes"  ON public.classes;
DROP POLICY IF EXISTS "Teachers read classes"  ON public.classes;

CREATE POLICY "Admins insert classes" ON public.classes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins update classes" ON public.classes FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins delete classes" ON public.classes FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff read classes" ON public.classes FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher','student','parent')));

-- ATTENDANCE
DROP POLICY IF EXISTS "Teachers manage attendance"     ON public.attendance;
DROP POLICY IF EXISTS "Students read own attendance"   ON public.attendance;
DROP POLICY IF EXISTS "Parents read child attendance"  ON public.attendance;

CREATE POLICY "Staff insert attendance" ON public.attendance FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher')));

CREATE POLICY "Staff update attendance" ON public.attendance FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher')));

CREATE POLICY "All read attendance" ON public.attendance FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin','teacher'))
    OR EXISTS (SELECT 1 FROM public.students WHERE id = attendance.student_id AND user_id = auth.uid())
  );

-- ADMISSION INQUIRIES — allow anon insert (public form)
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.admission_inquiries;
DROP POLICY IF EXISTS "Admins manage inquiries"   ON public.admission_inquiries;

CREATE POLICY "Anyone can submit inquiry" ON public.admission_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read inquiries" ON public.admission_inquiries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- CONTACT MESSAGES — allow anon insert (public form)
DROP POLICY IF EXISTS "Anyone can send message" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins read messages"    ON public.contact_messages;

CREATE POLICY "Anyone can send message" ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins read messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
