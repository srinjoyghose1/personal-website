import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const modes = [
  { id: 'all', accent: '#00BFA6', shape: 'ring', label: 'Full structure' },
  { id: 'helix', accent: '#00BFA6', shape: 'helix', label: 'Alpha helices' },
  { id: 'sheet', accent: '#2563EB', shape: 'sheet', label: 'Beta strands' },
  { id: 'surface', accent: '#14B8A6', shape: 'surface', label: 'Van der Waals surface' },
  { id: 'core', accent: '#F59E0B', shape: 'core', label: 'Dense core' },
];

function clearExtras(viewer) {
  if (viewer.removeAllSurfaces) viewer.removeAllSurfaces();
  if (viewer.removeAllShapes) viewer.removeAllShapes();
}

function addSurface(viewer, selection, color, opacity) {
  viewer.addSurface(window.$3Dmol.SurfaceType.VWS, { color, opacity }, selection);
}

function applyMode(viewer, mode, isDark) {
  if (!viewer || !window.$3Dmol) return;
  clearExtras(viewer);

  const quiet = isDark ? '#222222' : '#D8D8D8';

  viewer.setStyle({}, { cartoon: { color: quiet, thickness: 0.45, opacity: 0.3 } });

  if (mode === 'all') {
    viewer.setStyle({}, { cartoon: { color: 'spectrum', thickness: 0.88, opacity: 0.95 } });
    viewer.setStyle({ ss: 'h' }, { cartoon: { color: '#00BFA6', thickness: 1, opacity: 1 } });
    viewer.setStyle({ ss: 's' }, { cartoon: { color: '#2563EB', thickness: 0.9, opacity: 1 } });
    addSurface(viewer, {}, '#00BFA6', 0.06);
  }

  if (mode === 'helix') {
    viewer.setStyle({ ss: 'h' }, { cartoon: { color: '#00BFA6', thickness: 1.35, opacity: 1 } });
    addSurface(viewer, { ss: 'h' }, '#00BFA6', 0.12);
  }

  if (mode === 'sheet') {
    viewer.setStyle({ ss: 's' }, { cartoon: { color: '#2563EB', thickness: 1.25, opacity: 1 } });
    addSurface(viewer, { ss: 's' }, '#2563EB', 0.12);
  }

  if (mode === 'surface') {
    viewer.setStyle({}, { cartoon: { color: isDark ? '#5C6B6A' : '#7B8C8A', thickness: 0.55, opacity: 0.42 } });
    addSurface(viewer, {}, '#00BFA6', 0.32);
  }

  if (mode === 'core') {
    viewer.setStyle({}, { cartoon: { color: quiet, thickness: 0.38, opacity: 0.18 } });
    viewer.setStyle({ resi: '12-21,32-48,58-72' }, { stick: { colorscheme: 'orangeCarbon', radius: 0.2, opacity: 0.95 } });
    viewer.setStyle({ resi: '12-21,32-48,58-72', ss: 'h' }, { cartoon: { color: '#F59E0B', thickness: 1.05, opacity: 0.85 } });
    addSurface(viewer, { resi: '12-21,32-48,58-72' }, '#F59E0B', 0.16);
  }

  const focusSelection = {
    all: {},
    helix: { ss: 'h' },
    sheet: { ss: 's' },
    surface: {},
    core: { resi: '12-21,32-48,58-72' },
  }[mode] || {};

  viewer.zoomTo(focusSelection);
  viewer.render();
}

function modeFromAtom(atom) {
  if (atom?.ss === 'h') return 'helix';
  if (atom?.ss === 's') return 'sheet';
  if (atom?.resi >= 12 && atom?.resi <= 72) return 'core';
  return 'surface';
}

function ProteinViewerFull({ isDark, activeMode, onPick }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    let cancelled = false;

    const init = () => {
      if (cancelled) return;
      if (!window.$3Dmol) {
        setTimeout(init, 150);
        return;
      }

      if (viewerRef.current) {
        try {
          viewerRef.current.spin(false);
        } catch (error) {
          console.warn(error);
        }
        el.innerHTML = '';
      }

      const viewer = window.$3Dmol.createViewer(el, {
        backgroundColor: isDark ? '#050505' : '#F7F7F4',
      });
      viewerRef.current = viewer;
      readyRef.current = false;

      window.$3Dmol.download('pdb:1QYS', viewer, {}, () => {
        if (cancelled) return;
        readyRef.current = true;
        viewer.setClickable({}, true, (atom) => {
          onPick(modeFromAtom(atom));
        });
        applyMode(viewer, activeMode, isDark);
        viewer.zoomTo();
        viewer.spin('y', 0.42);
        viewer.render();
      });
    };

    init();
    return () => {
      cancelled = true;
      if (viewerRef.current) {
        try {
          viewerRef.current.spin(false);
        } catch (error) {
          console.warn(error);
        }
      }
    };
  }, [isDark, onPick]);

  useEffect(() => {
    if (!readyRef.current) return;
    applyMode(viewerRef.current, activeMode, isDark);
  }, [activeMode, isDark]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

function ModeIcon({ shape, color }) {
  if (shape === 'helix') {
    return (
      <span style={{ width: 24, height: 24, position: 'relative', display: 'block' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            position: 'absolute',
            left: 3 + i * 6,
            top: i % 2 ? 11 : 4,
            width: 8,
            height: 8,
            borderRadius: '50%',
            border: `2px solid ${color}`,
          }} />
        ))}
      </span>
    );
  }

  if (shape === 'sheet') {
    return (
      <span style={{ width: 24, height: 24, display: 'grid', gap: 3, alignContent: 'center' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 22 - i * 3, height: 3, background: color, display: 'block', margin: '0 auto' }} />
        ))}
      </span>
    );
  }

  if (shape === 'surface') {
    return <span style={{ width: 24, height: 24, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0 34%, rgba(0,191,166,0.18) 36% 100%)`, display: 'block' }} />;
  }

  if (shape === 'core') {
    return <span style={{ width: 22, height: 22, borderRadius: 6, background: color, display: 'block', transform: 'rotate(45deg)' }} />;
  }

  return <span style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${color}`, display: 'block' }} />;
}

export default function ProteinDeepDivePage({ isDark }) {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState('all');
  const active = modes.find(mode => mode.id === activeMode) || modes[0];

  return (
    <main
      className="min-h-screen w-full"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: isDark ? '#050505' : '#F7F7F4',
      }}
    >
      <motion.button
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ borderColor: '#00BFA6', color: '#00BFA6' }}
        whileTap={{ scale: 0.96 }}
        aria-label="Home"
        title="Home"
        onClick={() => navigate('/')}
        style={{
          position: 'fixed',
          top: 20,
          left: 22,
          zIndex: 70,
          width: 40,
          height: 40,
          borderRadius: 8,
          border: `1px solid ${isDark ? 'rgba(232,232,232,0.18)' : 'rgba(26,26,26,0.16)'}`,
          background: isDark ? 'rgba(5,5,5,0.64)' : 'rgba(250,250,248,0.72)',
          color: isDark ? '#E8E8E8' : '#1A1A1A',
          cursor: 'pointer',
          fontSize: 26,
          lineHeight: 1,
          backdropFilter: 'blur(10px)',
        }}
      >
        ‹
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ProteinViewerFull
          isDark={isDark}
          activeMode={activeMode}
          onPick={setActiveMode}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.15, 0.35, 0.15], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: '12%',
          borderRadius: '50%',
          border: `1px solid ${active.accent}`,
          boxShadow: `0 0 80px ${active.accent}33`,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45 }}
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 24,
          transform: 'translateX(-50%)',
          zIndex: 80,
          display: 'flex',
          gap: 10,
          padding: 10,
          borderRadius: 10,
          border: `1px solid ${isDark ? 'rgba(232,232,232,0.12)' : 'rgba(26,26,26,0.12)'}`,
          background: isDark ? 'rgba(5,5,5,0.68)' : 'rgba(250,250,248,0.72)',
          backdropFilter: 'blur(14px)',
        }}
      >
        {modes.map(mode => {
          const selected = mode.id === activeMode;
          return (
            <button
              key={mode.id}
              type="button"
              aria-label={mode.label}
              title={mode.label}
              onClick={() => setActiveMode(mode.id)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 8,
                border: `1px solid ${selected ? mode.accent : 'transparent'}`,
                background: selected ? `${mode.accent}1F` : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ModeIcon shape={mode.shape} color={selected ? mode.accent : (isDark ? '#777' : '#777')} />
            </button>
          );
        })}
      </motion.div>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          right: 22,
          top: 22,
          zIndex: 70,
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: `1px solid ${active.accent}`,
          boxShadow: `0 0 30px ${active.accent}55`,
          background: `${active.accent}22`,
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          right: 34,
          top: 34,
          zIndex: 71,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: active.accent,
        }}
      />

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: '32%',
          background: isDark
            ? 'linear-gradient(to top, rgba(5,5,5,0.76), transparent)'
            : 'linear-gradient(to top, rgba(247,247,244,0.76), transparent)',
          pointerEvents: 'none',
        }}
      />
    </main>
  );
}
