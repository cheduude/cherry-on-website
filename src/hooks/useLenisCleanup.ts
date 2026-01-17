import { useEffect } from 'react';

export const useLenisCleanup = () => {
  useEffect(() => {
    // Функция полной очистки Lenis
    const completeLenisCleanup = () => {
      // 1. Уничтожаем Lenis
      if (typeof window !== 'undefined' && (window as any).lenis) {
        try {
          (window as any).lenis.destroy();
        } catch (e) {
          console.error('Error destroying lenis:', e);
        }
        delete (window as any).lenis;
      }
      
      // 2. Восстанавливаем стили body и html
      const restoreStyles = () => {
        const bodyStyles = [
          'overflow',
          'height',
          'position',
          'width',
          'margin',
          'padding'
        ];
        
        const htmlStyles = [
          'overflow',
          'height',
          'position'
        ];
        
        // Сбрасываем стили body
        bodyStyles.forEach(prop => {
          document.body.style.removeProperty(prop);
        });
        
        // Сбрасываем стили html
        htmlStyles.forEach(prop => {
          document.documentElement.style.removeProperty(prop);
        });
        
        // Гарантируем стандартное поведение
        
        document.body.style.height = 'auto';
        document.documentElement.style.overflow = 'auto';
      };
      
      restoreStyles();
      
      // 3. Удаляем классы
      document.body.className = document.body.className
        .replace(/\blenis\b/g, '')
        .replace(/\blenis-smooth\b/g, '')
        .replace(/\blenis-stopped\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      // 4. Очищаем все ScrollTrigger
      if (typeof window !== 'undefined' && (window as any).gsap) {
        const gsap = (window as any).gsap;
        if (gsap.core && gsap.core.globals) {
          const triggers = gsap.core.globals().ScrollTrigger;
          if (triggers && triggers.getAll) {
            triggers.getAll().forEach((trigger: any) => {
              try {
                trigger.kill();
              } catch (e) {
                console.error('Error killing ScrollTrigger:', e);
              }
            });
          }
        }
      }
      
      // 5. Удаляем обработчики
      const removeEventListeners = () => {
        const types = ['wheel', 'touchmove', 'scroll'];
        types.forEach(type => {
          window.removeEventListener(type, () => {}, {
            passive: false,
            capture: true
          } as any);
        });
      };
      
      removeEventListeners();
      
      // 6. Принудительный рефлоу
      document.body.style.display = 'none';
      // eslint-disable-next-line no-unused-expressions
      document.body.offsetHeight;
      document.body.style.display = '';
    };
    
    // Выполняем очистку
    completeLenisCleanup();
    
    // Добавляем обработчик для восстановления скролла при любом взаимодействии
    const forceScrollRestore = () => {
      
      document.body.style.height = 'auto';
    };
    
    // Восстанавливаем скролл при любом взаимодействии
    const events = ['click', 'touchstart', 'keydown', 'mousemove'];
    events.forEach(event => {
      window.addEventListener(event, forceScrollRestore, { once: true });
    });
    
    return () => {
      // Убираем обработчики
      events.forEach(event => {
        window.removeEventListener(event, forceScrollRestore);
      });
    };
  }, []);
};