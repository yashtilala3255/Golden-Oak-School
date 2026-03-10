import { useState, useEffect, useCallback } from 'react'
import { Download, Search, Filter, Loader, AlertCircle } from 'lucide-react'
import { supabase } from '../../supabaseClient'

interface Row {
    date: string; roll_no: string; full_name: string; grade: string
    section: string; status: string; teacher_name: string
}

const STATUS_BADGE: Record<string, string> = {
    present: 'badge-success', absent: 'badge-danger', late: 'badge-warning',
}

export default function AttendanceReports() {
    const todayStr = new Date().toISOString().split('T')[0]
    const [date, setDate] = useState(todayStr)
    const [gradeFilter, setGradeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [search, setSearch] = useState('')
    const [rows, setRows] = useState<Row[]>([])
    const [loading, setLoading] = useState(false)
    const [grades, setGrades] = useState<string[]>([])

    // Load distinct grades for filter dropdown
    useEffect(() => {
        supabase.from('students').select('grade').then(({ data }) => {
            const unique = [...new Set((data || []).map((r: any) => r.grade))].sort()
            setGrades(unique)
        })
    }, [])

    const fetchData = useCallback(async () => {
        setLoading(true)
        // Get attendance records — join students via student_id
        let q = supabase
            .from('attendance')
            .select(`
                date, status,
                students(full_name, roll_no, grade, section),
                marked_by_name
            `)
            .order('date', { ascending: false })

        if (date) q = q.eq('date', date)
        if (statusFilter) q = q.eq('status', statusFilter)

        const { data, error } = await q.limit(300)

        if (error) { setLoading(false); return }

        let mapped: Row[] = (data || []).map((r: any) => ({
            date: r.date,
            roll_no: r.students?.roll_no ?? '—',
            full_name: r.students?.full_name ?? 'Unknown',
            grade: r.students?.grade ?? '—',
            section: r.students?.section ?? '—',
            status: r.status,
            teacher_name: r.marked_by_name ?? '—',
        }))

        if (gradeFilter) mapped = mapped.filter(r => r.grade === gradeFilter)
        if (search) mapped = mapped.filter(r =>
            r.full_name.toLowerCase().includes(search.toLowerCase()) ||
            r.roll_no.includes(search)
        )

        setRows(mapped)
        setLoading(false)
    }, [date, gradeFilter, statusFilter, search])

    useEffect(() => { fetchData() }, [fetchData])

    const present = rows.filter(r => r.status === 'present').length
    const absent = rows.filter(r => r.status === 'absent').length
    const late = rows.filter(r => r.status === 'late').length

    const exportCSV = () => {
        const header = 'Date,Roll,Student,Grade,Section,Status,Marked By\n'
        const body = rows.map(r => `${r.date},${r.roll_no},"${r.full_name}",${r.grade},${r.section},${r.status},"${r.teacher_name}"`).join('\n')
        const a = Object.assign(document.createElement('a'), {
            href: URL.createObjectURL(new Blob([header + body], { type: 'text/csv' })),
            download: `attendance_${date || 'all'}.csv`
        })
        a.click()
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Attendance Reports</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>Real-time attendance data from Supabase</p>
                </div>
                <button className="btn btn-primary" onClick={exportCSV} disabled={rows.length === 0}><Download size={16} /> Export CSV</button>
            </div>

            {/* Filters */}
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', boxShadow: 'var(--shadow)', marginBottom: 20, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
                    <label className="form-label"><Filter size={12} style={{ display: 'inline' }} /> Date</label>
                    <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
                    <label className="form-label">Grade</label>
                    <select className="form-control" value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
                        <option value="">All Grades</option>
                        {grades.map(g => <option key={g}>{g}</option>)}
                    </select>
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: 140, marginBottom: 0 }}>
                    <label className="form-label">Status</label>
                    <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">All</option>
                        <option>present</option><option>absent</option><option>late</option>
                    </select>
                </div>
                <div className="form-group" style={{ flex: 2, minWidth: 200, marginBottom: 0 }}>
                    <label className="form-label">Search</label>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Name or roll number..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* Summary Counts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                {[
                    { label: 'Total Records', count: rows.length, color: 'var(--info)' },
                    { label: 'Present', count: present, color: 'var(--success)' },
                    { label: 'Absent', count: absent, color: 'var(--danger)' },
                    { label: 'Late', count: late, color: 'var(--warning)' },
                ].map(s => (
                    <div key={s.label} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 12, borderLeft: `4px solid ${s.color}` }}>
                        <span style={{ fontWeight: 800, fontSize: '1.375rem', color: s.color }}>{s.count}</span>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-600)' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="table-wrapper">
                {loading ? (
                    <div style={{ padding: 48, textAlign: 'center' }}><Loader size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--green-deep)', margin: '0 auto' }} /></div>
                ) : rows.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>
                        <AlertCircle size={28} style={{ margin: '0 auto 8px', opacity: 0.4 }} /><br />No records found.
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr><th>Date</th><th>Roll</th><th>Student Name</th><th>Grade</th><th>Section</th><th>Status</th><th>Marked By</th></tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.date}</td>
                                    <td><span style={{ fontWeight: 600, color: 'var(--green-deep)' }}>#{r.roll_no}</span></td>
                                    <td style={{ fontWeight: 600 }}>{r.full_name}</td>
                                    <td>{r.grade}</td>
                                    <td>Sec {r.section}</td>
                                    <td><span className={`badge ${STATUS_BADGE[r.status] ?? ''}`} style={{ textTransform: 'capitalize' }}>{r.status}</span></td>
                                    <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{r.teacher_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
