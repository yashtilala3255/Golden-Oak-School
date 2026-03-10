import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../supabaseClient'

/** Detects device type from user agent */
function getDevice(): 'mobile' | 'tablet' | 'desktop' {
    const ua = navigator.userAgent.toLowerCase()
    if (/tablet|ipad|playbook|silk|(android(?!.*mobile))/i.test(ua)) return 'tablet'
    if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
    return 'desktop'
}

/** Extracts a short source label from the referrer */
function getSource(): string {
    const ref = document.referrer
    if (!ref) return 'direct'
    try {
        const host = new URL(ref).hostname.replace('www.', '')
        if (host.includes('google')) return 'google'
        if (host.includes('facebook')) return 'facebook'
        if (host.includes('instagram')) return 'instagram'
        if (host.includes('youtube')) return 'youtube'
        if (host.includes('whatsapp')) return 'whatsapp'
        return host
    } catch {
        return 'direct'
    }
}

/**
 * Fires once on every public-page navigation.
 * Inserts a row into `page_views` table in Supabase.
 * Call this hook inside PublicLayout (wraps every public page).
 */
export function usePageView() {
    const location = useLocation()

    useEffect(() => {
        // Don't track admin / ams routes
        if (location.pathname.startsWith('/ams')) return

        supabase.from('page_views').insert([{
            page: location.pathname,
            device: getDevice(),
            source: getSource(),
        }]).then(() => { /* fire-and-forget */ })
    }, [location.pathname])
}
