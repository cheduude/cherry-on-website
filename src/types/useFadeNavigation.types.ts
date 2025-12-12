export interface UseFadeNavigationProps {
  /** Длительность анимации в миллисекундах */
  fadeDuration?: number;
  
  /** Callback перед началом навигации */
  onFadeStart?: () => void;
  
  /** Callback после завершения анимации */
  onFadeComplete?: () => void;
}

export interface UseFadeNavigationReturn {
  /** Флаг активности анимации */
  isFading: boolean;
  
  /** Функция для начала анимации */
  startFade: () => void;
  
  /** Функция для остановки анимации */
  stopFade: () => void;
  
  /** Функция навигации с анимацией */
  navigateWithFade: (navigateFn: () => void) => void;
}