import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { usePageView } from './hooks/usePageView'
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

function PublicLayout({ children }: { children: React.ReactNode }) {
    usePageView()   // 👁 track every page visit
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
        </BrowserRouter>
    )
}
