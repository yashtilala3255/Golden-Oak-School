-- Fix RLS Policy for Contact Messages to allow deletion by Admins
DROP POLICY IF EXISTS "Admins read messages" ON public.contact_messages;

CREATE POLICY "Admins manage messages" ON public.contact_messages FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
