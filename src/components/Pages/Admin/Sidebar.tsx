import React from 'react';
import './ServerManagement.css';

interface SidebarProps {
  activeTab: 'nginx' | 'haproxy';
  onTabChange: (tab: 'nginx' | 'haproxy') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'nginx', label: 'Nginx', icon: 'fas fa-server', color: '#ff6b6b' },
    { id: 'haproxy', label: 'HAProxy', icon: 'fas fa-exchange-alt', color: '#4ecdc4' },
    { id: 'logs', label: 'Логи', icon: 'fas fa-file-alt', color: '#45b7d1' },
    { id: 'metrics', label: 'Метрики', icon: 'fas fa-chart-line', color: '#96ceb4' },
    { id: 'settings', label: 'Настройки', icon: 'fas fa-cog', color: '#ffeaa7' },
  ];

  return (
    <aside className="sidebar">
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
              onClick={() => {
                if (item.id === 'nginx' || item.id === 'haproxy') {
                  onTabChange(item.id as 'nginx' | 'haproxy');
                }
              }}
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
        <div className="server-status">
          <div className="status-indicator active"></div>
          <span className="status-text">Все сервисы активны</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;