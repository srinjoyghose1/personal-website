import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useBlog, usePages } from '../hooks/useContent';

const GARAMOND = "'Cormorant Garamond', Georgia, serif";
const SANS     = "'DM Sans', system-ui, sans-serif";
const MONO     = "'JetBrains Mono', monospace";

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', h);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.92)',
        zIndex: 500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'zoom-out',
        padding: '2rem',
      }}
    >
      <motion.img
        src={src}
        alt="expanded"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '90vw', maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: 8,
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          cursor: 'default',
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: 20, right: 24,
          width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: '1.2rem',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
        aria-label="Close"
      >
        ×
      </button>
    </motion.div>
  );
}

// ─── Blog grid ────────────────────────────────────────────────────────────────
export default function BlogPage({ isDark }) {
  const [activePost, setActivePost] = useState(null);
  const blogPosts = useBlog();
  const pages     = usePages();

  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted     = isDark ? '#777'    : '#6B6B6B';
  const border    = isDark ? '#2A2A2A' : '#EBEBEB';

  if (activePost) return (
    <BlogPostView post={activePost} isDark={isDark} onBack={() => setActivePost(null)} />
  );

  return (
    <div className="min-h-screen w-full max-w-5xl" style={{ margin: '0 auto', padding: '6rem 2rem', color: textColor }}>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', marginBottom: 56 }}
      >
        <h1 style={{
          fontFamily: "'Space Mono', monospace", fontWeight: 700,
          fontSize: 'clamp(2rem, 5vw, 3.6rem)',
          color: textColor, lineHeight: 1.1, letterSpacing: '-0.02em',
        }}>
          {pages.blog?.heading ?? '/writing'}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop:  `1px solid ${border}`,
          borderLeft: `1px solid ${border}`,
        }}
      >
        {blogPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            onClick={() => setActivePost(post)}
            style={{
              borderRight:  `1px solid ${border}`,
              borderBottom: `1px solid ${border}`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'background 0.15s',
            }}
            whileHover={{ backgroundColor: isDark ? 'rgba(0,191,166,0.04)' : 'rgba(0,191,166,0.03)' }}
          >
            {/* Cover photo strip */}
            {post.photo && (
              <div style={{ height: 140, overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={post.photo}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            <div style={{ padding: '28px 24px 22px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 180 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <h2 style={{
                  fontFamily: SANS, fontWeight: 600,
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.28rem)',
                  color: textColor, lineHeight: 1.35, flex: 1,
                }}>
                  {post.title}
                </h2>
                <span style={{ color: muted, fontSize: '0.85rem', flexShrink: 0, marginTop: 2 }}>↗</span>
              </div>

              <p style={{
                fontFamily: SANS, fontWeight: 300,
                fontSize: '1rem', lineHeight: 1.8,
                color: muted, flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
                {post.excerpt}
              </p>

              <span style={{
                fontFamily: MONO, fontSize: '0.68rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: '#00BFA6',
              }}>
                {post.date}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Post reader ──────────────────────────────────────────────────────────────
function BlogPostView({ post, isDark, onBack }) {
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const openLightbox = useCallback((src) => setLightboxSrc(src), []);

  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted     = isDark ? '#777'    : '#6B6B6B';
  const border    = isDark ? '#2A2A2A' : '#EBEBEB';

  const fullContent = {
    'molecular-logic-markets': `There is a strange isomorphism between the allosteric regulation of enzymes and the feedback mechanisms of financial markets.

Both systems exhibit non-linear responses to input signals. Both have evolved saturation kinetics — the Michaelis-Menten curve finds its analogue in the diminishing returns of capital deployment. And both can be hijacked by competitive inhibitors.

**Allostery and Information Cascades**

In allosteric regulation, binding at one site changes the conformation of the protein at a distant site. In markets, information propagates through networks of correlated assets — a credit event in one corner changes the "conformation" of risk-taking across the system.

The key insight from enzymology: allosteric systems are inherently non-equilibrium. They require continuous energy input to maintain their regulatory states. Markets, similarly, require continuous information input to maintain price discovery.

**What this means for investing**

If you accept the analogy, then finding alpha requires identifying either:

- Mischaracterised substrates (assets the market is pricing as low-value because it lacks the right assay)
- Allosteric effects the market hasn't priced (second-order consequences of known information)
- Competitive inhibitors (structural changes to market microstructure that suppress true price discovery)`,
    'balance-sheet-genome': `A genome is a compressed programme for building a living system. A balance sheet is a compressed programme for understanding a firm's biochemistry.

Both are written in their own syntax. Both reward careful reading. And both hide as much as they reveal.

**The genome problem**

When the first genomes were sequenced, biologists expected to find a relatively transparent map from gene to function. Most of the genome didn't code for anything obvious — large stretches were regulatory, not structural.

Balance sheets have the same architecture. The stated numbers are the coding sequences. The footnotes, the accounting choices, the off-balance-sheet exposures — these are the regulatory sequences.

**Reading regulatory sequences**

- Operating lease commitments: real future obligations not on the face
- Pension obligations: actuarial assumptions that can dramatically shift the liability picture
- Deferred revenue: a liability that represents future earnings already collected
- Goodwill impairment history: a confession that a prior acquisition was overpriced

Understanding this layer is what separates financial analysts from financial readers.`,
  };

  const rawContent = fullContent[post.slug] || post.excerpt;

  // Parse lines — supports **heading**, - list, ![url], plain text
  const renderContent = () => {
    const lines = rawContent.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={i} style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.5rem', color: textColor, marginBottom: 16, marginTop: 40 }}>
            {line.slice(2, -2)}
          </h3>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <div key={i} style={{ fontFamily: SANS, fontWeight: 300, fontSize: '1rem', lineHeight: 1.9, color: muted, paddingLeft: 20, marginBottom: 10, borderLeft: '2px solid rgba(0,191,166,0.35)' }}>
            {line.slice(2)}
          </div>
        );
      }
      // ![url] — inline image
      if (line.startsWith('![') && line.includes('](') && line.endsWith(')')) {
        const src = line.slice(line.indexOf('](') + 2, -1);
        return (
          <ExpandableImage key={i} src={src} onExpand={openLightbox} />
        );
      }
      if (line.trim() === '') {
        return <div key={i} style={{ height: 20 }} />;
      }
      return (
        <p key={i} style={{ fontFamily: SANS, fontWeight: 300, fontSize: '1.05rem', lineHeight: 2, color: textColor, marginBottom: 20 }}>
          {line}
        </p>
      );
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        style={{ minHeight: '100vh', width: '100%', maxWidth: '42rem', margin: '0 auto', padding: '6rem 2rem', color: textColor }}
      >
        <button
          onClick={onBack}
          style={{ fontFamily: MONO, fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: muted, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 48, display: 'block' }}
        >
          ← Writing
        </button>

        <p style={{ fontFamily: MONO, fontSize: '0.62rem', color: 'rgba(0,191,166,0.65)', letterSpacing: '0.12em', marginBottom: 18 }}>
          {post.date}
        </p>
        <h1 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: textColor, lineHeight: 1.2, marginBottom: 40, fontStyle: 'italic' }}>
          {post.title}
        </h1>

        {/* Cover photo */}
        {post.photo && (
          <ExpandableImage src={post.photo} onExpand={openLightbox} style={{ marginBottom: 40 }} />
        )}

        <div style={{ height: 1, background: border, marginBottom: 48 }} />

        <div>{renderContent()}</div>

        {/* External link */}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginTop: 48,
              fontFamily: MONO, fontSize: '0.72rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', textDecoration: 'none',
              color: '#00BFA6', border: '1px solid #00BFA6',
              borderRadius: 6, padding: '10px 18px',
            }}
          >
            Read more ↗
          </a>
        )}
      </motion.div>

      {/* Lightbox */}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
}

// ─── Expandable image ─────────────────────────────────────────────────────────
function ExpandableImage({ src, onExpand, style }) {
  return (
    <div
      style={{ borderRadius: 10, overflow: 'hidden', cursor: 'zoom-in', ...style }}
      onDoubleClick={() => onExpand(src)}
      title="Double-click to expand"
    >
      <img
        src={src}
        alt=""
        style={{ width: '100%', display: 'block', objectFit: 'cover', transition: 'transform 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.015)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      />
    </div>
  );
}
