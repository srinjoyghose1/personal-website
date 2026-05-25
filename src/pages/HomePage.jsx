import { useEffect } from 'react';
import HeroSection from '../components/hero/HeroSection';

export default function HomePage({ isDark }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return <HeroSection isDark={isDark} />;
}
