import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/academics', label: 'Academics' },
  { path: '/admissions', label: 'Admissions' },
  { path: '/facilities', label: 'Facilities' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { settings } = useSiteSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const toggleMobile = () => {
    setMobileOpen(o => {
      document.body.style.overflow = o ? '' : 'hidden'
      return !o
    })
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container flex-between" style={{ height: '100%' }}>
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src={settings.logo_url || '/logo.png'} alt={settings.school_name} className="logo-img" />
            <div>
              <div className="logo-name">{settings.school_name}</div>
              <div className="logo-tagline">Kotharia, Gujarat</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="nav-links">
            {NAV_LINKS.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Admin Login Button */}
          {/* <div className="nav-cta">
            <Link to="/ams/login" className="btn btn-primary btn-sm">
              Admin Login
            </Link>
          </div> */}

          {/* Mobile Toggle */}
          <button className="mobile-toggle" onClick={toggleMobile} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && <div className="mobile-overlay" onClick={toggleMobile} />}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <ul>
          {NAV_LINKS.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                onClick={toggleMobile}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: var(--nav-height);
          z-index: 900;
          transition: all var(--transition);
          background: transparent;
        }
        .navbar.scrolled {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(12px);
          box-shadow: var(--shadow);
        }
        .navbar-logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none;
        }
        .logo-img {
          width: 52px; height: 52px;
          object-fit: contain;
          flex-shrink: 0;
          border-radius: 8px;
          background: rgba(255,255,255,0.92);
          padding: 2px;
        }
        .logo-name {
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.0625rem;
          color: var(--green-deep);
          line-height: 1.2;
          transition: color var(--transition);
        }
        .logo-tagline {
          font-size: 0.6875rem;
          color: var(--gray-400);
          letter-spacing: 0.05em;
        }
        .navbar:not(.scrolled) .logo-name { color: var(--white); }
        .navbar:not(.scrolled) .logo-img { background: rgba(255,255,255,0.15); }
        .nav-links {
          display: flex; gap: 4px;
          list-style: none;
        }
        .nav-link {
          padding: 8px 14px;
          border-radius: var(--radius-full);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-600);
          transition: all var(--transition-fast);
          text-decoration: none;
          white-space: nowrap;
        }
        .navbar:not(.scrolled) .nav-link { color: rgba(255,255,255,0.85); }
        .nav-link:hover, .nav-link.active { color: var(--gold-dark); background: var(--gold-pale); }
        .navbar:not(.scrolled) .nav-link:hover, .navbar:not(.scrolled) .nav-link.active { color: var(--gold-light); background: rgba(255,255,255,0.12); }
        .nav-cta { display: flex; gap: 8px; }
        .mobile-toggle {
          display: none;
          color: var(--green-deep);
          padding: 8px;
          border-radius: var(--radius);
          transition: background var(--transition-fast);
        }
        .navbar:not(.scrolled) .mobile-toggle { color: var(--white); }
        .mobile-toggle:hover { background: var(--gray-100); }
        .mobile-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 850;
          animation: fadeIn 0.2s ease;
        }
        .mobile-menu {
          position: fixed;
          top: 0; right: -300px; bottom: 0;
          width: 280px;
          background: var(--white);
          z-index: 900;
          padding: 80px var(--space-6) var(--space-6);
          overflow-y: auto;
          transition: right var(--transition);
          box-shadow: var(--shadow-lg);
        }
        .mobile-menu.open { right: 0; }
        .mobile-nav-link {
          display: block;
          padding: 12px 16px;
          border-radius: var(--radius);
          font-size: 1rem;
          font-weight: 500;
          color: var(--gray-700);
          transition: all var(--transition-fast);
          text-decoration: none;
          margin-bottom: 4px;
        }
        .mobile-nav-link.active { color: var(--green-deep); background: var(--green-pale); }
        .mobile-nav-link:hover { background: var(--gray-100); }
        @media (max-width: 900px) {
          .nav-links, .nav-cta { display: none; }
          .mobile-toggle { display: flex; }
        }
      `}</style>
    </>
  )
}
