// src/types/lenis.d.ts
declare module '@studio-freight/lenis' {
  export default class Lenis {
    constructor(options?: {
      duration?: number;
      easing?: (t: number) => number;
      direction?: 'vertical' | 'horizontal';
      gestureDirection?: 'vertical' | 'horizontal';
      smooth?: boolean;
      smoothTouch?: boolean;
      touchMultiplier?: number;
      wheelMultiplier?: number;
    });
    raf(time: number): void;
    destroy(): void;
  }
}