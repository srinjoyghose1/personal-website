import { useState } from 'react';
import { contact } from '../data/profile';
import { useAbout } from '../hooks/useContent';
import { renderMd } from '../lib/markdown';

const MONO = "'IBM Plex Mono', monospace";
const HEAD = "'Fraunces', serif";

// ─── Markdown block ───────────────────────────────────────────────────────────
function Md({ text }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: renderMd(text) }} />
  );
}


// ─── Top-level accordion ──────────────────────────────────────────────────────
function Accordion({ label, open, onToggle, children, text, muted, border }) {
  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          width: '100%', background: 'none', border: 'none',
          borderTop: `1px solid ${border}`, borderBottom: open ? 'none' : `1px solid ${border}`,
          cursor: 'pointer', padding: '1.1rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: '1.05rem', fontWeight: 500, color: text }}>
          {label}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '0.9rem', color: muted, display: 'inline-block', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none' }}>
          ›
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: '2rem', borderBottom: `1px solid ${border}` }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Sub-accordion (for everything else sub-sections) ────────────────────────
function SubAccordion({ label, open, onToggle, children, text, muted, border }) {
  return (
    <div style={{ borderBottom: `1px solid ${border}` }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '0.75rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: '0.9rem', fontWeight: 500, color: text }}>
          {label}
        </span>
        <span style={{ fontFamily: MONO, fontSize: '0.85rem', color: muted, display: 'inline-block', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none' }}>
          ›
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: '1.2rem', paddingLeft: '1rem' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function EverythingPage({ isDark }) {
  const about = useAbout();

  const bg     = isDark ? '#0D0D0D' : '#FAFAF8';
  const text   = isDark ? '#E0E0E0' : '#1A1A1A';
  const muted  = isDark ? '#787878' : '#555555';
  const border = isDark ? '#2A2A2A' : '#E0E0E0';
  const accent = '#00BFA6';

  const [aboutMeOpen,    setAboutMeOpen]    = useState(false);
  const [workingOnOpen,  setWorkingOnOpen]  = useState(false);
  const [everythingOpen, setEverythingOpen] = useState(false);
  const [openSubs,       setOpenSubs]       = useState({});

  const toggleSub = (id) => setOpenSubs(prev => ({ ...prev, [id]: !prev[id] }));

  const workingOnSections = about.workingOnSections
    ?? (about.workingOn ? [{ id: '__legacy__', name: 'current', content: about.workingOn }] : []);

  const everythingSections = about.everythingSections ?? [
    { id: '__photos__', name: 'photos', content: about.photos ?? '' },
    { id: '__places__', name: 'places', content: about.places ?? '' },
    { id: '__food__',   name: 'food',   content: about.food ?? '' },
  ];

  const mdStyles = `
    .md-p   { font-family: ${MONO}; font-size: 1rem; line-height: 1.85; color: ${muted}; margin: 0 0 1rem; }
    .md-h2  { font-family: ${MONO}; font-size: 1.15rem; font-weight: 600; color: ${text}; margin: 1.2rem 0 0.6rem; }
    .md-h3  { font-family: ${MONO}; font-size: 1rem; font-weight: 600; color: ${text}; margin: 1rem 0 0.5rem; }
    .md-ul  { margin: 0 0 1rem 1.2rem; padding: 0; }
    .md-li  { font-family: ${MONO}; font-size: 1rem; line-height: 1.85; color: ${muted}; margin-bottom: 0.3rem; }
    .md-link { color: ${accent}; text-decoration: none; position: relative; }
    .md-link:hover { color: #00d4b8; text-decoration: underline; }
    em { font-style: italic; }
    strong { font-weight: 600; color: ${text}; }

    .e-link { color: ${accent}; text-decoration: none; }
    .e-link:hover { color: #00d4b8; text-decoration: underline; }
  `;

  return (
    <div style={{ background: bg, minHeight: '100vh', color: text }}>
      <style>{mdStyles}</style>

      <div style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: 'clamp(4rem, 10vw, 6rem) clamp(1.5rem, 6vw, 3rem) 6rem',
      }}>

        {/* ── Heading ── */}
        <h1 style={{
          fontFamily: HEAD,
          fontSize: 'clamp(3.2rem, 9vw, 5.5rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          margin: '0 0 2.2rem',
          color: text,
          textAlign: 'center',
        }}>
          hi im srinjoy
        </h1>

        {/* ── Intro (markdown from store) ── */}
        <div style={{ textAlign: 'center' }}>
          <Md text={about.intro} />
        </div>

        {/* ── Spacer ── */}
        <div style={{ height: '2.4rem' }} />

        {/* ── Accordion: about me ── */}
        {about.aboutMe && (
          <Accordion
            label="about me"
            open={aboutMeOpen}
            onToggle={() => setAboutMeOpen(o => !o)}
            text={text} muted={muted} border={border}
          >
            <div style={{ paddingTop: '0.8rem' }}>
              <Md text={about.aboutMe} />
            </div>
          </Accordion>
        )}

        {/* ── Accordion: what i'm working on ── */}
        <Accordion
          label="what i'm working on"
          open={workingOnOpen}
          onToggle={() => setWorkingOnOpen(o => !o)}
          text={text} muted={muted} border={border}
        >
          <div style={{ paddingTop: '0.8rem' }}>
            {workingOnSections.map(sec => (
              <SubAccordion
                key={sec.id}
                label={sec.name}
                open={!!openSubs[sec.id]}
                onToggle={() => toggleSub(sec.id)}
                text={text} muted={muted} border={border}
              >
                <Md text={sec.content} />
              </SubAccordion>
            ))}

          </div>
        </Accordion>

        {/* ── Accordion: everything else ── */}
        <Accordion
          label="everything else"
          open={everythingOpen}
          onToggle={() => setEverythingOpen(o => !o)}
          text={text} muted={muted} border={border}
        >
          <div style={{ paddingTop: '0.8rem' }}>
            {everythingSections.map(sec => (
              <SubAccordion
                key={sec.id}
                label={sec.name}
                open={!!openSubs[sec.id]}
                onToggle={() => toggleSub(sec.id)}
                text={text} muted={muted} border={border}
              >
                <Md text={sec.content} />
              </SubAccordion>
            ))}
          </div>
        </Accordion>

        {/* ── Connect ── */}
        <p style={{ fontFamily: MONO, fontSize: '0.95rem', color: muted, marginTop: '3rem', marginBottom: 0, textAlign: 'center', letterSpacing: '0.03em' }}>
          <a className="e-link" href={contact.linkedin} target="_blank" rel="noreferrer">ln</a>
          <span style={{ margin: '0 0.6em', opacity: 0.4 }}>·</span>
          <a className="e-link" href={`mailto:${contact.email}`}>email</a>
        </p>
      </div>
    </div>
  );
}
