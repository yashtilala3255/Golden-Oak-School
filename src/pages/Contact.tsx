import { useState } from 'react'
import { MapPin, Phone, Clock, Mail, Send, CheckCircle } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useSiteSettings } from '../hooks/useSiteSettings'

export default function Contact() {
    const { settings } = useSiteSettings()
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const payload = {
                name: form.name,
                email: form.email,
                phone: form.phone || null,
                subject: form.subject,
                message: form.message
            }
            const { error } = await supabase.from('contact_messages').insert([payload])
            if (error) {
                console.error("Insert Error: ", error)
                setStatus('error')
                return
            }
            setStatus('sent')
            setForm({ name: '', email: '', phone: '', subject: '', message: '' })
        } catch (err) {
            console.error("Unknown Error: ", err)
            setStatus('error')
        }
    }

    return (
        <div>
            <section className="page-hero" style={{ background: 'linear-gradient(135deg, var(--green-deep), var(--green-mid))' }}>
                <div className="container" style={{ textAlign: 'center', paddingTop: 'calc(var(--nav-height) + 64px)', paddingBottom: 80 }}>
                    <div className="section-badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold-light)', border: '1px solid rgba(201,168,76,0.25)' }}>Get in Touch</div>
                    <h1 className="display-lg text-white" style={{ marginTop: '1rem' }}>Contact Us</h1>
                    <div className="divider-gold" />
                    <p className="body-lg text-white" style={{ opacity: 0.8, maxWidth: 540, marginInline: 'auto' }}>
                        We'd love to hear from you. Reach out to us for admissions, queries, or to schedule a school visit.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'start' }}>
                        {/* Info */}
                        <div>
                            <h2 className="heading-lg text-green" style={{ marginBottom: 32 }}>Our Information</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {[
                                    { icon: <MapPin size={22} />, title: 'Address', value: settings.address, link: 'https://maps.google.com/?q=Golden+Oak+School+Kotharia+Gujarat' },
                                    { icon: <Phone size={22} />, title: 'Phone', value: settings.phone, link: `tel:${settings.phone}` },
                                    { icon: <Clock size={22} />, title: 'Office Hours', value: settings.timing, link: null },
                                    { icon: <Mail size={22} />, title: 'Email', value: settings.email, link: `mailto:${settings.email}` },
                                ].map((item, i) => (
                                    <div key={i} className="contact-info-item">
                                        <div className="contact-info-icon">{item.icon}</div>
                                        <div>
                                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--gray-400)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{item.title}</div>
                                            {item.link
                                                ? <a href={item.link} style={{ color: 'var(--gray-700)', textDecoration: 'none', fontWeight: 500, whiteSpace: 'pre-line' }}>{item.value}</a>
                                                : <span style={{ color: 'var(--gray-700)', fontWeight: 500, whiteSpace: 'pre-line' }}>{item.value}</span>
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Google Map */}
                            <div style={{ marginTop: 32, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '2px solid var(--gray-200)', boxShadow: 'var(--shadow)' }}>
                                <iframe
                                    src={settings.map_embed}
                                    width="100%"
                                    height="260"
                                    style={{ border: 0, display: 'block' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Golden Oak School Location"
                                />
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <a
                                    href="https://maps.google.com/?q=6RV6+5P+Kotharia+Gujarat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-gold"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                >
                                    <MapPin size={16} /> Open in Google Maps
                                </a>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="card card-body">
                            <h2 className="heading-md text-green" style={{ marginBottom: 6 }}>Send Us a Message</h2>
                            <p className="body-sm text-gray" style={{ marginBottom: 28 }}>We typically respond within 24 hours on working days.</p>

                            {status === 'sent' ? (
                                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                                    <CheckCircle size={56} style={{ color: 'var(--success)', marginBottom: 16 }} />
                                    <h3 className="heading-md text-green" style={{ marginBottom: 8 }}>Message Received!</h3>
                                    <p className="body-md text-gray">Thank you for reaching out. We'll get back to you soon.</p>
                                    <button className="btn btn-green" style={{ marginTop: 20 }} onClick={() => setStatus('idle')}>Send Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div className="form-group">
                                            <label className="form-label">Full Name *</label>
                                            <input className="form-control" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone Number</label>
                                            <input className="form-control" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address *</label>
                                        <input className="form-control" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Subject *</label>
                                        <select className="form-control" required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                                            <option value="">Select subject</option>
                                            <option>Admission Inquiry</option>
                                            <option>Fee Structure</option>
                                            <option>Campus Visit</option>
                                            <option>Academics</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Message *</label>
                                        <textarea className="form-control" required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Write your message here..." />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'sending'}>
                                        {status === 'sending' ? 'Sending...' : <><Send size={18} /> Send Message</>}
                                    </button>
                                </form>
                            )}
                            {status === 'error' && (
                                <div style={{ marginTop: 16, padding: 12, background: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                                    Failed to send your message. Please check your connection and try again, or contact us via phone.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        .contact-info-item {
          display: flex; align-items: flex-start; gap: 16px;
          background: var(--white);
          border: 1.5px solid var(--gray-100);
          border-radius: var(--radius-lg);
          padding: 20px;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .contact-info-item:hover { border-color: var(--gold); box-shadow: var(--shadow-sm); }
        .contact-info-icon {
          width: 44px; height: 44px; flex-shrink: 0;
          background: var(--gold-pale);
          border-radius: var(--radius);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold-dark);
        }
        @media (max-width: 768px) {
          .section > .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    )
}
