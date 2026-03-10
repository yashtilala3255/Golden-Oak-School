import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // Verify caller is authenticated admin or teacher
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const callerClient = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_ANON_KEY')!,
            { global: { headers: { Authorization: authHeader } } }
        );

        const { data: { user: caller } } = await callerClient.auth.getUser();
        if (!caller) {
            return new Response(JSON.stringify({ error: 'Not authenticated' }), {
                status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const { data: profile } = await callerClient.from('profiles').select('role').eq('id', caller.id).single();
        if (!profile || !['admin', 'teacher'].includes(profile.role)) {
            return new Response(JSON.stringify({ error: 'Only admin or teacher can create accounts' }), {
                status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Parse request body — type: 'student' | 'teacher'
        const { type, record_id, full_name, identifier } = await req.json();
        // identifier = roll_no for students, emp_id for teachers
        if (!type || !record_id || !identifier || !full_name) {
            return new Response(JSON.stringify({ error: 'type, record_id, full_name, and identifier are required' }), {
                status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Generate credentials based on type
        const cleanId = identifier.toString().toLowerCase().replace(/\s+/g, '');
        const prefix = type === 'teacher' ? 't' : 's';
        const passPrefix = type === 'teacher' ? 'GOT@' : 'GOS@';
        const role = type === 'teacher' ? 'teacher' : 'student';
        const email = `${prefix}${cleanId}@goldenoakschool.in`;
        const password = `${passPrefix}${identifier}`;

        // Service-role client to create Supabase Auth user
        const adminClient = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        // Check if user already exists
        const { data: listData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
        const existing = listData?.users?.find((u: any) => u.email === email);

        let userId: string;

        if (existing) {
            userId = existing.id;
            await adminClient.auth.admin.updateUserById(userId, {
                password,
                user_metadata: { role, full_name },
            });
        } else {
            const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { role, full_name },
            });
            if (createErr) throw new Error(createErr.message);
            userId = newUser.user.id;
        }

        // Update the record (students or teachers table)
        const table = type === 'teacher' ? 'teachers' : 'students';
        const { error: updateErr } = await adminClient
            .from(table)
            .update({ user_id: userId, portal_email: email, portal_password: password })
            .eq('id', record_id);

        if (updateErr) throw new Error(updateErr.message);

        return new Response(JSON.stringify({ success: true, email, password, user_id: userId }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});
