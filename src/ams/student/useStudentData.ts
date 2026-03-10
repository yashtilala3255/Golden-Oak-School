/**
 * Utility: find the student record for the currently logged-in auth user.
 *
 * Self-healing strategy:
 *  1. Try matching `user_id = auth.uid()` (fast path — already linked)
 *  2. Fallback: match `portal_email = auth user's email`
 *  3. If found via email, write `user_id` back to the row automatically
 *     so next time the fast-path works immediately.
 */
import { supabase } from '../../supabaseClient'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getLinkedStudent<T = any>(selectCols: string): Promise<T | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // 1️⃣ Fast path — user_id already set on the row
    const { data: byId } = await supabase
        .from('students')
        .select(selectCols)
        .eq('user_id', user.id)
        .maybeSingle()

    if (byId) return byId as T

    // 2️⃣ Fallback — student may have a portal_email matching their auth email
    if (!user.email) return null

    const { data: byEmail } = await supabase
        .from('students')
        .select('id, ' + selectCols)
        .eq('portal_email', user.email)
        .maybeSingle()

    if (!byEmail) return null

    // 3️⃣ Auto-link: persist the user_id so fast-path works on the next load
    supabase
        .from('students')
        .update({ user_id: user.id })
        .eq('id', (byEmail as unknown as { id: string }).id)
        .then(() => { /* fire-and-forget */ })

    return byEmail as T
}
