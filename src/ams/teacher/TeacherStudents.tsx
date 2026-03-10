import { useState, useEffect } from 'react'
import { Search, Trash2, Loader, AlertCircle } from 'lucide-react'
import { supabase } from '../../supabaseClient'

interface Student {
    id: string; roll_no: string; full_name: string; grade: string;
    section: string; parent_name: string; phone: string; status: string;
    portal_email: string | null;
}

const GRADES = ['Nursery', 'KG', ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)]

export default function TeacherStudents() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [gradeFilter, setGradeFilter] = useState('All')
    const [error, setError] = useState('')

    const fetchStudents = async () => {
        setLoading(true)
        const { data } = await supabase.from('students').select('id, roll_no, full_name, grade, section, parent_name, phone, status, portal_email').order('grade').order('roll_no')
        setStudents(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchStudents() }, [])

    const filtered = students.filter(s => {
        const matchSearch = s.full_name.toLowerCase().includes(search.toLowerCase()) || s.roll_no.includes(search)
        const matchGrade = gradeFilter === 'All' || s.grade === gradeFilter
        return matchSearch && matchGrade
    })

    const remove = async (id: string, name: string) => {
        if (!confirm(`Delete ${name}? This will also delete all their attendance records and cannot be undone.`)) return
        setError('')
        const { error: err } = await supabase.from('students').delete().eq('id', id)
        if (err) {
            setError(`Delete failed: ${err.message}`)
        } else {
            setStudents(prev => prev.filter(s => s.id !== id))
        }
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Students</h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>{students.length} students enrolled</p>
            </div>

            {error && (
                <div style={{ marginBottom: 16, padding: '10px 16px', background: 'var(--danger-pale)', color: '#B91C1C', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Search name or roll no..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <select className="form-control" style={{ width: 'auto', minWidth: 140 }} value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}>
                        <option value="All">All Grades</option>
                        {GRADES.map(g => <option key={g}>{g}</option>)}
                    </select>
                    <span className="badge badge-green">{filtered.length} students</span>
                </div>

                {loading ? (
                    <div style={{ padding: 48, textAlign: 'center' }}><Loader size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--gray-400)' }} /></div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>
                        {search || gradeFilter !== 'All' ? 'No students matched your search.' : 'No students enrolled yet.'}
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ boxShadow: 'none', borderRadius: 0 }}>
                        <table className="data-table">
                            <thead>
                                <tr><th>Roll No</th><th>Student Name</th><th>Grade</th><th>Section</th><th>Parent</th><th>Phone</th><th>Status</th><th>Portal</th><th>Delete</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map(s => (
                                    <tr key={s.id}>
                                        <td><span style={{ fontWeight: 600, color: 'var(--green-deep)' }}>#{s.roll_no}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0 }}>{s.full_name.charAt(0)}</div>
                                                <span style={{ fontWeight: 600 }}>{s.full_name}</span>
                                            </div>
                                        </td>
                                        <td>{s.grade}</td>
                                        <td><span className="badge badge-info">Sec {s.section}</span></td>
                                        <td>{s.parent_name || '—'}</td>
                                        <td>{s.phone || '—'}</td>
                                        <td><span className={`badge ${s.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{s.status}</span></td>
                                        <td>
                                            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: s.portal_email ? '#15803D' : 'var(--gray-400)' }}>
                                                {s.portal_email ? '🔗 Linked' : '—'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => remove(s.id, s.full_name)}
                                                title={`Delete ${s.full_name}`}
                                                style={{ width: 32, height: 32, borderRadius: 6, border: '1.5px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', cursor: 'pointer', background: 'transparent' }}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
