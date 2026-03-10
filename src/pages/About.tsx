import { Link } from 'react-router-dom'
import { Eye, Target, Heart, ArrowRight } from 'lucide-react'

const VALUES = [
    { icon: '🌟', title: 'Excellence', desc: 'We pursue the highest standards in academics and personal growth.' },
    { icon: '🤝', title: 'Integrity', desc: 'Honesty, respect, and ethical conduct in everything we do.' },
    { icon: '🌱', title: 'Growth', desc: 'Continuous learning and improvement for students, teachers, and the institution.' },
    { icon: '🤲', title: 'Inclusivity', desc: 'Every child matters. We celebrate diversity and ensure every student feels valued.' },
    { icon: '💡', title: 'Innovation', desc: 'Encouraging curiosity, creativity, and problem-solving for the modern world.' },
    { icon: '🏛️', title: 'Community', desc: 'Building strong partnerships between school, family, and society.' },
]

export default function About() {
    return (
        <div>
            {/* Page Hero */}
            <section className="page-hero" style={{ background: 'linear-gradient(135deg, var(--green-deep) 0%, var(--green-mid) 100%)' }}>
                <div className="container" style={{ textAlign: 'center', paddingTop: 'calc(var(--nav-height) + 64px)', paddingBottom: 80 }}>
                    <div className="section-badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold-light)', border: '1px solid rgba(201,168,76,0.25)' }}>Our Story</div>
                    <h1 className="display-lg text-white" style={{ marginTop: '1rem' }}>About Golden Oak School</h1>
                    <div className="divider-gold" />
                    <p className="body-lg text-white" style={{ opacity: 0.8, maxWidth: 600, marginInline: 'auto' }}>
                        A legacy built on trust, dedication, and the unwavering belief in every child's potential.
                    </p>
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="section">
                <div className="container">
                    <div className="cards-2-col">
                        <div className="vm-card vision">
                            <div className="vm-icon"><Eye size={32} /></div>
                            <h2 className="heading-lg" style={{ color: 'var(--green-deep)', margin: '1rem 0 0.75rem' }}>Our Vision</h2>
                            <div style={{ width: 40, height: 3, background: 'var(--gold)', borderRadius: 999, marginBottom: '1rem' }} />
                            <p className="body-lg" style={{ color: 'var(--gray-600)' }}>
                                To be the leading educational institution in Gujarat that nurtures future leaders, critical thinkers, and compassionate global citizens — rooted in Indian values and ready for the world stage.
                            </p>
                        </div>
                        <div className="vm-card mission">
                            <div className="vm-icon" style={{ background: 'var(--green-pale)', color: 'var(--green-mid)' }}><Target size={32} /></div>
                            <h2 className="heading-lg" style={{ color: 'var(--green-deep)', margin: '1rem 0 0.75rem' }}>Our Mission</h2>
                            <div style={{ width: 40, height: 3, background: 'var(--green-mid)', borderRadius: 999, marginBottom: '1rem' }} />
                            <p className="body-lg" style={{ color: 'var(--gray-600)' }}>
                                To provide exceptional, holistic education that empowers students academically, emotionally, and socially through innovative teaching, a safe environment, and strong community partnerships.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Principal's Message — text only, no name/photo */}
            <section className="section bg-off-white">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Leadership</div>
                        <h2 className="display-md text-green" style={{ marginTop: '0.75rem' }}>Principal's Message</h2>
                        <div className="divider-gold" />
                    </div>
                    <div style={{ maxWidth: 780, margin: '0 auto', background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-10)', boxShadow: 'var(--shadow-md)', borderLeft: '4px solid var(--gold)' }}>
                        <div style={{ color: 'var(--gold)', fontSize: '4rem', fontFamily: 'Georgia', lineHeight: 1, marginBottom: '0.5rem' }}>"</div>
                        <p className="body-lg" style={{ color: 'var(--gray-600)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                            At Golden Oak School, we believe that education is not merely the transfer of knowledge, but the transformation of a young mind. Every child who walks through our doors carries immense potential — our role is to unlock it.
                        </p>
                        <p className="body-md" style={{ color: 'var(--gray-500)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                            Our dedicated team of educators works tirelessly to create an environment where curiosity is celebrated, mistakes are learning opportunities, and every achievement — big or small — is recognized. We partner closely with parents, because we know that the best education happens at the intersection of home and school.
                        </p>
                        <p className="body-md" style={{ color: 'var(--gray-500)', lineHeight: 1.8 }}>
                            I invite you to be part of our golden family. Together, let us shape futures that shine.
                        </p>
                        <div style={{ marginTop: '1.5rem' }}>
                            <Link to="/admissions" className="btn btn-primary">Apply Now <ArrowRight size={16} /></Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* Values */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Core Values</div>
                        <h2 className="display-md text-green" style={{ marginTop: '0.75rem' }}>What We Stand For</h2>
                        <div className="divider-gold" />
                    </div>
                    <div className="grid-3">
                        {VALUES.map((v, i) => (
                            <div key={i} className="value-card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="value-icon">{v.icon}</div>
                                <h3 className="heading-sm" style={{ color: 'var(--green-deep)', marginBottom: '0.5rem' }}>{v.title}</h3>
                                <p className="body-sm text-gray">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ background: 'var(--gold-pale)', padding: '64px 0', borderTop: '3px solid var(--gold)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <Heart size={36} style={{ color: 'var(--gold)', marginBottom: 16 }} />
                    <h2 className="heading-lg text-green" style={{ marginBottom: '0.75rem' }}>Ready to Join Our Family?</h2>
                    <p className="body-lg text-gray" style={{ marginBottom: '2rem', maxWidth: 500, marginInline: 'auto' }}>
                        Begin your child's transformative educational journey at Golden Oak School.
                    </p>
                    <Link to="/admissions" className="btn btn-green btn-lg">Start Application <ArrowRight size={18} /></Link>
                </div>
            </section>

            <style>{`
        .cards-2-col { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        .vm-card {
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          box-shadow: var(--shadow);
          border-top: 4px solid transparent;
        }
        .vision { border-top-color: var(--gold); }
        .mission { border-top-color: var(--green-mid); }
        .vm-icon {
          width: 64px; height: 64px;
          background: var(--gold-pale);
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold-dark);
        }

        .value-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          box-shadow: var(--shadow-sm);
          border: 1.5px solid var(--gray-100);
          transition: all var(--transition);
          text-align: center;
        }
        .value-card:hover { border-color: var(--gold); box-shadow: var(--shadow); transform: translateY(-3px); }
        .value-icon { font-size: 2.5rem; margin-bottom: 16px; }
        @media (max-width: 768px) {
          .cards-2-col { grid-template-columns: 1fr; }

        }
      `}</style>
        </div>
    )
}
