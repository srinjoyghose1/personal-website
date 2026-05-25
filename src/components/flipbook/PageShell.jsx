// Shared interior page wrapper — header rule, captions, paper background
export default function PageShell({ left = '', center = '', right = '', children, accent }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: accent || 'var(--color-paper)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* Paper grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      }} />

      {/* Header strip */}
      <div style={{
        padding: '14px 24px 0',
        flexShrink: 0, position: 'relative', zIndex: 1,
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: accent ? 'rgba(240,235,224,0.5)' : 'var(--color-ink-muted)',
          marginBottom: 8,
        }}>
          <span>{left}</span>
          <span style={{ textAlign: 'center' }}>{center}</span>
          <span style={{ textAlign: 'right' }}>{right}</span>
        </div>
        <div style={{
          height: '1px',
          background: accent ? 'rgba(240,235,224,0.18)' : 'var(--color-rule)',
        }} />
      </div>

      {/* Content area */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
