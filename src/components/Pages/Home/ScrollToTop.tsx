// src/components/Layout/ScrollToTop/ScrollToTop.tsx
import React, { useState, useEffect } from 'react';
import styles from './ScrollToTop.module.css';
import Lenis from '@studio-freight/lenis';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Проверяем позицию скролла
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300); // Показываем кнопку после 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Плавный скролл наверх
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      // Используем Lenis для плавного скролла, если он инициализирован
      const lenisInstance = (window as any).lenis;
      
      if (lenisInstance) {
        lenisInstance.scrollTo(0, {
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        // Fallback на нативный плавный скролл
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  };

  if (!isVisible) return null;

  return (
    <button 
      className={styles.scrollToTopButton}
      onClick={scrollToTop}
      aria-label="Наверх"
    >
      <svg 
        className={styles.arrowIcon} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M12 19V5M12 5l-6 6M12 5l6 6" />
      </svg>
    </button>
  );
};

export default ScrollToTop;