import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Youtube } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

export default function Footer() {
    const { settings } = useSiteSettings()

    return (
        <footer className="site-footer">
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand */}
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <img src={settings.logo_url || '/logo.png'} alt={settings.school_name} style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8, background: 'rgba(255,255,255,0.12)', padding: 2, flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--gold-light)' }}>{settings.school_name}</div>
                                    <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>Kotharia, Gujarat</div>
                                </div>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginTop: '1.25rem' }}>
                                Nurturing young minds for a golden future. Providing quality education with a commitment to academic excellence and holistic development.
                            </p>
                            <div style={{ display: 'flex', gap: 12, marginTop: '1.25rem' }}>
                                {settings.facebook && (
                                    <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
                                        <Facebook size={18} />
                                    </a>
                                )}
                                {settings.instagram && (
                                    <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                                        <Instagram size={18} />
                                    </a>
                                )}
                                {settings.youtube && (
                                    <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="YouTube">
                                        <Youtube size={18} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="footer-heading">Quick Links</h3>
                            <ul className="footer-links">
                                {[
                                    ['/', 'Home'],
                                    ['/about', 'About Us'],
                                    ['/academics', 'Academics'],
                                    ['/admissions', 'Admissions'],
                                    ['/facilities', 'Facilities'],
                                    ['/gallery', 'Gallery'],
                                    ['/contact', 'Contact'],
                                ].map(([path, label]) => (
                                    <li key={path}>
                                        <Link to={path} className="footer-link">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="footer-heading">Contact</h3>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <li className="footer-contact-item">
                                    <MapPin size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                                    <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                        {settings.address}
                                    </span>
                                </li>
                                <li className="footer-contact-item">
                                    <Phone size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                                    <a href={`tel:+91${settings.phone}`} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', textDecoration: 'none' }}>
                                        {settings.phone}
                                    </a>
                                </li>
                                <li className="footer-contact-item">
                                    <Clock size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                                    <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>{settings.timing}</span>
                                </li>
                                <li className="footer-contact-item">
                                    <Mail size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                                    <a href={`mailto:${settings.email}`} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', textDecoration: 'none' }}>
                                        {settings.email}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Map */}
                        <div>
                            <h3 className="footer-heading">Find Us</h3>
                            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
                                <iframe
                                    src={settings.map_embed}
                                    width="100%"
                                    height="180"
                                    style={{ border: 0, display: 'block' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Golden Oak School Location"
                                />
                            </div>
                            <Link to="/admissions" className="btn btn-primary btn-sm" style={{ marginTop: 16, display: 'inline-flex' }}>
                                Apply for Admission
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem' }}>
                        © {new Date().getFullYear()} {settings.school_name}, Kotharia. All rights reserved.
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8125rem' }}>
                        Website Developed By ❤️ <a href="https://scalexwebsolution.vercel.app/">ScaleXWebSolution</a> 
                    </p>
                </div>
            </div>

            <style>{`
        .site-footer { background: var(--green-deep); }
        .footer-main { padding: 64px 0 48px; }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.8fr 1fr 1fr;
          gap: 48px;
        }
        .footer-logo { display: flex; align-items: center; gap: 12px; }
        .footer-heading {
          font-family: var(--font-serif);
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--gold-light);
          margin-bottom: 20px;
        }
        .footer-links { display: flex; flex-direction: column; gap: 10px; }
        .footer-link {
          color: rgba(255,255,255,0.6);
          font-size: 0.9rem;
          text-decoration: none;
          transition: color var(--transition-fast);
          display: inline-flex; align-items: center; gap: 6px;
        }
        .footer-link:hover { color: var(--gold-light); }
        .footer-link::before { content: '›'; color: var(--gold); }
        .footer-contact-item { display: flex; align-items: flex-start; gap: 10px; }
        .social-icon {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .social-icon:hover { border-color: var(--gold); color: var(--gold); background: rgba(201,168,76,0.1); }
        .footer-bottom {
          background: rgba(0,0,0,0.2);
          padding: 16px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
          .footer-main { padding: 48px 0 36px; }
        }
      `}</style>
        </footer>
    )
}
