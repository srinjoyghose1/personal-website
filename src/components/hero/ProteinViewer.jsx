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
        try { viewerRef.current.spin(false); } catch (_) {}
        el.innerHTML = '';
      }

      const bgColor = isDark ? '#0D0D0D' : '#FFFFFF';

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
        viewer.spin('y', 0.55);
      });
    };

    init();

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        try { viewerRef.current.spin(false); } catch (_) {}
      }
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    />
  );
}
