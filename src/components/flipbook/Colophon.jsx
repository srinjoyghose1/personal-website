import PageShell from './PageShell';

export default function Colophon() {
  return (
    <PageShell left="Srinjoy Ghose" center="Colophon" right="2026">
      <div style={{
        height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px 36px',
        gap: 24,
      }}>
        {/* Mark */}
        <div style={{
          width: 48, height: 48,
          border: '1.5px solid rgba(26,26,26,0.18)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '1rem', color: 'var(--color-ink)',
            letterSpacing: '-0.04em',
          }}>
            SG
          </span>
        </div>

        {/* Name */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.2rem, 4vw, 2rem)',
            color: 'var(--color-ink)',
            letterSpacing: '-0.03em', margin: 0, lineHeight: 1,
          }}>
            SRINJOY GHOSE
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.54rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--color-ink-muted)', margin: '10px 0 0',
          }}>
            Wharton · CAS · Vagelos LSM
          </p>
        </div>

        {/* Rule */}
        <div style={{ width: 40, height: 1, background: 'var(--color-rule)' }} />

        {/* Contact */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
            letterSpacing: '0.14em', color: 'var(--color-ink-muted)',
            margin: 0, lineHeight: 1.9,
          }}>
            srinnghose@gmail.com<br/>
            linkedin.com/in/SrinjoyGhose
          </p>
        </div>

        {/* Edition note */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.46rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(26,26,26,0.28)',
          textAlign: 'center', margin: 0, lineHeight: 1.8,
        }}>
          University of Pennsylvania<br/>
          Class of 2029 · Philadelphia PA
        </p>
      </div>
    </PageShell>
  );
}
