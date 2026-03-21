// src/components/Cabinet/layout/CabinetLayout.tsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './CabinetLayout.module.css';
import { useAuth } from '../../../hooks/useAuth';

const CabinetLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/cabinet/login');
  };

  const navItems = [
    { to: '/cabinet', label: 'Дашборд', icon: '📊', end: true },
    { to: '/cabinet/tariffs', label: 'Тарифы', icon: '🏷️', end: false },
    { to: '/cabinet/subscription', label: 'Подписка', icon: '🔐', end: false },
    { to: '/cabinet/referrals', label: 'Рефералы', icon: '👥', end: false },
    { to: '/cabinet/profile', label: 'Профиль', icon: '👤', end: false },
  ];

  return (
    <div className={styles.cabinetContainer}>
      {/* Десктопный сайдбар */}
      <aside className={styles.sidebar}>
        
        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
        </div>
      </aside>

      {/* Мобильный хедер + меню */}
      <div className={styles.mobileHeader}>
        <button
          className={styles.menuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
        <div className={styles.mobileLogo}>Client Panel</div>
        <div className={styles.mobileUserEmail}>{user?.email}</div>
      </div>

      {/* Мобильное меню (выпадающее) */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
          <button onClick={handleLogout} className={styles.mobileLogoutButton}>
            Выйти
          </button>
        </div>
      )}

      {/* Основной контент */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default CabinetLayout;