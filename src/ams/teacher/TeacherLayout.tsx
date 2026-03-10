import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, ClipboardCheck, History, LogOut, Bell, Users } from 'lucide-react'
import { supabase } from '../../supabaseClient'

interface TeacherInfo { full_name: string; subject: string; grade: string; section: string }

export default function TeacherLayout() {
    const navigate = useNavigate()
    const [teacher, setTeacher] = useState<TeacherInfo | null>(null)

    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            const { data } = await supabase
                .from('teachers')
                .select('full_name, subject, grade, section')
                .eq('user_id', user.id)
                .single()
            if (data) setTeacher(data)
        }
        load()
    }, [])

    const handleLogout = async () => { await supabase.auth.signOut(); navigate('/ams/login') }
    const initial = teacher?.full_name?.charAt(0) ?? 'T'

    return (
        <div className="ams-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <GraduationCap size={20} color="var(--green-deep)" />
                    </div>
                    <div className="sidebar-logo-text">
                        <div className="school-name">Golden Oak AMS</div>
                        <div className="role-label">Teacher Panel</div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">Navigation</div>
                    <NavLink to="/ams/teacher" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <ClipboardCheck size={18} /> Mark Attendance
                    </NavLink>
                    <NavLink to="/ams/teacher/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <History size={18} /> Attendance History
                    </NavLink>
                    <NavLink to="/ams/teacher/students" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Users size={18} /> Students
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.875rem', flexShrink: 0 }}>{initial}</div>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 600 }}>
                                {teacher?.full_name ?? 'Loading...'}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                                {teacher ? `${teacher.subject} – ${teacher.grade}` : 'Teacher Panel'}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="nav-item" style={{ width: '100%', color: 'rgba(255,100,100,0.8)' }}>
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>
            <main className="ams-main">
                <header className="ams-topbar">
                    <div>
                        <div style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '1.0625rem' }}>Teacher Portal</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                            {teacher ? `${teacher.full_name} • ${teacher.subject} – ${teacher.grade} ${teacher.section}` : 'Golden Oak School'}
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button style={{ width: 36, height: 36, borderRadius: 9, border: '1.5px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)', cursor: 'pointer' }}><Bell size={16} /></button>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-deep)', fontWeight: 700, fontSize: '0.875rem' }}>{initial}</div>
                    </div>
                </header>
                <div className="ams-content"><Outlet /></div>
            </main>
        </div>
    )
}
