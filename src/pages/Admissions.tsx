import { useState } from 'react'
import { CheckCircle, FileText, Calendar, Users, AlertCircle, Send } from 'lucide-react'
import { supabase } from '../supabaseClient'

const TIMELINE = [
    { step: 1, title: 'Submit Inquiry', desc: 'Fill out the online inquiry form below or visit the school office.' },
    { step: 2, title: 'School Tour', desc: 'Schedule a campus visit and interact with faculty to learn about our environment.' },
    { step: 3, title: 'Assessment', desc: 'Students attend a brief friendly interaction session with our admissions team.' },
    { step: 4, title: 'Document Submission', desc: 'Submit required documents listed below to the school office.' },
    { step: 5, title: 'Confirmation', desc: 'Receive admission confirmation and fee payment details within 3–5 working days.' },
    { step: 6, title: 'Welcome!', desc: 'Join our golden family! Orientation session before the academic session begins.' },
]

const DOCUMENTS = [
    'Birth Certificate (Original + Photocopy)',
    'Transfer Certificate from previous school (if applicable)',
    'Previous year\'s Report Card',
    'Aadhar Card (Child)',
    'Aadhar Card (Parent/Guardian)',
    'Recent Passport-size Photographs (4 copies)',
    'Residential Proof (Electricity Bill / Ration Card)',
    'Caste Certificate (if applicable)',
]

export default function Admissions() {
    const [form, setForm] = useState({ parent_name: '', student_name: '', grade: '', phone: '', email: '', message: '' })
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

    const GRADES = ['Nursery', 'KG', ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const payload = {
                parent_name: form.parent_name,
                student_name: form.student_name,
                grade_applying: form.grade,
                phone: form.phone,
                email: form.email || null,
                message: form.message || null,
            }
            const { error } = await supabase.from('admission_inquiries').insert([payload])
            if (error) {
                console.error("Insert Error: ", error)
                setStatus('error')
                return
            }
            setStatus('sent')
            setForm({ parent_name: '', student_name: '', grade: '', phone: '', email: '', message: '' })
        } catch (err) {
            console.error("Unknown Error: ", err)
            setStatus('error')
        }
    }

    return (
        <div>
            <section className="page-hero" style={{ background: 'linear-gradient(135deg, var(--green-deep), var(--green-mid))' }}>
                <div className="container" style={{ textAlign: 'center', paddingTop: 'calc(var(--nav-height) + 64px)', paddingBottom: 80 }}>
                    <div className="section-badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold-light)', border: '1px solid rgba(201,168,76,0.25)' }}>Admissions 2025–26</div>
                    <h1 className="display-lg text-white" style={{ marginTop: '1rem' }}>Begin Your Journey</h1>
                    <div className="divider-gold" />
                    <p className="body-lg text-white" style={{ opacity: 0.8, maxWidth: 560, marginInline: 'auto' }}>
                        Enroll your child at Golden Oak School. Simple process, transparent communication, and a warm welcome.
                    </p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', padding: '8px 20px', color: 'var(--gold-light)', fontSize: '0.9rem' }}>
                        <AlertCircle size={16} /> Admissions Open for 2025–26 Session
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">How to Apply</div>
                        <h2 className="display-md text-green" style={{ marginTop: '0.75rem' }}>Admission Process</h2>
                        <div className="divider-gold" />
                    </div>
                    <div className="timeline">
                        {TIMELINE.map((t, i) => (
                            <div key={i} className="timeline-item animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="timeline-step">{t.step}</div>
                                {i < TIMELINE.length - 1 && <div className="timeline-line" />}
                                <div className="timeline-content">
                                    <h3 className="heading-sm" style={{ color: 'var(--green-deep)', marginBottom: 6 }}>{t.title}</h3>
                                    <p className="body-sm text-gray">{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Documents + Form */}
            <section className="section bg-off-white">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'start' }}>
                        {/* Documents */}
                        <div>
                            <div className="section-badge" style={{ marginBottom: 16 }}>Required Documents</div>
                            <h2 className="heading-lg text-green" style={{ marginBottom: 24 }}>
                                <FileText size={24} style={{ display: 'inline', marginRight: 8, color: 'var(--gold)' }} />
                                Documents Checklist
                            </h2>
                            <div className="docs-list">
                                {DOCUMENTS.map((doc, i) => (
                                    <div key={i} className="doc-item">
                                        <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                        <span className="body-md text-gray">{doc}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ background: 'var(--gold-pale)', border: '1.5px solid rgba(201,168,76,0.3)', borderRadius: 'var(--radius-lg)', padding: 20, marginTop: 24 }}>
                                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                    <Calendar size={20} style={{ color: 'var(--gold-dark)', flexShrink: 0, marginTop: 2 }} />
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--green-deep)', marginBottom: 4 }}>Important </div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>

                                            Office hours: Mon–Sat, 9 AM – 7:30 PM
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 20, display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--white)', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
                                <Users size={20} style={{ color: 'var(--green-mid)', flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--green-deep)', marginBottom: 4 }}>Age Criteria</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.7 }}>
                                        Nursery: 3+ years | KG: 4+ years<br />
                                        Grade 1: 5+ years
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inquiry Form */}
                        <div className="card card-body">
                            <h2 className="heading-md text-green" style={{ marginBottom: 6 }}>Online Inquiry Form</h2>
                            <p className="body-sm text-gray" style={{ marginBottom: 24 }}>Fill in your details and we'll get back to you within 24 hours.</p>

                            {status === 'sent' ? (
                                <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                                    <CheckCircle size={56} style={{ color: 'var(--success)', marginBottom: 16 }} />
                                    <h3 className="heading-md text-green" style={{ marginBottom: 8 }}>Inquiry Submitted!</h3>
                                    <p className="body-md text-gray">We'll contact you within 24 hours. Thank you for your interest in Golden Oak School!</p>
                                    <button className="btn btn-green" style={{ marginTop: 20 }} onClick={() => setStatus('idle')}>Submit Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div className="form-group">
                                            <label className="form-label">Parent Name *</label>
                                            <input className="form-control" required value={form.parent_name} onChange={e => setForm(f => ({ ...f, parent_name: e.target.value }))} placeholder="Your full name" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Student Name *</label>
                                            <input className="form-control" required value={form.student_name} onChange={e => setForm(f => ({ ...f, student_name: e.target.value }))} placeholder="Child's full name" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div className="form-group">
                                            <label className="form-label">Grade Applying For *</label>
                                            <select className="form-control" required value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                                                <option value="">Select grade</option>
                                                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone Number *</label>
                                            <input className="form-control" type="tel" required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <input className="form-control" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Message / Questions</label>
                                        <textarea className="form-control" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Any queries about sessions, facilities, fees..." />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'sending'} style={{ marginTop: 8 }}>
                                        {status === 'sending' ? 'Sending...' : <><Send size={18} /> Submit Inquiry</>}
                                    </button>
                                </form>
                            )}
                            {status === 'error' && (
                                <div style={{ marginTop: 16, padding: 12, background: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                                    Failed to submit your inquiry. Please check your connection and try again, or contact us via phone.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        .timeline { display: flex; flex-direction: column; gap: 0; max-width: 700px; margin-inline: auto; }
        .timeline-item { display: flex; gap: 20px; position: relative; }
        .timeline-step {
          width: 48px; height: 48px; flex-shrink: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gold), var(--gold-dark));
          color: var(--green-deep);
          font-weight: 800; font-size: 1.125rem;
          display: flex; align-items: center; justify-content: center;
          box-shadow: var(--shadow-gold);
          position: relative; z-index: 1;
        }
        .timeline-line {
          position: absolute;
          left: 23px; top: 48px;
          width: 2px; height: calc(100% - 0px);
          background: linear-gradient(to bottom, var(--gold), var(--gray-200));
        }
        .timeline-content { padding: 10px 0 36px; flex: 1; }
        .docs-list { display: flex; flex-direction: column; gap: 12px; }
        .doc-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; background: var(--white); border-radius: var(--radius); border: 1.5px solid var(--gray-100); }
        @media (max-width: 768px) {
          .section > .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    )
}
