import { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useResearch, usePages } from '../hooks/useContent';

const MONO    = "'JetBrains Mono', monospace";
const SANS    = "'Courier New', Courier, monospace";

function PinCard({ item, isDark }) {
  const [hovered,  setHovered]  = useState(false);
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);

  const rawX    = useMotionValue(0);
  const rawY    = useMotionValue(0);
  const rotateX = useSpring(rawX, { stiffness: 140, damping: 20 });
  const rotateY = useSpring(rawY, { stiffness: 140, damping: 20 });

  const textColor    = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted        = isDark ? '#555'    : '#999';
  const cardBg       = isDark ? 'rgba(16,16,16,0.97)' : 'rgba(250,250,248,0.97)';
  const borderNormal = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)';
  const borderActive = 'rgba(0,191,166,0.32)';
  const shadowHover  = isDark
    ? '0 24px 64px rgba(0,0,0,0.7), 0 0 24px rgba(0,191,166,0.07)'
    : '0 24px 64px rgba(0,0,0,0.13), 0 0 24px rgba(0,191,166,0.09)';

  const handleMouseMove = (e) => {
    if (!cardRef.current || expanded) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    rawX.set(((e.clientY - cy) / (rect.height / 2)) * -9);
    rawY.set(((e.clientX - cx) / (rect.width  / 2)) * 9);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rawX.set(0);
    rawY.set(0);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setExpanded(v => !v);
    rawX.set(0);
    rawY.set(0);
  };

  const links = item.links ?? [];

  return (
    <div
      ref={cardRef}
      style={{ perspective: '900px', paddingTop: 30, position: 'relative' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={handleDoubleClick}
    >
      {/* Glowing pin needle — appears on hover */}
      <AnimatePresence>
        {hovered && !expanded && (
          <motion.div
            key="pin"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              pointerEvents: 'none', zIndex: 20,
            }}
          >
            <div style={{
              width: 9, height: 9, borderRadius: '50%',
              background: '#00BFA6',
              boxShadow: '0 0 16px rgba(0,191,166,0.9), 0 0 5px #00BFA6',
              marginBottom: 3,
            }} />
            <div style={{
              width: 1.5, height: 22,
              background: 'linear-gradient(to bottom, rgba(0,191,166,0.7), transparent)',
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card body */}
      <motion.div
        style={{
          rotateX: expanded ? 0 : rotateX,
          rotateY: expanded ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          borderRadius: 14,
          border: `1px solid ${hovered || expanded ? borderActive : borderNormal}`,
          background: cardBg,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
          cursor: expanded ? 'default' : 'pointer',
          minHeight: 175,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: hovered && !expanded ? shadowHover : 'none',
        }}
        animate={{ scale: expanded ? 1.02 : 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {!expanded ? (
            /* ── Normal face ── */
            <motion.div
              key="normal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              style={{
                padding: '22px 18px 18px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 10, textAlign: 'center', minHeight: 175,
              }}
            >
              <span style={{
                fontFamily: MONO, fontSize: '0.5rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#00BFA6',
              }}>
                {item.category}
              </span>

              <h3 style={{
                fontFamily: SANS, fontWeight: 600, fontSize: '0.92rem',
                color: textColor, lineHeight: 1.4, margin: 0,
                textDecoration: item.published ? 'underline' : 'none',
                textDecorationColor: '#00BFA6',
                textUnderlineOffset: '3px',
                textDecorationThickness: '2px',
              }}>
                {item.title}
              </h3>

              {item.date && (
                <span style={{
                  fontFamily: MONO, fontSize: '0.5rem',
                  letterSpacing: '0.1em', color: muted,
                }}>
                  {item.date}
                </span>
              )}

              {links.length > 0 && (
                <span style={{
                  fontFamily: MONO, fontSize: '0.42rem',
                  letterSpacing: '0.12em',
                  color: isDark ? '#303030' : '#D2D2D2',
                  marginTop: 4,
                }}>
                  double-click to explore
                </span>
              )}
            </motion.div>
          ) : (
            /* ── Links menu ── */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              style={{ padding: '16px 14px', minHeight: 175 }}
            >
              {/* Header row */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 10,
              }}>
                <span style={{
                  fontFamily: MONO, fontSize: '0.5rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: '#00BFA6',
                }}>
                  {item.category}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
                  style={{
                    fontFamily: MONO, fontSize: '0.75rem',
                    color: muted, background: 'none', border: 'none',
                    cursor: 'pointer', padding: '2px 5px', lineHeight: 1,
                    borderRadius: 4, transition: 'color 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = textColor; }}
                  onMouseLeave={e => { e.currentTarget.style.color = muted; }}
                >
                  ×
                </button>
              </div>

              {/* Title */}
              <p style={{
                fontFamily: SANS, fontWeight: 600, fontSize: '0.78rem',
                color: textColor, lineHeight: 1.35, margin: '0 0 13px',
              }}>
                {item.title}
              </p>

              {/* Hairline */}
              <div style={{
                height: 1,
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)',
                marginBottom: 10,
              }} />

              {/* Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontFamily: MONO, fontSize: '0.54rem', letterSpacing: '0.05em',
                      color: isDark ? '#909090' : '#606060',
                      textDecoration: 'none',
                      padding: '6px 9px', borderRadius: 6,
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)',
                      border: '1px solid transparent',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(0,191,166,0.35)';
                      e.currentTarget.style.color = '#00BFA6';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.color = isDark ? '#909090' : '#606060';
                    }}
                  >
                    <span style={{ color: '#00BFA6', fontSize: '0.48rem', flexShrink: 0 }}>↗</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function ResearchPage({ isDark }) {
  const allItems = useResearch();
  const pages    = usePages();
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';

  return (
    <div style={{
      minHeight: '100vh', width: '100%', maxWidth: 980,
      margin: '0 auto', padding: '5rem 24px 120px',
      color: textColor,
    }}>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: "'Space Mono', monospace", fontWeight: 700,
          fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: textColor,
          lineHeight: 1.1, letterSpacing: '-0.02em',
          marginBottom: 52, textAlign: 'center',
        }}
      >
        {pages.research?.heading ?? '/work'}
      </motion.h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 22,
      }}>
        {allItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.42, ease: 'easeOut' }}
          >
            <PinCard item={item} isDark={isDark} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
