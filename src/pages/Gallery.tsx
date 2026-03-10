import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

interface GalleryItem {
    id: string | number;
    category: string;
    title: string;
    emoji: string;
    bg: string;
    date: string;
    img?: string;
    img_url?: string;
}

const FALLBACK_ITEMS: GalleryItem[] = [
    { id: 1, category: 'academic', title: 'Golden Oak Campus', emoji: '🏫', bg: 'linear-gradient(135deg,#1B4332,#40916C)', date: 'Mar 2026', img: '/gallery-1.png' },
    { id: 2, category: 'cultural', title: 'School Celebration', emoji: '🎉', bg: 'linear-gradient(135deg,#FF6B6B,#FEE140)', date: 'Mar 2026', img: '/gallery-2.jpg' },
    { id: 3, category: 'academic', title: 'Campus Life', emoji: '📚', bg: 'linear-gradient(135deg,#667EEA,#764BA2)', date: 'Mar 2026', img: '/gallery-3.jpg' },
    { id: 4, category: 'sports', title: 'Sports & Events', emoji: '🏅', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', date: 'Mar 2026', img: '/gallery-4.jpg' },
]

const BASE_CATEGORIES = [
    { id: 'all', label: 'All Events' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'sports', label: 'Sports' },
    { id: 'academic', label: 'Academic' },
]

export default function Gallery() {
    const [active, setActive] = useState<string>('all')
    const [selected, setSelected] = useState<GalleryItem | null>(null)
    const [items, setItems] = useState<GalleryItem[]>(FALLBACK_ITEMS)
    const [categories, setCategories] = useState(BASE_CATEGORIES)

    useEffect(() => {
        supabase
            .from('gallery_items')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => {
                if (data && data.length > 0) {
                    const normalized: GalleryItem[] = data.map((g: Record<string, unknown>) => ({ ...g, img: (g.img_url as string) || (g.img as string) } as GalleryItem))
                    setItems(normalized)
                    const cats = Array.from(new Set(normalized.map((g) => g.category)))
                    const dynamicCats = [
                        { id: 'all', label: 'All Events' },
                        ...cats.map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
                    ]
                    setCategories(dynamicCats)
                }
            })
    }, [])

    const filtered = active === 'all' ? items : items.filter(i => i.category === active)

    return (
        <div>
            <section className="page-hero" style={{ background: 'linear-gradient(135deg, var(--green-deep), var(--green-mid))' }}>
                <div className="container" style={{ textAlign: 'center', paddingTop: 'calc(var(--nav-height) + 64px)', paddingBottom: 80 }}>
                    <div className="section-badge" style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold-light)', border: '1px solid rgba(201,168,76,0.25)' }}>Moments &amp; Memories</div>
                    <h1 className="display-lg text-white" style={{ marginTop: '1rem' }}>Our Gallery</h1>
                    <div className="divider-gold" />
                    <p className="body-lg text-white" style={{ opacity: 0.8, maxWidth: 540, marginInline: 'auto' }}>
                        Capturing the spirit of Golden Oak — from academic milestones to memorable celebrations.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Category Filter */}
                    <div className="gallery-filters">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`gallery-filter-btn ${active === cat.id ? 'active' : ''}`}
                                onClick={() => setActive(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="gallery-grid">
                        {filtered.map((item, i) => (
                            <div
                                key={item.id}
                                className="gallery-item animate-fade-up"
                                style={{ animationDelay: `${i * 0.05}s`, background: item.img ? 'transparent' : item.bg }}
                                onClick={() => setSelected(item)}
                            >
                                <div className="gallery-item-inner">
                                    {item.img ? (
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                    ) : (
                                        <div className="gallery-emoji">{item.emoji}</div>
                                    )}
                                    <div className="gallery-overlay">
                                        <div className="gallery-title">{item.title}</div>
                                        <div className="gallery-date">{item.date}</div>
                                        <div className="gallery-category">{item.category}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="lightbox-card" onClick={e => e.stopPropagation()}>
                        {selected.img ? (
                            <img
                                src={selected.img}
                                alt={selected.title}
                                style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 20, display: 'block' }}
                            />
                        ) : (
                            <div style={{ background: selected.bg, borderRadius: 'var(--radius-lg)', padding: '40px 0', textAlign: 'center', marginBottom: 20 }}>
                                <span style={{ fontSize: '5rem' }}>{selected.emoji}</span>
                            </div>
                        )}
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--green-deep)', marginBottom: 6 }}>{selected.title}</h2>
                        <p style={{ color: 'var(--gray-500)', marginBottom: 8, fontSize: '0.9rem' }}>{selected.date}</p>
                        <span style={{ display: 'inline-block', background: 'var(--green-pale)', borderRadius: 'var(--radius-full)', padding: '4px 14px', color: 'var(--green-deep)', fontSize: '0.8125rem', textTransform: 'capitalize', fontWeight: 600 }}>{selected.category}</span>
                        <button onClick={() => setSelected(null)} style={{ display: 'block', margin: '20px auto 0', background: 'var(--green-deep)', color: 'white', border: 'none', padding: '10px 28px', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontWeight: 600 }}>Close</button>
                    </div>
                </div>
            )}

            <style>{`
        .gallery-filters {
          display: flex; flex-wrap: wrap; gap: 10px;
          justify-content: center;
          margin-bottom: 40px;
        }
        .gallery-filter-btn {
          padding: 8px 20px;
          border-radius: var(--radius-full);
          font-size: 0.9rem; font-weight: 500;
          border: 2px solid var(--gray-200);
          color: var(--gray-600);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .gallery-filter-btn:hover { border-color: var(--gold); color: var(--gold-dark); }
        .gallery-filter-btn.active { background: var(--green-deep); color: white; border-color: var(--green-deep); }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .gallery-item {
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: transform var(--transition), box-shadow var(--transition);
          aspect-ratio: 1;
        }
        .gallery-item:nth-child(3n+1) { aspect-ratio: 4/3; }
        .gallery-item:hover { transform: scale(1.02); box-shadow: var(--shadow-lg); }
        .gallery-item-inner {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          position: relative;
          min-height: 180px;
        }
        .gallery-emoji { font-size: 3.5rem; }
        .gallery-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 16px;
          opacity: 0;
          transition: opacity var(--transition);
        }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-title { color: white; font-weight: 700; font-size: 0.9375rem; margin-bottom: 4px; }
        .gallery-date { color: rgba(255,255,255,0.7); font-size: 0.8rem; }
        .gallery-category {
          display: inline-block;
          font-size: 0.75rem;
          background: rgba(255,255,255,0.25);
          color: white;
          padding: 2px 10px;
          border-radius: 999px;
          margin-top: 4px;
          text-transform: capitalize;
        }
        .lightbox-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: 24px;
          max-width: 520px;
          width: 90%;
          animation: fadeInUp 0.3s ease;
          box-shadow: var(--shadow-lg);
        }
        @media (max-width: 900px) {
          .gallery-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
        </div>
    )
}
