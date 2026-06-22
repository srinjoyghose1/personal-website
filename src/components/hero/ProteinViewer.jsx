import { useEffect, useRef } from 'react';

export default function ProteinViewer({ isDark }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;

    const init = () => {
      if (cancelled) return;
      if (!window.$3Dmol) {
        setTimeout(init, 150);
        return;
      }

      if (viewerRef.current) {
        el.innerHTML = '';
      }

      const bgColor = isDark ? '#0D0D0D' : '#FAFAF8';

      const viewer = window.$3Dmol.createViewer(el, {
        backgroundColor: bgColor,
      });
      viewerRef.current = viewer;

      // Top7 (1QYS) — first computationally de novo designed protein (Baker Lab, 2003)
      window.$3Dmol.download('pdb:1QYS', viewer, {}, () => {
        if (cancelled) return;

        // Full cartoon with spectrum coloring
        viewer.setStyle({}, {
          cartoon: {
            color: 'spectrum',
            thickness: 0.8,
            opacity: 0.9,
          },
        });

        // Accent alpha-helices in teal to pop
        viewer.setStyle({ ss: 'h' }, {
          cartoon: { color: '#00BFA6', thickness: 0.85, opacity: 0.95 },
        });

        viewer.zoomTo();
        viewer.render();
        viewer.spin('y', 0.85);
      });
    };

    init();

    return () => { cancelled = true; };
  }, [isDark]);

  return (
    <>
      <style>{`
        @keyframes protein-float {
          0%   { transform: translate3d(-1.2%, 0.8%, 0) scale(1.03) rotate(-0.4deg); }
          35%  { transform: translate3d(1.1%, -1.4%, 0) scale(1.055) rotate(0.3deg); }
          70%  { transform: translate3d(0.4%, 1.1%, 0) scale(1.035) rotate(0.6deg); }
          100% { transform: translate3d(-1.2%, 0.8%, 0) scale(1.03) rotate(-0.4deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .protein-viewer-motion {
            animation: none !important;
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className="protein-viewer-motion"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformOrigin: '50% 50%',
          animation: 'protein-float 18s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
    </>
  );
}
