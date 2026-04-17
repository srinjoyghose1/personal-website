import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dark-mode');
    if (stored === 'true') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('dark');
        localStorage.setItem('dark-mode', 'true');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('dark-mode', 'false');
      }
      return next;
    });
  };

  return { isDark, toggle };
}
