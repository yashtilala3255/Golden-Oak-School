import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { ShieldAlert, Users, Power, AlertTriangle, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Profile {
    id: string
    full_name: string
    role: string
    is_super_admin: boolean
    email?: string
}

export default function SuperAdmin() {
    const navigate = useNavigate()
    const [isSuper, setIsSuper] = useState<boolean | null>(null)
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [admins, setAdmins] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAccessAndLoad = async () => {
            const { data: authData } = await supabase.auth.getUser()
            if (!authData.user) return navigate('/adminlogin')

            // Check if super admin
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_super_admin')
                .eq('id', authData.user.id)
                .single()

            if (!profile?.is_super_admin) {
                return navigate('/ams/admin')
            }

            setIsSuper(true)

            // Load maintenance mode
            const { data: settings } = await supabase
                .from('site_settings')
                .select('value')
                .eq('key', 'maintenance_mode')
                .single()

            if (settings) {
                setMaintenanceMode(settings.value === 'true')
            }

            // Load admins list
            const { data: adminProfiles } = await supabase
                .from('profiles')
                .select('id, full_name, role, is_super_admin')
                .eq('role', 'admin')

            if (adminProfiles) {
                setAdmins(adminProfiles)
            }

            setLoading(false)
        }
        checkAccessAndLoad()
    }, [navigate])

    const toggleMaintenanceMode = async () => {
        const newValue = !maintenanceMode
        setMaintenanceMode(newValue)
        await supabase
            .from('site_settings')
            .update({ value: newValue.toString() })
            .eq('key', 'maintenance_mode')
    }

    if (loading || !isSuper) {
        return <div className="spinner" style={{ margin: '40px auto' }} />
    }

    return (
        <div className="admin-page">
            <header className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="header-icon" style={{ background: 'var(--danger-pale)', color: '#B91C1C' }}>
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <h1 className="page-title">Super Admin Controls</h1>
                        <p className="page-subtitle">Critical system settings and master controls</p>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>

                {/* ── 1. WEBSITE SHUTDOWN ── */}
                <div className="card" style={{ border: maintenanceMode ? '2px solid #ef4444' : '1px solid var(--gray-200)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ background: maintenanceMode ? '#fee2e2' : 'var(--gray-100)', borderRadius: 12, padding: 12 }}>
                            <Power size={24} color={maintenanceMode ? '#ef4444' : 'var(--gray-600)'} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--gray-800)' }}>Website Shutdown</h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Maintenance Mode</p>
                        </div>
                    </div>

                    <p style={{ color: 'var(--gray-600)', marginBottom: 24, fontSize: '0.9375rem', lineHeight: 1.5 }}>
                        Turning this on will completely <strong>shut down the public website</strong> and display a "Maintenance Mode" screen to all visitors. The admin portal will remain accessible.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: maintenanceMode ? '#fef2f2' : 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {maintenanceMode ? <AlertTriangle size={20} color="#ef4444" /> : <ShieldCheck size={20} color="var(--green-mid)" />}
                            <span style={{ fontWeight: 600, color: maintenanceMode ? '#b91c1c' : 'var(--green-deep)' }}>
                                {maintenanceMode ? 'System Offline (Maintenance)' : 'System Online'}
                            </span>
                        </div>
                        <button
                            onClick={toggleMaintenanceMode}
                            className={`btn ${maintenanceMode ? 'btn-primary' : 'btn-outline'}`}
                            style={{ background: maintenanceMode ? '#ef4444' : '', borderColor: maintenanceMode ? '#ef4444' : '' }}
                        >
                            {maintenanceMode ? 'Bring Website Online' : 'Enable Maintenance Mode'}
                        </button>
                    </div>
                </div>

                {/* ── 2. ADMIN LIST ── */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ background: 'var(--gold-pale)', borderRadius: 12, padding: 12 }}>
                            <Users size={24} color="var(--gold-dark)" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--gray-800)' }}>Administrator Accounts</h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Active Admins: {admins.length}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {admins.map(admin => (
                            <div key={admin.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--gray-800)', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {admin.full_name || 'Unnamed Admin'}
                                        {admin.is_super_admin && (
                                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', background: 'var(--danger-pale)', color: '#B91C1C', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                                                Super
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: 4 }}>ID: {admin.id.split('-')[0]}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
