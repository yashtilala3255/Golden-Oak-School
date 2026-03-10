import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, LayoutDashboard, BarChart2, History, LogOut, Menu, X, Bell, Globe, UserCircle2 } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const NAV_ITEMS = [
    { to: '/ams/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    // { to: '/ams/admin/students', label: 'Students', icon: <Users size={18} /> },
    // { to: '/ams/admin/teachers', label: 'Teachers', icon: <UserCheck size={18} /> },
    // { to: '/ams/admin/classes', label: 'Classes & Sections', icon: <BookOpen size={18} /> },
    // { to: '/ams/admin/reports', label: 'Attendance Reports', icon: <ClipboardList size={18} /> },
    { to: '/ams/admin/analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
    { to: '/ams/admin/audit', label: 'Audit Log', icon: <History size={18} /> },
]

const WEB_NAV = [
    { to: '/ams/admin/website', label: 'Website Manager', icon: <Globe size={18} /> },
]

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [adminName, setAdminName] = useState('Admin User')
    const [adminEmail, setAdminEmail] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return
            setAdminEmail(user.email ?? '')
            const { data } = await supabase.from('profiles').select('full_name,avatar_url').eq('id', user.id).single()
            if (data?.full_name) setAdminName(data.full_name)
            if (data?.avatar_url) setAvatarUrl(data.avatar_url)
        })
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/adminlogin')
    }

    const initials = adminName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

    return (
        <div className="ams-layout">
            {/* Sidebar */}
            {sidebarOpen && <div className="mobile-overlay" style={{ zIndex: 195 }} onClick={() => setSidebarOpen(false)} />}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <GraduationCap size={20} color="var(--green-deep)" />
                    </div>
                    <div className="sidebar-logo-text">
                        <div className="school-name">Golden Oak School</div>
                        <div className="role-label">Admin Panel</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Navigation</div>
                    {NAV_ITEMS.map(item => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    ))}
                    <div className="sidebar-section-label" style={{ marginTop: 16 }}>Website</div>
                    {WEB_NAV.map(item => (
                        <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                            {item.icon} {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <NavLink to="/ams/admin/profile" onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textDecoration: 'none', borderRadius: 'var(--radius)', padding: '6px 8px', transition: 'background 0.2s' }}
                        onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')} onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)', flexShrink: 0 }} />
                        ) : (
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.875rem', flexShrink: 0 }}>{initials}</div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminName}</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminEmail}</div>
                        </div>
                        <UserCircle2 size={15} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                    </NavLink>
                    <button onClick={handleLogout} className="nav-item" style={{ width: '100%', color: 'rgba(255,100,100,0.8)' }}>
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="ams-main">
                <header className="ams-topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setSidebarOpen(o => !o)} style={{ display: 'none' }} className="mobile-menu-btn" aria-label="Menu">
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div>
                            <div style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '1.0625rem' }}>Admin Dashboard</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Golden Oak School • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <NavLink to="/ams/admin/profile" title="My Profile" style={{ flexShrink: 0, textDecoration: 'none' }}>
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold)' }} />
                            ) : (
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>{initials}</div>
                            )}
                        </NavLink>
                    </div>
                </header>
                <div className="ams-content">
                    <Outlet />
                </div>
            </main>

            <style>{`
        .mobile-menu-btn { background: none; border: none; cursor: pointer; color: var(--gray-600); }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
        </div>
    )
}
