import { useState, useEffect, useRef } from 'react'
import { Camera, Save, Lock, User, Mail, CheckCircle, Loader, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

export default function AdminProfile() {
    // Profile state
    const [profile, setProfile] = useState({ full_name: '', avatar_url: '' })
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [savingProfile, setSavingProfile] = useState(false)
    const [savingEmail, setSavingEmail] = useState(false)
    const [savingPwd, setSavingPwd] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Success/error messages
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string; for: string } | null>(null)

    // Password fields
    const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
    const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false })

    const fileRef = useRef<HTMLInputElement>(null)

    // ── Load current user ────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setEmail(user.email ?? '')

            const { data } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .single()
            if (data) setProfile({ full_name: data.full_name ?? '', avatar_url: data.avatar_url ?? '' })
            setLoading(false)
        }
        load()
    }, [])

    const flash = (type: 'success' | 'error', text: string, forSection: string) => {
        setMsg({ type, text, for: forSection })
        setTimeout(() => setMsg(null), 3500)
    }

    // ── Avatar upload ────────────────────────────────────────────
    const handleAvatarUpload = async (file: File) => {
        setUploading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setUploading(false); return }

        const ext = file.name.split('.').pop()
        const path = `avatars/${user.id}.${ext}`
        const { error } = await supabase.storage.from('gallery').upload(path, file, { upsert: true })
        if (error) { flash('error', 'Upload failed: ' + error.message, 'profile'); setUploading(false); return }

        const { data } = supabase.storage.from('gallery').getPublicUrl(path)
        const avatarUrl = data.publicUrl

        await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id)
        setProfile(p => ({ ...p, avatar_url: avatarUrl }))
        flash('success', 'Profile photo updated!', 'profile')
        setUploading(false)
    }

    // ── Save display name ────────────────────────────────────────
    const saveProfile = async () => {
        setSavingProfile(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        const { error } = await supabase.from('profiles').update({ full_name: profile.full_name }).eq('id', user.id)
        setSavingProfile(false)
        flash(error ? 'error' : 'success', error ? error.message : 'Display name updated!', 'profile')
    }

    // ── Update email ─────────────────────────────────────────────
    const saveEmail = async () => {
        if (!email.includes('@')) { flash('error', 'Enter a valid email address.', 'email'); return }
        setSavingEmail(true)
        const { error } = await supabase.auth.updateUser({ email })
        setSavingEmail(false)
        flash(error ? 'error' : 'success', error ? error.message : 'Email updated! Check inbox to confirm.', 'email')
    }

    // ── Change password ──────────────────────────────────────────
    const savePassword = async () => {
        if (pwd.next.length < 6) { flash('error', 'New password must be at least 6 characters.', 'pwd'); return }
        if (pwd.next !== pwd.confirm) { flash('error', 'Passwords do not match.', 'pwd'); return }
        setSavingPwd(true)
        const { error } = await supabase.auth.updateUser({ password: pwd.next })
        setSavingPwd(false)
        if (error) { flash('error', error.message, 'pwd'); return }
        flash('success', 'Password changed successfully!', 'pwd')
        setPwd({ current: '', next: '', confirm: '' })
    }

    const initials = profile.full_name
        ? profile.full_name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : email.charAt(0).toUpperCase()

    if (loading) return (
        <div style={{ padding: 80, textAlign: 'center' }}>
            <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--green-deep)', margin: '0 auto' }} />
        </div>
    )

    return (
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
                <Link to="/ams/admin" style={{ width: 36, height: 36, borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-500)', textDecoration: 'none' }}>
                    <ArrowLeft size={16} />
                </Link>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>My Profile</h1>
                    <p style={{ color: 'var(--gray-400)', fontSize: '0.8125rem', marginTop: 2 }}>Manage your account details and security</p>
                </div>
            </div>

            {/* ── Section 1: Avatar + Display Name ── */}
            <div style={card}>
                <SectionTitle icon={<User size={18} />} title="Profile Information" />

                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--gold)' }} />
                        ) : (
                            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700, border: '3px solid var(--gold)' }}>
                                {initials}
                            </div>
                        )}
                        <button
                            onClick={() => fileRef.current?.click()}
                            disabled={uploading}
                            style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: 'var(--green-deep)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                            title="Change photo"
                        >
                            {uploading ? <Loader size={12} color="white" style={{ animation: 'spin 1s linear infinite' }} /> : <Camera size={12} color="white" />}
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleAvatarUpload(e.target.files[0]) }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 600, color: 'var(--gray-800)', fontSize: '1rem' }}>{profile.full_name || 'Admin User'}</div>
                        <div style={{ color: 'var(--gray-400)', fontSize: '0.8125rem' }}>{email}</div>
                        <button onClick={() => fileRef.current?.click()} style={{ marginTop: 8, fontSize: '0.8125rem', color: 'var(--green-mid)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>
                            Change photo
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Display Name</label>
                    <input className="form-control" value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} placeholder="Your full name" />
                </div>

                {msg?.for === 'profile' && <AlertMsg msg={msg} />}

                <button className="btn btn-green" onClick={saveProfile} disabled={savingProfile}>
                    {savingProfile ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : <><Save size={14} /> Save Profile</>}
                </button>
            </div>

            {/* ── Section 2: Email ── */}
            <div style={{ ...card, marginTop: 20 }}>
                <SectionTitle icon={<Mail size={18} />} title="Email Address" />
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 16 }}>
                    Changing your email will send a confirmation link to the new address.
                </p>
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@goldenoakschool.in" />
                </div>
                {msg?.for === 'email' && <AlertMsg msg={msg} />}
                <button className="btn btn-green" onClick={saveEmail} disabled={savingEmail}>
                    {savingEmail ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Updating...</> : <><Save size={14} /> Update Email</>}
                </button>
            </div>

            {/* ── Section 3: Password ── */}
            <div style={{ ...card, marginTop: 20 }}>
                <SectionTitle icon={<Lock size={18} />} title="Change Password" />
                <p style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', marginBottom: 16 }}>
                    Use a strong password of at least 6 characters.
                </p>

                {(['next', 'confirm'] as const).map(field => (
                    <div className="form-group" key={field}>
                        <label className="form-label">{field === 'next' ? 'New Password' : 'Confirm New Password'}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="form-control"
                                type={showPwd[field] ? 'text' : 'password'}
                                value={pwd[field]}
                                onChange={e => setPwd(p => ({ ...p, [field]: e.target.value }))}
                                placeholder={field === 'next' ? 'New password' : 'Repeat new password'}
                                style={{ paddingRight: 44 }}
                            />
                            <button type="button" onClick={() => setShowPwd(s => ({ ...s, [field]: !s[field] }))}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex' }}>
                                {showPwd[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Strength indicator */}
                {pwd.next.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginBottom: 4 }}>Password strength</div>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {[1, 2, 3, 4].map(i => {
                                const strength = Math.min(4, Math.floor(pwd.next.length / 3) + (pwd.next.match(/[A-Z]/) ? 1 : 0) + (pwd.next.match(/[0-9]/) ? 1 : 0) + (pwd.next.match(/[^A-Za-z0-9]/) ? 1 : 0))
                                const colors = ['#EF4444', '#F59E0B', '#10B981', '#2D6A4F']
                                return <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i <= strength ? colors[strength - 1] : 'var(--gray-200)', transition: 'background 0.25s' }} />
                            })}
                        </div>
                    </div>
                )}

                {msg?.for === 'pwd' && <AlertMsg msg={msg} />}
                <button className="btn btn-green" onClick={savePassword} disabled={savingPwd || pwd.next.length < 1}>
                    {savingPwd ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Changing...</> : <><Lock size={14} /> Change Password</>}
                </button>
            </div>
        </div>
    )
}

/* ── Sub-components ─────────────────────────────────────────── */
const card: React.CSSProperties = {
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px 28px',
    boxShadow: 'var(--shadow)',
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--gray-100)' }}>
            <div style={{ color: 'var(--green-deep)' }}>{icon}</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--green-deep)', fontWeight: 700 }}>{title}</h2>
        </div>
    )
}

function AlertMsg({ msg }: { msg: { type: 'success' | 'error'; text: string } }) {
    const isSuccess = msg.type === 'success'
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius)', marginBottom: 14, background: isSuccess ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${isSuccess ? '#BBF7D0' : '#FECACA'}`, color: isSuccess ? '#166534' : '#B91C1C', fontSize: '0.8125rem', fontWeight: 500 }}>
            <CheckCircle size={15} style={{ flexShrink: 0 }} />
            {msg.text}
        </div>
    )
}
