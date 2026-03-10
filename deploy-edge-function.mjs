/**
 * deploy-edge-function.mjs
 * Deploys the create-student-account Edge Function via Supabase Management API
 * and runs the SQL migration to add portal credential columns.
 * 
 * Usage: node deploy-edge-function.mjs
 */

import { readFileSync } from 'fs'

const PROJECT_REF = 'yrfojcxxugfpwwbmtnkf'
// Get your access token from: https://supabase.com/dashboard/account/tokens
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_ACCESS_TOKEN_HERE'

const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZm9qY3h4dWdmcHd3Ym10bmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzYxMTAsImV4cCI6MjA4Nzc1MjExMH0.MDGSpdLozK7VDRntYM8YoNglWBqLrg1cSS6c6Y7lvv0'

if (ACCESS_TOKEN === 'YOUR_ACCESS_TOKEN_HERE') {
    console.log('❌ ERROR: Please set your Supabase access token.')
    console.log('   Get it from: https://supabase.com/dashboard/account/tokens')
    console.log('   Then run: set SUPABASE_ACCESS_TOKEN=your_token_here && node deploy-edge-function.mjs')
    process.exit(1)
}

// Step 1: Run SQL Migration -------------------------------
console.log('\n📦 Step 1: Running SQL migration (adding portal credential columns)...')
const sql = `
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS portal_email TEXT;
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS portal_password TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS portal_email TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS portal_password TEXT;
`

try {
    const sqlRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sql })
    })
    if (!sqlRes.ok) {
        const err = await sqlRes.text()
        console.log('⚠ SQL migration warning:', err, '(columns may already exist — that is OK)')
    } else {
        console.log('✅ SQL migration applied successfully.')
    }
} catch (e) {
    console.log('⚠ SQL migration failed:', e.message, '— run add_credential_columns.sql manually in Supabase SQL Editor.')
}

// Step 2: Deploy Edge Function ----------------------------
console.log('\n🚀 Step 2: Deploying Edge Function create-student-account...')
const functionBody = readFileSync('./supabase/functions/create-student-account/index.ts', 'utf8')

// Create multipart form data with the function
const boundary = '----FormBoundary' + Date.now()
const body = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="metadata"',
    'Content-Type: application/json',
    '',
    JSON.stringify({ name: 'create-student-account', verify_jwt: true, entrypoint_path: 'index.ts' }),
    `--${boundary}`,
    'Content-Disposition: form-data; name="file"; filename="index.ts"',
    'Content-Type: application/typescript',
    '',
    functionBody,
    `--${boundary}--`
].join('\r\n')

try {
    const deployRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/functions/deploy`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
        },
        body
    })

    if (!deployRes.ok) {
        const err = await deployRes.text()
        throw new Error(err)
    }

    const result = await deployRes.json()
    console.log('✅ Edge Function deployed successfully!')
    console.log('   Function:', result.name || 'create-student-account')
    console.log(`   URL: https://${PROJECT_REF}.supabase.co/functions/v1/create-student-account`)
    console.log('\n🎉 All done! You can now Add Students and credentials will auto-generate.')
} catch (e) {
    console.log('❌ Deploy failed:', e.message)
    console.log('\n📋 MANUAL ALTERNATIVE:')
    console.log('   1. Go to: https://supabase.com/dashboard/project/yrfojcxxugfpwwbmtnkf/functions')
    console.log('   2. Click "New Function" → name it: create-student-account')
    console.log('   3. Paste the contents of: supabase/functions/create-student-account/index.ts')
    console.log('   4. Click Deploy')
}
