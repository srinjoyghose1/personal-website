import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MoleculeCanvas from './MoleculeCanvas';
import ParticleField from './ParticleField';

const letters = 'SRINJOY GHOSE'.split('');

export default function HeroSection({ isDark }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  const bg = isDark ? '#0D0D0D' : '#FFFFFF';
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const mutedColor = isDark ? '#888888' : '#6B6B6B';

  return (
    <section
      ref={ref}
      className="relative w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ height: '100vh', background: bg }}
    >
      {/* Particle background */}
      <div className="absolute inset-0" style={{ opacity: 0.6 }}>
        <ParticleField isDark={isDark} />
      </div>

      {/* Molecule canvas */}
      <motion.div
        style={{ opacity, scale, y }}
        className="absolute inset-0"
      >
        <MoleculeCanvas isDark={isDark} />
      </motion.div>

      {/* Name overlay */}
      <motion.div
        style={{ opacity, scale, y, position: 'relative', zIndex: 10 }}
        className="flex flex-col items-center select-none"
      >
        {/* Name letters */}
        <div className="flex items-center justify-center flex-wrap gap-0">
          {letters.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.04, duration: 0.5, ease: 'easeOut' }}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                fontWeight: 700,
                letterSpacing: char === ' ' ? '0.5em' : '0.12em',
                color: char === ' ' ? 'transparent' : textColor,
                lineHeight: 1.1,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>

        {/* Teal accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
          style={{ background: '#00BFA6', height: 1.5, width: '100%', marginTop: 12, transformOrigin: 'left' }}
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.65rem, 1.5vw, 0.85rem)',
            color: mutedColor,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginTop: 16,
            textAlign: 'center',
          }}
        >
          Biology · Finance · Research · Photography
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.6 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem',
            color: mutedColor,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            style={{ width: 1, height: 32, background: `linear-gradient(to bottom, #00BFA6, transparent)` }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
