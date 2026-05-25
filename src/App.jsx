import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useDarkMode } from './hooks/useDarkMode';
import NavMenu from './components/nav/NavMenu';
import HomePage from './pages/HomePage';
import ResearchPage from './pages/ResearchPage';
import BlogPage from './pages/BlogPage';
import PhotographyPage from './pages/PhotographyPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ProteinDeepDivePage from './pages/ProteinDeepDivePage';
import AdminPage from './pages/AdminPage';

const PageWrapper = ({ children, isDark }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.32, ease: 'easeOut' }}
    style={{
      background: isDark ? '#0D0D0D' : '#FFFFFF',
      minHeight: '100vh',
    }}
  >
    {children}
  </motion.div>
);

function CustomCursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';

    const SIZE_DEFAULT     = 10;
    const SIZE_INTERACTIVE = 22;

    const move = (e) => {
      const interactive = Boolean(
        e.target.closest('a, button, input, textarea, select, [role="button"]')
      );
      const size = interactive ? SIZE_INTERACTIVE : SIZE_DEFAULT;
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      el.style.width     = `${size}px`;
      el.style.height    = `${size}px`;
      el.style.opacity   = '1';
    };

    const hide = () => { el.style.opacity = '0'; };

    window.addEventListener('pointermove',  move, { passive: true });
    window.addEventListener('pointerleave', hide);

    return () => {
      window.removeEventListener('pointermove',  move);
      window.removeEventListener('pointerleave', hide);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'fixed', top: 0, left: 0,
        width: 10, height: 10,
        borderRadius: '50%',
        border: '1.5px solid #00BFA6',
        background: '#00BFA6',
        boxShadow: '0 0 8px rgba(0,191,166,0.5)',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        willChange: 'transform',
        transition: 'width 0.1s, height 0.1s',
      }}
    />
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: '#00BFA6',
        transformOrigin: '0% 50%',
        scaleX,
        zIndex: 9998,
        boxShadow: '0 0 16px rgba(0,191,166,0.45)',
      }}
    />
  );
}

export default function App() {
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();

  return (
    <div style={{ background: isDark ? '#0D0D0D' : '#FFFFFF', minHeight: '100vh' }}>
      <ScrollProgress />
      <CustomCursor />
      <NavMenu isDark={isDark} onToggleDark={toggle} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageWrapper isDark={isDark}>
              <HomePage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/about" element={
            <PageWrapper isDark={isDark}>
              <AboutPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/work" element={
            <PageWrapper isDark={isDark}>
              <ResearchPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/blog" element={
            <PageWrapper isDark={isDark}>
              <BlogPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/photography" element={
            <PageWrapper isDark={isDark}>
              <PhotographyPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/contact" element={
            <PageWrapper isDark={isDark}>
              <ContactPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/protein" element={
            <PageWrapper isDark={isDark}>
              <ProteinDeepDivePage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
