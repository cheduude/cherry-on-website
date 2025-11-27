// src/hooks/useScrollGradient.ts
import { useEffect } from 'react';

export const useScrollGradient = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const gradient = `linear-gradient(to bottom, #000 ${scrollY / 10}%, #222 100%)`;
      document.body.style.background = gradient;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};