import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import NginxUI from './NginxUI';
import HAProxyUI from './HAProxyUI';
import './ServerManagement.css';
import Lenis from '@studio-freight/lenis';

const ServerManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nginx' | 'haproxy'>('nginx');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // БАГ 1: Сбрасываем скролл всей страницы при входе в админку
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const wrapperElement = wrapperRef.current;
    if (!wrapperElement) return;

    // Сбрасываем скролл контейнера
    wrapperElement.scrollTop = 0;

    // Создаем Lenis только для wrapper
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 1.5,
      gestureDirection: 'vertical',
    });

    // Сохраняем ссылку для доступа
    lenisRef.current = lenis;

    // Обработчик колеса мыши ТОЛЬКО для wrapper
    const handleWheel = (e: WheelEvent) => {
      // БАГ 2: Проверяем что курсор НАД wrapper
      const rect = wrapperElement.getBoundingClientRect();
      const isOverWrapper = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

      if (isOverWrapper) {
        e.preventDefault();
        e.stopPropagation();
        
        // Рассчитываем новый скролл
        const delta = e.deltaY;
        const currentScroll = wrapperElement.scrollTop;
        const maxScroll = wrapperElement.scrollHeight - wrapperElement.clientHeight;
        
        // Ограничиваем скролл
        const newScroll = Math.max(0, Math.min(currentScroll + delta, maxScroll));
        wrapperElement.scrollTop = newScroll;
        
        // Обновляем Lenis
        if (lenisRef.current) {
          lenisRef.current.raf(Date.now());
        }
        
        return false;
      }
    };

    // Обработчик для тач-устройств
    const handleTouchStart = (e: TouchEvent) => {
      const rect = wrapperElement.getBoundingClientRect();
      const touch = e.touches[0];
      const isOverWrapper = 
        touch.clientX >= rect.left && 
        touch.clientX <= rect.right && 
        touch.clientY >= rect.top && 
        touch.clientY <= rect.bottom;
      
      if (isOverWrapper) {
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = wrapperElement.getBoundingClientRect();
      const touch = e.touches[0];
      const isOverWrapper = 
        touch.clientX >= rect.left && 
        touch.clientX <= rect.right && 
        touch.clientY >= rect.top && 
        touch.clientY <= rect.bottom;
      
      if (isOverWrapper) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Вешаем обработчики на window с capture: true
    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });

    // Анимационный цикл
    let animationFrameId: number;
    const raf = (time: number) => {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
      }
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    // Очистка
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      window.removeEventListener('wheel', handleWheel, { capture: true } as any);
      window.removeEventListener('touchstart', handleTouchStart, { capture: true } as any);
      window.removeEventListener('touchmove', handleTouchMove, { capture: true } as any);
      
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      
      // Снова сбрасываем скролл при выходе
      window.scrollTo(0, 0);
    };
  }, []);

  // Сброс скролла при смене таба
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <div className="server-management">
      <div className="container">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="main-content">
          <div className="admin-topbar">
            {activeTab === 'nginx' ? 'Nginx Administration' : 'HAProxy Administration'}
          </div>

          <div className="admin-iframe-wrapper" ref={wrapperRef}>
            {activeTab === 'nginx' ? <NginxUI /> : <HAProxyUI />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServerManagementPage;