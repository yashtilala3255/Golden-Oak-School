import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, TrendingUp, AlertCircle, CheckCircle, Clock, Download, Loader } from 'lucide-react'
import { supabase } from '../../supabaseClient'
import { getLinkedStudent } from './useStudentData'

const STATUS_COLOR: Record<string, string> = { present: '#15803D', absent: '#B91C1C', late: '#B45309' }
const STATUS_BG: Record<string, string> = { present: 'var(--success-pale)', absent: 'var(--danger-pale)', late: 'var(--warning-pale)' }
const STATUS_ICON: Record<string, React.ReactNode> = {
    present: <CheckCircle size={15} />, absent: <AlertCircle size={15} />, late: <Clock size={15} />,
}

interface AttendRow { date: string; status: string }
interface Student { id: string; full_name: string; grade: string; section: string; roll_no: string }

export default function StudentDashboard() {
    const [student, setStudent] = useState<Student | null>(null)
    const [records, setRecords] = useState<AttendRow[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const studs = await getLinkedStudent<Student>('id, full_name, grade, section, roll_no')
            if (!studs) { setLoading(false); return }
            setStudent(studs)

            const { data: att } = await supabase.from('attendance').select('date, status')
                .eq('student_id', studs.id).order('date', { ascending: false }).limit(90)
            setRecords(att || [])
            setLoading(false)
        }
        load()
    }, [])

    const recent = records.slice(0, 7)
    const presentCount = records.filter(r => r.status === 'present').length
    const absentCount = records.filter(r => r.status === 'absent').length
    const lateCount = records.filter(r => r.status === 'late').length
    const total = records.length
    const pct = total > 0 ? Math.round(presentCount / total * 100) : 0

    const handleDownload = () => {
        const csv = 'Date,Status\n' + records.map(r => `${r.date},${r.status}`).join('\n')
        const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `my_attendance.csv` })
        a.click()
    }

    if (loading) return <div style={{ padding: 48, textAlign: 'center' }}><Loader size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--green-deep)', margin: '0 auto' }} /></div>
    if (!student) return (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 12px' }} />
            <p>Your student profile is not linked yet.</p>
            <p style={{ fontSize: '0.875rem', marginTop: 8 }}>Please ask the school admin to link your account to your student record.</p>
        </div>
    )

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>My Attendance</h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>
                    {student.full_name} • {student.grade} – Section {student.section} • Roll #{student.roll_no}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Rate', value: `${pct}%`, color: pct >= 75 ? 'var(--success)' : 'var(--danger)', desc: 'attendance rate' },
                    { label: 'Present', value: presentCount, color: 'var(--success)', desc: `out of ${total} days` },
                    { label: 'Absent', value: absentCount, color: 'var(--danger)', desc: 'absences' },
                    { label: 'Late', value: lateCount, color: 'var(--warning)', desc: 'late arrivals' },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', boxShadow: 'var(--shadow)', borderTop: `4px solid ${s.color}` }}>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>{s.desc}</div>
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)', marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontWeight: 700, color: 'var(--green-deep)', display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={18} style={{ color: 'var(--gold)' }} /> My Attendance Score</div>
                    <span style={{ fontWeight: 800, fontSize: '1.375rem', color: pct >= 75 ? '#15803D' : '#B91C1C' }}>{pct}%</span>
                </div>
                <div style={{ height: 14, background: 'var(--gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${pct >= 75 ? 'var(--success), #4ADE80' : 'var(--danger), #F87171'})`, borderRadius: 'var(--radius-full)', transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                    <span>0%</span>
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>75% minimum required</span>
                    <span>100%</span>
                </div>
                {pct < 75 && total > 0 && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--danger-pale)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 8, color: '#B91C1C', fontSize: '0.875rem', fontWeight: 500 }}>
                        <AlertCircle size={16} /> Your attendance is below the required 75%. Please attend regularly.
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, color: 'var(--green-deep)' }}>Recent Days</div>
                        <Link to="/ams/student/calendar" style={{ color: 'var(--green-mid)', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>Full Calendar →</Link>
                    </div>
                    {recent.length === 0 ? (
                        <div style={{ padding: 24, textAlign: 'center', color: 'var(--gray-400)' }}>No attendance records yet.</div>
                    ) : recent.map((r, i) => (
                        <div key={i} style={{ padding: '12px 24px', borderBottom: '1px solid var(--gray-50)', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ color: STATUS_COLOR[r.status], display: 'flex', alignItems: 'center', flexShrink: 0 }}>{STATUS_ICON[r.status]}</div>
                            <span style={{ flex: 1, fontWeight: 500, color: 'var(--gray-700)' }}>{r.date}</span>
                            <span style={{ background: STATUS_BG[r.status], color: STATUS_COLOR[r.status], padding: '3px 12px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'capitalize' }}>{r.status}</span>
                        </div>
                    ))}
                </div>
                <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 14 }}>Quick Actions</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <Link to="/ams/student/calendar" className="btn btn-green" style={{ justifyContent: 'center' }}><Calendar size={16} /> View Attendance Calendar</Link>
                        <button onClick={handleDownload} disabled={records.length === 0} className="btn btn-outline-gold" style={{ justifyContent: 'center' }}><Download size={16} /> Download CSV Report</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
