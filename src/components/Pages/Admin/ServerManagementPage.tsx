import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import NginxUI from './NginxUI';
import HAProxyUI from './HAProxyUI';
import MonitorUI from './MonitorUI';
import PanelUI from './PanelUI';
import MailUI from './MailUI';
import CloudUI from './CloudUI';
import './ServerManagement.css';

type TabType = 'nginx' | 'haproxy' | 'monitor' | 'panel' | 'mail' | 'cloud' | 'logs' | 'metrics' | 'settings';

const ServerManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('nginx');
  const [sidebarVisible, setSidebarVisible] = useState(true); // состояние видимости сайдбара
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  // Сброс скролла при смене таба
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <div className="server-management">
      <div className="container">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isVisible={sidebarVisible}
        />

        <main className="main-content">
          <div className="admin-topbar">
            <button 
              className="sidebar-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <span className="toggle-icon">{sidebarVisible ? '◀' : '▶'}</span>
          </button>
          <span className="topbar-title">{tabTitles[activeTab]}</span>
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