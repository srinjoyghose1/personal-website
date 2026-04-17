import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { photos } from '../data/content';

const categories = ['All', 'Microscopy', 'Scientific', 'Documentary', 'Street', 'Architecture'];

// Placeholder gradient photos
const gradients = [
  'linear-gradient(135deg, #E8FBF8 0%, #B2F5EA 50%, #C6F6F0 100%)',
  'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 50%, #F0F0F0 100%)',
  'linear-gradient(135deg, #EDE9FE 0%, #C7D2FE 50%, #BAE6FD 100%)',
  'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FCA5A5 100%)',
  'linear-gradient(135deg, #F0FDF4 0%, #BBF7D0 50%, #A7F3D0 100%)',
  'linear-gradient(135deg, #EFF6FF 0%, #BFDBFE 50%, #C7D2FE 100%)',
];

const darkGradients = [
  'linear-gradient(135deg, #0D1F1E 0%, #0A2520 50%, #0D1A18 100%)',
  'linear-gradient(135deg, #1A1A1A 0%, #222222 50%, #1A1A1A 100%)',
  'linear-gradient(135deg, #1A1520 0%, #1E1B2E 50%, #0F172A 100%)',
  'linear-gradient(135deg, #1C1A10 0%, #211F0A 50%, #1C0F0F 100%)',
  'linear-gradient(135deg, #0F1A14 0%, #132218 50%, #0A1A10 100%)',
  'linear-gradient(135deg, #0F1422 0%, #131A2E 50%, #151220 100%)',
];

function PhotographyPattern({ index, isDark }) {
  const patterns = [
    // Microscopy grid
    ({ isDark }) => (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(0,191,166,0.2) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />
        {[30, 55, 75, 45].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${20 + i * 18}%`, top: `${25 + i * 12}%`,
            width: size, height: size, borderRadius: '50%',
            border: '1px solid rgba(0,191,166,0.5)',
            transform: 'translate(-50%,-50%)',
          }} />
        ))}
        {[12, 20, 8].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${40 + i * 15}%`, top: `${60 + i * 8}%`,
            width: size, height: size, borderRadius: '50%',
            background: 'rgba(0,191,166,0.3)',
            transform: 'translate(-50%,-50%)',
          }} />
        ))}
      </div>
    ),
    // Grid lines (trading floor)
    ({ isDark }) => (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[20, 40, 60, 80].map(p => (
          <div key={p} style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0, width: 0.5, background: 'rgba(0,191,166,0.15)' }} />
        ))}
        {[25, 50, 75].map(p => (
          <div key={p} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: 0.5, background: 'rgba(0,191,166,0.15)' }} />
        ))}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline points="0,70 20,55 40,60 55,35 70,40 85,25 100,30" fill="none" stroke="rgba(0,191,166,0.5)" strokeWidth="0.8" />
        </svg>
      </div>
    ),
    // Gel bands
    ({ isDark }) => (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, padding: '20px 30px' }}>
        {[0.9, 0.6, 0.85, 0.4, 0.75, 0.55].map((opacity, i) => (
          <div key={i} style={{
            height: `${6 + i * 1.5}px`,
            width: `${40 + Math.random() * 30}%`,
            background: `rgba(0,191,166,${opacity * 0.7})`,
            borderRadius: 2,
            marginLeft: `${10 + i * 3}px`,
          }} />
        ))}
      </div>
    ),
    // Street light streaks
    ({ isDark }) => (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[
          { x1: 30, y1: 0, x2: 40, y2: 100, opacity: 0.4 },
          { x1: 50, y1: 0, x2: 48, y2: 100, opacity: 0.25 },
          { x1: 70, y1: 0, x2: 65, y2: 100, opacity: 0.3 },
          { x1: 15, y1: 0, x2: 20, y2: 100, opacity: 0.2 },
        ].map((l, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${l.x1}%`, top: 0, bottom: 0, width: '1px',
            background: `rgba(255,180,50,${l.opacity})`,
            transform: `skewX(${(l.x2 - l.x1) * 0.5}deg)`,
          }} />
        ))}
        <div style={{
          position: 'absolute', bottom: '20%', left: '25%',
          width: 80, height: 2,
          background: 'rgba(255,150,50,0.3)',
          borderRadius: 1,
        }} />
      </div>
    ),
    // Cell division
    ({ isDark }) => (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 80, height: 40 }}>
          <div style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: 38, height: 38, borderRadius: '50%',
            border: '1.5px solid rgba(0,191,166,0.6)',
            background: 'rgba(0,191,166,0.08)',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            width: 38, height: 38, borderRadius: '50%',
            border: '1.5px solid rgba(0,191,166,0.6)',
            background: 'rgba(0,191,166,0.08)',
          }} />
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 1, height: 38, background: 'rgba(0,191,166,0.4)' }} />
        </div>
      </div>
    ),
    // Architecture lines
    ({ isDark }) => (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="20" y1="0" x2="20" y2="100" stroke="rgba(0,191,166,0.15)" strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(0,191,166,0.15)" strokeWidth="0.5" />
          <line x1="80" y1="0" x2="80" y2="100" stroke="rgba(0,191,166,0.15)" strokeWidth="0.5" />
          <rect x="15" y="30" width="30" height="60" fill="none" stroke="rgba(0,191,166,0.3)" strokeWidth="0.5" />
          <rect x="55" y="20" width="25" height="70" fill="none" stroke="rgba(0,191,166,0.3)" strokeWidth="0.5" />
          {[35, 45, 55, 65, 75, 85].map(y => (
            <line key={y} x1="15" y1={y} x2="45" y2={y} stroke="rgba(0,191,166,0.1)" strokeWidth="0.3" />
          ))}
        </svg>
      </div>
    ),
  ];

  const Pattern = patterns[index % patterns.length];
  return <Pattern isDark={isDark} />;
}

export default function PhotographyPage({ isDark }) {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';

  const filtered = filter === 'All' ? photos : photos.filter(p => p.category === filter);

  return (
    <div className="min-h-screen w-full max-w-5xl mx-auto px-4 sm:px-8 py-20" style={{ color: textColor }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#00BFA6',
          marginBottom: 12,
        }}>
          // specimen.collection
        </p>
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          color: textColor,
          lineHeight: 1.2,
          marginBottom: 16,
        }}>
          Photography
        </h1>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.85rem',
          lineHeight: 1.75,
          color: muted,
          maxWidth: 480,
          marginBottom: 40,
        }}>
          A curated specimen collection. Each image a carefully selected exhibit — from the microscopic to the metropolitan.
        </p>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-12"
      >
        {categories.filter(c => c === 'All' || photos.some(p => p.category === c)).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${filter === cat ? '#00BFA6' : border}`,
              color: filter === cat ? '#00BFA6' : muted,
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 gap-4"
      >
        <AnimatePresence>
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 0 1.5px #00BFA6' }}
              onClick={() => setLightbox(photo)}
              style={{
                borderRadius: 10,
                overflow: 'hidden',
                cursor: 'pointer',
                border: `1px solid ${border}`,
                background: isDark ? darkGradients[i % darkGradients.length] : gradients[i % gradients.length],
                aspectRatio: photo.aspect === 'tall' ? '3/4' : photo.aspect === 'wide' ? '4/3' : '1/1',
                position: 'relative',
                transition: 'box-shadow 0.2s',
              }}
            >
              <PhotographyPattern index={i} isDark={isDark} />

              {/* Overlay on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '16px',
                }}
              >
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: textColor,
                  marginBottom: 4,
                }}>
                  {photo.title}
                </p>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.1em',
                  color: muted,
                }}>
                  {photo.date}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{
                borderRadius: 16,
                overflow: 'hidden',
                maxWidth: 600,
                width: '100%',
                background: isDark ? darkGradients[(lightbox.id - 1) % darkGradients.length] : gradients[(lightbox.id - 1) % gradients.length],
                border: '1px solid rgba(0,191,166,0.4)',
                position: 'relative',
              }}
            >
              <div style={{ aspectRatio: '4/3', position: 'relative' }}>
                <PhotographyPattern index={lightbox.id - 1} isDark={isDark} />
              </div>
              <div style={{
                padding: '20px 24px',
                background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
                borderTop: '1px solid rgba(0,191,166,0.2)',
              }}>
                <p style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: isDark ? '#E8E8E8' : '#1A1A1A',
                  marginBottom: 4,
                }}>
                  {lightbox.title}
                </p>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem',
                  color: muted,
                  letterSpacing: '0.1em',
                }}>
                  {lightbox.date} · {lightbox.location} · {lightbox.category}
                </p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: 'absolute', top: 12, right: 12,
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#FFF', cursor: 'pointer', fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
