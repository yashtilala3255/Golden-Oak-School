import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react'
import { supabase } from '../../supabaseClient'

const STATUS_COLOR = { present: '#22C55E', absent: '#EF4444', late: '#F59E0B' }
const STATUS_LABEL = { present: 'Present', absent: 'Absent', late: 'Late' }

export default function AttendanceCalendar() {
    const now = new Date()
    const [year, setYear] = useState(now.getFullYear())
    const [month, setMonth] = useState(now.getMonth())
    const [studentId, setStudentId] = useState<string | null>(null)
    const [attendMap, setAttendMap] = useState<Record<string, 'present' | 'absent' | 'late'>>({})
    const [loading, setLoading] = useState(true)
    const [studentInfo, setStudentInfo] = useState<{ full_name: string; grade: string; section: string; roll_no: string } | null>(null)

    useEffect(() => {
        const init = async () => {
            const { data: studs } = await supabase.from('students').select('id, full_name, grade, section, roll_no').limit(1).single()
            if (studs) { setStudentId(studs.id); setStudentInfo(studs) }
            setLoading(false)
        }
        init()
    }, [])

    useEffect(() => {
        if (!studentId) return
        const load = async () => {
            setLoading(true)
            const start = `${year}-${String(month + 1).padStart(2, '0')}-01`
            const end = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`
            const { data } = await supabase.from('attendance').select('date, status')
                .eq('student_id', studentId).gte('date', start).lte('date', end)
            const map: Record<string, 'present' | 'absent' | 'late'> = {}
            data?.forEach(r => { map[r.date] = r.status as any })
            setAttendMap(map)
            setLoading(false)
        }
        load()
    }, [studentId, year, month])

    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' })
    const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
    const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }
    const pad = (n: number) => String(n).padStart(2, '0')
    const keyFor = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`
    const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

    const counts = { present: 0, absent: 0, late: 0 }
    Object.values(attendMap).forEach(v => { if (v in counts) counts[v as keyof typeof counts]++ })
    const totalMarked = counts.present + counts.absent + counts.late
    const pct = totalMarked ? Math.round(counts.present / totalMarked * 100) : 0

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Attendance Calendar</h1>
                {studentInfo && <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>{studentInfo.full_name} • {studentInfo.grade} – Sec {studentInfo.section} • Roll #{studentInfo.roll_no}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Present', value: counts.present, color: STATUS_COLOR.present },
                    { label: 'Absent', value: counts.absent, color: STATUS_COLOR.absent },
                    { label: 'Late', value: counts.late, color: STATUS_COLOR.late },
                    { label: 'Rate', value: `${pct}%`, color: pct >= 75 ? STATUS_COLOR.present : STATUS_COLOR.absent },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', boxShadow: 'var(--shadow)', borderLeft: `4px solid ${s.color}` }}>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase' }}>{s.label}</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--green-deep)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button onClick={prev} style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}><ChevronLeft size={18} /></button>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 700, color: 'white' }}>{monthName} {year}</div>
                    </div>
                    <button onClick={next} style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}><ChevronRight size={18} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--off-white)', borderBottom: '1px solid var(--gray-200)' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ textAlign: 'center', padding: '10px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-500)' }}>{d}</div>
                    ))}
                </div>

                {loading ? (
                    <div style={{ padding: 48, textAlign: 'center' }}><Loader size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--gray-400)', margin: '0 auto' }} /></div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                        {cells.map((day, i) => {
                            if (!day) return <div key={i} style={{ height: 72, borderBottom: '1px solid var(--gray-100)', borderRight: '1px solid var(--gray-100)' }} />
                            const key = keyFor(day)
                            const status = attendMap[key]
                            const isToday = key === new Date().toISOString().split('T')[0]
                            const isWeekend = [0, 6].includes(new Date(year, month, day).getDay())
                            return (
                                <div key={i} style={{ height: 72, borderBottom: '1px solid var(--gray-100)', borderRight: '1px solid var(--gray-100)', padding: '10px 12px', background: status ? STATUS_COLOR[status] + '12' : isWeekend ? 'var(--gray-50)' : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', gap: 6 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: isToday ? 'var(--green-deep)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span style={{ fontWeight: isToday ? 700 : 500, fontSize: '0.9375rem', color: isToday ? 'white' : isWeekend ? 'var(--gray-400)' : 'var(--gray-700)' }}>{day}</span>
                                    </div>
                                    {status && <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[status] }} title={STATUS_LABEL[status as keyof typeof STATUS_LABEL]} />}
                                </div>
                            )
                        })}
                    </div>
                )}

                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--gray-100)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    {(['present', 'absent', 'late'] as const).map(s => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLOR[s] }} />
                            <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500 }}>{STATUS_LABEL[s]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
