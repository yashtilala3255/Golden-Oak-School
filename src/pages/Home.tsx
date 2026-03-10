import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star, Users, BookOpen, Award, Shield, Zap, Heart, Leaf, Globe, Phone, MapPin, ArrowRight, Bell } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useSiteSettings } from '../hooks/useSiteSettings'

const WHY_US = [
    { icon: <Award size={28} />, title: 'Academic Excellence', desc: 'Rigorous curriculum aligned with national standards, fostering critical thinking and innovation.' },
    { icon: <Shield size={28} />, title: 'Safe Environment', desc: 'CCTV-monitored campus with trained security staff ensuring complete student safety.' },
    { icon: <Zap size={28} />, title: 'Smart Learning', desc: 'Technology-enabled classrooms with digital boards, labs, and e-learning resources.' },
    { icon: <Heart size={28} />, title: 'Holistic Growth', desc: 'Sports, arts, music, and extracurriculars to nurture every dimension of student potential.' },
    { icon: <Leaf size={28} />, title: 'Green Campus', desc: 'Eco-friendly, landscaped campus that connects students with nature and sustainability.' },
    { icon: <Globe size={28} />, title: 'Global Mindset', desc: 'Multicultural activities, English-medium instruction, and world-ready skill development.' },
]

const ACADEMICS = [
    { level: 'Playhouse', grades: 'Play Group (Ages 2–3)', desc: 'A joyful first step — sensory play, rhymes & stories in Gujarati & English to spark early curiosity.', color: '#fff8e7', border: '#e8a020' },
    { level: 'Pre-Primary', grades: 'Nursery – KG (Ages 3–6)', desc: 'Play-based bilingual learning in Gujarati & English that nurtures creativity and foundational skills.', color: 'var(--gold-pale)', border: 'var(--gold)' },
    { level: 'Primary', grades: 'Grade 1 – 5 (Ages 6–11)', desc: 'CBSE-aligned curriculum with activity-based methods in both Gujarati & English medium.', color: 'var(--green-pale)', border: 'var(--green-mid)' },
    { level: 'Secondary', grades: 'Grade 6 – 12 (Ages 11–18)', desc: 'Comprehensive board exam preparation with dedicated subject mentoring in English medium.', color: 'var(--info-pale)', border: 'var(--info)' },
]

const FACILITIES_PREVIEW = [
    { icon: '🏫', title: 'Smart Classrooms' },
    { icon: '📚', title: 'Library' },
    { icon: '🔬', title: 'Science Lab' },
    { icon: '⚽', title: 'Playground' },
    { icon: '🎨', title: 'Art Studio' },
    { icon: '🏥', title: 'Medical Room' },
]

const FALLBACK_TESTIMONIALS = [
    { name: 'Priya Sharma', role: 'Parent of Grade 5 student', quote: 'Golden Oak School has transformed my child\'s love for learning. The teachers are incredibly dedicated and the environment is truly nurturing.', stars: 5 },
    { name: 'Rakesh Patel', role: 'Parent of Grade 8 student', quote: 'My daughter has grown tremendously in confidence and academics since joining. The holistic approach here is unmatched in the region.', stars: 5 },
    { name: 'Meera Desai', role: 'Parent of Grade 2 student', quote: 'The smart classrooms and modern facilities make learning exciting for my son every day. Best decision we made for his education.', stars: 5 },
]

const FALLBACK_STATS = [
    { number: '500+', label: 'Students Enrolled' },
    { number: '12', label: 'Smart Classrooms' },
    { number: '35+', label: 'Expert Teachers' },
    { number: '98%', label: 'Pass Rate' },
]

export default function Home() {
    const { settings } = useSiteSettings()
    const [announcements, setAnnouncements] = useState<{ id: string; title: string; body: string; category: string }[]>([])
    const [stats, setStats] = useState(FALLBACK_STATS)
    const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS)

    useEffect(() => {
        supabase.from('announcements').select('id, title, body, category').eq('active', true)
            .order('created_at', { ascending: false }).limit(10)
            .then(({ data }) => setAnnouncements(data || []))

        supabase.from('site_stats').select('number, label').order('sort')
            .then(({ data }) => { if (data && data.length > 0) setStats(data) })

        supabase.from('testimonials').select('name, role, quote, stars').order('created_at', { ascending: false })
            .then(({ data }) => { if (data && data.length > 0) setTestimonials(data) })
    }, [])
    return (
        <div>
            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-overlay" />
                    <div className="hero-pattern" />
                </div>
                <div className="container hero-content animate-fade">
                    <div className="section-badge" style={{ background: 'rgba(201,168,76,0.2)', color: 'var(--gold-light)', border: '1px solid rgba(201,168,76,0.3)' }}>
                        ✦ Admissions Open {settings.admission_year}
                    </div>
                    <h1 className="display-xl text-white" style={{ marginTop: '1rem', maxWidth: 720 }}>
                        Nurturing Young Minds<br />
                        <span style={{ color: 'var(--gold-light)' }}>for a Golden Future</span>
                    </h1>
                    <p className="body-lg text-white" style={{ maxWidth: 600, marginTop: '1.5rem', opacity: 0.85 }}>
                        {settings.hero_sub}
                    </p>
                    <div style={{ display: 'flex', gap: 16, marginTop: '2.5rem', flexWrap: 'wrap' }}>
                        <Link to="/admissions" className="btn btn-primary btn-lg">
                            Apply for Admission <ArrowRight size={18} />
                        </Link>
                        <Link to="/contact" className="btn btn-secondary btn-lg">
                            <Phone size={18} /> Contact Us
                        </Link>
                    </div>
                    {/* Quick Info Bar */}
                    <div className="hero-info-bar">
                        <div className="hero-info-item">
                            <MapPin size={16} style={{ color: 'var(--gold-light)' }} />
                            <span>Arjun Park, Kotharia, Gujarat</span>
                        </div>
                        <div className="hero-info-divider" />
                        <div className="hero-info-item">
                            <Phone size={16} style={{ color: 'var(--gold-light)' }} />
                            <a href={`tel:${settings.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{settings.phone}</a>
                        </div>
                        <div className="hero-info-divider" />
                        <div className="hero-info-item">
                            <span style={{ color: 'var(--gold-light)' }}>⏰</span>
                            <span>{settings.timing}</span>
                        </div>
                    </div>
                </div>
                {/* Scroll indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-dot" />
                </div>
            </section>

            {/* ANNOUNCEMENTS TICKER */}
            {announcements.length > 0 && (
                <>
                    <style>{`
                        .announce-wrap { background: var(--green-deep); border-bottom: 2px solid rgba(201,168,76,0.3); display: flex; align-items: stretch; overflow: hidden; }
                        .announce-label { background: var(--gold); color: var(--green-deep); padding: 0 20px; font-weight: 800; font-size: 0.8125rem; display: flex; align-items: center; gap: 7px; flex-shrink: 0; letter-spacing: 0.05em; z-index: 2; }
                        .announce-track-outer { flex: 1; overflow: hidden; position: relative; }
                        .announce-track { display: flex; width: max-content; animation: marquee-slide 25s linear infinite; padding: 11px 0; }
                        .announce-track:hover { animation-play-state: paused; }
                        .announce-item { white-space: nowrap; padding: 0 40px; color: rgba(255,255,255,0.9); font-size: 0.875rem; display: flex; align-items: center; gap: 10px; }
                        .announce-dot { color: var(--gold-light); font-size: 0.625rem; }
                        .announce-badge { background: rgba(201,168,76,0.25); color: var(--gold-light); font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; }
                        @keyframes marquee-slide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                    `}</style>
                    <div className="announce-wrap">
                        <div className="announce-label">
                            <Bell size={13} /> NOTICES
                        </div>
                        <div className="announce-track-outer">
                            <div className="announce-track">
                                {[...announcements, ...announcements].map((a, i) => (
                                    <div key={i} className="announce-item">
                                        <span className="announce-dot">◆</span>
                                        <span className="announce-badge">{a.category}</span>
                                        <span>{a.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* STATS */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-box animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="stat-number-lg">{stat.number}</div>
                                <div className="stat-label-lg">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT PREVIEW */}
            <section className="section">
                <div className="container">
                    <div className="about-preview-grid">
                        <div className="about-image-side">
                            <div className="about-image-block">
                                <div className="about-img-main">
                                    <img
                                        src="/campus.webp"
                                        alt="Golden Oak School Campus"
                                        style={{ width: '100%', height: 380, objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                                <div className="about-img-accent">
                                    <div className="img-placeholder small">
                                        <span style={{ fontSize: '2.5rem' }}>👨‍🏫</span>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 6 }}>Expert Faculty</p>
                                    </div>
                                </div>
                                <div className="about-badge-box">
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--green-deep)', fontFamily: 'var(--font-serif)' }}>{settings.about_years}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 500 }}>{settings.about_badge}</div>
                                </div>
                            </div>
                        </div>
                        <div className="about-text-side">
                            <div className="section-badge">About Golden Oak School</div>
                            <h2 className="display-md text-green" style={{ marginTop: '1rem' }}>
                                A Legacy of<br /><span style={{ color: 'var(--gold)' }}>Academic Excellence</span>
                            </h2>
                            <div className="divider-gold" style={{ marginLeft: 0, marginTop: '1.25rem', marginBottom: '1.25rem' }} />
                            <p className="body-lg" style={{ color: 'var(--gray-600)' }}>
                                {settings.about_short}
                            </p>
                            <p className="body-md" style={{ color: 'var(--gray-500)', marginTop: '1rem' }}>
                                Our dedicated faculty, modern infrastructure, and student-centric approach create an environment where every child thrives and discovers their fullest potential.
                            </p>
                            <div style={{ display: 'flex', gap: 16, marginTop: '2rem', flexWrap: 'wrap' }}>
                                <Link to="/about" className="btn btn-green">Our Story <ChevronRight size={18} /></Link>
                                <Link to="/admissions" className="btn btn-outline-gold">Admissions</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="section bg-off-white">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Why Choose Us</div>
                        <h2 className="display-md text-green" style={{ marginTop: '0.75rem' }}>What Sets Us Apart</h2>
                        <div className="divider-gold" />
                        <p className="body-lg text-gray" style={{ maxWidth: 560, marginInline: 'auto' }}>
                            We go beyond textbooks to provide an education that prepares students for life's greatest challenges.
                        </p>
                    </div>
                    <div className="grid-3">
                        {WHY_US.map((item, i) => (
                            <div key={i} className="card card-body why-card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="why-icon" style={{ color: 'var(--green-mid)' }}>{item.icon}</div>
                                <h3 className="heading-sm" style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--green-deep)' }}>
                                    {item.title}
                                </h3>
                                <p className="body-sm text-gray">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ACADEMICS OVERVIEW */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Academics</div>
                        <h2 className="display-md text-green" style={{ marginTop: '0.75rem' }}>Academic Programmes</h2>
                        <div className="divider-gold" />
                    </div>
                    <div className="academics-grid-4">
                        {ACADEMICS.map((item, i) => (
                            <div key={i} className="academics-card animate-fade-up" style={{ background: item.color, borderTop: `4px solid ${item.border}`, animationDelay: `${i * 0.1}s` }}>
                                <div className="academics-level" style={{ color: item.border }}>{item.level}</div>
                                <div className="academics-grades">{item.grades}</div>
                                <p className="body-sm text-gray">{item.desc}</p>
                                <Link to="/academics" className="learn-more-link" style={{ color: item.border }}>
                                    Learn more <ChevronRight size={14} />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link to="/academics" className="btn btn-green btn-lg">View All Programmes <ArrowRight size={18} /></Link>
                    </div>
                </div>
            </section>

            {/* FACILITIES PREVIEW */}
            <section className="section" style={{ background: 'linear-gradient(135deg, var(--green-deep) 0%, var(--green-mid) 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(201,168,76,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%)' }} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="section-header">
                        <div className="section-badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold-light)', border: '1px solid rgba(201,168,76,0.25)' }}>
                            World-Class Facilities
                        </div>
                        <h2 className="display-md text-white" style={{ marginTop: '0.75rem' }}>Everything a Learner Needs</h2>
                        <div className="divider-gold" />
                    </div>
                    <div className="facilities-grid">
                        {FACILITIES_PREVIEW.map((f, i) => (
                            <div key={i} className="facility-preview-card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                                <div className="facility-preview-icon">{f.icon}</div>
                                <div className="facility-preview-title">{f.title}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                        <Link to="/facilities" className="btn btn-primary btn-lg">Explore Facilities <ArrowRight size={18} /></Link>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="section bg-off-white">
                <div className="container">
                    <div className="section-header">
                        <div className="section-badge">Testimonials</div>
                        <h2 className="display-md text-green" style={{ marginTop: '0.75rem' }}>What Parents Say</h2>
                        <div className="divider-gold" />
                    </div>
                    <div className="grid-3">
                        {testimonials.map((t, i) => (
                            <div key={i} className="testimonial-card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="stars">
                                    {Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={16} fill="var(--gold)" color="var(--gold)" />)}
                                </div>
                                <p className="testimonial-quote">"{t.quote}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{t.name.charAt(0)}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--gray-800)' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--gray-400)' }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA BANNER */}
            <section className="cta-banner">
                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 className="display-md text-white" style={{ marginBottom: '1rem' }}>Begin Your Child's Golden Journey</h2>
                    <p className="body-lg text-white" style={{ opacity: 0.85, marginBottom: '2.5rem' }}>
                        Join our growing family of learners. Admissions are open for 2025–26.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/admissions" className="btn btn-primary btn-lg">Apply Now <ArrowRight size={18} /></Link>
                        <Link to="/contact" className="btn btn-secondary btn-lg">Schedule a Visit</Link>
                    </div>
                </div>
            </section>

            <style>{`
        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0D2B1E 0%, #1B4332 35%, #2D6A4F 70%, #1B4332 100%);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.12) 0%, transparent 60%),
                      radial-gradient(ellipse at 20% 80%, rgba(64,145,108,0.15) 0%, transparent 50%);
        }
        .hero-pattern {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .hero-content {
          padding-top: calc(var(--nav-height) + 48px);
          padding-bottom: 120px;
          position: relative;
          z-index: 1;
        }
        .hero-info-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
        .hero-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
        }
        .hero-info-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.2);
        }
        .scroll-indicator {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          z-index: 2;
        }
        .scroll-dot {
          width: 6px; height: 24px;
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 3px;
          position: relative;
          overflow: hidden;
        }
        .scroll-dot::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px; height: 6px;
          border-radius: 2px;
          background: var(--gold-light);
          animation: scroll-bounce 2s infinite;
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          100% { transform: translateX(-50%) translateY(12px); opacity: 0; }
        }
        /* STATS */
        .stats-section {
          background: var(--white);
          padding: 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--green-deep);
        }
        .stat-box {
          padding: 40px 32px;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.1);
          transition: background var(--transition);
        }
        .stat-box:last-child { border-right: none; }
        .stat-box:hover { background: rgba(255,255,255,0.05); }
        .stat-number-lg {
          font-family: var(--font-serif);
          font-size: 2.75rem;
          font-weight: 800;
          color: var(--gold-light);
          line-height: 1;
        }
        .stat-label-lg {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.6);
          margin-top: 6px;
          font-weight: 500;
        }
        /* ABOUT PREVIEW */
        .about-preview-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .about-image-block {
          position: relative;
        }
        .about-img-main { border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg); }
        .about-img-accent {
          position: absolute;
          bottom: -24px;
          right: -24px;
          width: 160px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          border: 4px solid var(--white);
        }
        .about-badge-box {
          position: absolute;
          top: 24px;
          left: -24px;
          background: var(--gold);
          padding: 16px 20px;
          border-radius: var(--radius-lg);
          text-align: center;
          box-shadow: var(--shadow-gold);
        }
        .img-placeholder {
          background: linear-gradient(135deg, var(--green-pale), var(--gold-pale));
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .img-placeholder.large { height: 380px; }
        .img-placeholder.small { height: 120px; }
        /* WHY US */
        .why-card { border-top: 3px solid var(--gold); text-align: left; }
        .why-icon {
          width: 56px; height: 56px;
          background: var(--green-pale);
          border-radius: var(--radius);
          display: flex; align-items: center; justify-content: center;
        }
        /* ACADEMICS */
        .academics-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .academics-card {
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          transition: transform var(--transition), box-shadow var(--transition);
        }
        .academics-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .academics-level {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1.2;
        }
        .academics-grades {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--gray-500);
          margin: 4px 0 12px;
          letter-spacing: 0.04em;
        }
        .learn-more-link {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.875rem; font-weight: 600;
          margin-top: 16px;
          text-decoration: none;
          transition: gap var(--transition-fast);
        }
        .learn-more-link:hover { gap: 8px; }
        /* FACILITIES */
        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
        }
        .facility-preview-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg);
          padding: 28px 16px;
          text-align: center;
          transition: all var(--transition);
          cursor: pointer;
        }
        .facility-preview-card:hover {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.3);
          transform: translateY(-4px);
        }
        .facility-preview-icon { font-size: 2.25rem; margin-bottom: 12px; }
        .facility-preview-title { color: rgba(255,255,255,0.8); font-size: 0.875rem; font-weight: 500; }
        /* TESTIMONIALS */
        .testimonial-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: var(--space-8);
          box-shadow: var(--shadow);
          position: relative;
          border-top: 3px solid var(--gold);
          transition: transform var(--transition), box-shadow var(--transition);
        }
        .testimonial-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .stars { display: flex; gap: 3px; margin-bottom: 16px; }
        .testimonial-quote {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--gray-600);
          font-style: italic;
          margin-bottom: 24px;
        }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .author-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--green-mid), var(--green-deep));
          color: white;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 1.125rem;
          flex-shrink: 0;
        }
        /* CTA BANNER */
        .cta-banner {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--green-deep), var(--green-mid));
          position: relative;
          overflow: hidden;
        }
        .cta-banner::before {
          content: '';
          position: absolute;
          top: -50%; right: -20%;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 1024px) {
          .facilities-grid { grid-template-columns: repeat(3, 1fr); }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .stat-box:nth-child(2) { border-right: none; }
          .academics-grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .about-preview-grid { grid-template-columns: 1fr; gap: 48px; }
          .about-image-block { order: -1; }
          .about-img-accent { width: 120px; bottom: -16px; right: -16px; }
          .about-badge-box { top: 16px; left: -16px; }
          .facilities-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .academics-grid-4 { grid-template-columns: 1fr 1fr; }
          .hero-info-bar { gap: 12px; }
          .hero-info-divider { display: none; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .stat-box { padding: 24px 16px; }
          .facilities-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .academics-grid-4 { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    )
}
