import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export interface SiteSettings {
    school_name: string
    tagline: string
    hero_sub: string
    address: string
    phone: string
    email: string
    timing: string
    whatsapp: string
    admission_year: string
    about_short: string
    logo_url: string
    map_embed: string
    facebook: string
    instagram: string
    youtube: string
    about_years: string
    about_badge: string
}

const DEFAULTS: SiteSettings = {
    school_name: 'Golden Oak School',
    tagline: 'Nurturing Young Minds for a Golden Future',
    hero_sub: 'Golden Oak School — a premium CBSE-style campus offering Gujarati & English medium education from Playhouse to Grade 12. Shaping confident, curious learners in Kotharia, Gujarat.',
    address: 'Arjun Park, behind Swati Park, Swati Park, Kotharia, Gujarat 360002',
    phone: '07777053054',
    email: 'school.goldenoak@gmail.com',
    timing: 'Monday – Saturday, 9:00 AM – 7:30 PM',
    whatsapp: '917777053054',
    admission_year: '2025–26',
    about_short: 'Founded with a vision to transform education in Kotharia, Golden Oak School has been a beacon of quality learning. We believe in nurturing not just academics, but character, confidence, and creativity.',
    logo_url: '/logo.png',
    map_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3692.923717542176!2d70.81178109999999!3d22.242972899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959cb0076aa2db9%3A0x2f2bd7f517aca987!2sGolden%20Oak%20School!5e0!3m2!1sen!2sin!4v1773034159086!5m2!1sen!2sin',
    facebook: 'https://www.facebook.com/goldenoak.school1/',
    instagram: 'https://www.instagram.com/goldenoak_school/',
    youtube: 'https://www.youtube.com/@tgos2024',
    about_years: '15+',
    about_badge: 'Years of Excellence',
}

export function useSiteSettings() {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase
            .from('site_settings')
            .select('key,value')
            .then(({ data }) => {
                if (data && data.length > 0) {
                    const map: Record<string, string> = {}
                    data.forEach((r: { key: string; value: string }) => { map[r.key] = r.value })
                    setSettings(prev => ({ ...prev, ...map }) as SiteSettings)
                }
                setLoading(false)
            })
    }, [])

    return { settings, loading }
}
