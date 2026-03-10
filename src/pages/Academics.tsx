import { useState } from 'react'
import { Book, Star, Music, ChevronRight } from 'lucide-react'

const PROGRAMMES = [
    {
        id: 'playhouse',
        label: 'Playhouse',
        icon: '🎪',
        grades: 'Play Group (Ages 2–3)',
        color: '#e8a020',
        subjects: ['Sensory Play', 'Rhymes & Songs', 'Story Time', 'Gujarati & English Basics', 'Colours & Shapes', 'Drawing & Craft', 'Music & Movement', 'Outdoor Exploration'],
        desc: 'Our Playhouse programme is a joyful, nurturing first step into formal education. Through sensory play, music, rhymes, and stories in both Gujarati & English, we spark a lifelong love for learning in a warm, home-like environment.',
        highlights: ['Gujarati & English bilingual environment', 'Home-like, safe & caring classroom', 'Expert early-childhood educators', 'Sensory & Montessori activities', 'Daily parent updates'],
    },
    {
        id: 'preprimary',
        label: 'Pre-Primary',
        icon: '🌸',
        grades: 'Nursery – KG (Ages 3–6)',
        color: 'var(--gold)',
        subjects: ['Language & Literacy (Gujarati & English)', 'Number Recognition', 'Art & Craft', 'Music & Movement', 'Story Time', 'Outdoor Play', 'Sensory Activities'],
        desc: 'Our Pre-Primary programme lays the foundation for lifelong learning through play-based, activity-driven education in Gujarati & English medium. We nurture curiosity, creativity, social skills, and emotional intelligence in a warm, safe environment.',
        highlights: ['Gujarati & English bilingual instruction', 'Small class sizes (max 20 students)', 'Qualified Montessori-trained teachers', 'Air-conditioned, colourful classrooms',],
    },
    {
        id: 'primary',
        label: 'Primary',
        icon: '📚',
        grades: 'Grade 1 – 5 (Ages 6–11)',
        color: 'var(--green-mid)',
        subjects: ['English', 'Hindi', 'Gujarati', 'Mathematics', 'Environmental Science', 'Computer Basics', 'General Knowledge', 'Art & Craft', 'Physical Education'],
        desc: 'The Primary programme builds strong academic foundations through CBSE-aligned curriculum in Gujarati & English medium. Activity-based teaching methods make learning engaging across all core subjects.',
        highlights: ['CBSE-aligned curriculum', 'Gujarati & English medium', 'Activity-based learning methods', 'Regular formative assessments', 'Science Exploration Labs'],
    },
    {
        id: 'secondary',
        label: 'Secondary',
        icon: '🎓',
        grades: 'Grade 6 – 12 (Ages 11–18)',
        color: 'var(--info)',
        subjects: ['English', 'Hindi / Sanskrit', 'Mathematics', 'Science (Physics, Chemistry, Biology)', 'Social Science', 'Computer Science', 'Gujarati / Third Language'],
        desc: 'Our Secondary programme prepares students comprehensively for board examinations. Dedicated subject experts, regular mock tests, and mentoring ensure confident, well-rounded graduates ready for the next step.',
        highlights: ['CBSE board exam preparation', 'Subject-specialist teachers', 'Regular board exam mock tests', 'Doubt-clearing sessions', 'Career counselling'],
    },
    {
        id: 'activities',
        label: 'Co-Curricular',
        icon: '🎭',
        grades: 'All Grades',
        color: 'var(--danger)',
        subjects: ['Cricket & Football', 'Basketball', 'Yoga & Meditation', 'Classical Dance', 'Theatre & Drama', 'Drawing & Painting', 'Music (Vocal & Instrumental)',],
        desc: 'We believe education extends far beyond textbooks. Our rich co-curricular activities programme develops leadership, teamwork, creativity, and physical health alongside academic excellence.',
        highlights: ['Annual cultural festival', 'Inter-school sports competitions', 'Art exhibitions', 'Science fair participation', 'Community service projects'],
    },
]

export default function Academics() {
    const [active, setActive] = useState('playhouse')
    const prog = PROGRAMMES.find(p => p.id === active)!

    return (
        <div>
            <section className="page-hero" style={{ background: 'linear-gradient(135deg, var(--green-deep) 0%, var(--green-mid) 100%)' }}>
                <div className="container" style={{ textAlign: 'center', paddingTop: 'calc(var(--nav-height) + 64px)', paddingBottom: 80 }}>
                    <div className="section-badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold-light)', border: '1px solid rgba(201,168,76,0.25)' }}>Our Programmes</div>
                    <h1 className="display-lg text-white" style={{ marginTop: '1rem' }}>Academic Excellence</h1>
                    <div className="divider-gold" />
                    <p className="body-lg text-white" style={{ opacity: 0.8, maxWidth: 580, marginInline: 'auto' }}>
                        From Playhouse to Grade 12, we offer Gujarati &amp; English medium education under a premium CBSE-style framework, nurturing every child's full potential.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Tabs */}
                    <div className="programme-tabs">
                        {PROGRAMMES.map(p => (
                            <button
                                key={p.id}
                                className={`programme-tab ${active === p.id ? 'active' : ''}`}
                                style={{ '--tab-color': p.color } as any}
                                onClick={() => setActive(p.id)}
                            >
                                <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                                <span>{p.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="programme-content animate-fade">
                        <div className="programme-info">
                            <div className="overline" style={{ color: prog.color }}>Programme Details</div>
                            <h2 className="display-md text-green" style={{ marginTop: '0.5rem' }}>{prog.label}</h2>
                            <div style={{ display: 'inline-block', background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', padding: '4px 14px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-600)', margin: '12px 0 20px' }}>
                                {prog.grades}
                            </div>
                            <p className="body-lg" style={{ color: 'var(--gray-600)', lineHeight: 1.8 }}>{prog.desc}</p>
                            <div style={{ marginTop: '2rem' }}>
                                <h3 className="heading-sm" style={{ color: 'var(--green-deep)', marginBottom: 16 }}>Programme Highlights</h3>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {prog.highlights.map((h, i) => (
                                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--gray-600)' }}>
                                            <Star size={14} fill={prog.color} color={prog.color} style={{ flexShrink: 0 }} />
                                            <span className="body-md">{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="programme-subjects">
                            <h3 className="heading-sm" style={{ color: 'var(--green-deep)', marginBottom: 20 }}>
                                <Book size={20} style={{ display: 'inline', marginRight: 8, color: prog.color }} />
                                Subjects & Activities
                            </h3>
                            <div className="subjects-grid">
                                {prog.subjects.map((s, i) => (
                                    <div key={i} className="subject-chip" style={{ borderColor: prog.color, color: prog.color }}>
                                        <ChevronRight size={14} /> {s}
                                    </div>
                                ))}
                            </div>
                            <div className="programme-cta-box" style={{ borderColor: prog.color }}>
                                <Music size={24} style={{ color: prog.color, marginBottom: 12 }} />
                                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', color: 'var(--green-deep)', marginBottom: 8 }}>
                                    Interested in Admission?
                                </h4>
                                <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginBottom: 16 }}>
                                    Apply now for 2025–26 academic session. Limited seats available.
                                </p>
                                <a href="/admissions" className="btn btn-primary">Apply for {prog.label}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
        .programme-tabs {
          display: flex; gap: 12px; margin-bottom: 48px;
          border-bottom: 2px solid var(--gray-200);
          padding-bottom: 0;
          overflow-x: auto;
        }
        .programme-tab {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 24px;
          border-radius: var(--radius) var(--radius) 0 0;
          font-weight: 600; font-size: 0.9375rem;
          color: var(--gray-500);
          border: 2px solid transparent;
          border-bottom: none;
          transition: all var(--transition);
          white-space: nowrap;
          cursor: pointer;
        }
        .programme-tab:hover { color: var(--tab-color); background: var(--gray-50); }
        .programme-tab.active {
          color: var(--tab-color);
          background: var(--white);
          border-color: var(--gray-200);
          border-bottom-color: var(--white);
          margin-bottom: -2px;
        }
        .programme-content {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .subjects-grid {
          display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px;
        }
        .subject-chip {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1.5px solid;
          font-size: 0.875rem; font-weight: 500;
          background: transparent;
          transition: all var(--transition-fast);
        }
        .subject-chip:hover { filter: brightness(0.95); }
        .programme-cta-box {
          background: var(--off-white);
          border: 2px dashed;
          border-radius: var(--radius-lg);
          padding: 28px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .programme-content { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    )
}
