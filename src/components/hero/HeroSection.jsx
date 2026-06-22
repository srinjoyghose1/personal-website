import { useRef, useEffect, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useMotionTemplate, useTransform } from 'framer-motion';
import anime from 'animejs';
import ProteinViewer from './ProteinViewer';
import ParticleField from './ParticleField';
import { meta } from '../../data/profile';

// ─── Encrypted text — scrambles random chars then resolves letter-by-letter ──
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!&*';
const SCRAMBLE_STAGGER = 62;
const SCRAMBLE_RESOLVE = 600;
const SCRAMBLE_START   = 280;

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function EncryptedText({ text, textColor, textShadow, immediate }) {
  const [display, setDisplay] = useState(() =>
    immediate
      ? text.split('')
      : text.split('').map(c => (c === ' ' ? ' ' : randomChar()))
  );
  const timerRef = useRef(null);

  useEffect(() => {
    if (immediate) return;

    const startAt = performance.now() + SCRAMBLE_START;

    timerRef.current = setInterval(() => {
      const elapsed = performance.now() - startAt;
      if (elapsed < 0) return;

      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (elapsed >= i * SCRAMBLE_STAGGER + SCRAMBLE_RESOLVE) return char;
          return randomChar();
        })
      );

      const totalMs = (text.length - 1) * SCRAMBLE_STAGGER + SCRAMBLE_RESOLVE;
      if (elapsed >= totalMs) clearInterval(timerRef.current);
    }, 35);

    return () => clearInterval(timerRef.current);
  }, [text, immediate]);

  return (
    <div style={{ lineHeight: 1.05 }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            fontFamily: "'Space Mono', monospace",
            fontSize: 'clamp(2.2rem, 6vw, 5.5rem)',
            fontWeight: 700,
            letterSpacing:
              char === ' ' || text[i + 1] === ' ' || i === text.length - 1
                ? 0 : '0.1em',
            width: char === ' ' ? 'clamp(1.2rem, 4vw, 4rem)' : 'auto',
            color: char === ' ' ? 'transparent' : textColor,
            textShadow,
          }}
        >
          {display[i]}
        </span>
      ))}
    </div>
  );
}

// ─── Moving border link ───────────────────────────────────────────────────────
function MovingBorderLink({ children, href, bg, duration = 2800 }) {
  const pathRef  = useRef(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const len = pathRef.current?.getTotalLength();
    if (len) progress.set((time * (len / duration)) % len);
  });

  const x = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v)?.x ?? 0);
  const y = useTransform(progress, (v) => pathRef.current?.getPointAtLength(v)?.y ?? 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'relative', display: 'inline-block',
        padding: 2, borderRadius: '10px',
        textDecoration: 'none', color: 'inherit',
        cursor: 'pointer', verticalAlign: '-0.04em',
        marginLeft: '0.24em',
      }}
    >
      <span aria-hidden style={{
        position: 'absolute', inset: 0,
        borderRadius: '10px', overflow: 'hidden',
        pointerEvents: 'none',
        background: 'transparent',
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <rect ref={pathRef} fill="none" width="100%" height="100%" rx="8" ry="8" />
        </svg>
        <motion.span
          style={{
            position: 'absolute', top: 0, left: 0,
            width: 94, height: 94, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,191,166,1) 0%, rgba(0,191,166,0.42) 42%, transparent 72%)',
            transform,
            pointerEvents: 'none',
          }}
        />
      </span>
      <span style={{
        position: 'relative', display: 'inline-block',
        background: 'transparent', borderRadius: '8px',
        padding: '0.02em 0.42em 0.04em', zIndex: 1,
        lineHeight: 'inherit', fontFamily: 'inherit',
        fontSize: 'inherit', fontStyle: 'inherit',
        fontWeight: 700, letterSpacing: 'inherit',
      }}>
        {children}
      </span>
    </a>
  );
}

const SESSION_KEY = 'hero_seen';

// ─── Hero section ─────────────────────────────────────────────────────────────
export default function HeroSection({ isDark }) {
  const sectionRef = useRef(null);
  const lineRef    = useRef(null);
  const pulseRef   = useRef(null);

  // Skip all animations if the user has already seen them this session
  const alreadySeen = sessionStorage.getItem(SESSION_KEY) === 'true';
  const [revealed, setRevealed] = useState(alreadySeen);

  const bg        = isDark ? '#0D0D0D' : '#FAFAF8';
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const heroName  = meta.name.toUpperCase();

  useEffect(() => {
    // Mark as seen immediately so any same-session nav back skips animations
    sessionStorage.setItem(SESSION_KEY, 'true');

    if (alreadySeen) {
      // Show line instantly, no animation
      if (lineRef.current) lineRef.current.style.transform = 'scaleX(1)';
      return;
    }

    // First visit — play sequenced animations after scramble resolves (~2 s)
    const t = setTimeout(() => {
      setRevealed(true);

      if (lineRef.current) {
        anime({ targets: lineRef.current, scaleX: [0, 1], duration: 800, easing: 'easeOutExpo' });
      }
      if (pulseRef.current) {
        anime({
          targets: pulseRef.current.querySelectorAll('.pulse-ring'),
          scale: [0.6, 2.6], opacity: [0.3, 0],
          delay: anime.stagger(750, { start: 400 }),
          duration: 3000, loop: true, easing: 'easeOutSine',
        });
      }
    }, 2000);

    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section
      ref={sectionRef}
      style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: bg }}
    >
      {/* Protein — fades in after scramble resolves (instant on return visits) */}
      <motion.div
        animate={{ opacity: revealed ? (isDark ? 0.68 : 0.42) : 0 }}
        transition={{ duration: alreadySeen ? 0 : 2.5, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0, cursor: 'crosshair' }}
      >
        <ProteinViewer isDark={isDark} />
      </motion.div>

      {/* Radial vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: isDark
          ? 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 15%, rgba(13,13,13,0.5) 55%, rgba(13,13,13,0.9) 100%)'
          : 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 15%, rgba(250,250,248,0.45) 55%, rgba(250,250,248,0.9) 100%)',
      }} />

      {/* Particle field */}
      <motion.div
        animate={{ opacity: revealed ? 0.13 : 0 }}
        transition={{ duration: alreadySeen ? 0 : 2, ease: 'easeOut' }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <ParticleField isDark={isDark} />
      </motion.div>

      {/* Pulse rings */}
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

      {/* Centered identity */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 24px',
      }}>
        {/* Name — scrambles on mount, resolves to true name */}
        <EncryptedText
          text={heroName}
          textColor={textColor}
          textShadow={isDark ? '0 0 60px rgba(0,191,166,0.12)' : '0 2px 20px rgba(0,0,0,0.06)'}
          immediate={alreadySeen}
        />

        {/* Teal divider — draws in after scramble */}
        <div ref={lineRef} style={{
          width: 320, height: 2.25, background: '#00BFA6',
          marginTop: 20, marginBottom: 24,
          transformOrigin: 'center', transform: 'scaleX(0)',
        }} />

        {/* Bio — fades in after scramble */}
        <motion.p
          animate={{ opacity: revealed ? 1 : 0 }}
          transition={{ duration: alreadySeen ? 0 : 0.75, delay: (!alreadySeen && revealed) ? 0.3 : 0 }}
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700, fontStyle: 'italic',
            fontSize: 'clamp(1.1rem, 2.2vw, 1.6rem)',
            letterSpacing: '0.05em', color: textColor,
            maxWidth: 540, lineHeight: 1.55,
            margin: 0,
          }}
        >
          a student at
          <MovingBorderLink href="https://lsm.upenn.edu/program/about" bg={bg} duration={2800}>
            Penn LSM
          </MovingBorderLink>
        </motion.p>
      </div>
    </section>
  );
}
