import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'

export default function AMSLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPwd, setShowPwd] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
            if (authError) throw authError

            // Fetch role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user!.id)
                .single()

            const role = profile?.role ?? 'admin'
            navigate(`/ams/${role}`, { replace: true })
        } catch (err: any) {
            setError(err.message || 'Invalid email or password. Please try again.')
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="ams-login-page">
            <div className="ams-login-left">
                <div className="login-branding">
                    <div className="login-logo">
                        <GraduationCap size={36} color="var(--green-deep)" />
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--white)', fontWeight: 800, marginBottom: '1rem' }}>
                        Admin<br />login<br />Portal
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.7 }}>
                        Golden Oak School's secure portal for managing website , school operations.
                    </p>
                    <div className="login-features">
                        {['Admin Dashboard', 'Website Analytics', 'Website Manager',].map(f => (
                            <div key={f} className="login-feature">
                                <div className="login-feature-dot" />
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="ams-login-right">
                <div className="login-card">
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--shadow-gold)' }}>
                            <Lock size={24} color="var(--green-deep)" />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--green-deep)' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--gray-500)', marginTop: 6 }}>Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                <input
                                    className="form-control"
                                    type="email"
                                    required
                                    style={{ paddingLeft: 40 }}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@school.in"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                <input
                                    className="form-control"
                                    type={showPwd ? 'text' : 'password'}
                                    required
                                    style={{ paddingLeft: 40, paddingRight: 44 }}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(s => !s)}
                                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--danger-pale)', color: '#B91C1C', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.875rem' }}>
                                <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: 8 }}>
                            {loading ? 'Signing in...' : 'Sign In to AMS'}
                        </button>
                    </form>




                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8125rem', color: 'var(--gray-400)' }}>
                        <a href="/" style={{ color: 'var(--green-mid)', fontWeight: 500, textDecoration: 'none' }}>← Back to School Website</a>
                    </p>
                </div>
            </div>

            <style>{`
        .ams-login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .ams-login-left {
          background: linear-gradient(135deg, var(--green-deep), var(--green-mid));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 64px 48px;
          position: relative;
          overflow: hidden;
        }
        .ams-login-left::before {
          content: '';
          position: absolute;
          top: -20%; right: -20%;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%);
        }
        .login-branding { position: relative; z-index: 1; }
        .login-logo {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: var(--shadow-gold);
        }
        .login-features { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
        .login-feature {
          display: flex; align-items: center; gap: 12px;
          color: rgba(255,255,255,0.75);
          font-size: 0.9375rem;
        }
        .login-feature-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--gold);
          flex-shrink: 0;
        }
        .ams-login-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background: var(--gray-50);
        }
        .login-card {
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: var(--shadow-lg);
        }
        @media (max-width: 768px) {
          .ams-login-page { grid-template-columns: 1fr; }
          .ams-login-left { display: none; }
          .ams-login-right { padding: 24px 16px; background: linear-gradient(135deg, var(--green-deep), var(--green-mid)); }
          .login-card { max-width: 100%; }
        }
      `}</style>
        </div>
    )
}
