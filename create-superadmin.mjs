import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load .env
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
    console.error('You need the Service Role Key to bypass RLS when creating a Super Admin.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

const email = 'scalexwebsolution@gmail.com'
const password = 'SX8321060'

async function createSuperAdmin() {
    console.log('🔄 Creating Super Admin account...')

    try {
        // 1. Create the Auth user using Admin API
        let userId;
        const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { full_name: 'ScaleX Web Solution', role: 'admin' }
        })

        if (adminError) {
            if (adminError.message.includes('already exists') || adminError.message.includes('registered')) {
                console.log('ℹ️ User already exists. Fetching ID...')
                // Fetch user id
                const { data: users, error: listError } = await supabase.auth.admin.listUsers()
                if (listError) throw listError
                const existing = users.users.find(u => u.email === email)
                if (!existing) throw new Error('User exists but could not find ID.')
                userId = existing.id
            } else {
                throw adminError
            }
        } else {
            userId = adminData.user.id
        }

        if (!userId) throw new Error('Could not obtain user ID')
        console.log(`✅ Auth user acquired. ID: ${userId}`)

        // 2. Ensure profile exists and has is_super_admin = true
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                full_name: 'ScaleX Web Solution',
                role: 'admin',
                is_super_admin: true
            })

        if (profileError) throw profileError

        console.log('✅ Super Admin profile updated successfully!')
        console.log('----------------------------------------------------')
        console.log(`Email:    ${email}`)
        console.log(`Password: ${password}`)
        console.log('----------------------------------------------------')

    } catch (error) {
        console.error('❌ Error creating Super Admin:', error.message)
    }
}

createSuperAdmin()
