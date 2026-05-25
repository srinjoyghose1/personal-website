import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { contact } from '../data/profile';

const GARAMOND = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";
const MONO = "'JetBrains Mono', monospace";

export default function ContactPage({ isDark }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';

  return (
    <div className="min-h-screen w-full max-w-2xl" style={{ margin: '0 auto', padding: '6rem 2rem', color: textColor, textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 64 }}>
        <p style={{ fontFamily: MONO, fontSize: '0.56rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#00BFA6', marginBottom: 18 }}>
          // contact.init()
        </p>
        <h1 style={{ fontFamily: GARAMOND, fontWeight: 300, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: textColor, lineHeight: 1.1, marginBottom: 18, fontStyle: 'italic' }}>
          Let's think together.
        </h1>
        <p style={{ fontFamily: SANS, fontWeight: 300, fontSize: '1rem', lineHeight: 1.9, color: muted, maxWidth: 420, margin: '0 auto' }}>
          For research collaborations, writing, conversations about biology and finance, or anything worth the exchange of an email.
        </p>
      </motion.div>

      {/* Direct links */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 64, flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontFamily: MONO, fontSize: '0.56rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>email</p>
          <a href={`mailto:${contact.email}`} style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.95rem', color: '#00BFA6', textDecoration: 'none', borderBottom: '1px solid rgba(0,191,166,0.4)' }}>
            {contact.email}
          </a>
        </div>
        <div>
          <p style={{ fontFamily: MONO, fontSize: '0.56rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: muted, marginBottom: 8 }}>linkedin</p>
          <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ fontFamily: SANS, fontWeight: 300, fontSize: '0.95rem', color: '#00BFA6', textDecoration: 'none', borderBottom: '1px solid rgba(0,191,166,0.4)' }}>
            {contact.linkedin.replace('https://', '')}
          </a>
        </div>
      </motion.div>

      {/* Status */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderRadius: 8, background: isDark ? '#0D1F1E' : '#F0FDFB', border: '1px solid rgba(0,191,166,0.25)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
        <span style={{ fontFamily: MONO, fontSize: '0.6rem', letterSpacing: '0.1em', color: textColor }}>open to conversations</span>
      </motion.div>

      <Link to="/admin" style={{ fontFamily: MONO, fontSize: '0.42rem', color: isDark ? '#2A2A2A' : '#E0E0E0', letterSpacing: '0.2em', textDecoration: 'none', display: 'block', marginTop: 96 }}>
        admin
      </Link>
    </div>
  );
}
