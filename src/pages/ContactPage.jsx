import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage({ isDark }) {
  const textColor = isDark ? '#E8E8E8' : '#1A1A1A';
  const muted = isDark ? '#888' : '#6B6B6B';
  const border = isDark ? '#2A2A2A' : '#E5E5E5';
  const cardBg = isDark ? '#1A1A1A' : '#FAFAFA';
  const inputBg = isDark ? '#111111' : '#FFFFFF';

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.82rem',
    lineHeight: 1.6,
    color: textColor,
    background: inputBg,
    border: `1px solid ${border}`,
    borderRadius: 8,
    padding: '12px 16px',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto px-4 sm:px-8 py-20" style={{ color: textColor }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#00BFA6',
          marginBottom: 12,
        }}>
          // contact.init()
        </p>
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          color: textColor,
          lineHeight: 1.2,
          marginBottom: 16,
        }}>
          Let's think together.
        </h1>
        <p style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.85rem',
          lineHeight: 1.75,
          color: muted,
          maxWidth: 480,
          marginBottom: 56,
        }}>
          For research collaborations, writing, conversations about biology and finance,
          or anything worth the exchange of an email.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-8">
        {/* Form — 3 cols */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="sm:col-span-3"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: cardBg,
                border: '1px solid rgba(0,191,166,0.4)',
                borderRadius: 12,
                padding: '32px',
              }}
            >
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: '#00BFA6',
                marginBottom: 12,
              }}>
                message received
              </p>
              <p style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '1rem',
                color: textColor,
                marginBottom: 8,
              }}>
                Thank you, {form.name || 'there'}.
              </p>
              <p style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                lineHeight: 1.7,
                color: muted,
              }}>
                I'll read your message carefully and respond when I have something worth saying back.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: muted,
                  display: 'block',
                  marginBottom: 6,
                }}>
                  name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00BFA6'}
                  onBlur={e => e.target.style.borderColor = border}
                />
              </div>
              <div>
                <label style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: muted,
                  display: 'block',
                  marginBottom: 6,
                }}>
                  email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#00BFA6'}
                  onBlur={e => e.target.style.borderColor = border}
                  required
                />
              </div>
              <div>
                <label style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: muted,
                  display: 'block',
                  marginBottom: 6,
                }}>
                  message
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="What's on your mind?"
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = '#00BFA6'}
                  onBlur={e => e.target.style.borderColor = border}
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '14px 24px',
                  borderRadius: 8,
                  background: '#00BFA6',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                send message →
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Info — 2 cols */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="sm:col-span-2 flex flex-col gap-6"
        >
          {/* Direct email */}
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 12,
            padding: '24px',
          }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#00BFA6',
              marginBottom: 10,
            }}>
              direct
            </p>
            <a
              href="mailto:s.ghose@domain.edu"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem',
                color: textColor,
                textDecoration: 'none',
                borderBottom: '1px solid #00BFA6',
              }}
            >
              s.ghose@domain.edu
            </a>
          </div>

          {/* Links */}
          <div style={{
            background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 12,
            padding: '24px',
          }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#00BFA6',
              marginBottom: 16,
            }}>
              elsewhere
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: 'linkedin', href: '#' },
                { label: 'github', href: '#' },
                { label: 'twitter / x', href: '#' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.72rem',
                    color: muted,
                    textDecoration: 'none',
                    letterSpacing: '0.05em',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#00BFA6'}
                  onMouseLeave={e => e.target.style.color = muted}
                >
                  ./{link.label} →
                </a>
              ))}
            </div>
          </div>

          {/* Status */}
          <div style={{
            background: isDark ? '#0D1F1E' : '#F0FDFB',
            border: '1px solid rgba(0,191,166,0.3)',
            borderRadius: 12,
            padding: '24px',
          }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#00BFA6',
              marginBottom: 10,
            }}>
              status
            </p>
            <div className="flex items-center gap-2">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem',
                color: textColor,
              }}>
                open to conversations
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
