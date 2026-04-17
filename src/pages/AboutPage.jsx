import { motion } from 'framer-motion';
import ParticleField from '../components/hero/ParticleField';

export default function AboutPage({ isDark }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';
  const cardBg = isDark ? '#1A1A1A' : '#FAFAFA';

  const sections = [
    {
      label: 'biology',
      title: 'The molecular lens.',
      body: 'I think in mechanisms. Years of working in molecular biology have trained me to look for the causal chain — the specific enzyme, the exact binding site, the precise regulatory signal. I apply this habit of mind to every problem I encounter, whether it\'s a genome or a balance sheet.',
    },
    {
      label: 'finance',
      title: 'The quantitative eye.',
      body: 'Markets are complex adaptive systems. They have feedback loops, phase transitions, emergent behaviours. My interest in finance grew from seeing the structural similarity to biological systems — and wanting to understand why mispricing persists in the presence of arbitrageurs, just as drug resistance persists in the presence of antibiotics.',
    },
    {
      label: 'research',
      title: 'The question-asking habit.',
      body: 'The best research questions are the ones your field considers obvious — so obvious they\'ve stopped asking. I\'m drawn to boundary questions: what does molecular network topology tell us about financial contagion? What does allosteric regulation tell us about information cascades?',
    },
    {
      label: 'photography',
      title: 'The observer\'s discipline.',
      body: 'I photograph because the camera is a tool for making observation deliberate. You have to decide what you\'re looking for before you can find it. That\'s also the first step of an experiment.',
    },
  ];

  return (
    <div className="min-h-screen w-full" style={{ color: textColor }}>
      {/* Header section with particles */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '80px 0 60px' }}>
        <ParticleField isDark={isDark} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#00BFA6',
              marginBottom: 12,
            }}>
              // profile.md
            </p>
            <h1 style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: textColor,
              lineHeight: 1.1,
              marginBottom: 24,
            }}>
              Srinjoy Ghose
            </h1>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
              lineHeight: 1.8,
              color: muted,
              maxWidth: 580,
            }}>
              Biology and finance student. Researcher. Analyst. Photographer.
              Working at the intersection of molecular biology and capital markets —
              because the most interesting questions live at the boundary.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">
        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(to right, #00BFA6, transparent)`, marginBottom: 60 }} />

        {/* Four sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {sections.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                background: cardBg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: '28px',
              }}
            >
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00BFA6',
                marginBottom: 10,
              }}>
                {s.label}
              </p>
              <h3 style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.95rem',
                color: textColor,
                marginBottom: 12,
                lineHeight: 1.4,
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem',
                lineHeight: 1.8,
                color: muted,
              }}>
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Currently section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: isDark ? '#0D1F1E' : '#F0FDFB',
            border: '1px solid rgba(0,191,166,0.3)',
            borderRadius: 12,
            padding: '32px',
          }}
        >
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#00BFA6',
            marginBottom: 20,
          }}>
            currently
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { key: 'reading', value: 'Information Theory & Molecular Evolution — Maynard Smith' },
              { key: 'researching', value: 'CRISPR-mediated metabolic pathway modulation' },
              { key: 'thinking about', value: 'Information asymmetry in biotech capital markets' },
            ].map(item => (
              <div key={item.key}>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.58rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: muted,
                  marginBottom: 6,
                }}>
                  {item.key}
                </p>
                <p style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.78rem',
                  lineHeight: 1.65,
                  color: textColor,
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
