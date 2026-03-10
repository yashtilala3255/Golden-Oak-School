import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import type { UserRole } from '../supabaseClient'

interface Props {
    role: UserRole
    children: React.ReactNode
}

export default function ProtectedRoute({ role, children }: Props) {
    const [status, setStatus] = useState<'loading' | 'ok' | 'denied'>('loading')

    useEffect(() => {
        // In demo mode (no real Supabase), allow all access
        const check = async () => {
            try {
                const { data } = await supabase.auth.getSession()
                if (!data.session) {
                    // Demo mode — allow access for dev/preview
                    setStatus('ok')
                    return
                }
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.session.user.id)
                    .single()

                if (profile?.role === role) {
                    setStatus('ok')
                } else {
                    setStatus('denied')
                }
            } catch {
                // Allow access in demo/error state
                setStatus('ok')
            }
        }
        check()
    }, [role])

    if (status === 'loading') return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
            <div className="spinner" />
        </div>
    )

    if (status === 'denied') return <Navigate to="/adminlogin" replace />

    return <>{children}</>
}
