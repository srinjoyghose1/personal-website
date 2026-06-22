import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NavMenu({ isDark, onToggleDark }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLabel = isHome ? '/' : '\\';
  const navHref  = isHome ? '/all' : '/';
  const navColor = isHome ? '#00BFA6' : '#8B1A1A';

  return (
    <>
      <style>{`
        .admin-dashboard-link {
          opacity: 0.08;
        }

        .admin-dashboard-link:hover,
        .admin-dashboard-link:focus-visible {
          opacity: 0.62;
        }
      `}</style>

      <Link
        to="/admin"
        title="Admin dashboard"
        aria-label="Open admin dashboard"
        className="admin-dashboard-link"
        style={{
          position: 'fixed',
          top: 18,
          left: 18,
          zIndex: 50,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.62rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: isDark ? '#E8E8E8' : '#1A1A1A',
          textDecoration: 'none',
          transition: 'opacity 0.18s ease, color 0.18s ease',
        }}
      >
        admin
      </Link>

      {/* Dark mode toggle — top right */}
      <div className="fixed top-5 right-6 z-50">
        <button
          onClick={onToggleDark}
          title="Toggle dark mode"
          style={{
            background: isDark ? '#1A1A1A' : '#FAFAF8',
            border: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
            color: isDark ? '#E8E8E8' : '#1A1A1A',
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:border-[#00BFA6] transition-all duration-200"
        >
          <AtomIcon isDark={isDark} />
        </button>
      </div>

      {/* Single toggle nav item — delayed on home so it appears after scramble */}
      <nav
        style={{
          position: 'fixed',
          left: 32,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: (isHome && sessionStorage.getItem('hero_seen') !== 'true') ? 2.2 : 0,
            duration: 0.6,
          }}
        >
          <Link
            to={navHref}
            style={{
              display: 'block',
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(1.8rem, 3.8vw, 3.1rem)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1,
              color: navColor,
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            {navLabel}
          </Link>
        </motion.div>
      </nav>
    </>
  );
}

function AtomIcon({ isDark }) {
  if (isDark) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00BFA6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00BFA6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
