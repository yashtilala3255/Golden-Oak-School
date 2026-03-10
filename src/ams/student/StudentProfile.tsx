import { useState, useEffect } from 'react'
import { Eye, EyeOff, Copy, CheckCircle, Loader, AlertCircle, User, Phone, BookOpen, Hash, Shield } from 'lucide-react'
import { getLinkedStudent } from './useStudentData'

interface Student {
    full_name: string; roll_no: string; grade: string; section: string
    parent_name: string; phone: string; email: string; status: string
    portal_email: string | null; portal_password: string | null
}

export default function StudentProfile() {
    const [student, setStudent] = useState<Student | null>(null)
    const [loading, setLoading] = useState(true)
    const [showPass, setShowPass] = useState(false)
    const [copied, setCopied] = useState('')

    useEffect(() => {
        const load = async () => {
            const data = await getLinkedStudent<Student>(
                'full_name, roll_no, grade, section, parent_name, phone, email, status, portal_email, portal_password'
            )
            setStudent(data)
            setLoading(false)
        }
        load()
    }, [])

    const copyText = (text: string, key: string) => {
        navigator.clipboard.writeText(text)
        setCopied(key); setTimeout(() => setCopied(''), 2200)
    }

    if (loading) return (
        <div style={{ padding: 64, textAlign: 'center' }}>
            <Loader size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--green-deep)' }} />
        </div>
    )
    if (!student) return (
        <div style={{ padding: 64, textAlign: 'center', color: 'var(--gray-400)' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p>Your profile is not linked yet. Ask the school admin to link your account.</p>
        </div>
    )

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--green-deep)', fontWeight: 700 }}>My Profile</h1>
                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 4 }}>Your student record — view only</p>
            </div>

            {/* Identity card */}
            <div style={{ background: 'linear-gradient(135deg, var(--green-deep) 0%, var(--green-mid) 100%)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 800, color: 'var(--green-deep)', flexShrink: 0 }}>
                    {student.full_name.charAt(0)}
                </div>
                <div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{student.full_name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginTop: 4 }}>
                        {student.grade} &nbsp;·&nbsp; Section {student.section} &nbsp;·&nbsp; Roll #{student.roll_no}
                    </div>
                    <span style={{ marginTop: 8, display: 'inline-block', background: student.status === 'active' ? 'rgba(74,222,128,0.18)' : 'rgba(248,113,113,0.18)', color: student.status === 'active' ? '#86EFAC' : '#FCA5A5', border: `1px solid ${student.status === 'active' ? 'rgba(74,222,128,0.35)' : 'rgba(248,113,113,0.35)'}`, fontSize: '0.8rem', fontWeight: 700, padding: '3px 12px', borderRadius: 999, textTransform: 'capitalize' }}>
                        {student.status}
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Academic Info */}
                <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--gray-100)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={18} style={{ color: 'var(--green-mid)' }} /></div>
                        <span style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.9375rem' }}>Academic Info</span>
                    </div>
                    {[
                        { label: 'Roll Number', value: `#${student.roll_no}`, icon: <Hash size={15} /> },
                        { label: 'Grade / Class', value: student.grade, icon: <BookOpen size={15} /> },
                        { label: 'Section', value: `Section ${student.section}`, icon: <User size={15} /> },
                        { label: 'Status', value: student.status, icon: <CheckCircle size={15} /> },
                    ].map(({ label, value, icon }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-50)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--gray-500)', fontSize: '0.875rem' }}>{icon} {label}</div>
                            <span style={{ fontWeight: 600, color: 'var(--green-deep)', fontSize: '0.9rem', textTransform: 'capitalize' }}>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Parent/Contact Info */}
                <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--gray-100)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gold-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={18} style={{ color: 'var(--gold-dark)' }} /></div>
                        <span style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.9375rem' }}>Parent / Contact</span>
                    </div>
                    {[
                        { label: 'Parent Name', value: student.parent_name || '—' },
                        { label: 'Phone Number', value: student.phone || '—' },
                        { label: 'Email', value: student.email || '—' },
                    ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--gray-50)' }}>
                            <div style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>{label}</div>
                            <span style={{ fontWeight: 600, color: 'var(--gray-700)', fontSize: '0.875rem' }}>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Portal Credentials */}
                <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 24, boxShadow: 'var(--shadow)', gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--gray-100)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--info-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={18} style={{ color: 'var(--info)' }} /></div>
                        <div>
                            <span style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.9375rem' }}>My Portal Login</span>
                            <div style={{ fontSize: '0.8rem', color: 'var(--gray-400)', marginTop: 1 }}>Your login credentials to this portal — keep these safe</div>
                        </div>
                    </div>

                    {student.portal_email ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {[
                                { label: 'Portal Email (Login ID)', value: student.portal_email, key: 'email', masked: false },
                                { label: 'Password', value: student.portal_password || '', key: 'pass', masked: true },
                            ].map(({ label, value, key, masked }) => (
                                <div key={key}>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={masked && !showPass ? 'password' : 'text'}
                                            value={value}
                                            readOnly
                                            style={{ width: '100%', padding: '10px 80px 10px 14px', borderRadius: 'var(--radius)', border: '1.5px solid var(--gray-200)', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9375rem', background: 'var(--gray-50)', color: 'var(--green-deep)', boxSizing: 'border-box' }}
                                        />
                                        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
                                            {masked && (
                                                <button type="button" onClick={() => setShowPass(p => !p)} style={{ padding: 6, background: 'none', border: 'none', color: 'var(--gray-400)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                                </button>
                                            )}
                                            <button type="button" onClick={() => copyText(value, key)} style={{ padding: 6, background: 'none', border: 'none', color: copied === key ? 'var(--success)' : 'var(--gray-400)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                {copied === key ? <CheckCircle size={15} /> : <Copy size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                            <Shield size={28} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                            <p>Portal account not yet created. Ask your school admin to generate your login.</p>
                        </div>
                    )}

                    <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--green-pale)', borderRadius: 'var(--radius)', fontSize: '0.8125rem', color: 'var(--green-deep)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Shield size={13} /> These credentials are read-only. Contact your school admin to make any changes.
                    </div>
                </div>
            </div>
        </div>
    )
}
