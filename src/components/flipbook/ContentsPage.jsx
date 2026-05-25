import PageShell from './PageShell';

const SECTIONS = [
  { id: 'Research',          label: 'Research',          roman: 'I'   },
  { id: 'Projects',          label: 'Projects',          roman: 'II'  },
  { id: 'Investment Theses', label: 'Investment Theses', roman: 'III' },
  { id: 'Community',         label: 'Community',         roman: 'IV'  },
];

// Pastel accent colours for the image well on the left half
const IMAGE_COLORS = ['#2A4A3A', '#1E2A42', '#4A2E12', '#2F1E3A'];

export default function ContentsPage({ projects }) {
  // Build numbered entry list: sections + their projects
  let num = 1; // start after cover + contents
  const entries = [];
  for (const sec of SECTIONS) {
    entries.push({ label: sec.label, isSec: true, roman: sec.roman, num: num++ });
    projects
      .filter(p => p.category === sec.id)
      .forEach(p => entries.push({ label: p.title, isSec: false, num: num++ }));
  }

  return (
    <PageShell left="Srinjoy Ghose" center="Contents" right="2026">
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        height: '100%',
      }}>
        {/* Left half — editorial image well (4-quadrant placeholder mosaic) */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 3, padding: '14px 8px 20px 20px',
        }}>
          {IMAGE_COLORS.map((color, i) => (
            <div key={i} style={{
              background: color,
              borderRadius: 3,
              display: 'flex', alignItems: 'flex-end',
              padding: 8,
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '5px',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(240,235,224,0.45)',
              }}>
                {['Research', 'Projects', 'Theses', 'Community'][i]}
              </span>
            </div>
          ))}
        </div>

        {/* Right half — contents list */}
        <div style={{
          padding: '14px 20px 20px 12px',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
            color: 'var(--color-ink)',
            lineHeight: 1, letterSpacing: '-0.03em',
            marginBottom: 16, marginTop: 2,
          }}>
            CON<br/>TENTS
          </h2>

          <div style={{
            flex: 1, overflow: 'hidden',
            display: 'flex', flexDirection: 'column', gap: 0,
          }}>
            {entries.map((entry, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'baseline', gap: 6,
                padding: '3px 0',
                borderBottom: '1px solid var(--color-rule)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: entry.isSec ? '0.52rem' : '0.46rem',
                  color: entry.isSec ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                  letterSpacing: '0.1em',
                  minWidth: 18, flexShrink: 0,
                }}>
                  {entry.num}.
                </span>
                <span style={{
                  fontFamily: entry.isSec ? 'var(--font-display)' : 'var(--font-body)',
                  fontSize: entry.isSec ? '0.56rem' : '0.48rem',
                  fontWeight: entry.isSec ? 700 : 400,
                  letterSpacing: entry.isSec ? '0.12em' : '0.01em',
                  textTransform: entry.isSec ? 'uppercase' : 'none',
                  color: entry.isSec ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                  lineHeight: 1.35,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {entry.label}
                </span>
                {entry.isSec && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.44rem',
                    color: 'var(--color-ink-muted)', letterSpacing: '0.08em',
                    flexShrink: 0,
                  }}>
                    {entry.roman}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
