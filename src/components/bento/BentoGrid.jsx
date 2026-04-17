import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogPosts, researchProjects } from '../../data/content';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' }
  })
};

function BentoCard({ children, className = '', style = {}, to, isDark, span, i = 0 }) {
  const bg = isDark ? '#1A1A1A' : '#FAFAFA';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';

  const inner = (
    <motion.div
      custom={i}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ boxShadow: '0 0 0 1.5px #00BFA6', y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 16,
        overflow: 'hidden',
        height: '100%',
        cursor: to ? 'pointer' : 'default',
        ...style,
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className={`block ${span}`} style={{ textDecoration: 'none' }}>
        {inner}
      </Link>
    );
  }

  return <div className={span}>{inner}</div>;
}

function TagPill({ label, isDark }) {
  return (
    <span style={{
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.6rem',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      padding: '3px 8px',
      borderRadius: 4,
      border: '1px solid #00BFA6',
      color: '#00BFA6',
    }}>
      {label}
    </span>
  );
}

export default function BentoGrid({ isDark }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const latest = blogPosts[0];
  const latestProject = researchProjects[0];

  return (
    <section
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16"
      id="bento"
    >
      {/* Section label */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: muted,
          marginBottom: 32,
        }}
      >
        // index.laboratory
      </motion.p>

      {/* Grid */}
      <div className="grid grid-cols-12 gap-4 auto-rows-auto">

        {/* ── Row 1 ── */}

        {/* About card — 5 cols */}
        <BentoCard to="/about" isDark={isDark} span="col-span-12 sm:col-span-5" i={0} style={{ minHeight: 200 }}>
          <div className="p-7 h-full flex flex-col justify-between">
            <div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00BFA6',
                marginBottom: 12,
              }}>
                about
              </p>
              <h2 style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                color: textColor,
                lineHeight: 1.3,
                marginBottom: 12,
              }}>
                Biology meets finance at the edge of ideas.
              </h2>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                lineHeight: 1.7,
                color: muted,
              }}>
                Student, researcher, analyst. Working across the molecular and the monetary — because the best problems live on boundaries.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <TagPill label="Biology" />
              <TagPill label="Finance" />
              <TagPill label="Research" />
            </div>
          </div>
        </BentoCard>

        {/* Research card — 7 cols */}
        <BentoCard to="/research" isDark={isDark} span="col-span-12 sm:col-span-7" i={1} style={{ minHeight: 200 }}>
          <div className="p-7 h-full flex flex-col justify-between">
            <div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00BFA6',
                marginBottom: 12,
              }}>
                research + projects
              </p>
              <h2 style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '1.1rem',
                color: textColor,
                marginBottom: 8,
                lineHeight: 1.4,
              }}>
                {latestProject.title}
              </h2>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                lineHeight: 1.7,
                color: muted,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
                {latestProject.abstract}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-wrap gap-2">
                {latestProject.tags.slice(0, 2).map(tag => (
                  <TagPill key={tag} label={tag} />
                ))}
              </div>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                color: muted,
              }}>
                {latestProject.date} →
              </span>
            </div>
          </div>
        </BentoCard>

        {/* ── Row 2 ── */}

        {/* Blog card — 7 cols */}
        <BentoCard to="/blog" isDark={isDark} span="col-span-12 sm:col-span-7" i={2} style={{ minHeight: 220 }}>
          <div className="p-7 h-full flex flex-col justify-between">
            <div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00BFA6',
                marginBottom: 12,
              }}>
                lab journal
              </p>
              <div style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                color: muted,
                marginBottom: 8,
              }}>
                {latest.date} · {latest.readTime} read
              </div>
              <h2 style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '1.05rem',
                color: textColor,
                marginBottom: 10,
                lineHeight: 1.4,
              }}>
                {latest.title}
              </h2>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.75rem',
                lineHeight: 1.75,
                color: muted,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
                {latest.excerpt}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {latest.tags.map(tag => <TagPill key={tag} label={tag} />)}
            </div>
          </div>
        </BentoCard>

        {/* Photography card — 5 cols */}
        <BentoCard to="/photography" isDark={isDark} span="col-span-12 sm:col-span-5" i={3} style={{ minHeight: 220 }}>
          <div className="h-full relative overflow-hidden" style={{ minHeight: 220 }}>
            {/* Fake photography preview */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: isDark
                ? 'linear-gradient(135deg, #0D1A18 0%, #0A2520 50%, #0D1A18 100%)'
                : 'linear-gradient(135deg, #E8FBF8 0%, #B2F5EA 50%, #E0F9F5 100%)',
            }} />
            {/* Microscopy grid overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, rgba(0,191,166,0.15) 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
            }} />
            {/* Circles representing specimen */}
            {[
              { x: '20%', y: '30%', r: 28 },
              { x: '55%', y: '55%', r: 40 },
              { x: '75%', y: '25%', r: 18 },
              { x: '40%', y: '75%', r: 22 },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: c.x,
                top: c.y,
                width: c.r * 2,
                height: c.r * 2,
                borderRadius: '50%',
                border: '1px solid rgba(0,191,166,0.4)',
                transform: 'translate(-50%, -50%)',
              }} />
            ))}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px 24px',
              background: isDark
                ? 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                : 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)',
            }}>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00BFA6',
                marginBottom: 4,
              }}>
                photography
              </p>
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.9rem',
                color: textColor,
              }}>
                The eye behind the experiment.
              </p>
            </div>
          </div>
        </BentoCard>

        {/* ── Row 3 ── */}

        {/* Finance thesis card — 4 cols */}
        <BentoCard to="/research?filter=Finance" isDark={isDark} span="col-span-12 sm:col-span-4" i={4} style={{ minHeight: 180 }}>
          <div className="p-7 h-full flex flex-col justify-between">
            <div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00BFA6',
                marginBottom: 12,
              }}>
                financial theses
              </p>
              <h3 style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.95rem',
                color: textColor,
                lineHeight: 1.4,
                marginBottom: 8,
              }}>
                Investment research &amp; market analysis.
              </h3>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem',
                lineHeight: 1.7,
                color: muted,
              }}>
                Sector analysis, equity theses, valuation frameworks for biotech and deep tech.
              </p>
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              color: '#00BFA6',
              marginTop: 16,
            }}>
              {researchProjects.filter(p => p.domain === 'Finance').length} theses →
            </div>
          </div>
        </BentoCard>

        {/* Startup card — 4 cols */}
        <BentoCard isDark={isDark} span="col-span-12 sm:col-span-4" i={5} style={{ minHeight: 180 }}>
          <div className="p-7 h-full flex flex-col justify-between">
            <div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00BFA6',
                marginBottom: 12,
              }}>
                building + investing
              </p>
              <h3 style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.95rem',
                color: textColor,
                lineHeight: 1.4,
                marginBottom: 8,
              }}>
                Startups as experiments.
              </h3>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem',
                lineHeight: 1.7,
                color: muted,
              }}>
                Venture thinking, founder patterns, and the science of building companies from scratch.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <TagPill label="Venture" />
              <TagPill label="Startups" />
            </div>
          </div>
        </BentoCard>

        {/* Contact card — 4 cols */}
        <BentoCard to="/contact" isDark={isDark} span="col-span-12 sm:col-span-4" i={6}
          style={{
            minHeight: 180,
            background: isDark ? '#0D1F1E' : '#F0FDFB',
            border: '1px solid rgba(0,191,166,0.3)',
          }}
        >
          <div className="p-7 h-full flex flex-col justify-between">
            <div>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00BFA6',
                marginBottom: 12,
              }}>
                contact
              </p>
              <h3 style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.95rem',
                color: textColor,
                lineHeight: 1.4,
                marginBottom: 8,
              }}>
                Let's think together.
              </h3>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem',
                lineHeight: 1.7,
                color: muted,
              }}>
                For research collaborations, writing, or a conversation worth having.
              </p>
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.72rem',
              color: '#00BFA6',
              marginTop: 16,
            }}>
              s.ghose@domain.edu →
            </div>
          </div>
        </BentoCard>

      </div>
    </section>
  );
}
