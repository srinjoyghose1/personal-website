import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import RingBinding from './RingBinding';
import Cover from './Cover';
import ContentsPage from './ContentsPage';
import SectionDivider from './SectionDivider';
import ProjectPage from './ProjectPage';
import Colophon from './Colophon';
import '../../styles/flipbook-tokens.css';

// ── Section metadata ───────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'Research',          label: 'Research',          roman: 'I / IV',   colorVar: 'var(--color-section-research)'  },
  { id: 'Projects',          label: 'Projects',          roman: 'II / IV',  colorVar: 'var(--color-section-projects)'  },
  { id: 'Investment Theses', label: 'Investment Theses', roman: 'III / IV', colorVar: 'var(--color-section-theses)'    },
  { id: 'Community',         label: 'Community',         roman: 'IV / IV',  colorVar: 'var(--color-section-community)' },
];

function buildPages(projects) {
  const seq = [
    { type: 'cover' },
    { type: 'contents', projects },
  ];
  for (const sec of SECTIONS) {
    const items = projects.filter(p => p.category === sec.id);
    if (!items.length) continue;
    seq.push({ type: 'section', section: sec });
    items.forEach((project, i) =>
      seq.push({ type: 'project', project, localNum: i + 1 })
    );
  }
  seq.push({ type: 'colophon' });
  return seq;
}

function renderPageContent(page, pageIndex, total) {
  switch (page.type) {
    case 'cover':    return <Cover />;
    case 'contents': return <ContentsPage projects={page.projects} />;
    case 'section':  return <SectionDivider section={page.section} />;
    case 'project':  return <ProjectPage project={page.project} pageNum={pageIndex + 1} totalPages={total} />;
    case 'colophon': return <Colophon />;
    default:         return null;
  }
}

const RING_W  = 56;   // spine column width (px)
const FLIP_MS = 850;
const EASE    = [0.22, 0.61, 0.36, 1];
const CTRL_H  = 44;   // bottom controls bar height (px)

export default function Flipbook({ projects }) {
  const pages    = buildPages(projects);
  const total    = pages.length;
  const timerRef = useRef(null);

  const [current,  setCurrent]  = useState(0);
  const [flipping, setFlipping] = useState(null);
  const [flipDir,  setFlipDir]  = useState(null);
  const [hoverZ,   setHoverZ]   = useState(null);

  const isAnimating = flipping !== null;

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Auto-open cover
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (current === 0 && flipping === null) goForward();
    }, 1100);
    return () => clearTimeout(timerRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goForward = useCallback(() => {
    if (isAnimating || current >= total - 1) return;
    setFlipping(current);
    setFlipDir('forward');
    timerRef.current = setTimeout(() => {
      setCurrent(c => c + 1);
      setFlipping(null);
      setFlipDir(null);
    }, FLIP_MS);
  }, [isAnimating, current, total]);

  const goBackward = useCallback(() => {
    if (isAnimating || current <= 0) return;
    setFlipping(current - 1);
    setFlipDir('backward');
    timerRef.current = setTimeout(() => {
      setCurrent(c => c - 1);
      setFlipping(null);
      setFlipDir(null);
    }, FLIP_MS);
  }, [isAnimating, current]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goForward(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); goBackward(); }
      if (e.key === 'Home' && !isAnimating) { clearTimeout(timerRef.current); setCurrent(0); }
      if (e.key === 'End'  && !isAnimating) { clearTimeout(timerRef.current); setCurrent(total - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goForward, goBackward, isAnimating, total]);

  function getRotation(index) {
    if (index === flipping) return flipDir === 'forward' ? -180 : 0;
    return index < current ? -180 : 0;
  }

  function getZIndex(index) {
    if (index === flipping) return 200;
    if (index === current)  return 150;
    if (index < current)    return 10 + index;
    return 100 - (index - current);
  }

  const progress = ((current + 1) / total) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--color-stage)',
      userSelect: 'none', overflow: 'hidden',
    }}>
      {/* ARIA live region */}
      <div role="status" aria-live="polite" aria-atomic="true"
        style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        {pages[current]?.type === 'project'
          ? `Page: ${pages[current].project.title}`
          : `Page: ${pages[current]?.type}`}
      </div>

      {/* ── Binder — fills viewport minus controls strip ───────────────────── */}
      <div style={{
        position: 'absolute',
        top: 8, left: 8, right: 8,
        bottom: CTRL_H + 8,
        display: 'flex',
        borderRadius: 4,
        boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 12px 32px rgba(0,0,0,0.5)',
        overflow: 'visible',
      }}>
        {/* Back cover depth */}
        <div style={{
          position: 'absolute',
          left: RING_W, right: -6, top: 5, bottom: -5,
          background: 'var(--color-back-cover)',
          borderRadius: '0 4px 4px 0',
          zIndex: 0,
        }} />

        {/* Stacked page edges */}
        {[5,4,3,2,1].map(n => (
          <div key={n} style={{
            position: 'absolute',
            left: RING_W, right: -n * 2, top: n * 0.8, bottom: -n * 0.8,
            background: n % 2 ? 'var(--color-paper-stack)' : 'var(--color-paper-edge)',
            borderRadius: '0 3px 3px 0',
            zIndex: n,
          }} />
        ))}

        {/* ── Ring spine ─────────────────────────────────────────────── */}
        <div style={{
          width: RING_W, flexShrink: 0,
          background: 'linear-gradient(to right, #0E0E0E, #1E1E1E 60%, #181818)',
          borderRadius: '4px 0 0 4px',
          position: 'relative',
          zIndex: 300,
        }}>
          <RingBinding count={7} />
        </div>

        {/* ── Page stack ─────────────────────────────────────────────── */}
        <div style={{
          flex: 1,
          position: 'relative',
          perspective: '2400px',
          perspectiveOrigin: '20% 50%',
          zIndex: 5,
          borderRadius: '0 4px 4px 0',
          overflow: 'visible',
        }}>
          {pages.map((page, index) => {
            const targetRotation = getRotation(index);
            const isFlippingThis = index === flipping;

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{ rotateY: targetRotation }}
                transition={isFlippingThis
                  ? { duration: FLIP_MS / 1000, ease: EASE }
                  : { duration: 0 }}
                style={{
                  position: 'absolute', inset: 0,
                  transformOrigin: '0% 50%',
                  transformStyle: 'preserve-3d',
                  zIndex: getZIndex(index),
                }}
              >
                {/* Front face */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  overflow: 'hidden',
                  borderRadius: '0 4px 4px 0',
                }}>
                  {renderPageContent(page, index, total)}
                </div>

                {/* Back face */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'var(--color-paper-edge)',
                  borderRadius: '0 4px 4px 0',
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(0,0,0,0.025) 28px, rgba(0,0,0,0.025) 29px)',
                }} />

                {/* Mid-flip shadow */}
                {isFlippingThis && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.32, 0] }}
                    transition={{ duration: FLIP_MS / 1000, ease: 'linear' }}
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to right, rgba(0,0,0,0.30), transparent 55%)',
                      borderRadius: '0 4px 4px 0',
                      pointerEvents: 'none',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      zIndex: 10,
                    }}
                  />
                )}
              </motion.div>
            );
          })}

          {/* Right click zone — advance */}
          <div
            onClick={goForward}
            onMouseEnter={() => setHoverZ('right')}
            onMouseLeave={() => setHoverZ(null)}
            role="button" tabIndex={0} aria-label="Next page"
            onKeyDown={e => e.key === 'Enter' && goForward()}
            style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '22%',
              cursor: current < total - 1 ? 'e-resize' : 'default',
              zIndex: 400,
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
              padding: '0 18px',
            }}
          >
            {hoverZ === 'right' && current < total - 1 && !isAnimating && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'rgba(26,26,26,0.18)' }}>›</span>
            )}
          </div>

          {/* Left click zone — retreat */}
          <div
            onClick={goBackward}
            onMouseEnter={() => setHoverZ('left')}
            onMouseLeave={() => setHoverZ(null)}
            role="button" tabIndex={0} aria-label="Previous page"
            onKeyDown={e => e.key === 'Enter' && goBackward()}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '14%',
              cursor: current > 0 ? 'w-resize' : 'default',
              zIndex: 400,
              display: 'flex', alignItems: 'center',
              padding: '0 14px',
            }}
          >
            {hoverZ === 'left' && current > 0 && !isAnimating && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'rgba(26,26,26,0.18)' }}>‹</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Controls bar ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: CTRL_H,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, paddingBottom: 2,
      }}>
        <button onClick={goBackward} disabled={current === 0 || isAnimating}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            background: 'none',
            border: `1px solid ${current > 0 ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.06)'}`,
            color: current > 0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)',
            borderRadius: 3, padding: '5px 14px',
            cursor: current > 0 && !isAnimating ? 'pointer' : 'default',
            transition: 'all 0.15s',
          }}>
          ‹ Prev
        </button>

        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
          letterSpacing: '0.16em', color: 'rgba(255,255,255,0.28)',
          minWidth: 52, textAlign: 'center',
        }}>
          {current + 1} / {total}
        </span>

        <button onClick={goForward} disabled={current >= total - 1 || isAnimating}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            background: 'none',
            border: `1px solid ${current < total - 1 ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.06)'}`,
            color: current < total - 1 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)',
            borderRadius: 3, padding: '5px 14px',
            cursor: current < total - 1 && !isAnimating ? 'pointer' : 'default',
            transition: 'all 0.15s',
          }}>
          Next ›
        </button>

        {/* Keyboard hint */}
        <span style={{
          position: 'absolute', right: 16,
          fontFamily: 'var(--font-mono)', fontSize: '0.42rem',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.12)', pointerEvents: 'none',
        }}>
          ← → keys · click edges
        </span>
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2, background: 'rgba(255,255,255,0.06)',
      }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ height: '100%', background: 'var(--color-cover)' }}
        />
      </div>
    </div>
  );
}
