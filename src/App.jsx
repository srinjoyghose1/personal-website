import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useDarkMode } from './hooks/useDarkMode';
import NavMenu from './components/nav/NavMenu';
import HomePage from './pages/HomePage';
import ResearchPage from './pages/ResearchPage';
import BlogPage from './pages/BlogPage';
import PhotographyPage from './pages/PhotographyPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

const PageWrapper = ({ children, isDark }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25, ease: 'easeInOut' }}
    style={{
      background: isDark ? '#0D0D0D' : '#FFFFFF',
      minHeight: '100vh',
    }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();

  return (
    <div style={{ background: isDark ? '#0D0D0D' : '#FFFFFF', minHeight: '100vh' }}>
      <NavMenu isDark={isDark} onToggleDark={toggle} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <PageWrapper isDark={isDark}>
              <HomePage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/about" element={
            <PageWrapper isDark={isDark}>
              <AboutPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/research" element={
            <PageWrapper isDark={isDark}>
              <ResearchPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/blog" element={
            <PageWrapper isDark={isDark}>
              <BlogPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/photography" element={
            <PageWrapper isDark={isDark}>
              <PhotographyPage isDark={isDark} />
            </PageWrapper>
          } />
          <Route path="/contact" element={
            <PageWrapper isDark={isDark}>
              <ContactPage isDark={isDark} />
            </PageWrapper>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
