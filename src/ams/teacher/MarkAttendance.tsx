import { useState, useEffect } from 'react'
import { Save, CheckCircle, Loader, RefreshCw } from 'lucide-react'
import { supabase } from '../../supabaseClient'

type AttendStatus = 'present' | 'absent' | 'late' | null

interface Student { id: string; full_name: string; roll_no: string }

const STATUS_COLOR: Record<string, string> = {
    present: 'var(--success)', absent: 'var(--danger)', late: 'var(--warning)',
}

export default function MarkAttendance() {
    const today = new Date().toISOString().split('T')[0]
    const [date, setDate] = useState(today)
    const [grade, setGrade] = useState('Grade 7')
    const [section, setSection] = useState('A')
    const [students, setStudents] = useState<Student[]>([])
    const [attendance, setAttendance] = useState<Record<string, AttendStatus>>({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    const loadStudents = async () => {
        setLoading(true); setAttendance({}); setError('')
        const { data: studs, error: sErr } = await supabase
            .from('students').select('id, full_name, roll_no')
            .eq('grade', grade).eq('section', section).eq('status', 'active')
            .order('roll_no')

        if (sErr) { setError(sErr.message); setLoading(false); return }
        setStudents(studs || [])

        // Load existing attendance for this date
        if (studs && studs.length > 0) {
            const { data: att } = await supabase.from('attendance').select('student_id, status')
                .eq('date', date).in('student_id', studs.map(s => s.id))
            const map: Record<string, AttendStatus> = {}
            att?.forEach(a => { map[a.student_id] = a.status as AttendStatus })
            setAttendance(map)
        }
        setLoading(false)
    }

    useEffect(() => { loadStudents() }, [grade, section, date])

    const markAll = (status: AttendStatus) => {
        const all: Record<string, AttendStatus> = {}
        students.forEach(s => { all[s.id] = status })
        setAttendance(all)
    }

    const toggle = (id: string, status: 'present' | 'absent' | 'late') => {
        setAttendance(prev => ({ ...prev, [id]: prev[id] === status ? null : status }))
    }

    const handleSave = async () => {
        if (students.filter(s => attendance[s.id]).length === 0) { setError('Please mark at least one student.'); return }
        setSaving(true); setError('')
        try {
            const { data: { user } } = await supabase.auth.getUser()
            const userId = user?.id || null
            const entries = students
                .filter(s => attendance[s.id])
                .map(s => ({ student_id: s.id, date, status: attendance[s.id]!, marked_by: userId }))
            const { error: saveErr } = await supabase.from('attendance').upsert(entries, { onConflict: 'student_id,date' })
            if (saveErr) throw saveErr
            setSaved(true); setTimeout(() => setSaved(false), 3000)
        } catch (err: any) { setError(err.message) }
        finally { setSaving(false) }
    }

    const marked = Object.values(attendance).filter(Boolean).length
    const presentCount = Object.values(attendance).filter(s => s === 'present').length
    const absentCount = Object.values(attendance).filter(s => s === 'absent').length
    const lateCount = Object.values(attendance).filter(s => s === 'late').length
    const GRADES = ['Nursery', 'KG', ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)]

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Mark Attendance</h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>Select class & date, then mark each student's attendance</p>
            </div>

            {/* Controls */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', boxShadow: 'var(--shadow)', marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1, minWidth: 160 }}>
                    <label className="form-label">Date</label>
                    <input className="form-control" type="date" value={date} max={today} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
                    <label className="form-label">Grade</label>
                    <select className="form-control" value={grade} onChange={e => setGrade(e.target.value)}>
                        {GRADES.map(g => <option key={g}>{g}</option>)}
                    </select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 120 }}>
                    <label className="form-label">Section</label>
                    <select className="form-control" value={section} onChange={e => setSection(e.target.value)}>
                        {['A', 'B', 'C'].map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <div style={{ display: 'flex', gap: 8, flex: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <button className="btn btn-sm" style={{ background: 'var(--success-pale)', color: '#15803D', border: '1.5px solid var(--success)', borderRadius: 8 }} onClick={() => markAll('present')}>✓ All Present</button>
                    <button className="btn btn-sm" style={{ background: 'var(--danger-pale)', color: '#B91C1C', border: '1.5px solid var(--danger)', borderRadius: 8 }} onClick={() => markAll('absent')}>✗ All Absent</button>
                    <button className="btn btn-sm btn-outline-gold" onClick={() => setAttendance({})}>Reset</button>
                    <button className="btn btn-sm btn-green" onClick={loadStudents}><RefreshCw size={13} /></button>
                </div>
            </div>

            {/* Summary */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                {[
                    { label: 'Present', count: presentCount, color: '#15803D', bg: 'var(--success-pale)' },
                    { label: 'Absent', count: absentCount, color: '#B91C1C', bg: 'var(--danger-pale)' },
                    { label: 'Late', count: lateCount, color: '#B45309', bg: 'var(--warning-pale)' },
                    { label: 'Unmarked', count: students.length - marked, color: 'var(--gray-500)', bg: 'var(--gray-100)' },
                ].map(s => (
                    <div key={s.label} style={{ background: s.bg, color: s.color, borderRadius: 'var(--radius-full)', padding: '6px 16px', fontWeight: 700, fontSize: '0.875rem' }}>
                        {s.label}: {s.count}
                    </div>
                ))}
            </div>

            {error && <div style={{ background: 'var(--danger-pale)', color: '#B91C1C', padding: '10px 16px', borderRadius: 'var(--radius)', marginBottom: 16, fontSize: '0.875rem' }}>{error}</div>}

            {/* Student table */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)', marginBottom: 20 }}>
                {loading ? (
                    <div style={{ padding: 48, textAlign: 'center' }}><Loader size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--gray-400)' }} /></div>
                ) : students.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>No students found for {grade} – Section {section}. Add students first.</div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th>#</th><th>Roll No</th><th>Student Name</th><th>Mark Attendance</th><th>Status</th></tr></thead>
                        <tbody>
                            {students.map((s, i) => (
                                <tr key={s.id}>
                                    <td style={{ color: 'var(--gray-400)', fontWeight: 600 }}>{i + 1}</td>
                                    <td><span style={{ fontWeight: 600, color: 'var(--green-deep)' }}>#{s.roll_no}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>{s.full_name.charAt(0)}</div>
                                            <span style={{ fontWeight: 600 }}>{s.full_name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {(['present', 'absent', 'late'] as const).map(status => (
                                                <button key={status} className={`attend-btn ${status} ${attendance[s.id] === status ? 'active' : ''}`} onClick={() => toggle(s.id, status)} style={{ textTransform: 'capitalize' }}>
                                                    {status === 'present' ? '✓ Present' : status === 'absent' ? '✗ Absent' : '⚠ Late'}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        {attendance[s.id] ? (
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: STATUS_COLOR[attendance[s.id]!] + '18', color: STATUS_COLOR[attendance[s.id]!], padding: '4px 12px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'capitalize', border: `1.5px solid ${STATUS_COLOR[attendance[s.id]!]}40` }}>
                                                {attendance[s.id]}
                                            </span>
                                        ) : <span style={{ color: 'var(--gray-300)', fontSize: '0.8125rem' }}>—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
                {saved && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#15803D', fontWeight: 600, fontSize: '0.9375rem' }}>
                        <CheckCircle size={18} /> Attendance saved to database!
                    </div>
                )}
                <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving || marked === 0}>
                    <Save size={18} /> {saving ? 'Saving...' : `Save Attendance (${marked}/${students.length})`}
                </button>
            </div>
        </div>
    )
}
