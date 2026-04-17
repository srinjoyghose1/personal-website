import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { researchProjects } from '../data/content';

const domains = ['All', 'Biology', 'Finance', 'Startups'];

const domainColor = {
  Biology: '#00BFA6',
  Finance: '#22D3EE',
  Startups: '#34D399',
};

export default function ResearchPage({ isDark }) {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';
  const cardBg = isDark ? '#1A1A1A' : '#FAFAFA';

  const filtered = filter === 'All' ? researchProjects : researchProjects.filter(p => p.domain === filter);

  return (
    <div
      className="min-h-screen w-full max-w-4xl mx-auto px-4 sm:px-8 py-20"
      style={{ color: textColor }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#00BFA6',
          marginBottom: 12,
        }}>
          // research.log
        </p>
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          color: textColor,
          lineHeight: 1.2,
          marginBottom: 16,
        }}>
          Research &amp; Theses
        </h1>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.85rem',
          lineHeight: 1.75,
          color: muted,
          maxWidth: 520,
          marginBottom: 40,
        }}>
          A chronological record of intellectual work — from molecular biology to market structure.
          Each entry is a dated journal page in an ongoing inquiry.
        </p>
      </motion.div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-12"
      >
        {domains.map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: 6,
              border: `1px solid ${filter === d ? '#00BFA6' : border}`,
              color: filter === d ? '#00BFA6' : muted,
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {d}
          </button>
        ))}
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 1,
          background: `linear-gradient(to bottom, #00BFA6, transparent)`,
        }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-0"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative pl-8 pb-10"
              >
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: -5,
                  top: 6,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: domainColor[project.domain] || '#00BFA6',
                  border: `2px solid ${isDark ? '#0D0D0D' : '#FFFFFF'}`,
                }} />

                {/* Card */}
                <div
                  style={{
                    background: cardBg,
                    border: `1px solid ${expanded === project.id ? '#00BFA6' : border}`,
                    borderRadius: 12,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpanded(expanded === project.id ? null : project.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-3">
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.62rem',
                            color: muted,
                            letterSpacing: '0.1em',
                          }}>
                            {project.date}
                          </span>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.6rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: `${domainColor[project.domain]}20`,
                            color: domainColor[project.domain] || '#00BFA6',
                            border: `1px solid ${domainColor[project.domain]}40`,
                          }}>
                            {project.domain}
                          </span>
                          <span style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.6rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: project.status === 'Published' ? '#34D399' : muted,
                          }}>
                            {project.status}
                          </span>
                        </div>
                        <h3 style={{
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: textColor,
                          lineHeight: 1.4,
                          marginBottom: 8,
                        }}>
                          {project.title}
                        </h3>
                        <p style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.78rem',
                          lineHeight: 1.75,
                          color: muted,
                        }}>
                          {project.abstract}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map(tag => (
                        <span key={tag} style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.58rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          padding: '2px 7px',
                          borderRadius: 4,
                          border: `1px solid ${border}`,
                          color: muted,
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expanded findings */}
                  <AnimatePresence>
                    {expanded === project.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                          borderTop: `1px solid ${border}`,
                          overflow: 'hidden',
                        }}
                      >
                        <div className="p-6">
                          <p style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.6rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#00BFA6',
                            marginBottom: 8,
                          }}>
                            key findings
                          </p>
                          <p style={{
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '0.8rem',
                            lineHeight: 1.75,
                            color: textColor,
                            borderLeft: '2px solid #00BFA6',
                            paddingLeft: 16,
                          }}>
                            {project.findings}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
