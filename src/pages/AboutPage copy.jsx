import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import anime from 'animejs';
import ParticleField from '../components/hero/ParticleField';
import { meta, experience, education, leadership, awards, currently } from '../data/profile';

const GARAMOND = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";
const MONO = "'JetBrains Mono', monospace";

function Rule({ isDark }) {
  return <div style={{ height: 1, background: isDark ? '#2A2A2A' : '#E5E5E5', margin: '72px 0' }} />;
}

function SectionLabel({ text }) {
  return (
    <p style={{ fontFamily: MONO, fontSize: '0.56rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#00BFA6', marginBottom: 24, textAlign: 'center' }}>
      {text}
    </p>
  );
}

export default function AboutPage({ isDark }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';
  const cardBg = isDark ? '#141414' : '#FAFAFA';

  const headingRef = useRef(null);

  useEffect(() => {
    if (headingRef.current) {
      anime({
        targets: headingRef.current.querySelectorAll('.about-letter'),
        opacity: [0, 1],
        translateY: [14, 0],
        delay: anime.stagger(28, { start: 200 }),
        duration: 500,
        easing: 'easeOutQuart',
      });
    }
  }, []);

  return (
    <div className="min-h-screen w-full" style={{ color: textColor }}>

      {/* Hero header */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: 100, paddingBottom: 72, textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
          <ParticleField isDark={isDark} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-8">
          <p style={{ fontFamily: MONO, fontSize: '0.56rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#00BFA6', marginBottom: 20 }}>
            // profile.md
          </p>
          <div ref={headingRef} style={{ marginBottom: 28 }}>
            {meta.name.split('').map((char, i) => (
              <span key={i} className="about-letter" style={{
                display: 'inline-block', opacity: 0,
                fontFamily: GARAMOND, fontWeight: 300,
                fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
                letterSpacing: char === ' ' ? '0.15em' : '0.02em',
                color: char === ' ' ? 'transparent' : textColor,
                lineHeight: 1.1, fontStyle: 'italic',
              }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
          <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', lineHeight: 2, color: muted, maxWidth: 520, margin: '0 auto' }}>
            {meta.heroBio}
          </p>
        </div>
      </div>

      {/* Main content — centered */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pb-28" style={{ textAlign: 'center' }}>
        <div style={{ height: 1, background: `linear-gradient(to right, transparent, #00BFA6, transparent)`, marginBottom: 72 }} />

        {/* Experience */}
        <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionLabel text="Experience" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {experience.map((exp, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <p style={{ fontFamily: MONO, fontSize: '0.58rem', color: muted, marginBottom: 6, letterSpacing: '0.08em' }}>
                  {exp.period}
                </p>
                <p style={{ fontFamily: MONO, fontSize: '0.6rem', color: '#00BFA6', marginBottom: 10, letterSpacing: '0.1em' }}>
                  {exp.org}
                </p>
                <p style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.25rem', color: textColor, marginBottom: 16 }}>
                  {exp.role}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                  {exp.bullets.map((b, j) => (
                    <p key={j} style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.92rem', lineHeight: 1.8, color: muted, maxWidth: 540 }}>
                      {b}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Rule isDark={isDark} />

        {/* Education */}
        <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionLabel text="Education" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {education.map((ed, i) => (
              <div key={i} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '28px 24px' }}>
                <p style={{ fontFamily: MONO, fontSize: '0.58rem', color: muted, marginBottom: 8 }}>{ed.year}</p>
                <p style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.3rem', color: textColor, marginBottom: 8 }}>{ed.school}</p>
                <p style={{ fontFamily: SANS, fontWeight: 400, fontSize: '0.9rem', color: '#00BFA6', marginBottom: 8 }}>{ed.degree}</p>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.88rem', lineHeight: 1.7, color: muted }}>{ed.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <Rule isDark={isDark} />

        {/* Leadership */}
        <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionLabel text="Leadership" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {leadership.map((l, i) => (
              <div key={i} style={{ padding: '24px 0', borderBottom: `1px solid ${border}` }}>
                <p style={{ fontFamily: MONO, fontSize: '0.58rem', color: muted, marginBottom: 6, letterSpacing: '0.08em' }}>{l.period}</p>
                <p style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.2rem', color: textColor, marginBottom: 4 }}>{l.role}</p>
                <p style={{ fontFamily: MONO, fontSize: '0.6rem', color: '#00BFA6', marginBottom: 12, letterSpacing: '0.08em' }}>{l.org}</p>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.92rem', lineHeight: 1.8, color: muted, maxWidth: 520, margin: '0 auto' }}>{l.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <Rule isDark={isDark} />

        {/* Awards */}
        <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionLabel text="Awards" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {awards.map((a, i) => (
              <div key={i} style={{ background: isDark ? '#0D1F1E' : '#F0FDFB', border: '1px solid rgba(0,191,166,0.22)', borderRadius: 12, padding: '24px' }}>
                <p style={{ fontFamily: MONO, fontSize: '0.58rem', color: muted, marginBottom: 8 }}>{a.date}</p>
                <p style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.15rem', color: textColor, marginBottom: 10 }}>{a.title}</p>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.9rem', lineHeight: 1.8, color: muted, maxWidth: 500, margin: '0 auto' }}>{a.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <Rule isDark={isDark} />

        {/* Currently */}
        <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <SectionLabel text="Currently" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {currently.map(item => (
              <div key={item.key}>
                <p style={{ fontFamily: MONO, fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: muted, marginBottom: 10 }}>{item.key}</p>
                <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.8, color: textColor }}>{item.value}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
