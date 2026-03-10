-- Allow teachers to DELETE students (run in Supabase SQL Editor)
-- Already exists for admins; this adds teacher delete permission

DROP POLICY IF EXISTS "Admins delete students" ON public.students;

CREATE POLICY "Admin or teacher delete students" ON public.students
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'teacher')
    )
  );
