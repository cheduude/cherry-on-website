import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import NginxUI from './NginxUI';
import HAProxyUI from './HAProxyUI';
import MonitorUI from './MonitorUI';
import PanelUI from './PanelUI';
import MailUI from './MailUI';
import CloudUI from './CloudUI';
import './ServerManagement.css';
import Lenis from '@studio-freight/lenis';
import { useLenisCleanup } from '../../../hooks/useLenisCleanup';

type TabType = 'nginx' | 'haproxy' | 'monitor' | 'panel' | 'mail' | 'cloud' | 'logs' | 'metrics' | 'settings';

const ServerManagementPage: React.FC = () => {
  useLenisCleanup();
  const [activeTab, setActiveTab] = useState<TabType>('nginx');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const tabTitles = {
    nginx: 'Nginx Administration',
    haproxy: 'HAProxy Administration',
    monitor: 'System Monitoring',
    panel: 'Service Panel',
    mail: 'Mail Administration',
    cloud: 'Cloud Storage',
    logs: 'System Logs',
    metrics: 'Performance Metrics',
    settings: 'System Settings'
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'nginx':
        return <NginxUI />;
      case 'haproxy':
        return <HAProxyUI />;
      case 'monitor':
        return <MonitorUI />;
      case 'panel':
        return <PanelUI />;
      case 'mail':
        return <MailUI />;
      case 'cloud':
        return <CloudUI />;
      case 'logs':
        return <div className="ui-content">Логи системы (в разработке)</div>;
      case 'metrics':
        return <div className="ui-content">Метрики производительности (в разработке)</div>;
      case 'settings':
        return <div className="ui-content">Настройки системы (в разработке)</div>;
      default:
        return <NginxUI />;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const wrapperElement = wrapperRef.current;
    if (!wrapperElement) return;

    wrapperElement.scrollTop = 0;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 1.5,
      gestureDirection: 'vertical',
    });

    lenisRef.current = lenis;

    const handleWheel = (e: WheelEvent) => {
      const rect = wrapperElement.getBoundingClientRect();
      const isOverWrapper = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom;

      if (isOverWrapper) {
        e.preventDefault();
        e.stopPropagation();
        
        const delta = e.deltaY;
        const currentScroll = wrapperElement.scrollTop;
        const maxScroll = wrapperElement.scrollHeight - wrapperElement.clientHeight;
        
        const newScroll = Math.max(0, Math.min(currentScroll + delta, maxScroll));
        wrapperElement.scrollTop = newScroll;
        
        if (lenisRef.current) {
          lenisRef.current.raf(Date.now());
        }
        
        return false;
      }
    };

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

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });

    let animationFrameId: number;
    const raf = (time: number) => {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
      }
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

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
      
      window.scrollTo(0, 0);
    };
  }, []);

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
            {tabTitles[activeTab]}
          </div>

          <div className="admin-iframe-wrapper" ref={wrapperRef}>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServerManagementPage;