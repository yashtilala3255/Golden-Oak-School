import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit2, Save, X, Loader, Globe, Image, Star, BarChart2, Bell, CheckCircle, Upload, MapPin } from 'lucide-react'
import { supabase } from '../../supabaseClient'

/* ─── Types ─────────────────────────────────────────────── */
interface Setting { key: string; value: string; label: string; type: 'text' | 'textarea' | 'tel' | 'email' | 'url' }
interface Announcement { id: string; title: string; body: string; category: string; active: boolean; created_at: string }
interface GalleryItem { id: string; title: string; emoji: string; category: string; bg: string; img_url?: string; date: string }
interface Testimonial { id: string; name: string; role: string; quote: string; stars: number }
interface Stat { id: string; number: string; label: string; sort: number }

const TABS = [
    { id: 'settings', label: 'Site Settings', icon: <Globe size={16} /> },
    { id: 'contact', label: 'Contact Info', icon: <MapPin size={16} /> },
    { id: 'gallery', label: 'Gallery', icon: <Image size={16} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <Star size={16} /> },
    { id: 'stats', label: 'Stats', icon: <BarChart2 size={16} /> },
]

const SITE_SETTINGS_KEYS: Setting[] = [
    { key: 'school_name', label: 'School Name', type: 'text', value: '' },
    { key: 'tagline', label: 'Hero Tagline', type: 'text', value: '' },
    { key: 'hero_sub', label: 'Hero Sub-text', type: 'textarea', value: '' },
    { key: 'logo_url', label: 'Logo URL / Path', type: 'text', value: '' },
    { key: 'whatsapp', label: 'WhatsApp Number', type: 'tel', value: '' },
    { key: 'admission_year', label: 'Admission Year', type: 'text', value: '' },
    { key: 'about_short', label: 'About Short Text', type: 'textarea', value: '' },
    { key: 'about_years', label: 'Years Badge Value', type: 'text', value: '' },
    { key: 'about_badge', label: 'Years Badge Label', type: 'text', value: '' },
    { key: 'facebook', label: 'Facebook URL', type: 'url', value: '' },
    { key: 'instagram', label: 'Instagram URL', type: 'url', value: '' },
    { key: 'youtube', label: 'YouTube URL', type: 'url', value: '' },
]

const CONTACT_SETTINGS_KEYS: Setting[] = [
    { key: 'address', label: 'School Address', type: 'textarea', value: '' },
    { key: 'phone', label: 'Phone Number', type: 'tel', value: '' },
    { key: 'email', label: 'Email Address', type: 'email', value: '' },
    { key: 'timing', label: 'Office Hours', type: 'text', value: '' },
    { key: 'map_embed', label: 'Google Maps Embed URL', type: 'url', value: '' },
]

const BG_PRESETS = [
    'linear-gradient(135deg,#667EEA,#764BA2)',
    'linear-gradient(135deg,#11998e,#38ef7d)',
    'linear-gradient(135deg,#F093FB,#F5576C)',
    'linear-gradient(135deg,#1B4332,var(--gold))',
    'linear-gradient(135deg,#FF6B6B,#FEE140)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43E97B,#38F9D7)',
    'linear-gradient(135deg,#A18CD1,#FBC2EB)',
]

/* ─── Main Component ─────────────────────────────────────── */
export default function WebsiteManager() {
    const [tab, setTab] = useState('settings')

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>Website Manager</h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>Control all public website content from here — changes go live instantly</p>
            </div>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 6, boxShadow: 'var(--shadow)', flexWrap: 'wrap' }}>
                {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: tab === t.id ? 'var(--green-deep)' : 'transparent', color: tab === t.id ? 'white' : 'var(--gray-500)' }}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {tab === 'settings' && <SiteSettingsTab keys={SITE_SETTINGS_KEYS} title="General Settings" desc="School name, hero text, logo, social links" />}
            {tab === 'contact' && <SiteSettingsTab keys={CONTACT_SETTINGS_KEYS} title="Contact Information" desc="Address, phone, email, map embed — shown in Contact page and Footer" />}
            {tab === 'gallery' && <GalleryTab />}
            {tab === 'testimonials' && <TestimonialsTab />}
            {tab === 'stats' && <StatsTab />}
        </div>
    )
}

/* ══════════════════════════════════════════════════════════
   SHARED TAB — SITE SETTINGS (used for both General + Contact)
══════════════════════════════════════════════════════════ */
function SiteSettingsTab({ keys, title, desc }: { keys: Setting[]; title: string; desc: string }) {
    const [settings, setSettings] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        supabase.from('site_settings').select('key,value').then(({ data }) => {
            const map: Record<string, string> = {}
            keys.forEach(s => { map[s.key] = '' })
                ; (data || []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value })
            setSettings(map); setLoading(false)
        })
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const rows = Object.entries(settings).map(([key, value]) => ({ key, value }))
        await supabase.from('site_settings').upsert(rows, { onConflict: 'key' })
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
    }

    if (loading) return <Spin />

    return (
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 28, boxShadow: 'var(--shadow)' }}>
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--green-deep)', fontWeight: 700 }}>{title}</h2>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.8125rem', marginTop: 2 }}>{desc}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                {keys.map(s => (
                    <div key={s.key} className="form-group" style={{ marginBottom: 0, gridColumn: s.type === 'textarea' ? 'span 2' : undefined }}>
                        <label className="form-label">{s.label}</label>
                        {s.type === 'textarea' ? (
                            <textarea className="form-control" rows={3} value={settings[s.key] || ''} onChange={e => setSettings(p => ({ ...p, [s.key]: e.target.value }))} style={{ resize: 'vertical' }} />
                        ) : (
                            <input className="form-control" type={s.type} value={settings[s.key] || ''} onChange={e => setSettings(p => ({ ...p, [s.key]: e.target.value }))} />
                        )}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="btn btn-green" onClick={handleSave} disabled={saving}>
                    {saving ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Save size={15} /> Save Settings</>}
                </button>
                {saved && <span style={{ color: 'var(--success)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={15} /> Saved!</span>}
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════════════════
   TAB — ANNOUNCEMENTS
══════════════════════════════════════════════════════════ */
function AnnouncementsTab() {
    const [items, setItems] = useState<Announcement[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState<Announcement | null>(null)
    const [form, setForm] = useState({ title: '', body: '', category: 'General', active: true })
    const [saving, setSaving] = useState(false)

    const fetch = async () => { setLoading(true); const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }); setItems(data || []); setLoading(false) }
    useEffect(() => { fetch() }, [])

    const openAdd = () => { setEditing(null); setForm({ title: '', body: '', category: 'General', active: true }); setModal(true) }
    const openEdit = (a: Announcement) => { setEditing(a); setForm({ title: a.title, body: a.body, category: a.category, active: a.active }); setModal(true) }

    const save = async () => {
        setSaving(true)
        if (editing) await supabase.from('announcements').update(form).eq('id', editing.id)
        else await supabase.from('announcements').insert([form])
        setSaving(false); setModal(false); fetch()
    }

    const remove = async (id: string) => { if (!confirm('Delete announcement?')) return; await supabase.from('announcements').delete().eq('id', id); fetch() }
    const toggleActive = async (a: Announcement) => { await supabase.from('announcements').update({ active: !a.active }).eq('id', a.id); fetch() }

    const CATS = ['General', 'Admission', 'Holiday', 'Event', 'Exam', 'Result', 'Other']

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{items.length} announcements</span>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> New Announcement</button>
            </div>
            {loading ? <Spin /> : items.length === 0 ? <Empty text="No announcements yet." /> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.map(a => (
                        <div key={a.id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'flex-start', gap: 16, borderLeft: `4px solid ${a.active ? 'var(--success)' : 'var(--gray-300)'}` }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontWeight: 700, color: 'var(--green-deep)' }}>{a.title}</span>
                                    <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>{a.category}</span>
                                    <span className={`badge ${a.active ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.75rem' }}>{a.active ? 'Active' : 'Hidden'}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: 0 }}>{a.body}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>{new Date(a.created_at).toLocaleDateString('en-IN')}</p>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                                <button onClick={() => toggleActive(a)} style={iconBtn(a.active ? 'var(--warning)' : 'var(--success)')} title={a.active ? 'Hide' : 'Show'}>{a.active ? '👁' : '👁‍🗨'}</button>
                                <button onClick={() => openEdit(a)} style={iconBtn('var(--info)')}><Edit2 size={14} /></button>
                                <button onClick={() => remove(a.id)} style={iconBtn('var(--danger)')}><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {modal && (
                <Modal title={editing ? 'Edit Announcement' : 'New Announcement'} onClose={() => setModal(false)}>
                    <div className="form-group"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
                    <div className="form-group"><label className="form-label">Body / Description *</label><textarea className="form-control" rows={4} value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} style={{ resize: 'vertical' }} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group"><label className="form-label">Category</label>
                            <select className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                {CATS.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group"><label className="form-label">Status</label>
                            <select className="form-control" value={form.active ? 'active' : 'hidden'} onChange={e => setForm(p => ({ ...p, active: e.target.value === 'active' }))}>
                                <option value="active">Active (Visible)</option>
                                <option value="hidden">Hidden</option>
                            </select>
                        </div>
                    </div>
                    <ModalActions saving={saving} onSave={save} onCancel={() => setModal(false)} />
                </Modal>
            )}
        </div>
    )
}

/* ══════════════════════════════════════════════════════════
   TAB — GALLERY (with image upload)
══════════════════════════════════════════════════════════ */
function GalleryTab() {
    const [items, setItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState<GalleryItem | null>(null)
    const [form, setForm] = useState({ title: '', emoji: '📸', category: 'cultural', bg: BG_PRESETS[0], img_url: '', date: '' })
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const fetch = async () => { setLoading(true); const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false }); setItems(data || []); setLoading(false) }
    useEffect(() => { fetch() }, [])

    const openAdd = () => { setEditing(null); setForm({ title: '', emoji: '📸', category: 'cultural', bg: BG_PRESETS[0], img_url: '', date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) }); setModal(true) }
    const openEdit = (g: GalleryItem) => { setEditing(g); setForm({ title: g.title, emoji: g.emoji, category: g.category, bg: g.bg, img_url: g.img_url || '', date: g.date }); setModal(true) }

    const handleUpload = async (file: File) => {
        setUploading(true)
        const ext = file.name.split('.').pop()
        const path = `gallery/${Date.now()}.${ext}`
        const { error } = await supabase.storage.from('gallery').upload(path, file, { upsert: true })
        if (!error) {
            const { data } = supabase.storage.from('gallery').getPublicUrl(path)
            setForm(p => ({ ...p, img_url: data.publicUrl }))
        }
        setUploading(false)
    }

    const save = async () => {
        setSaving(true)
        if (editing) await supabase.from('gallery_items').update(form).eq('id', editing.id)
        else await supabase.from('gallery_items').insert([form])
        setSaving(false); setModal(false); fetch()
    }

    const remove = async (id: string) => { if (!confirm('Delete gallery item?')) return; await supabase.from('gallery_items').delete().eq('id', id); fetch() }
    const CATS = ['cultural', 'sports', 'academic', 'graduation', 'environment', 'other']

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{items.length} gallery items</span>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Gallery Item</button>
            </div>
            {loading ? <Spin /> : items.length === 0 ? <Empty text="No gallery items yet." /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                    {items.map(g => (
                        <div key={g.id} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)', background: g.img_url ? '#f5f5f5' : g.bg, position: 'relative', aspectRatio: '4/3' }}>
                            {g.img_url ? (
                                <img src={g.img_url} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>{g.emoji}</div>
                            )}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 12 }}>
                                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>{g.title}</div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>{g.date}</div>
                            </div>
                            <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                                <button onClick={() => openEdit(g)} style={iconBtn('white', 'rgba(0,0,0,0.4)')}><Edit2 size={12} /></button>
                                <button onClick={() => remove(g.id)} style={iconBtn('#FCA5A5', 'rgba(0,0,0,0.4)')}><Trash2 size={12} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {modal && (
                <Modal title={editing ? 'Edit Gallery Item' : 'Add Gallery Item'} onClose={() => setModal(false)}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group"><label className="form-label">Title *</label><input className="form-control" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} /></div>
                        <div className="form-group"><label className="form-label">Category</label>
                            <select className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                                {CATS.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group"><label className="form-label">Emoji (fallback)</label><input className="form-control" value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))} /></div>
                        <div className="form-group"><label className="form-label">Display Date</label><input className="form-control" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} placeholder="e.g. Dec 2024" /></div>
                    </div>

                    {/* Image upload */}
                    <div className="form-group">
                        <label className="form-label">Photo</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]) }}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-gold btn-sm"
                                onClick={() => fileRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Uploading...</> : <><Upload size={13} /> Upload Image</>}
                            </button>
                            {form.img_url && <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>✓ Image ready</span>}
                        </div>
                        <input className="form-control" value={form.img_url} onChange={e => setForm(p => ({ ...p, img_url: e.target.value }))} placeholder="Or paste image URL..." style={{ fontSize: '0.8125rem' }} />
                    </div>

                    {/* Preview */}
                    {form.img_url ? (
                        <div style={{ height: 100, borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 16 }}>
                            <img src={form.img_url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label className="form-label">Background Gradient (if no photo)</label>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                                    {BG_PRESETS.map(bg => (
                                        <div key={bg} onClick={() => setForm(p => ({ ...p, bg }))} style={{ width: 40, height: 32, borderRadius: 8, background: bg, cursor: 'pointer', border: form.bg === bg ? '3px solid var(--green-deep)' : '2px solid transparent', transition: 'border 0.15s' }} />
                                    ))}
                                </div>
                            </div>
                            <div style={{ height: 80, borderRadius: 'var(--radius)', background: form.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                                <span style={{ fontSize: '2rem' }}>{form.emoji}</span>
                                <span style={{ color: 'white', fontWeight: 700 }}>{form.title || 'Preview'}</span>
                            </div>
                        </>
                    )}

                    <ModalActions saving={saving} onSave={save} onCancel={() => setModal(false)} />
                </Modal>
            )}
        </div>
    )
}

/* ══════════════════════════════════════════════════════════
   TAB — TESTIMONIALS
══════════════════════════════════════════════════════════ */
function TestimonialsTab() {
    const [items, setItems] = useState<Testimonial[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState<Testimonial | null>(null)
    const [form, setForm] = useState({ name: '', role: '', quote: '', stars: 5 })
    const [saving, setSaving] = useState(false)

    const fetch = async () => { setLoading(true); const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false }); setItems(data || []); setLoading(false) }
    useEffect(() => { fetch() }, [])

    const openAdd = () => { setEditing(null); setForm({ name: '', role: 'Parent', quote: '', stars: 5 }); setModal(true) }
    const openEdit = (t: Testimonial) => { setEditing(t); setForm({ name: t.name, role: t.role, quote: t.quote, stars: t.stars }); setModal(true) }
    const save = async () => {
        setSaving(true)
        if (editing) await supabase.from('testimonials').update(form).eq('id', editing.id)
        else await supabase.from('testimonials').insert([form])
        setSaving(false); setModal(false); fetch()
    }
    const remove = async (id: string) => { if (!confirm('Delete testimonial?')) return; await supabase.from('testimonials').delete().eq('id', id); fetch() }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{items.length} testimonials</span>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Testimonial</button>
            </div>
            {loading ? <Spin /> : items.length === 0 ? <Empty text="No testimonials yet." /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                    {items.map(t => (
                        <div key={t.id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 20, boxShadow: 'var(--shadow)', borderTop: '3px solid var(--gold)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
                                <button onClick={() => openEdit(t)} style={iconBtn('var(--info)')}><Edit2 size={13} /></button>
                                <button onClick={() => remove(t.id)} style={iconBtn('var(--danger)')}><Trash2 size={13} /></button>
                            </div>
                            <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                                {Array.from({ length: t.stars }).map((_, i) => <span key={i} style={{ color: 'var(--gold)', fontSize: '0.875rem' }}>★</span>)}
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', fontStyle: 'italic', marginBottom: 14, lineHeight: 1.6 }}>"{t.quote}"</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{t.name.charAt(0)}</div>
                                <div><div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--gray-800)' }}>{t.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>{t.role}</div></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {modal && (
                <Modal title={editing ? 'Edit Testimonial' : 'Add Testimonial'} onClose={() => setModal(false)}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group"><label className="form-label">Name *</label><input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                        <div className="form-group"><label className="form-label">Role</label><input className="form-control" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="Parent of Grade 5 student" /></div>
                    </div>
                    <div className="form-group"><label className="form-label">Quote *</label><textarea className="form-control" rows={4} value={form.quote} onChange={e => setForm(p => ({ ...p, quote: e.target.value }))} style={{ resize: 'vertical' }} /></div>
                    <div className="form-group">
                        <label className="form-label">Stars</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[1, 2, 3, 4, 5].map(n => (
                                <button key={n} type="button" onClick={() => setForm(p => ({ ...p, stars: n }))} style={{ fontSize: '1.5rem', cursor: 'pointer', background: 'none', border: 'none', opacity: n <= form.stars ? 1 : 0.25, transition: 'opacity 0.15s' }}>★</button>
                            ))}
                        </div>
                    </div>
                    <ModalActions saving={saving} onSave={save} onCancel={() => setModal(false)} />
                </Modal>
            )}
        </div>
    )
}

/* ══════════════════════════════════════════════════════════
   TAB — STATS
══════════════════════════════════════════════════════════ */
function StatsTab() {
    const [items, setItems] = useState<Stat[]>([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(false)
    const [editing, setEditing] = useState<Stat | null>(null)
    const [form, setForm] = useState({ number: '', label: '', sort: 0 })
    const [saving, setSaving] = useState(false)

    const fetch = async () => { setLoading(true); const { data } = await supabase.from('site_stats').select('*').order('sort'); setItems(data || []); setLoading(false) }
    useEffect(() => { fetch() }, [])

    const openAdd = () => { setEditing(null); setForm({ number: '', label: '', sort: items.length }); setModal(true) }
    const openEdit = (s: Stat) => { setEditing(s); setForm({ number: s.number, label: s.label, sort: s.sort }); setModal(true) }
    const save = async () => {
        setSaving(true)
        if (editing) await supabase.from('site_stats').update(form).eq('id', editing.id)
        else await supabase.from('site_stats').insert([form])
        setSaving(false); setModal(false); fetch()
    }
    const remove = async (id: string) => { if (!confirm('Delete stat?')) return; await supabase.from('site_stats').delete().eq('id', id); fetch() }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>These show in the hero stats bar on the homepage</span>
                <button className="btn btn-primary" onClick={openAdd}><Plus size={15} /> Add Stat</button>
            </div>
            {loading ? <Spin /> : items.length === 0 ? <Empty text="No stats yet." /> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                    {items.map(s => (
                        <div key={s.id} style={{ background: 'var(--green-deep)', borderRadius: 'var(--radius-lg)', padding: '28px 24px', textAlign: 'center', position: 'relative', boxShadow: 'var(--shadow)' }}>
                            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4 }}>
                                <button onClick={() => openEdit(s)} style={iconBtn('rgba(255,255,255,0.8)', 'rgba(255,255,255,0.1)')}><Edit2 size={12} /></button>
                                <button onClick={() => remove(s.id)} style={iconBtn('#FCA5A5', 'rgba(255,255,255,0.1)')}><Trash2 size={12} /></button>
                            </div>
                            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--gold-light)', lineHeight: 1 }}>{s.number}</div>
                            <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            )}
            {modal && (
                <Modal title={editing ? 'Edit Stat' : 'Add Stat'} onClose={() => setModal(false)}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div className="form-group"><label className="form-label">Number / Value *</label><input className="form-control" value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} placeholder="500+" /></div>
                        <div className="form-group"><label className="form-label">Label *</label><input className="form-control" value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="Students Enrolled" /></div>
                        <div className="form-group"><label className="form-label">Display Order</label><input className="form-control" type="number" value={form.sort} onChange={e => setForm(p => ({ ...p, sort: +e.target.value }))} /></div>
                    </div>
                    <ModalActions saving={saving} onSave={save} onCancel={() => setModal(false)} />
                </Modal>
            )}
        </div>
    )
}

/* ─── Shared helpers ─────────────────────────────────────── */
const iconBtn = (color: string, bg = 'var(--gray-100)'): React.CSSProperties => ({
    width: 28, height: 28, borderRadius: 6, border: 'none', background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color, cursor: 'pointer', flexShrink: 0,
})

function Spin() {
    return <div style={{ padding: 48, textAlign: 'center' }}><Loader size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--gray-400)' }} /></div>
}
function Empty({ text }: { text: string }) {
    return <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-400)', background: 'var(--white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>{text}</div>
}
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--green-deep)' }}>{title}</h3>
                    <button onClick={onClose} style={{ color: 'var(--gray-400)', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                {children}
            </div>
        </div>
    )
}
function ModalActions({ saving, onSave, onCancel }: { saving: boolean; onSave: () => void; onCancel: () => void }) {
    return (
        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button className="btn btn-green" onClick={onSave} disabled={saving}>
                {saving ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Save size={14} /> Save</>}
            </button>
            <button className="btn btn-outline-gold" onClick={onCancel}>Cancel</button>
        </div>
    )
}
