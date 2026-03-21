import React from 'react';
import './ServerManagement.css';

type TabType = 'nginx' | 'haproxy' | 'monitor' | 'status' | 'panel' | 'mail' | 'cloud' | 'logs' | 'metrics' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isVisible }) => {
  const menuItems = [
    { id: 'nginx', label: 'Nginx', icon: 'fas fa-server', color: '#ff6b6b' },
    { id: 'haproxy', label: 'HAProxy', icon: 'fas fa-exchange-alt', color: '#4ecdc4' },
    { id: 'monitor', label: 'Монитор', icon: 'fas fa-chart-line', color: '#2ecc71' },
    { id: 'status', label: 'Статус серверов', icon: 'fas fa-chart-line', color: '#2ecc71' },
    { id: 'panel', label: 'Панель', icon: 'fas fa-tachometer-alt', color: '#f39c12' },
    { id: 'mail', label: 'Почта', icon: 'fas fa-envelope', color: '#e74c3c' },
    { id: 'cloud', label: 'Облако', icon: 'fas fa-cloud', color: '#3498db' },
    { id: 'logs', label: 'Логи', icon: 'fas fa-file-alt', color: '#45b7d1' },
    { id: 'metrics', label: 'Метрики', icon: 'fas fa-chart-bar', color: '#96ceb4' },
    { id: 'settings', label: 'Настройки', icon: 'fas fa-cog', color: '#ffeaa7' },
  ];

  return (
    <aside className={`admin-sidebar ${isVisible ? '' : 'hidden'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-cloud"></i>
          <h2>Server Manager</h2>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onTabChange(item.id as TabType)}
            >
              <div className="nav-link">
                <div className="nav-icon" style={{ background: item.color }}>
                  <i className={item.icon}></i>
                </div>
                <span className="nav-label">{item.label}</span>
                {activeTab === item.id && (
                  <div className="active-indicator"></div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        {/* Контейнер для клика, переключающий на вкладку статуса */}
        <div 
          onClick={() => onTabChange('status')} 
          style={{ cursor: 'pointer', width: '100%' }}
        >
          <iframe
            src="https://up.statuser.cloud/status-badge/iframe?slug=cherrycdnstatus&lang=ru&theme=auto&textColor=%230f172a&size=md&font=system&border=false&radius=full"
            title="Status badge"
            width="100%"
            height="40"
            style={{ 
              border: 0, 
              overflow: 'hidden', 
              pointerEvents: 'none' // отключаем интерактивность iframe
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;