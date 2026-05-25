import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResearch, usePages } from '../hooks/useContent';

function ProjectCard({ item, isDark, onClick }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted     = isDark ? '#666'    : '#888';
  const border    = isDark ? '#3A3A3A' : '#B0B0B0';

  return (
    <div
      onClick={onClick}
      style={{
        border: `2px solid ${border}`,
        borderRadius: 6,
        padding: '20px 16px',
        minHeight: 120,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'border-color 0.15s',
      }}
    >
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.55rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: '#00BFA6',
      }}>
        {item.category}
      </span>
      <h3 style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontWeight: 600,
        fontSize: '1rem',
        color: item.published ? textColor : muted,
        lineHeight: 1.3,
        textAlign: 'center',
        margin: 0,
        textDecoration: item.published ? 'underline' : 'none',
        textDecorationColor: '#00BFA6',
        textUnderlineOffset: '4px',
        textDecorationThickness: '2px',
      }}>
        {item.title}
      </h3>
    </div>
  );
}

function DetailDrawer({ item, isDark, onClose }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted     = isDark ? '#777'    : '#555';
  const bg        = isDark ? '#111'    : '#fff';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', h);
    };
  }, [onClose]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(3px)', zIndex: 200 }}
      />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(520px, 92vw)', background: bg, zIndex: 201,
          overflowY: 'auto', display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 48px rgba(0,0,0,0.18)',
        }}
      >
        <button onClick={onClose} style={{
          position: 'sticky', top: 0, alignSelf: 'flex-end',
          margin: '16px 16px 0 0', width: 34, height: 34, borderRadius: '50%',
          border: `1px solid ${isDark ? '#333' : '#E5E5E5'}`, background: bg,
          color: muted, fontSize: '1.1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>
        <div style={{ padding: '0 32px 48px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00BFA6' }}>{item.date}</span>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: textColor, lineHeight: 1.2, fontStyle: 'italic', margin: 0 }}>{item.title}</h2>
          {item.institution && <p style={{ fontFamily: "'DM Sans', system-ui", fontSize: '0.9rem', color: muted, margin: 0 }}>{item.institution}</p>}
          <div style={{ height: 1, background: isDark ? '#222' : '#EBEBEB' }} />
          <p style={{ fontFamily: "'DM Sans', system-ui", fontWeight: 300, fontSize: '1rem', lineHeight: 1.85, color: textColor, margin: 0 }}>{item.abstract}</p>
          {item.findings && <p style={{ fontFamily: "'DM Sans', system-ui", fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.8, color: muted, margin: 0 }}>{item.findings}</p>}
        </div>
      </motion.div>
    </>
  );
}

export default function ResearchPage({ isDark }) {
  const allItems = useResearch();
  const pages    = usePages();
  const [selected, setSelected] = useState(null);

  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';

  return (
    <div style={{ minHeight: '100vh', width: '100%', maxWidth: 960, margin: '0 auto', padding: '5rem 24px', color: textColor }}>
      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: "'Space Mono', monospace", fontWeight: 700,
          fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: textColor,
          lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 36,
          textAlign: 'center',
        }}
      >
        {pages.research?.heading ?? '/work'}
      </motion.h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 16,
      }}>
        {allItems.map(item => (
          <ProjectCard key={item.id} item={item} isDark={isDark} onClick={() => setSelected(item)} />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <DetailDrawer key={selected.id} item={selected} isDark={isDark} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
