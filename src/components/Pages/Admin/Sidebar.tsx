// src/components/Admin/Sidebar.tsx
import React from 'react';
import './ServerManagement.css';

type TabType = 'nginx' | 'haproxy' | 'monitor' | 'status' | 'panel' | 'mail' | 'cloud' | 'logs' | 'metrics' | 'settings' | 'users' | 'shop_cards' | 'orders' | 'content' | 'analytics';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isVisible }) => {
  const menuItems = [
    // Системные вкладки
    { id: 'nginx', label: 'Nginx', icon: 'fas fa-server', color: '#ff6b6b', group: 'system' },
    { id: 'haproxy', label: 'HAProxy', icon: 'fas fa-exchange-alt', color: '#4ecdc4', group: 'system' },
    { id: 'monitor', label: 'Монитор', icon: 'fas fa-chart-line', color: '#2ecc71', group: 'system' },
    { id: 'status', label: 'Статус серверов', icon: 'fas fa-chart-line', color: '#2ecc71', group: 'system' },
    { id: 'panel', label: 'Панель', icon: 'fas fa-tachometer-alt', color: '#f39c12', group: 'system' },
    { id: 'mail', label: 'Почта', icon: 'fas fa-envelope', color: '#e74c3c', group: 'system' },
    { id: 'cloud', label: 'Облако', icon: 'fas fa-cloud', color: '#3498db', group: 'system' },
    
    // Разделитель
    { id: 'divider', label: '', icon: '', color: '', group: 'divider' },
    
    // Управление сайтом
    { id: 'users', label: 'Пользователи', icon: 'fas fa-users', color: '#8b5cf6', group: 'site' },
    { id: 'shop_cards', label: 'Товары', icon: 'fas fa-tags', color: '#ec4899', group: 'site' },
    { id: 'orders', label: 'Заказы', icon: 'fas fa-shopping-cart', color: '#f59e0b', group: 'site' },
    { id: 'content', label: 'Редактор', icon: 'fas fa-edit', color: '#10b981', group: 'site' },
    { id: 'analytics', label: 'Аналитика', icon: 'fas fa-chart-simple', color: '#3b82f6', group: 'site' },
    
    // Дополнительные
    { id: 'logs', label: 'Логи', icon: 'fas fa-file-alt', color: '#45b7d1', group: 'extra' },
    { id: 'metrics', label: 'Метрики', icon: 'fas fa-chart-bar', color: '#96ceb4', group: 'extra' },
    { id: 'settings', label: 'Настройки', icon: 'fas fa-cog', color: '#ffeaa7', group: 'extra' },
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
          {menuItems.map((item) => {
            if (item.id === 'divider') {
              return (
                <li key="divider" className="sidebar-divider">
                  <span>Управление сайтом</span>
                </li>
              );
            }
            return (
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
            );
          })}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
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
              pointerEvents: 'none'
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