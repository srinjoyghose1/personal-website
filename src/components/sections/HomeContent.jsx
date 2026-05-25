import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import anime from 'animejs';
import { researchProjects, blogPosts } from '../../data/content';
import { meta, contact } from '../../data/profile';

const GARAMOND = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";
const MONO = "'JetBrains Mono', monospace";

function SectionLabel({ text }) {
  return (
    <p style={{
      fontFamily: MONO,
      fontSize: '0.58rem',
      letterSpacing: '0.35em',
      textTransform: 'uppercase',
      color: '#00BFA6',
      marginBottom: 24,
      textAlign: 'center',
    }}>
      {text}
    </p>
  );
}

function Rule({ isDark }) {
  return <div style={{ height: 1, background: isDark ? '#2A2A2A' : '#E5E5E5', margin: '96px 0' }} />;
}

function TagChip({ label }) {
  return (
    <span style={{
      fontFamily: MONO, fontSize: '0.55rem',
      letterSpacing: '0.12em', textTransform: 'uppercase',
      color: '#00BFA6', border: '1px solid rgba(0,191,166,0.32)',
      padding: '2px 8px', borderRadius: 3,
    }}>
      {label}
    </span>
  );
}

function ViewAllLink({ to, label }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 36 }}>
      <Link to={to} style={{
        fontFamily: MONO, fontSize: '0.65rem',
        color: '#00BFA6', textDecoration: 'none', letterSpacing: '0.12em',
      }}>
        {label} →
      </Link>
    </div>
  );
}

function useAnimeReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        anime({
          targets: el.querySelectorAll('.reveal-item'),
          opacity: [0, 1],
          translateY: [12, 0],
          delay: anime.stagger(60),
          duration: 480,
          easing: 'easeOutQuart',
        });
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

function ResearchList({ isDark }) {
  const ref = useRef(null);
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';
  useAnimeReveal(ref);

  return (
    <div ref={ref}>
      {researchProjects.slice(0, 3).map(project => (
        <div key={project.id} className="reveal-item" style={{ opacity: 0, padding: '28px 0', borderBottom: `1px solid ${border}`, textAlign: 'center' }}>
          <h3 style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.15rem', color: textColor, lineHeight: 1.4, marginBottom: 12 }}>
            {project.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 10 }}>
            {project.tags.slice(0, 3).map(tag => <TagChip key={tag} label={tag} />)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <span style={{ fontFamily: MONO, fontSize: '0.57rem', color: muted }}>{project.date}</span>
            <span style={{ fontFamily: MONO, fontSize: '0.57rem', color: project.status === 'In Progress' ? '#00BFA6' : muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {project.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WritingList({ isDark }) {
  const ref = useRef(null);
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';
  useAnimeReveal(ref);

  return (
    <div ref={ref}>
      {blogPosts.slice(0, 3).map(post => (
        <div key={post.id} className="reveal-item" style={{ opacity: 0, padding: '28px 0', borderBottom: `1px solid ${border}`, textAlign: 'center' }}>
          <h3 style={{ fontFamily: GARAMOND, fontWeight: 600, fontSize: '1.15rem', color: textColor, lineHeight: 1.4, marginBottom: 12 }}>
            {post.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 10 }}>
            {post.tags.slice(0, 2).map(tag => <TagChip key={tag} label={tag} />)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <span style={{ fontFamily: MONO, fontSize: '0.57rem', color: muted }}>{post.date}</span>
            <span style={{ fontFamily: MONO, fontSize: '0.57rem', color: muted }}>{post.readTime}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeContent({ isDark }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';

  return (
    <div style={{ width: '100%', maxWidth: '42rem', margin: '0 auto', padding: '128px 2rem', textAlign: 'center' }}>

      {/* About */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
      >
        <SectionLabel text="About" />
        <p style={{ fontFamily: SANS, fontSize: '1.05rem', fontWeight: 300, lineHeight: 2, color: muted, marginBottom: 18, textAlign: 'center' }}>
          {meta.homeBio[0]}
        </p>
        <p style={{ fontFamily: SANS, fontSize: '1.05rem', fontWeight: 300, lineHeight: 2, color: muted, marginBottom: 28, textAlign: 'center' }}>
          {meta.homeBio[1]}
        </p>
        <Link to="/about" style={{ fontFamily: MONO, fontSize: '0.65rem', color: '#00BFA6', textDecoration: 'none', letterSpacing: '0.12em' }}>
          Full profile →
        </Link>
      </motion.section>

      <Rule isDark={isDark} />

      {/* Research */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel text="Research" />
          <h2 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: textColor, lineHeight: 1.2, marginBottom: 48, fontStyle: 'italic' }}>
            Selected work
          </h2>
        </motion.div>
        <ResearchList isDark={isDark} />
        <ViewAllLink to="/research" label="All research & theses" />
      </section>

      <Rule isDark={isDark} />

      {/* Writing */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <SectionLabel text="Writing" />
          <h2 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: textColor, lineHeight: 1.2, marginBottom: 48, fontStyle: 'italic' }}>
            Notes from the lab journal
          </h2>
        </motion.div>
        <WritingList isDark={isDark} />
        <ViewAllLink to="/blog" label="All writing" />
      </section>

      <Rule isDark={isDark} />

      {/* Contact */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <SectionLabel text="Contact" />
        <h2 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: textColor, lineHeight: 1.2, marginBottom: 24, fontStyle: 'italic' }}>
          Let's think together
        </h2>
        <p style={{ fontFamily: SANS, fontSize: '1.05rem', fontWeight: 300, lineHeight: 2, color: muted, maxWidth: 420, margin: '0 auto 28px', textAlign: 'center' }}>
          {meta.contactBlurb}
        </p>
        <Link to="/contact" style={{ fontFamily: MONO, fontSize: '0.65rem', color: '#00BFA6', textDecoration: 'none', letterSpacing: '0.12em' }}>
          Get in touch →
        </Link>
      </motion.section>

    </div>
  );
}
