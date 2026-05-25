// Tile accent colours — gives the thumbnail grid visual variety
const TILE_COLORS = [
  '#8B4A2A','#2F4F3A','#3A3060','#6B2A2A','#1A3A4A',
  '#4A3010','#2A4A30','#5A2040','#303A20','#4A1A2A',
  '#1A2A4A','#3A2A10','#2A3A3A','#6A3020',
];

const TILE_LABELS = [
  'Bioreactor','Optic Chip','ML Denoise','L/S Equity',
  'EV Thesis','mRNA M&A','HK Biotech','Microfluidics',
  'Stem Cells','Point72','PUBUS','WRAP','BAM','R3F',
];

export default function Cover() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--color-cover)',
      display: 'flex', flexDirection: 'column',
      padding: '28px 30px 24px',
      position: 'relative', overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Subtle paper grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.055'/%3E%3C/svg%3E")`,
        opacity: 0.6,
      }} />

      {/* Top strip: studio + year */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'var(--color-cover-caption)', marginBottom: 20,
        position: 'relative', zIndex: 1,
      }}>
        <span>Srinjoy Ghose</span>
        <span>2026</span>
      </div>

      {/* Main content area */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1, gap: 16,
      }}>
        {/* Kicker */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.56rem',
          letterSpacing: '0.28em', textTransform: 'uppercase',
          color: 'var(--color-cover-caption)',
          textAlign: 'center', lineHeight: 1.9, margin: 0,
        }}>
          Biomedical Engineering · Capital Markets<br/>
          Computational Biology · Strategy
        </p>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(3rem, 8vw, 5.2rem)',
          color: 'var(--color-cover-text)',
          textAlign: 'center', lineHeight: 0.95,
          letterSpacing: '-0.03em', margin: 0,
        }}>
          /WORK
        </h1>

        {/* Thumbnail grid: 2 rows × 7 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 5, width: '92%', marginTop: 8,
        }}>
          {TILE_COLORS.map((color, i) => (
            <div key={i} style={{
              aspectRatio: '1 / 1.25',
              background: color,
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Tiny label overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '2px 2px',
                background: 'rgba(0,0,0,0.42)',
                fontFamily: 'var(--font-mono)',
                fontSize: '4px', letterSpacing: '0.06em',
                color: 'rgba(255,255,255,0.75)',
                textTransform: 'uppercase',
                lineHeight: 1.2,
                textAlign: 'center',
              }}>
                {TILE_LABELS[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom caption */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--color-cover-caption)',
        textAlign: 'center', margin: 0, marginTop: 12,
        position: 'relative', zIndex: 1,
      }}>
        Research · Investment · Community
      </p>
    </div>
  );
}
