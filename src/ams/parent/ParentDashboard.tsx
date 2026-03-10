import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, TrendingUp, AlertCircle, CheckCircle, Clock, Download, Loader, Eye, EyeOff, Copy } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const STATUS_COLOR: Record<string, string> = { present: '#15803D', absent: '#B91C1C', late: '#B45309' }
const STATUS_BG: Record<string, string> = { present: 'var(--success-pale)', absent: 'var(--danger-pale)', late: 'var(--warning-pale)' }
const STATUS_ICON: Record<string, React.ReactNode> = {
    present: <CheckCircle size={15} />, absent: <AlertCircle size={15} />, late: <Clock size={15} />,
}

interface AttendRow { date: string; status: string }
interface Student { id: string; full_name: string; grade: string; section: string; roll_no: string; portal_email: string | null; portal_password: string | null }

export default function ParentDashboard() {
    const [student, setStudent] = useState<Student | null>(null)
    const [records, setRecords] = useState<AttendRow[]>([])
    const [loading, setLoading] = useState(true)
    const [showPass, setShowPass] = useState(false)
    const [copied, setCopied] = useState('')

    useEffect(() => {
        const load = async () => {
            const { data: userData } = await supabase.auth.getUser()
            if (!userData.user) { setLoading(false); return }

            // Find student linked to this parent's user profile
            // Parents are matched by profile lookup — fetch first student where we can access attendance
            // For now: find any student accessible to this user (RLS handles scoping)
            const { data: studs } = await supabase.from('students').select('id, full_name, grade, section, roll_no, portal_email, portal_password').limit(1).single()
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
        const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `attendance_${student?.full_name || 'report'}.csv` })
        a.click()
    }
    const copyText = (text: string, key: string) => {
        navigator.clipboard.writeText(text)
        setCopied(key); setTimeout(() => setCopied(''), 2000)
    }

    if (loading) return <div style={{ padding: 48, textAlign: 'center' }}><Loader size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--green-deep)', margin: '0 auto' }} /></div>
    if (!student) return (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>
            <AlertCircle size={32} style={{ margin: '0 auto 12px' }} />
            <p>No student linked to your account yet.</p>
            <p style={{ fontSize: '0.875rem', marginTop: 8 }}>Please contact the school admin to link your child's record.</p>
        </div>
    )

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>My Child's Attendance</h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>
                    {student.full_name} • {student.grade} – Section {student.section} • Roll #{student.roll_no}
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Rate', value: `${pct}%`, color: pct >= 75 ? 'var(--success)' : 'var(--danger)', desc: 'attendance rate' },
                    { label: 'Present', value: presentCount, color: 'var(--success)', desc: `out of ${total} days` },
                    { label: 'Absent', value: absentCount, color: 'var(--danger)', desc: 'absences recorded' },
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
                    <div style={{ fontWeight: 700, color: 'var(--green-deep)', display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={18} style={{ color: 'var(--gold)' }} /> Attendance Score</div>
                    <span style={{ fontWeight: 800, fontSize: '1.375rem', color: pct >= 75 ? '#15803D' : '#B91C1C' }}>{pct}%</span>
                </div>
                <div style={{ height: 14, background: 'var(--gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${pct >= 75 ? 'var(--success), #4ADE80' : 'var(--danger), #F87171'})`, borderRadius: 'var(--radius-full)', transition: 'width 0.8s ease' }} />
                </div>
                {pct < 75 && (
                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--danger-pale)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 8, color: '#B91C1C', fontSize: '0.875rem', fontWeight: 500 }}>
                        <AlertCircle size={16} /> Attendance is below the required 75%. Please ensure your child attends regularly.
                    </div>
                )}
            </div>

            {/* Bottom row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: 700, color: 'var(--green-deep)' }}>Recent Days</div>
                        <Link to="/ams/parent/calendar" style={{ color: 'var(--green-mid)', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>Full Calendar →</Link>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 14 }}>Quick Actions</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Link to="/ams/parent/calendar" className="btn btn-green" style={{ justifyContent: 'center' }}><Calendar size={16} /> View Full Calendar</Link>
                            <button onClick={handleDownload} disabled={records.length === 0} className="btn btn-outline-gold" style={{ justifyContent: 'center' }}><Download size={16} /> Download CSV Report</button>
                        </div>
                    </div>
                    {/* Child's portal credentials */}
                    {student.portal_email && (
                        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)', borderLeft: '4px solid var(--gold)' }}>
                            <div style={{ fontWeight: 700, color: 'var(--green-deep)', marginBottom: 14 }}>🔐 Child's Portal Login</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { label: 'Email (Student ID)', value: student.portal_email, key: 'em', masked: false },
                                    { label: 'Password', value: student.portal_password || '', key: 'pw', masked: true },
                                ].map(({ label, value, key, masked }) => (
                                    <div key={key}>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 4, fontWeight: 600 }}>{label}</div>
                                        <div style={{ position: 'relative' }}>
                                            <input readOnly value={value} type={masked && !showPass ? 'password' : 'text'}
                                                style={{ width: '100%', background: 'var(--gray-50)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)', padding: '8px 72px 8px 12px', fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 600, color: 'var(--green-deep)', boxSizing: 'border-box' }} />
                                            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
                                                {masked && (
                                                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', padding: 3 }}>
                                                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                )}
                                                <button type="button" onClick={() => copyText(value, key)} style={{ background: 'none', border: 'none', color: copied === key ? 'var(--success)' : 'var(--gray-400)', cursor: 'pointer', padding: 3 }}>
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', margin: '4px 0 0' }}>Share these credentials with your child to access the Student Portal.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
