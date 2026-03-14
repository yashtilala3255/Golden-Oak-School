import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { usePageView } from './hooks/usePageView'
import { useSiteSettings } from './hooks/useSiteSettings'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import Home from './pages/Home'
import About from './pages/About'
import Academics from './pages/Academics'
import Admissions from './pages/Admissions'
import Facilities from './pages/Facilities'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import AMSLogin from './ams/Login'
import ProtectedRoute from './ams/ProtectedRoute'
import AdminLayout from './ams/admin/AdminLayout'
import AdminDashboard from './ams/admin/AdminDashboard'
import Students from './ams/admin/Students'
import Teachers from './ams/admin/Teachers'
import Classes from './ams/admin/Classes'
import AttendanceReports from './ams/admin/AttendanceReports'
import Analytics from './ams/admin/Analytics'
import AuditLog from './ams/admin/AuditLog'
import WebsiteManager from './ams/admin/WebsiteManager'
import AdminProfile from './ams/admin/AdminProfile'
import SuperAdmin from './ams/admin/SuperAdmin'
import AdmissionInquiries from './ams/admin/AdmissionInquiries'
import ContactMessages from './ams/admin/ContactMessages'
import TeacherLayout from './ams/teacher/TeacherLayout'
import MarkAttendance from './ams/teacher/MarkAttendance'
import TeacherHistory from './ams/teacher/AttendanceHistory'
import TeacherStudents from './ams/teacher/TeacherStudents'
import ParentLayout from './ams/parent/ParentLayout'
import ParentDashboard from './ams/parent/ParentDashboard'
import AttendanceCalendar from './ams/parent/AttendanceCalendar'
import StudentLayout from './ams/student/StudentLayout'
import StudentDashboard from './ams/student/StudentDashboard'
import StudentCalendar from './ams/student/StudentCalendar'
import StudentProfile from './ams/student/StudentProfile'
import AdminLogin from "./ams/Login";


function PublicLayout({ children }: { children: React.ReactNode }) {
    usePageView()   // 👁 track every page visit
    const { settings, loading } = useSiteSettings()

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>
    }

    if (settings.maintenance_mode === 'true') {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, var(--green-deep) 0%, #0d2b1e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px 16px' }}>
                {/* Logo + icon */}
                <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, boxShadow: '0 8px 32px rgba(201,168,76,0.4)' }}>
                    <span style={{ fontSize: 44 }}>🛠️</span>
                </div>

                {/* Heading */}
                <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', marginBottom: 12, fontWeight: 800, letterSpacing: '-0.01em' }}>
                    We'll Be Back Soon!
                </h1>
                <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.65)', maxWidth: 480, lineHeight: 1.7, marginBottom: 40 }}>
                    Sorry for the inconvenience — we're performing scheduled maintenance. <br />We'll be back online shortly!
                </p>

                {/* Contact Info Card */}
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 16, padding: '28px 32px', maxWidth: 420, width: '100%', marginBottom: 32, backdropFilter: 'blur(10px)' }}>
                    <p style={{ color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>Contact the School</p>

                    {/* Email */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: 16 }}>✉️</span>
                        </div>
                        <a href="mailto:school.goldenoak@gmail.com" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem', textDecoration: 'none', fontWeight: 500 }}>
                            school.goldenoak@gmail.com
                        </a>
                    </div>

                    {/* Phone */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: 16 }}>📞</span>
                        </div>
                        <a href="tel:07777053054" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem', textDecoration: 'none', fontWeight: 500 }}>
                            07777053054
                        </a>
                    </div>

                    {/* Address */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                            <span style={{ fontSize: 16 }}>📍</span>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', lineHeight: 1.6, textAlign: 'left' }}>
                            Arjun Park, behind Swati Park,<br />Kotharia, Gujarat 360002
                        </span>
                    </div>
                </div>

                {/* Developer Credit */}
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8125rem', marginTop: 8 }}>
                    Designed &amp; developed by{' '}
                    <a
                        href="https://scalexwebsolution.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--gold)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid rgba(201,168,76,0.4)', paddingBottom: 1 }}
                    >
                        ScaleX Web Solution
                    </a>
                </p>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <WhatsAppButton />
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ── Public Website ── */}
                <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/academics" element={<PublicLayout><Academics /></PublicLayout>} />
                <Route path="/admissions" element={<PublicLayout><Admissions /></PublicLayout>} />
                <Route path="/facilities" element={<PublicLayout><Facilities /></PublicLayout>} />
                <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
                <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

                {/* ── AMS Auth ── */}
                <Route path="/adminlogin" element={<AMSLogin />} />
                <Route path="/adminlogin" element={<AdminLogin />} />

                {/* ── Admin Panel ── */}
                <Route path="/ams/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="students" element={<Students />} />
                    <Route path="teachers" element={<Teachers />} />
                    <Route path="classes" element={<Classes />} />
                    <Route path="reports" element={<AttendanceReports />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="audit" element={<AuditLog />} />
                    <Route path="website" element={<WebsiteManager />} />
                    <Route path="profile" element={<AdminProfile />} />
                    <Route path="super" element={<SuperAdmin />} />
                    <Route path="inquiries" element={<AdmissionInquiries />} />
                    <Route path="messages" element={<ContactMessages />} />
                </Route>

                {/* ── Teacher Panel ── */}
                <Route path="/ams/teacher" element={<ProtectedRoute role="teacher"><TeacherLayout /></ProtectedRoute>}>
                    <Route index element={<MarkAttendance />} />
                    <Route path="history" element={<TeacherHistory />} />
                    <Route path="students" element={<TeacherStudents />} />
                </Route>

                {/* ── Parent Portal ── */}
                <Route path="/ams/parent" element={<ProtectedRoute role="parent"><ParentLayout /></ProtectedRoute>}>
                    <Route index element={<ParentDashboard />} />
                    <Route path="calendar" element={<AttendanceCalendar />} />
                </Route>

                {/* ── Student Portal ── */}
                <Route path="/ams/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
                    <Route index element={<StudentDashboard />} />
                    <Route path="calendar" element={<StudentCalendar />} />
                    <Route path="profile" element={<StudentProfile />} />
                </Route>
            </Routes>
            <VercelAnalytics />
        </BrowserRouter>
    )
}
