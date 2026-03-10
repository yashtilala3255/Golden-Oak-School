const FACILITIES = [
    {
        icon: '🖥️',
        title: 'Smart Classrooms',
        desc: 'Every classroom is equipped with digital whiteboards, projectors, and high-speed internet. Our technology-enabled learning environment makes lessons more engaging, interactive, and effective.',
        features: ['HD Digital Projectors', 'Interactive Whiteboards', 'Internet-connected Devices', 'Audio-Visual Systems', 'Ergonomic Furniture'],
        color: 'var(--info)',
        bg: 'var(--info-pale)',
    },

    {
        icon: '🔬',
        title: 'Science Laboratory',
        desc: 'Fully equipped Physics, Chemistry, and Biology labs with modern instruments and safety protocols, enabling students to explore science through hands-on experiments.',
        features: ['Physics Lab', 'Chemistry Lab', 'Biology Lab', 'Computer Science Lab', 'Safety Equipment'],
        color: 'var(--green-mid)',
        bg: 'var(--green-pale)',
    },
    {
        icon: '⚽',
        title: 'Sports & Playground',
        desc: 'A large outdoor playground with multiple sports areas cultivates physical fitness, teamwork, and healthy competition among all students.',
        features: ['Cricket Ground', 'Football Field', 'Basketball Court', 'Indoor Games Room', 'Yoga & Aerobics Area'],
        color: 'var(--danger)',
        bg: 'var(--danger-pale)',
    },
    {
        icon: '🔒',
        title: 'Safety & Security',
        desc: 'Student safety is our highest priority. The campus is secured with comprehensive surveillance, and strict visitor protocols.',
        features: ['24/7 CCTV Surveillance', 'Medical Room & First Aid'],
        color: 'var(--warning)',
        bg: 'var(--warning-pale)',
    },
    {
        icon: '🎨',
        title: 'Art & Activity Rooms',
        desc: 'Dedicated spaces for visual arts, music, dance, and drama allow students to express their creativity and explore diverse talents beyond academics.',
        features: ['Art Studio', 'Music Room', 'Dance Studio', 'Drama Hall', 'Pottery Corner'],
        color: '#9C27B0',
        bg: '#F3E5F5',
    },
]

export default function Facilities() {
    return (
        <div>
            <section className="page-hero" style={{ background: 'linear-gradient(135deg, var(--green-deep), var(--green-mid))' }}>
                <div className="container" style={{ textAlign: 'center', paddingTop: 'calc(var(--nav-height) + 64px)', paddingBottom: 80 }}>
                    <div className="section-badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold-light)', border: '1px solid rgba(201,168,76,0.25)' }}>World-Class Infrastructure</div>
                    <h1 className="display-lg text-white" style={{ marginTop: '1rem' }}>Our Facilities</h1>
                    <div className="divider-gold" />
                    <p className="body-lg text-white" style={{ opacity: 0.8, maxWidth: 580, marginInline: 'auto' }}>
                        State-of-the-art infrastructure designed to foster learning, creativity, and all-round development.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="facilities-full-grid">
                        {FACILITIES.map((f, i) => (
                            <div key={i} className="facility-card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="facility-icon-wrap" style={{ background: f.bg, color: f.color }}>
                                    <span style={{ fontSize: '2.5rem' }}>{f.icon}</span>
                                </div>
                                <div className="facility-body">
                                    <h3 className="heading-md" style={{ color: 'var(--green-deep)', marginBottom: '0.75rem' }}>{f.title}</h3>
                                    <p className="body-md text-gray" style={{ marginBottom: '1.25rem', lineHeight: 1.75 }}>{f.desc}</p>
                                    <ul className="facility-features">
                                        {f.features.map((feat, j) => (
                                            <li key={j} style={{ color: f.color, border: `1.5px solid ${f.color}20`, background: f.bg }}>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Safety Banner */}
            <section style={{ background: 'linear-gradient(135deg, var(--green-deep), var(--green-mid))', padding: '64px 0' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>🛡️</div>
                    <h2 className="heading-lg text-white" style={{ marginBottom: '1rem' }}>Your Child's Safety is Our Priority</h2>
                    <p className="body-lg text-white" style={{ opacity: 0.8, maxWidth: 560, marginInline: 'auto', marginBottom: '2rem' }}>
                        From CCTV surveillance to trained medical staff, we ensure every student is safe, healthy, and happy on campus.
                    </p>
                    <a href="/contact" className="btn btn-primary btn-lg">Schedule a Campus Visit</a>
                </div>
            </section>

            <style>{`
        .facilities-full-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }
        .facility-card {
          display: flex;
          gap: 24px;
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: 32px;
          box-shadow: var(--shadow);
          border: 1.5px solid var(--gray-100);
          align-items: flex-start;
          transition: all var(--transition);
        }
        .facility-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--gray-200); }
        .facility-icon-wrap {
          width: 72px; height: 72px; flex-shrink: 0;
          border-radius: var(--radius-lg);
          display: flex; align-items: center; justify-content: center;
        }
        .facility-features {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .facility-features li {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8125rem;
          font-weight: 500;
          border: 1.5px solid;
        }
        @media (max-width: 900px) {
          .facilities-full-grid { grid-template-columns: 1fr; }
          .facility-card { flex-direction: column; }
        }
      `}</style>
        </div>
    )
}
