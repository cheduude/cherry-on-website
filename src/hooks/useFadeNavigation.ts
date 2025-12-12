// hooks/useFadeNavigation.ts
import { useState, useCallback } from 'react';
import type { UseFadeNavigationProps, UseFadeNavigationReturn } from '../types/useFadeNavigation.types';

export const useFadeNavigation = ({
  fadeDuration = 500,
  onFadeStart,
  onFadeComplete,
}: UseFadeNavigationProps = {}): UseFadeNavigationReturn => {
  const [isFading, setIsFading] = useState(false);

  const startFade = useCallback(() => {
    setIsFading(true);
    if (onFadeStart) onFadeStart();
  }, [onFadeStart]);

  const stopFade = useCallback(() => {
    setIsFading(false);
    if (onFadeComplete) onFadeComplete();
  }, [onFadeComplete]);

  const navigateWithFade = useCallback((navigateFn: () => void) => {
    startFade();
    
    setTimeout(() => {
      navigateFn();
      
      // Автоматически останавливаем анимацию после навигации
      setTimeout(() => {
        stopFade();
      }, 100);
    }, fadeDuration);
  }, [startFade, stopFade, fadeDuration]);

  return {
    isFading,
    startFade,
    stopFade,
    navigateWithFade,
  };
};