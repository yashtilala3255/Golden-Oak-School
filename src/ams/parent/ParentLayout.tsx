import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, LayoutDashboard, Calendar, LogOut, Bell, Menu, X } from 'lucide-react'
import { supabase } from '../../supabaseClient'

export default function ParentLayout() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const handleLogout = async () => { await supabase.auth.signOut(); navigate('/ams/login') }

    return (
        <div className="ams-layout">
            {/* Mobile overlay */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />

            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <GraduationCap size={20} color="var(--green-deep)" />
                    </div>
                    <div className="sidebar-logo-text">
                        <div className="school-name">Golden Oak AMS</div>
                        <div className="role-label">Parent Portal</div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">My Child</div>
                    <NavLink to="/ams/parent" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <LayoutDashboard size={18} /> Overview
                    </NavLink>
                    <NavLink to="/ams/parent/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <Calendar size={18} /> Attendance Calendar
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.875rem', flexShrink: 0 }}>P</div>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 600 }}>Parent</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Parent Portal</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="nav-item" style={{ width: '100%', color: 'rgba(255,100,100,0.8)' }}>
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            <main className="ams-main">
                <header className="ams-topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setSidebarOpen(o => !o)} className="sidebar-toggle" aria-label="Toggle Menu">
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div>
                            <div style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '1.0625rem' }}>Parent Portal</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Golden Oak School</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button style={{ width: 36, height: 36, borderRadius: 9, border: '1.5px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)', cursor: 'pointer' }}><Bell size={16} /></button>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-deep)', fontWeight: 700, fontSize: '0.875rem' }}>P</div>
                    </div>
                </header>
                <div className="ams-content"><Outlet /></div>
            </main>
        </div>
    )
}
