import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';

const links = [
  { label: '~/', href: '/' },
  { label: './about', href: '/about' },
  { label: './research', href: '/research' },
  { label: './blog', href: '/blog' },
  { label: './photography', href: '/photography' },
  { label: './contact', href: '/contact' },
];

export default function NavMenu({ isDark, onToggleDark }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Fixed top-right controls */}
      <div className="fixed top-5 right-6 z-50 flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          title="Toggle dark mode"
          style={{
            background: isDark ? '#1A1A1A' : '#FAFAFA',
            border: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
            color: isDark ? '#E8E8E8' : '#1A1A1A',
          }}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:border-[#00BFA6] transition-all duration-200"
        >
          <AtomIcon isDark={isDark} />
        </button>

        {/* Menu toggle */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background: isDark ? '#1A1A1A' : '#FAFAFA',
            border: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
            color: isDark ? '#E8E8E8' : '#1A1A1A',
          }}
          className="w-9 h-9 rounded-full flex flex-col items-center justify-center gap-1 hover:border-[#00BFA6] transition-all duration-200"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            style={{ display: 'block', width: 14, height: 1.5, background: 'currentColor', borderRadius: 1 }}
          />
          <motion.span
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            style={{ display: 'block', width: 14, height: 1.5, background: 'currentColor', borderRadius: 1 }}
          />
          <motion.span
            animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            style={{ display: 'block', width: 14, height: 1.5, background: 'currentColor', borderRadius: 1 }}
          />
        </button>
      </div>

      {/* Menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.05)', backdropFilter: 'blur(2px)' }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              background: isDark ? '#111111' : '#FFFFFF',
              border: `1px solid ${isDark ? '#2A2A2A' : '#E5E5E5'}`,
            }}
            className="fixed top-16 right-6 z-50 rounded-xl overflow-hidden shadow-lg min-w-48"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={link.href}
                  onClick={() => setOpen(false)}
                  style={{
                    color: location.pathname === link.href ? '#00BFA6' : (isDark ? '#E8E8E8' : '#1A1A1A'),
                    borderBottom: `1px solid ${isDark ? '#2A2A2A' : '#F0F0F0'}`,
                  }}
                  className="block px-5 py-3 text-sm font-mono hover:text-[#00BFA6] transition-colors duration-150"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Fixed bottom-left: identity mark */}
      <div
        className="fixed bottom-5 left-6 z-50 font-mono text-xs tracking-widest uppercase"
        style={{ color: isDark ? '#444' : '#CCC' }}
      >
        SG / {new Date().getFullYear()}
      </div>
    </>
  );
}

function AtomIcon({ isDark }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00BFA6" strokeWidth="1.5">
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="1.5" fill="#00BFA6" />
    </svg>
  );
}
