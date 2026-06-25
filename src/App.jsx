import { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useDarkMode } from './hooks/useDarkMode';
import NavMenu from './components/nav/NavMenu';
import HomePage from './pages/HomePage';
import EverythingPage from './pages/EverythingPage';
import AboutPage from './pages/AboutPage';
import ProteinDeepDivePage from './pages/ProteinDeepDivePage';
import AdminPage from './pages/AdminPage';

// ─── "click here" hint — lives at root so position:fixed is viewport-relative ──
const HERO_KEY = 'hero_seen';

function ClickHint({ isDark }) {
  const alreadySeen = sessionStorage.getItem(HERO_KEY) === 'true';
  const delay = alreadySeen ? 1.1 : 3.3;
  const color = isDark ? '#C8C8C8' : '#2A2A2A';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.82, 0.82, 0] }}
      exit={{ opacity: 0 }}
      transition={{ delay, duration: 7.5, times: [0, 0.07, 0.72, 1], ease: 'easeInOut' }}
      style={{
        position: 'fixed', left: 20, top: 258,
        zIndex: 52, pointerEvents: 'none', userSelect: 'none',
      }}
    >
      <div style={{
        fontFamily: "'Caveat', cursive",
        fontSize: '1.22rem', fontWeight: 600,
        color, marginLeft: 48, lineHeight: 1.15,
        transform: 'rotate(-5deg)',
      }}>
        click here
      </div>
      <svg width="110" height="148" viewBox="0 0 110 148" style={{ display: 'block', marginTop: 1 }}>
        <motion.path
          d="M 76 10 C 86 44, 64 90, 28 138"
          fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.74 }}
          transition={{ delay: delay + 0.1, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.path
          d="M 28 138 L 17 122"
          fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.74 }}
          transition={{ delay: delay + 0.9, duration: 0.21, ease: 'easeOut' }}
        />
        <motion.path
          d="M 28 138 L 40 129"
          fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.74 }}
          transition={{ delay: delay + 1.08, duration: 0.21, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  );
}

const PageWrapper = ({ children, isDark }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.28, ease: 'easeInOut' }}
    style={{ background: isDark ? '#0D0D0D' : '#FAFAF8', minHeight: '100vh' }}
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
    <div style={{ background: isDark ? '#0D0D0D' : '#FAFAF8', minHeight: '100vh' }}>
      <ScrollProgress />
      <CustomCursor />
      <NavMenu isDark={isDark} onToggleDark={toggle} />

      {/* Hint rendered outside page AnimatePresence — keeps position:fixed in viewport */}
      <AnimatePresence>
        {location.pathname === '/' && <ClickHint key="click-hint" isDark={isDark} />}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageWrapper isDark={isDark}>
              <HomePage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/all" element={
            <PageWrapper isDark={isDark}>
              <EverythingPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/about" element={
            <PageWrapper isDark={isDark}>
              <AboutPage isDark={isDark} />
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
