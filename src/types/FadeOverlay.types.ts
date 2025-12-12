export interface FadeOverlayProps {
  /** Активен ли overlay */
  isActive: boolean;
  
  /** Длительность анимации в миллисекундах */
  duration?: number;
  
  /** Z-index для overlay */
  zIndex?: number;
  
  /** Цвет фона в формате rgba или hex */
  backgroundColor?: string;
  
  /** Градиент для фона (если передан, имеет приоритет над backgroundColor) */
  gradient?: string;
  
  /** Размытие фона */
  blurAmount?: number;
  
  /** Дополнительный CSS класс */
  className?: string;
  
  /** Callback, вызываемый когда анимация завершена */
  onAnimationComplete?: () => void;
}

export interface FadeOverlayStyle extends React.CSSProperties {
  '--fade-duration': string;
  '--z-index': number;
  '--bg-color'?: string;
  '--bg-gradient'?: string;
  '--blur-amount'?: string;
}