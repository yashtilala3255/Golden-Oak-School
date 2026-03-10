import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://yrfojcxxugfpwwbmtnkf.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZm9qY3h4dWdmcHd3Ym10bmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzYxMTAsImV4cCI6MjA4Nzc1MjExMH0.MDGSpdLozK7VDRntYM8YoNglWBqLrg1cSS6c6Y7lvv0'
)

async function seed() {
    console.log('Seeding site_settings...')
    const settings = [
        { key: 'school_name', value: 'Golden Oak School' },
        { key: 'tagline', value: 'Nurturing Young Minds for a Golden Future' },
        { key: 'hero_sub', value: 'Golden Oak School — a premium CBSE-style campus offering Gujarati & English medium education from Playhouse to Grade 12. Shaping confident, curious learners in Kotharia, Gujarat.' },
        { key: 'address', value: 'Arjun Park, behind Swati Park, Swati Park, Kotharia, Gujarat 360002' },
        { key: 'phone', value: '07777053054' },
        { key: 'email', value: 'school.goldenoak@gmail.com' },
        { key: 'timing', value: 'Monday – Saturday, 9:00 AM – 7:30 PM' },
        { key: 'whatsapp', value: '917777053054' },
        { key: 'admission_year', value: '2025–26' },
        { key: 'about_short', value: 'Founded with a vision to transform education in Kotharia, Golden Oak School has been a beacon of quality learning. We believe in nurturing not just academics, but character, confidence, and creativity.' },
        { key: 'logo_url', value: '/logo.png' },
        { key: 'map_embed', value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.923717542176!2d70.81178109999999!3d22.242972899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb0076aa2db9%3A0x2f2bd7f517aca987!2sGolden%20Oak%20School!5e0!3m2!1sen!2sin!4v1773034159086!5m2!1sen!2sin' },
        { key: 'facebook', value: 'https://www.facebook.com/goldenoak.school1/' },
        { key: 'instagram', value: 'https://www.instagram.com/goldenoak_school/' },
        { key: 'youtube', value: 'https://www.youtube.com/@tgos2024' },
        { key: 'about_years', value: '15+' },
        { key: 'about_badge', value: 'Years of Excellence' },
    ]
    const r1 = await supabase.from('site_settings').upsert(settings, { onConflict: 'key' })
    console.log('site_settings:', r1.error?.message || 'OK')

    console.log('Seeding site_stats...')
    // Check if already populated
    const { data: existingStats } = await supabase.from('site_stats').select('id').limit(1)
    if (!existingStats?.length) {
        const r2 = await supabase.from('site_stats').insert([
            { number: '500+', label: 'Students Enrolled', sort: 0 },
            { number: '12', label: 'Smart Classrooms', sort: 1 },
            { number: '35+', label: 'Expert Teachers', sort: 2 },
            { number: '98%', label: 'Pass Rate', sort: 3 },
        ])
        console.log('site_stats:', r2.error?.message || 'OK')
    } else {
        console.log('site_stats: already has data, skipping')
    }

    console.log('Seeding gallery_items...')
    const { data: existingGallery } = await supabase.from('gallery_items').select('id').limit(1)
    if (!existingGallery?.length) {
        const r3 = await supabase.from('gallery_items').insert([
            { title: 'Golden Oak Campus', emoji: '🏫', category: 'academic', bg: 'linear-gradient(135deg,#1B4332,#40916C)', img_url: '/gallery-1.png', date: 'Mar 2026' },
            { title: 'School Celebration', emoji: '🎉', category: 'cultural', bg: 'linear-gradient(135deg,#FF6B6B,#FEE140)', img_url: '/gallery-2.jpg', date: 'Mar 2026' },
            { title: 'Campus Life', emoji: '📚', category: 'academic', bg: 'linear-gradient(135deg,#667EEA,#764BA2)', img_url: '/gallery-3.jpg', date: 'Mar 2026' },
            { title: 'Sports & Events', emoji: '🏅', category: 'sports', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', img_url: '/gallery-4.jpg', date: 'Mar 2026' },
        ])
        console.log('gallery_items:', r3.error?.message || 'OK')
    } else {
        console.log('gallery_items: already has data, skipping')
    }

    console.log('Seeding testimonials...')
    const { data: existingTest } = await supabase.from('testimonials').select('id').limit(1)
    if (!existingTest?.length) {
        const r4 = await supabase.from('testimonials').insert([
            { name: 'Priya Sharma', role: 'Parent of Grade 5 student', quote: 'Golden Oak School has transformed my child\'s love for learning. The teachers are incredibly dedicated and the environment is truly nurturing.', stars: 5 },
            { name: 'Rakesh Patel', role: 'Parent of Grade 8 student', quote: 'My daughter has grown tremendously in confidence and academics since joining. The holistic approach here is unmatched in the region.', stars: 5 },
            { name: 'Meera Desai', role: 'Parent of Grade 2 student', quote: 'The smart classrooms and modern facilities make learning exciting for my son every day. Best decision we made for his education.', stars: 5 },
        ])
        console.log('testimonials:', r4.error?.message || 'OK')
    } else {
        console.log('testimonials: already has data, skipping')
    }

    console.log('\nDone! Check errors above. Tables must be created via Supabase Dashboard SQL Editor first.')
}

seed()
