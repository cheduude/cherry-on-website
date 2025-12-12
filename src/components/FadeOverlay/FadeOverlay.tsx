import React, { useState, useEffect, useCallback } from 'react';
import type { FadeOverlayProps, FadeOverlayStyle } from './../../types/FadeOverlay.types';
import './FadeOverlay.module.css';

const FadeOverlay: React.FC<FadeOverlayProps> = ({
  isActive,
  duration = 500,
  zIndex = 9998,
  backgroundColor = 'rgba(102, 126, 234, 0.95)',
  gradient = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
  blurAmount = 5,
  className = '',
  onAnimationComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Обработчик завершения анимации
  const handleTransitionEnd = useCallback(() => {
    if (!isVisible && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [isVisible, onAnimationComplete]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isActive) {
      setShouldRender(true);
      // Небольшая задержка перед показом анимации
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      // Ждем окончания анимации перед удалением из DOM
      timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActive, duration]);

  if (!shouldRender) return null;

  const style: FadeOverlayStyle = {
    '--fade-duration': `${duration}ms`,
    '--z-index': zIndex,
    '--bg-color': backgroundColor,
    '--bg-gradient': gradient,
    '--blur-amount': `${blurAmount}px`,
  };

  return (
    <div
      className={`fade-overlay ${isVisible ? 'visible' : ''} ${className}`}
      style={style}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden={!isVisible}
      role="presentation"
    />
  );
};

export default FadeOverlay;