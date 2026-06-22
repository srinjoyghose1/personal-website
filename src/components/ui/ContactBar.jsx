import { Link } from 'react-router-dom';
import { contact } from '../../data/profile';

const MONO = "'JetBrains Mono', monospace";

export default function ContactBar({ isDark }) {
  const bg        = isDark ? '#0D0D0D' : '#FAFAF8';
  const textColor = isDark ? '#484848' : '#ADADAD';
  const accent    = '#00BFA6';

  const linkStyle = {
    fontFamily: MONO,
    fontSize: '0.48rem',
    letterSpacing: '0.12em',
    color: textColor,
    textDecoration: 'none',
    transition: 'color 0.15s',
  };

  const sep = (
    <span style={{ color: isDark ? '#222' : '#D8D8D8', fontSize: '0.5rem', userSelect: 'none' }}>·</span>
  );

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 40,
      pointerEvents: 'none',
    }}>
      {/* Gradient fade above bar */}
      <div style={{
        height: 44,
        background: `linear-gradient(to bottom, transparent, ${bg})`,
      }} />

      {/* Bar */}
      <div style={{
        background: bg,
        borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}`,
        padding: '6px 28px 10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'auto',
      }}>

        {/* Left: SG mark */}
        <span style={{
          fontFamily: MONO,
          fontSize: '0.48rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: isDark ? '#222' : '#D8D8D8',
          userSelect: 'none',
        }}>
          SG / {new Date().getFullYear()}
        </span>

        {/* Center: contact info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Status dot */}
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#34D399', flexShrink: 0,
              boxShadow: '0 0 6px rgba(52,211,153,0.6)',
            }} />
            <span style={{
              fontFamily: MONO, fontSize: '0.46rem',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: textColor,
            }}>
              open
            </span>
          </span>

          {sep}

          <a
            href={`mailto:${contact.email}`}
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = textColor; }}
          >
            {contact.email}
          </a>

          {sep}

          <a
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = textColor; }}
          >
            linkedin/SrinjoyGhose
          </a>
        </div>

        {/* Right: near-invisible admin link */}
        <Link
          to="/admin"
          style={{
            fontFamily: MONO,
            fontSize: '0.38rem',
            letterSpacing: '0.15em',
            color: isDark ? '#111' : '#F2F2F2',
            textDecoration: 'none',
          }}
        >
          admin
        </Link>
      </div>
    </div>
  );
}
