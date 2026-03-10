import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import { supabase } from '../../supabaseClient'

interface AttendRecord {
    date: string
    grade: string
    section: string
    total: number
    present: number
    absent: number
    late: number
}

const GRADES = ['Nursery', 'KG', ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)]

const STATUS_COLOR: Record<string, string> = {
    present: '#15803D', absent: '#B91C1C', late: '#B45309'
}

export default function AttendanceHistory() {
    const [records, setRecords] = useState<AttendRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedGrade, setSelectedGrade] = useState('All')
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split('T')[0]
    })
    const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

    const load = async () => {
        setLoading(true)
        let query = supabase
            .from('attendance')
            .select('date, status, students(grade, section)')
            .gte('date', fromDate)
            .lte('date', toDate)
            .order('date', { ascending: false })

        const { data, error } = await query
        if (error) { setLoading(false); return }

        // Aggregate by date + grade + section
        const map: Record<string, AttendRecord> = {}
            ; (data as any[]).forEach(row => {
                const key = `${row.date}__${row.students?.grade}__${row.students?.section}`
                if (!map[key]) map[key] = { date: row.date, grade: row.students?.grade || '', section: row.students?.section || '', total: 0, present: 0, absent: 0, late: 0 }
                map[key].total++
                if (row.status === 'present') map[key].present++
                else if (row.status === 'absent') map[key].absent++
                else if (row.status === 'late') map[key].late++
            })

        let result = Object.values(map).sort((a, b) => b.date.localeCompare(a.date))
        if (selectedGrade !== 'All') result = result.filter(r => r.grade === selectedGrade)
        setRecords(result)
        setLoading(false)
    }

    useEffect(() => { load() }, [fromDate, toDate, selectedGrade])

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Attendance History</h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>View past attendance records for your classes</p>
            </div>

            {/* Filters */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '16px 24px', boxShadow: 'var(--shadow)', marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
                    <label className="form-label">From</label>
                    <input className="form-control" type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
                    <label className="form-label">To</label>
                    <input className="form-control" type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
                    <label className="form-label">Grade</label>
                    <select className="form-control" value={selectedGrade} onChange={e => setSelectedGrade(e.target.value)}>
                        <option value="All">All Grades</option>
                        {GRADES.map(g => <option key={g}>{g}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 48, textAlign: 'center' }}><Loader size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--gray-400)' }} /></div>
                ) : records.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>No attendance records found for selected filters.</div>
                ) : (
                    <table className="data-table">
                        <thead><tr><th>Date</th><th>Grade</th><th>Section</th><th>Total</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th></tr></thead>
                        <tbody>
                            {records.map((r, i) => {
                                const rate = r.total > 0 ? Math.round(r.present / r.total * 100) : 0
                                return (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600 }}>{r.date}</td>
                                        <td>{r.grade}</td>
                                        <td><span className="badge badge-info">Sec {r.section}</span></td>
                                        <td>{r.total}</td>
                                        <td style={{ color: STATUS_COLOR.present, fontWeight: 600 }}>{r.present}</td>
                                        <td style={{ color: STATUS_COLOR.absent, fontWeight: 600 }}>{r.absent}</td>
                                        <td style={{ color: STATUS_COLOR.late, fontWeight: 600 }}>{r.late}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ flex: 1, height: 6, background: 'var(--gray-200)', borderRadius: 'var(--radius-full)', overflow: 'hidden', minWidth: 60 }}>
                                                    <div style={{ height: '100%', width: `${rate}%`, background: rate >= 75 ? STATUS_COLOR.present : STATUS_COLOR.absent, borderRadius: 'var(--radius-full)' }} />
                                                </div>
                                                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: rate >= 75 ? STATUS_COLOR.present : STATUS_COLOR.absent, minWidth: 36 }}>{rate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
