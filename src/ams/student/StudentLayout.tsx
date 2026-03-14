import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { GraduationCap, LayoutDashboard, Calendar, LogOut, Bell, BookOpen, User, Menu, X } from 'lucide-react'
import { supabase } from '../../supabaseClient'
import { getLinkedStudent } from './useStudentData'

interface StudentInfo { full_name: string; grade: string; section: string; roll_no: string }

export default function StudentLayout() {
    const navigate = useNavigate()
    const [student, setStudent] = useState<StudentInfo | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const loadStudent = async () => {
            const data = await getLinkedStudent<StudentInfo>('full_name, grade, section, roll_no')
            if (data) setStudent(data)
        }
        loadStudent()
    }, [])

    const handleLogout = async () => { await supabase.auth.signOut(); navigate('/ams/login') }

    const initial = student?.full_name?.charAt(0) ?? 'S'

    return (
        <div className="ams-layout">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <GraduationCap size={20} color="var(--green-deep)" />
                    </div>
                    <div className="sidebar-logo-text">
                        <div className="school-name">Golden Oak AMS</div>
                        <div className="role-label">Student Portal</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section-label">My Attendance</div>
                    <NavLink to="/ams/student" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <LayoutDashboard size={18} /> Dashboard
                    </NavLink>
                    <NavLink to="/ams/student/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <Calendar size={18} /> Attendance Calendar
                    </NavLink>
                    <NavLink to="/ams/student/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}>
                        <User size={18} /> My Profile
                    </NavLink>

                    <div className="sidebar-section-label" style={{ marginTop: 12 }}>School</div>
                    <NavLink to="/" className="nav-item" target="_blank" onClick={() => setSidebarOpen(false)}>
                        <BookOpen size={18} /> School Website
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.875rem', flexShrink: 0 }}>{initial}</div>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', fontWeight: 600 }}>
                                {student?.full_name ?? 'Loading...'}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                                {student ? `${student.grade} – ${student.section} • Roll #${student.roll_no}` : 'Student Portal'}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setSidebarOpen(o => !o)} className="sidebar-toggle" aria-label="Toggle Menu">
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <div>
                            <div style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '1.0625rem' }}>Student Portal</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                {student ? `${student.full_name} • ${student.grade} Section ${student.section}` : 'Golden Oak School'}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button style={{ width: 36, height: 36, borderRadius: 9, border: '1.5px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)', cursor: 'pointer' }}>
                            <Bell size={16} />
                        </button>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-deep)', fontWeight: 700, fontSize: '0.875rem' }}>{initial}</div>
                    </div>
                </header>
                <div className="ams-content"><Outlet /></div>
            </main>
        </div>
    )
}
