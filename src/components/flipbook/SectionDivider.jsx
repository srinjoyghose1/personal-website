import PageShell from './PageShell';

export default function SectionDivider({ section }) {
  return (
    <PageShell
      left="Srinjoy Ghose"
      center={section.label}
      right={section.roman}
      accent={section.colorVar}
    >
      <div style={{
        height: '100%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 28px 32px',
      }}>
        {/* Large section index top-right */}
        <div style={{
          position: 'absolute', top: 36, right: 24,
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(240,235,224,0.38)',
        }}>
          {section.roman}
        </div>

        {/* Big label */}
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(2.4rem, 8vw, 5.5rem)',
          color: 'var(--color-section-text)',
          lineHeight: 0.92, letterSpacing: '-0.03em',
          margin: 0,
        }}>
          {section.label.toUpperCase().split(' ').map((word, i) => (
            <span key={i} style={{ display: 'block' }}>{word}</span>
          ))}
        </h2>

        {/* Thin accent rule */}
        <div style={{
          width: 48, height: 2,
          background: 'rgba(240,235,224,0.35)',
          marginTop: 20,
        }} />
      </div>
    </PageShell>
  );
}
