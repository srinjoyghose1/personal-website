import PageShell from './PageShell';

// Map category to image well accent colour
const CAT_COLOR = {
  'Research':          '#1F3A2F',
  'Projects':          '#1E2A42',
  'Investment Theses': '#4A2E12',
  'Community':         '#2F1E3A',
};

export default function ProjectPage({ project, pageNum, totalPages }) {
  const accent = CAT_COLOR[project.category] || '#2A2A2A';

  return (
    <PageShell
      left="Srinjoy Ghose"
      center={project.category}
      right={`${pageNum} / ${totalPages}`}
    >
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        height: '100%', gap: 0,
      }}>
        {/* Left: image well */}
        <div style={{
          background: accent,
          margin: '14px 6px 20px 20px',
          borderRadius: 4,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', alignItems: 'flex-start',
          padding: 14, overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Subtle grid pattern over the image well */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />
          {/* Date tag */}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'rgba(240,235,224,0.5)',
            position: 'relative', zIndex: 1,
          }}>
            {project.date}
          </span>
          {project.institution && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(240,235,224,0.38)',
              marginTop: 4, position: 'relative', zIndex: 1,
            }}>
              {project.institution}
            </span>
          )}
        </div>

        {/* Right: text */}
        <div style={{
          padding: '14px 18px 20px 10px',
          display: 'flex', flexDirection: 'column',
          gap: 10, overflow: 'hidden',
        }}>
          {/* Category pill */}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--color-ink-muted)',
          }}>
            {project.category}
          </span>

          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(0.9rem, 2.2vw, 1.2rem)',
            color: 'var(--color-ink)', lineHeight: 1.2,
            letterSpacing: '-0.02em', margin: 0,
          }}>
            {project.title}
          </h3>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--color-rule)' }} />

          {/* Abstract */}
          <p style={{
            fontFamily: 'var(--font-body)', fontWeight: 300,
            fontSize: '0.72rem', lineHeight: 1.75,
            color: 'var(--color-ink-muted)', margin: 0,
            flex: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 8,
            WebkitBoxOrient: 'vertical',
          }}>
            {project.abstract}
          </p>

          {/* Findings strip */}
          {project.findings && (
            <div style={{
              borderLeft: '2px solid rgba(0,191,166,0.4)',
              paddingLeft: 8,
            }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '0.64rem',
                lineHeight: 1.65, color: 'var(--color-ink-muted)',
                margin: 0,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}>
                {project.findings}
              </p>
            </div>
          )}

          {/* Meta strip */}
          <div style={{
            paddingTop: 8,
            borderTop: '1px solid var(--color-rule)',
            fontFamily: 'var(--font-mono)', fontSize: '0.46rem',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--color-ink-muted)',
          }}>
            {project.date}
            {project.institution && <> · {project.institution}</>}
            {' · '}{project.category}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
