import { useState, useEffect } from 'react'
import { Plus, X, Trash2, BookOpen, Layers, Loader, AlertCircle, Save } from 'lucide-react'
import { supabase } from '../../supabaseClient'

interface ClassRow {
    id: string
    name: string
    sections: string[]
}

export default function Classes() {
    const [classes, setClasses] = useState<ClassRow[]>([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [newName, setNewName] = useState('')
    const [newSections, setNewSections] = useState('A')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const fetchClasses = async () => {
        setLoading(true)
        const { data } = await supabase.from('classes').select('*').order('name')
        setClasses(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchClasses() }, [])

    // Add entirely new class with sections
    const addClass = async () => {
        if (!newName.trim()) { setError('Class name is required.'); return }
        const secs = newSections.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
        if (secs.length === 0) { setError('At least one section is required.'); return }
        setSaving(true); setError('')
        const { error: err } = await supabase.from('classes').insert([{ name: newName.trim(), sections: secs }])
        setSaving(false)
        if (err) { setError(err.message); return }
        setNewName(''); setNewSections('A'); setShowAdd(false)
        fetchClasses()
    }

    // Add a section to an existing class
    const addSection = async (cls: ClassRow) => {
        const letter = prompt(`Add section to ${cls.name} (e.g. D):`)
        if (!letter) return
        const upper = letter.trim().toUpperCase()
        if (cls.sections.includes(upper)) { alert(`Section ${upper} already exists in ${cls.name}`); return }
        const updated = [...cls.sections, upper].sort()
        const { error: err } = await supabase.from('classes').update({ sections: updated }).eq('id', cls.id)
        if (err) { alert(err.message); return }
        setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, sections: updated } : c))
    }

    // Remove a section from a class
    const removeSection = async (cls: ClassRow, sec: string) => {
        if (!confirm(`Remove Section ${sec} from ${cls.name}?`)) return
        const updated = cls.sections.filter(s => s !== sec)
        const { error: err } = await supabase.from('classes').update({ sections: updated }).eq('id', cls.id)
        if (err) { alert(err.message); return }
        setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, sections: updated } : c))
    }

    // Delete entire class
    const deleteClass = async (cls: ClassRow) => {
        if (!confirm(`Delete ${cls.name} and all its sections? Students in this class won't be deleted.`)) return
        const { error: err } = await supabase.from('classes').delete().eq('id', cls.id)
        if (err) { alert(err.message); return }
        setClasses(prev => prev.filter(c => c.id !== cls.id))
    }

    const totalSections = classes.reduce((a, c) => a + (c.sections?.length || 0), 0)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Classes & Sections</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>
                        {classes.length} classes — {totalSections} sections total
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowAdd(true); setError('') }}>
                    <Plus size={16} /> Add Class
                </button>
            </div>

            {loading ? (
                <div style={{ padding: 64, textAlign: 'center' }}>
                    <Loader size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--gray-400)' }} />
                </div>
            ) : classes.length === 0 ? (
                <div style={{ padding: 64, textAlign: 'center', color: 'var(--gray-400)' }}>
                    <BookOpen size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p>No classes yet. Click <strong>Add Class</strong> to create your first grade.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                    {classes.map(cls => (
                        <div key={cls.id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)', border: '1.5px solid var(--gray-100)', position: 'relative' }}>
                            {/* Delete class button */}
                            <button
                                onClick={() => deleteClass(cls)}
                                title={`Delete ${cls.name}`}
                                style={{ position: 'absolute', top: 14, right: 14, width: 28, height: 28, borderRadius: 6, border: '1.5px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', cursor: 'pointer', background: 'transparent' }}
                            >
                                <Trash2 size={13} />
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <BookOpen size={20} style={{ color: 'var(--green-mid)' }} />
                                </div>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--green-deep)' }}>{cls.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                                        {(cls.sections?.length || 0)} section{(cls.sections?.length || 0) !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, minHeight: 36 }}>
                                {(cls.sections || []).map(sec => (
                                    <span key={sec} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--gold-pale)', color: 'var(--gold-dark)', padding: '5px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600, fontSize: '0.875rem', border: '1.5px solid rgba(201,168,76,0.25)' }}>
                                        <Layers size={12} /> Sec {sec}
                                        <button
                                            onClick={() => removeSection(cls, sec)}
                                            style={{ margin: 0, padding: 0, background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', lineHeight: 1, marginLeft: 2, display: 'flex', alignItems: 'center' }}
                                            title={`Remove Section ${sec}`}
                                        >
                                            <X size={11} />
                                        </button>
                                    </span>
                                ))}
                                {(cls.sections?.length || 0) === 0 && (
                                    <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', fontStyle: 'italic' }}>No sections yet</span>
                                )}
                            </div>

                            <button onClick={() => addSection(cls)} className="btn btn-sm btn-outline-gold" style={{ width: '100%', justifyContent: 'center' }}>
                                <Plus size={14} /> Add Section
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Class Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--green-deep)' }}>Add New Class</h3>
                            <button onClick={() => setShowAdd(false)} style={{ color: 'var(--gray-400)', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Class / Grade Name *</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. Grade 4, KG, Nursery"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addClass()}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Sections (comma-separated)</label>
                                <input
                                    className="form-control"
                                    placeholder="e.g. A, B, C"
                                    value={newSections}
                                    onChange={e => setNewSections(e.target.value)}
                                />
                                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginTop: 4 }}>
                                    You can add more sections later from the class card.
                                </p>
                            </div>

                            {/* Preview */}
                            {newName && (
                                <div style={{ background: 'var(--off-white)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.875rem' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--green-deep)' }}>{newName}</span>
                                    {' · '}
                                    {newSections.split(',').map(s => s.trim().toUpperCase()).filter(Boolean).map(s => (
                                        <span key={s} style={{ background: 'var(--gold-pale)', color: 'var(--gold-dark)', padding: '2px 8px', borderRadius: 999, fontWeight: 600, fontSize: '0.8125rem', marginLeft: 4 }}>Sec {s}</span>
                                    ))}
                                </div>
                            )}

                            {error && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#B91C1C', fontSize: '0.875rem' }}>
                                    <AlertCircle size={15} /> {error}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button className="btn btn-green" onClick={addClass} disabled={saving}>
                                    {saving ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Save size={15} /> Create Class</>}
                                </button>
                                <button className="btn btn-outline-gold" onClick={() => setShowAdd(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
