import HeroSection from '../components/hero/HeroSection';
import BentoGrid from '../components/bento/BentoGrid';

export default function HomePage({ isDark }) {
  return (
    <>
      <HeroSection isDark={isDark} />
      <BentoGrid isDark={isDark} />
    </>
  );
}
