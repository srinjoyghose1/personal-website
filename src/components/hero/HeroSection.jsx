import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import anime from 'animejs';
import ProteinViewer from './ProteinViewer';
import ParticleField from './ParticleField';
import { meta, hero } from '../../data/profile';

const BPM = hero.bpm;
const BEAT_MS = (60 / BPM) * 1000;
const BEATS_PER_LOOP = 10;
const PERIOD_PX = 140;
const LOOP_PX = BEATS_PER_LOOP * PERIOD_PX;
const LOOP_MS = BEATS_PER_LOOP * BEAT_MS;

function buildAPPath(width = 4000, period = PERIOD_PX) {
  const segs = ['M0,28'];
  for (let i = 0; i < Math.ceil(width / period) + 1; i++) {
    const x = i * period;
    segs.push(
      `L${x + 20},28`, `L${x + 24},26`, `L${x + 27},4`,
      `L${x + 31},36`, `L${x + 37},32`, `L${x + 46},28`,
      `L${x + period},28`
    );
  }
  return segs.join(' ');
}
const AP_PATH = buildAPPath();

// ─── Intro overlay — always mounted, slides up/down ──────────────────────────
function IntroOverlay({ isDark, visible, onGoToHero }) {
  const lettersRef    = useRef(null);
  const lineRef       = useRef(null);
  const animatedRef   = useRef(false); // entrance runs once
  const triggeringRef = useRef(false); // prevents double-fire

  const bioControls  = useAnimation();
  const hintControls = useAnimation();

  const heroName  = meta.name.toUpperCase();
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const bg        = isDark ? '#0D0D0D' : '#FFFFFF';

  // Entrance: letter stagger + line, only on first show
  useEffect(() => {
    if (!visible || animatedRef.current) return;
    animatedRef.current = true;

    if (lettersRef.current) {
      anime({
        targets: lettersRef.current.querySelectorAll('.intro-letter'),
        opacity: [0, 1], translateY: [36, 0],
        delay: anime.stagger(44, { start: 220 }),
        duration: 700, easing: 'easeOutQuint',
      });
    }
    if (lineRef.current) {
      anime({
        targets: lineRef.current,
        scaleX: [0, 1], delay: 1200, duration: 900, easing: 'easeOutExpo',
      });
    }
  }, [visible]);

  // Bio text + scroll hint fade based on visible
  useEffect(() => {
    const isFirst = !animatedRef.current || (animatedRef.current && visible);
    if (visible) {
      const delay = animatedRef.current ? 0.3 : 1.9;
      bioControls.start({ opacity: 1, transition: { delay, duration: 0.75 } });
      hintControls.start({ opacity: 0.38, transition: { delay: delay + 0.7, duration: 0.8 } });
    } else {
      bioControls.start({ opacity: 0, transition: { duration: 0.18 } });
      hintControls.start({ opacity: 0, transition: { duration: 0.12 } });
    }
  }, [visible, bioControls, hintControls]);

  // Click or scroll-down → go to hero
  useEffect(() => {
    if (!visible) return;

    const trigger = (e) => {
      // For wheel events, only fire on scroll-down
      if (e.type === 'wheel' && e.deltaY <= 0) return;
      if (triggeringRef.current) return;
      triggeringRef.current = true;
      onGoToHero();
      setTimeout(() => { triggeringRef.current = false; }, 1200);
    };

    const touchData = { startY: 0 };
    const onTouchStart = (e) => { touchData.startY = e.touches[0].clientY; };
    const onTouchEnd   = (e) => {
      // Finger moves up = scroll down gesture
      if (touchData.startY - e.changedTouches[0].clientY > 50) trigger({ type: 'touch' });
    };

    window.addEventListener('click',      trigger);
    window.addEventListener('wheel',      trigger, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('click',      trigger);
      window.removeEventListener('wheel',      trigger);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [visible, onGoToHero]);

  return (
    <motion.div
      animate={{ y: visible ? 0 : '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
      }}
    >
      {/* Name letters */}
      <div ref={lettersRef} style={{ lineHeight: 1.05 }}>
        {heroName.split('').map((char, i) => (
          <span
            key={i} className="intro-letter"
            style={{
              display: 'inline-block', opacity: 0,
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(2.2rem, 6vw, 5.5rem)', fontWeight: 700,
              letterSpacing:
                char === ' ' || heroName[i + 1] === ' ' || i === heroName.length - 1
                  ? 0 : '0.1em',
              width: char === ' ' ? 'clamp(1.2rem, 4vw, 4rem)' : 'auto',
              color: char === ' ' ? 'transparent' : textColor,
              textShadow: isDark ? '0 0 60px rgba(0,191,166,0.12)' : '0 2px 20px rgba(0,0,0,0.06)',
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </div>

      {/* Teal divider */}
      <div ref={lineRef} style={{
        width: 180, height: 1.5, background: '#00BFA6',
        marginTop: 20, marginBottom: 24,
        transformOrigin: 'center', transform: 'scaleX(0)',
      }} />

      {/* Bio line */}
      <motion.p
        animate={bioControls}
        initial={{ opacity: 0 }}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 400, fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
          letterSpacing: '0.05em', color: textColor,
          maxWidth: 540, lineHeight: 1.55,
        }}
      >
        I am a student at Penn LSM
      </motion.p>

      {/* Scroll hint */}
      <motion.div
        animate={hintControls}
        initial={{ opacity: 0 }}
        style={{
          position: 'absolute', bottom: 36,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          pointerEvents: 'none',
        }}
      >
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.52rem', letterSpacing: '0.22em',
          textTransform: 'uppercase', color: textColor,
        }}>
          scroll or click to continue
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: '#00BFA6', fontSize: '0.9rem', lineHeight: 1 }}
        >
          ↓
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────
export default function HeroSection({ isDark }) {
  const navigate   = useNavigate();
  const sectionRef = useRef(null);
  const lettersRef = useRef(null);
  const lineRef    = useRef(null);
  const pulseRef   = useRef(null);

  // panel: 0 = intro visible, 1 = hero visible
  const [panel,     setPanel]     = useState(0);
  const [heroReady, setHeroReady] = useState(false);
  const panelRef        = useRef(0);
  const heroAnimatedRef = useRef(false);

  const goToHero = useCallback(() => {
    if (panelRef.current === 1) return;
    panelRef.current = 1;
    setPanel(1);
  }, []);

  const goToIntro = useCallback(() => {
    if (panelRef.current === 0) return;
    panelRef.current = 0;
    setPanel(0);
  }, []);

  // When on hero: scroll up → go back to intro
  useEffect(() => {
    if (panel !== 1) return;

    const onWheel = (e) => { if (e.deltaY < 0) goToIntro(); };

    const touchData = { startY: 0 };
    const onTouchStart = (e) => { touchData.startY = e.touches[0].clientY; };
    const onTouchEnd   = (e) => {
      // Finger moves down = scroll up gesture
      if (e.changedTouches[0].clientY - touchData.startY > 60) goToIntro();
    };

    window.addEventListener('wheel',      onWheel,       { passive: true });
    window.addEventListener('touchstart', onTouchStart,  { passive: true });
    window.addEventListener('touchend',   onTouchEnd,    { passive: true });
    return () => {
      window.removeEventListener('wheel',      onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
    };
  }, [panel, goToIntro]);

  // Hero text animations — run once on first reveal
  useEffect(() => {
    if (panel !== 1 || heroAnimatedRef.current) return;
    heroAnimatedRef.current = true;
    setHeroReady(true);

    if (lettersRef.current) {
      anime({
        targets: lettersRef.current.querySelectorAll('.hero-letter'),
        opacity: [0, 1], translateY: [10, 0],
        delay: anime.stagger(24), duration: 360, easing: 'easeOutQuart',
      });
    }
    if (lineRef.current) {
      anime({
        targets: lineRef.current,
        scaleX: [0, 1], delay: 260, duration: 500, easing: 'easeOutExpo',
      });
    }
    if (pulseRef.current) {
      anime({
        targets: pulseRef.current.querySelectorAll('.pulse-ring'),
        scale: [0.6, 2.6], opacity: [0.3, 0],
        delay: anime.stagger(750, { start: 700 }),
        duration: 3000, loop: true, easing: 'easeOutSine',
      });
    }
  }, [panel]);

  const { scrollYProgress } = useScroll({
    target: sectionRef, offset: ['start start', 'end start'],
  });
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scrollY       = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  const bg        = isDark ? '#0D0D0D' : '#FFFFFF';
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const heroName  = meta.name.toUpperCase();

  return (
    <section
      ref={sectionRef}
      onDoubleClick={() => navigate('/protein')}
      title="Double-click to open protein design"
      style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: bg }}
    >
      {/* ── Intro overlay (always mounted, slides up/down) ── */}
      <IntroOverlay isDark={isDark} visible={panel === 0} onGoToHero={goToHero} />

      <style>{`
        @keyframes ekg-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-${LOOP_PX}px); }
        }
      `}</style>

      {/* Protein viewer — loads in background, revealed when intro pans up */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 0.68 : 0.42 }}
        transition={{ delay: 0.5, duration: 3, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0, cursor: 'crosshair' }}
      >
        <ProteinViewer isDark={isDark} />
      </motion.div>

      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: isDark
          ? 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 15%, rgba(13,13,13,0.5) 55%, rgba(13,13,13,0.9) 100%)'
          : 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 15%, rgba(255,255,255,0.45) 55%, rgba(255,255,255,0.9) 100%)',
      }} />

      {/* Particle field */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.13, pointerEvents: 'none' }}>
        <ParticleField isDark={isDark} />
      </div>

      {/* Synaptic pulse rings */}
      <div ref={pulseRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="pulse-ring" style={{
            position: 'absolute', width: 300, height: 300,
            borderRadius: '50%', border: '1px solid rgba(0,191,166,0.2)', opacity: 0,
          }} />
        ))}
      </div>

      {/* ── Centered identity ── */}
      <motion.div
        style={{
          opacity: scrollOpacity, y: scrollY,
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 10, textAlign: 'center', padding: '0 24px',
        }}
      >
        {/* Name */}
        <div ref={lettersRef} style={{ lineHeight: 1.05 }}>
          {heroName.split('').map((char, i) => (
            <span
              key={i} className="hero-letter"
              style={{
                display: 'inline-block', opacity: 0,
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(2.2rem, 6vw, 5.5rem)', fontWeight: 700,
                letterSpacing:
                  char === ' ' || heroName[i + 1] === ' ' || i === heroName.length - 1
                    ? 0 : '0.1em',
                width: char === ' ' ? 'clamp(1.2rem, 4vw, 4rem)' : 'auto',
                color: char === ' ' ? 'transparent' : textColor,
                textShadow: isDark ? '0 0 60px rgba(0,191,166,0.12)' : '0 2px 20px rgba(0,0,0,0.06)',
              }}
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </div>

        {/* Teal line */}
        <div ref={lineRef} style={{
          width: 180, height: 1.5, background: '#00BFA6',
          marginTop: 20, marginBottom: 22,
          transformOrigin: 'center', transform: 'scaleX(0)',
        }} />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={heroReady ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: heroReady ? 0.55 : 0, duration: 0.7 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700, fontStyle: 'italic',
            fontSize: 'clamp(1.2rem, 2.4vw, 1.7rem)',
            letterSpacing: '0.06em', color: textColor,
          }}
        >
          {meta.tagline.map((part, i) => (
            <span key={i}>
              {i > 0 && <span style={{ color: '#00BFA6', fontStyle: 'normal' }}>&nbsp;·&nbsp;</span>}
              {part}
            </span>
          ))}
        </motion.p>
      </motion.div>

      {/* BPM indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={heroReady ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: heroReady ? 0.8 : 0, duration: 0.5 }}
        style={{
          position: 'absolute', bottom: 18, left: 32,
          zIndex: 20, pointerEvents: 'none', lineHeight: 1.3,
        }}
      >
        <div style={{
          fontFamily: "'Space Mono', monospace", fontWeight: 700,
          fontSize: 'clamp(0.6rem, 1vw, 0.8rem)',
          letterSpacing: '0.04em', color: '#EF4444',
        }}>
          ♥ {BPM} BPM
        </div>
      </motion.div>

      {/* EKG wave */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={heroReady ? { opacity: 0.35 } : { opacity: 0 }}
        transition={{ delay: heroReady ? 0.6 : 0, duration: 0.8 }}
        style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '100%', height: 50, overflow: 'hidden', pointerEvents: 'none',
        }}
      >
        <svg width="4000" height="50" viewBox="0 0 4000 50"
          style={{ position: 'absolute', bottom: 0, animation: `ekg-scroll ${LOOP_MS}ms linear infinite` }}
        >
          <path d={AP_PATH} fill="none" stroke="#EF4444" strokeWidth="1.4" />
        </svg>
      </motion.div>
    </section>
  );
}
