-- ============================================================
-- LINK STUDENT AUTH ACCOUNTS
-- Run in Supabase SQL Editor after creating student auth users
-- ============================================================

-- Step 1: Create auth users for students in Supabase Dashboard
--   Authentication → Users → Add User
--   Email: student@goldenoakschool.in
--   Password: Student@1234
--   Metadata: {"role": "student", "full_name": "Aarav Shah"}

-- Step 2: Copy the new user's UUID from the Users table, then run:
-- UPDATE public.students
--   SET user_id = 'PASTE-USER-UUID-HERE'
--   WHERE roll_no = '701';  -- or any identifier

-- EXAMPLE — link Aarav Shah (roll #701) to a Supabase auth user:
-- UPDATE public.students
--   SET user_id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'
--   WHERE roll_no = '701';

-- To see all students and their current user_id:
SELECT id, roll_no, full_name, grade, section, user_id FROM public.students ORDER BY grade, roll_no;

-- To create a parent link (so ParentDashboard shows data):
-- The parent portal fetches the first student they have access to.
-- Create a parent user in Auth, then link via profile:
--   Authentication → Users → Add User
--   Email: parent@goldenoakschool.in
--   Metadata: {"role": "parent", "full_name": "Rajesh Shah"}
-- Then the parent can see their child's attendance once the child's record exists.
