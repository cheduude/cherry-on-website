// src/components/Cabinet/layout/CabinetLayout.tsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './CabinetLayout.module.css';
import { useAuth } from '../../../hooks/useAuth';
import {
  LayoutDashboard,
  KeyRound,
  Users,
  User,
  Package,
} from 'lucide-react';

const CabinetLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndicatorStyle, setActiveIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  const navItems = [
    { to: '/cabinet', label: 'Дашборд', icon: LayoutDashboard, end: true, index: 0 },
    { to: '/cabinet/tariffs', label: 'Мои заказы', icon: Package, end: false, index: 1 },
    { to: '/cabinet/subscription', label: 'Подписка', icon: KeyRound, end: false, index: 2 },
    { to: '/cabinet/referrals', label: 'Рефералы', icon: Users, end: false, index: 3 },
    { to: '/cabinet/profile', label: 'Профиль', icon: User, end: false, index: 4 },
  ];
  const visibleNavItems = navItems.filter((item) => item.to !== '/cabinet' || user?.role === 'admin');

  // Определяем, вошёл ли пользователь через Telegram
  const isTelegramUser = user?.email?.endsWith('@telegram.com') || 
                          user?.username?.includes('tg') ||
                          (user?.id && typeof user.id === 'number' && user.id > 100000000);

  // Получаем отображаемое имя (для Telegram показываем username или имя)
  const getDisplayName = () => {
    if (!user) return '';
    
    if (isTelegramUser) {
      // Для Telegram показываем username или displayName
      return user.displayName || user.username || user.name || user.email?.split('@')[0] || 'Пользователь';
    }
    
    // Для обычных пользователей показываем email
    return user.email || 'Пользователь';
  };

  // Обновление позиции активной полоски
  const updateActiveIndicator = () => {
    const activeIndex = visibleNavItems.findIndex(item => {
      if (item.end) {
        return location.pathname === item.to;
      }
      return location.pathname.startsWith(item.to);
    });

    if (activeIndex !== -1 && navRefs.current[activeIndex]) {
      const activeElement = navRefs.current[activeIndex];
      if (activeElement && navContainerRef.current) {
        const containerRect = navContainerRef.current.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        setActiveIndicatorStyle({
          left: elementRect.left - containerRect.left,
          width: elementRect.width,
        });
      }
    }
  };

  useEffect(() => {
    updateActiveIndicator();
    window.addEventListener('resize', updateActiveIndicator);
    return () => window.removeEventListener('resize', updateActiveIndicator);
  }, [location, user?.role]);

  // Функция для установки ref
  const setNavRef = (index: number) => (el: HTMLAnchorElement | null) => {
    navRefs.current[index] = el;
  };

  // Рендер иконки
  const renderIcon = (Icon: any, size: number = 20) => {
    return <Icon size={size} strokeWidth={1.5} />;
  };

  return (
    <div className={styles.cabinetContainer}>
      {/* Десктопный сайдбар */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>Личный кабинет</div>
          {user && <div className={styles.userEmail}>{getDisplayName()}</div>}
        </div>
        <nav className={styles.sidebarNav}>
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
              style={{ '--index': item.index } as React.CSSProperties}
            >
              <span className={styles.navIcon}>
                {renderIcon(item.icon, 20)}
              </span>
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

      {/* Мобильная версия: горизонтальная навигация с плавающей полоской */}
      <div className={styles.mobileNavBar}>
        <div className={styles.mobileNavContainer} ref={navContainerRef}>
          {visibleNavItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.mobileNavLink} ${isActive ? styles.active : ''}`
              }
              ref={setNavRef(index)}
            >
              <span className={styles.mobileNavIcon}>
                {renderIcon(item.icon, 18)}
              </span>
              <span className={styles.mobileNavLabel}>{item.label}</span>
            </NavLink>
          ))}
          <div
            className={styles.activeIndicator}
            style={{
              left: activeIndicatorStyle.left,
              width: activeIndicatorStyle.width,
            }}
          />
        </div>
      </div>

      {/* Основной контент */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default CabinetLayout;
