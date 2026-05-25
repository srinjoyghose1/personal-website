import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';

const links = [
  { label: '/', href: '/' },
  { label: '/work', href: '/work' },
  { label: '/writing', href: '/blog' },
  { label: '/photos', href: '/photography' },
  { label: '/contact', href: '/contact' },
];

export default function NavMenu({ isDark, onToggleDark }) {
  const location = useLocation();
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';

  return (
    <>
      {/* Dark mode toggle — top right */}
      <div className="fixed top-5 right-6 z-50">
        <button
          onClick={onToggleDark}
          title="Toggle dark mode"
          style={{
            background: isDark ? '#1A1A1A' : '#FAFAFA',
            border: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
            color: isDark ? '#E8E8E8' : '#1A1A1A',
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:border-[#00BFA6] transition-all duration-200"
        >
          <AtomIcon isDark={isDark} />
        </button>
      </div>

      {/* Always-visible left sidebar nav */}
      <nav
        style={{
          position: 'fixed',
          left: 32,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {links.map(link => {
          const active = location.pathname === link.href;
          return (
            <Link
              key={link.href}
              to={link.href}
              style={{
                display: 'block',
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(1rem, 2vw, 1.6rem)',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                lineHeight: 1.65,
                color: active ? '#00BFA6' : textColor,
                opacity: active ? 1 : 0.38,
                textDecoration: 'none',
                transition: 'opacity 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.opacity = '0.75'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.opacity = '0.38'; }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Identity mark — bottom left */}
      <div
        className="fixed bottom-1 left-6 z-50 font-mono text-xs tracking-widest uppercase"
        style={{ color: isDark ? '#444' : '#CCC' }}
      >
        SG / {new Date().getFullYear()}
      </div>
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
