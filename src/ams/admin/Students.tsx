import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, Save, Loader, Link2, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react'
import { supabase } from '../../supabaseClient'

interface Student {
    id: string; roll_no: string; full_name: string; grade: string;
    section: string; parent_name: string; phone: string; status: string;
    user_id: string | null; portal_email: string | null; portal_password: string | null;
}

const GRADES = ['Nursery', 'KG', ...Array.from({ length: 10 }, (_, i) => `Grade ${i + 1}`)]
const EMPTY = { roll_no: '', full_name: '', grade: 'Grade 1', section: 'A', parent_name: '', phone: '', status: 'active' }
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string

export default function Students() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modal, setModal] = useState<'add' | 'edit' | 'creds' | null>(null)
    const [editing, setEditing] = useState<Student | null>(null)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState('')
    const [newCreds, setNewCreds] = useState<{ email: string; password: string } | null>(null)
    const [showPass, setShowPass] = useState(false)
    const [copied, setCopied] = useState('')

    const fetchStudents = async () => {
        setLoading(true)
        const { data } = await supabase.from('students').select('*').order('grade').order('roll_no')
        setStudents(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchStudents() }, [])

    const filtered = students.filter(s =>
        s.full_name.toLowerCase().includes(search.toLowerCase()) ||
        s.roll_no.includes(search) ||
        s.grade.toLowerCase().includes(search.toLowerCase())
    )

    const openAdd = () => { setForm(EMPTY); setError(''); setNewCreds(null); setModal('add') }
    const openEdit = (s: Student) => {
        setEditing(s)
        setForm({ roll_no: s.roll_no, full_name: s.full_name, grade: s.grade, section: s.section, parent_name: s.parent_name || '', phone: s.phone || '', status: s.status })
        setError(''); setModal('edit')
    }
    const viewCreds = (s: Student) => { setEditing(s); setShowPass(false); setModal('creds') }

    const copyText = (text: string, key: string) => {
        navigator.clipboard.writeText(text)
        setCopied(key)
        setTimeout(() => setCopied(''), 2000)
    }

    const save = async () => {
        if (!form.full_name || !form.roll_no) { setError('Name and Roll No are required.'); return }
        setSaving(true); setError('')
        try {
            if (modal === 'add') {
                const { data, error } = await supabase.from('students').insert([form]).select().single()
                if (error) throw error
                // Auto-generate portal account via Edge Function
                setGenerating(true)
                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-student-account`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${session?.access_token || ''}`,
                        },
                        body: JSON.stringify({ type: 'student', record_id: data.id, full_name: form.full_name, identifier: form.roll_no }),
                    })
                    const result = await res.json()
                    if (result.success) {
                        setNewCreds({ email: result.email, password: result.password })
                        await fetchStudents()
                        setModal('creds')
                        setEditing({ ...data, portal_email: result.email, portal_password: result.password })
                        return
                    } else {
                        const msg = result.error || result.message || `HTTP ${res.status} — is the Edge Function deployed?`
                        setError(`⚠ Student added! Portal account failed: ${msg}`)
                    }
                } catch (fetchErr: any) {
                    setError(`⚠ Student added! Portal account failed (${fetchErr.message}). Deploy the Edge Function first.`)
                } finally {
                    setGenerating(false)
                }
                await fetchStudents(); setModal(null); return
            } else if (editing) {
                const { error } = await supabase.from('students').update(form).eq('id', editing.id)
                if (error) throw error
            }
            await fetchStudents(); setModal(null)
        } catch (err: any) { setError(err.message) }
        finally { setSaving(false); setGenerating(false) }
    }

    const regenerate = async (s: Student) => {
        setGenerating(true); setError('')
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const res = await fetch(`${SUPABASE_URL}/functions/v1/create-student-account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token || ''}` },
                body: JSON.stringify({ type: 'student', record_id: s.id, full_name: s.full_name, identifier: s.roll_no }),
            })
            const result = await res.json()
            if (result.success) {
                setNewCreds({ email: result.email, password: result.password })
                setEditing(prev => prev ? { ...prev, portal_email: result.email, portal_password: result.password } : prev)
                await fetchStudents()
            } else setError(result.error || 'Failed to generate account')
        } catch (err: any) { setError(err.message) }
        finally { setGenerating(false) }
    }

    const remove = async (id: string) => {
        if (!confirm('Delete this student? This cannot be undone.')) return
        await supabase.from('students').delete().eq('id', id)
        setStudents(prev => prev.filter(s => s.id !== id))
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Student Management</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>{students.length} students enrolled</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Student</button>
            </div>

            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--gray-100)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input className="form-control" style={{ paddingLeft: 36 }} placeholder="Search name, roll, grade..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <span className="badge badge-green">{filtered.length} results</span>
                </div>

                {loading ? (
                    <div style={{ padding: 48, textAlign: 'center' }}><Loader size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--gray-400)' }} /></div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)' }}>
                        {search ? 'No students matched your search.' : 'No students yet. Click "Add Student" to get started.'}
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ boxShadow: 'none', borderRadius: 0 }}>
                        <table className="data-table">
                            <thead><tr><th>Roll No</th><th>Student Name</th><th>Grade</th><th>Section</th><th>Parent</th><th>Phone</th><th>Status</th><th>Portal</th><th>Actions</th></tr></thead>
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
                                            <button onClick={() => viewCreds(s)} style={{ background: s.portal_email ? 'var(--success-pale)' : 'var(--gray-100)', color: s.portal_email ? '#15803D' : 'var(--gray-500)', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <Link2 size={13} /> {s.portal_email ? 'View ID' : 'No Account'}
                                            </button>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button onClick={() => openEdit(s)} style={{ width: 30, height: 30, borderRadius: 6, border: '1.5px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)', cursor: 'pointer' }}><Edit2 size={14} /></button>
                                                <button onClick={() => remove(s.id)} style={{ width: 30, height: 30, borderRadius: 6, border: '1.5px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {(modal === 'add' || modal === 'edit') && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--green-deep)' }}>
                                {modal === 'add' ? 'Add New Student' : 'Edit Student'}
                            </h3>
                            <button onClick={() => setModal(null)} style={{ color: 'var(--gray-400)', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        {modal === 'add' && (
                            <div style={{ background: 'linear-gradient(135deg, var(--green-deep)10, var(--gold)08)', border: '1px solid var(--green-deep)20', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16, fontSize: '0.875rem', color: 'var(--green-deep)', fontWeight: 500 }}>
                                🔐 Portal login credentials will be auto-generated after adding this student.
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {[
                                { field: 'full_name', label: 'Student Name *', type: 'text' },
                                { field: 'roll_no', label: 'Roll No *', type: 'text' },
                                { field: 'parent_name', label: 'Parent Name', type: 'text' },
                                { field: 'phone', label: 'Parent Phone', type: 'tel' },
                            ].map(({ field, label, type }) => (
                                <div key={field} className="form-group">
                                    <label className="form-label">{label}</label>
                                    <input className="form-control" type={type} value={(form as any)[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
                                </div>
                            ))}
                            <div className="form-group">
                                <label className="form-label">Grade</label>
                                <select className="form-control" value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                                    {GRADES.map(g => <option key={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Section</label>
                                <select className="form-control" value={form.section} onChange={e => setForm(f => ({ ...f, section: e.target.value }))}>
                                    {['A', 'B', 'C'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-control" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        {error && <p style={{ color: error.startsWith('⚠') ? 'var(--warning)' : 'var(--danger)', fontSize: '0.875rem', marginTop: 12 }}>{error}</p>}
                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button className="btn btn-green" onClick={save} disabled={saving || generating}>
                                {generating ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Generating account...</>
                                    : saving ? 'Saving...'
                                        : modal === 'add' ? <><Plus size={15} /> Add &amp; Generate Login</> : <><Save size={15} /> Save Changes</>}
                            </button>
                            <button className="btn btn-outline-gold" onClick={() => setModal(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Credentials Modal */}
            {modal === 'creds' && editing && (
                <div className="modal-overlay" onClick={() => setModal(null)}>
                    <div className="modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--green-deep)' }}>Portal Login Credentials</h3>
                            <button onClick={() => setModal(null)} style={{ color: 'var(--gray-400)', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '12px 16px', background: 'var(--off-white)', borderRadius: 'var(--radius)' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>{editing.full_name.charAt(0)}</div>
                            <div>
                                <div style={{ fontWeight: 700, color: 'var(--green-deep)' }}>{editing.full_name}</div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>{editing.grade} – Section {editing.section} • Roll #{editing.roll_no}</div>
                            </div>
                        </div>

                        {(editing.portal_email || newCreds) ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {newCreds && (
                                    <div style={{ background: 'var(--success-pale)', color: '#15803D', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <CheckCircle size={16} /> Portal account created successfully!
                                    </div>
                                )}
                                {[
                                    { label: 'Login Email (Student ID)', value: newCreds?.email || editing.portal_email || '', key: 'email' },
                                    { label: 'Password', value: newCreds?.password || editing.portal_password || '', key: 'pass', masked: true },
                                ].map(({ label, value, key, masked }) => (
                                    <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">{label}</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                className="form-control"
                                                type={masked && !showPass ? 'password' : 'text'}
                                                value={value}
                                                readOnly
                                                style={{ paddingRight: 80, fontFamily: 'monospace', background: 'var(--gray-50)', fontWeight: 600 }}
                                            />
                                            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
                                                {masked && (
                                                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ color: 'var(--gray-400)', cursor: 'pointer', padding: 4 }}>
                                                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                )}
                                                <button type="button" onClick={() => copyText(value, key)} style={{ color: copied === key ? 'var(--success)' : 'var(--gray-400)', cursor: 'pointer', padding: 4 }}>
                                                    {copied === key ? <CheckCircle size={15} /> : <Copy size={15} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', margin: 0 }}>
                                    🔗 Login URL: <strong>localhost:5173/ams/login</strong>
                                </p>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--gray-400)' }}>
                                <p style={{ marginBottom: 16 }}>No portal account yet for this student.</p>
                            </div>
                        )}

                        {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', marginTop: 12 }}>{error}</p>}

                        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                            <button className="btn btn-green" onClick={() => regenerate(editing)} disabled={generating}>
                                {generating ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Link2 size={14} /> {editing.portal_email ? 'Regenerate Password' : 'Generate Account'}</>}
                            </button>
                            <button className="btn btn-outline-gold" onClick={() => setModal(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
