import { meta, experience, contact } from '../data/profile';

const MONO = "'JetBrains Mono', monospace";
const HAND = "'Caveat', cursive";

const CUHK_URL = 'https://www.jockeyphpc.cuhk.edu.hk/en/home';

export default function AboutPage({ isDark }) {
  const bg      = isDark ? '#0D0D0D' : '#FAFAF8';
  const text    = isDark ? '#E0E0E0' : '#1A1A1A';
  const muted   = isDark ? '#888' : '#555';
  const divider = isDark ? '#2A2A2A' : '#E0E0E0';

  return (
    <div style={{ background: bg, minHeight: '100vh', color: text }}>
      <style>{`
        .about-link {
          color: #00BFA6;
          text-decoration: none;
          position: relative;
          display: inline-block;
        }
        .about-link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 1px;
          background: #00BFA6;
          transition: width 0.25s ease;
        }
        .about-link:hover::after {
          width: 100%;
        }
        .about-link:hover {
          color: #00d4b8;
        }

        .about-section-title {
          font-family: ${MONO};
          font-size: 1.35rem;
          font-weight: 500;
          margin: 0 0 1.4rem;
          color: ${text};
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .about-para {
          font-family: ${MONO};
          font-size: 1rem;
          line-height: 1.85;
          color: ${muted};
          margin: 0 0 1.4rem;
        }

        .work-item {
          font-family: ${MONO};
          font-size: 1rem;
          line-height: 1.85;
          color: ${muted};
          margin: 0 0 0.55rem;
        }

        .prev-item {
          padding: 1rem 0;
          border-bottom: 1px solid ${divider};
        }
        .prev-item-period {
          font-family: ${MONO};
          font-size: 0.72rem;
          color: ${muted};
          margin: 0 0 0.25rem;
          letter-spacing: 0.04em;
        }
        .prev-item-role {
          font-family: ${MONO};
          font-size: 1rem;
          font-weight: 500;
          color: ${text};
          margin: 0 0 0.2rem;
        }
        .prev-item-org {
          font-family: ${MONO};
          font-size: 0.88rem;
          color: #00BFA6;
          margin: 0 0 0.4rem;
        }
        .prev-item-detail {
          font-family: ${MONO};
          font-size: 0.88rem;
          line-height: 1.75;
          color: ${muted};
          margin: 0;
        }

        hr.about-rule {
          border: none;
          border-top: 1px solid ${divider};
          margin: 2.8rem 0;
        }
      `}</style>

      <div style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: 'clamp(4rem, 10vw, 6rem) clamp(1.5rem, 6vw, 3rem) 6rem',
      }}>

        {/* Big handwritten heading */}
        <h1 style={{
          fontFamily: HAND,
          fontSize: 'clamp(3.2rem, 9vw, 5.5rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          margin: '0 0 2.4rem',
          color: text,
        }}>
          hi im srinjoy
        </h1>

        {/* Intro paragraphs */}
        <p className="about-para">
          I'm in the Hong Kong SAR this summer, working with Real-World Data at{' '}
          <a
            className="about-link"
            href={CUHK_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            CUHK's Jockey PHPC
          </a>
          .
        </p>

        <p className="about-para">
          Studying global markets of science and challenging the status quo on what
          it means to <em>"truly"</em> commercialize saving lives.
        </p>

        <p className="about-para">
          I love to stay fit, travel, and meet people. So{' '}
          <a
            className="about-link"
            href={`mailto:${contact.email}`}
          >
            reach out
          </a>
          !
        </p>

        <hr className="about-rule" />

        {/* What I'm working on */}
        <section style={{ marginBottom: '2.8rem' }}>
          <h2 className="about-section-title">
            <span>💻</span> what i'm working on
          </h2>

          <p className="work-item">
            Real-World Data Research @{' '}
            <a
              className="about-link"
              href={CUHK_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              CUHK Jockey PHPC
            </a>
          </p>
          <p className="work-item">
            Investment Analyst @{' '}
            <a
              className="about-link"
              href="https://www.balyasny.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Balyasny Asset Management
            </a>
          </p>
          <p className="work-item">
            Organ-on-a-chip research @{' '}
            <a
              className="about-link"
              href="https://minimedicine.seas.upenn.edu"
              target="_blank"
              rel="noopener noreferrer"
            >
              MiNiMedicine Lab
            </a>
          </p>
        </section>

        <hr className="about-rule" />

        {/* Previously */}
        <section>
          <h2 className="about-section-title">
            <span>⬅</span> previously
          </h2>

          {experience.slice(1).map((exp, i) => (
            <div className="prev-item" key={i}>
              <p className="prev-item-period">{exp.period}</p>
              <p className="prev-item-role">{exp.role}</p>
              <p className="prev-item-org">{exp.org}</p>
              {exp.bullets.map((b, j) => (
                <p className="prev-item-detail" key={j}>{b}</p>
              ))}
            </div>
          ))}
        </section>

        <hr className="about-rule" />

        {/* Connect */}
        <p className="about-para" style={{ marginBottom: 0 }}>
          Find me on{' '}
          <a
            className="about-link"
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          {' '}or send a note to{' '}
          <a
            className="about-link"
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
