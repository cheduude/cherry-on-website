// src/components/Layout/Header/MenuAuth.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { MENU_CONFIG } from '../../../constants/menu';
import DropdownMenu from './DropdownMenu';
import styles from './MenuAuth.module.css';
import type { MenuAuthProps, MenuItem } from '../../../types';

const MenuAuth: React.FC<MenuAuthProps> = ({ isMobile }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginExpanded, setIsLoginExpanded] = useState(false);
  const [isAuthExpanded, setIsAuthExpanded] = useState(false);
  const authContainerRef = useRef<HTMLDivElement>(null);
  const loginLinkRef = useRef<HTMLAnchorElement>(null);
  

  // Фильтрация пунктов меню по ролям
  const getFilteredMenuItems = (): MenuItem[] => {
    if (!isAuthenticated || !user) return [];

    return MENU_CONFIG.filter(item => {
      // Пропускаем пункт "Выйти" в основном списке
      if (item.id === 'logout') return false;
      
      // Проверяем доступ для админских пунктов
      if (item.adminOnly && item.roles) {
        return item.roles.includes(user.role || 'user');
      }
      
      return true;
    }).map(item => ({
      id: item.id,
      label: item.label,
      path: item.path,
      icon: item.icon,
      adminOnly: item.adminOnly,
      roles: item.roles,
    }));
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.id === 'logout') {
      logout();
    }
    closeAuthMenu();
  };

  const openAuthMenu = () => {
    setIsAuthExpanded(true);
    setIsMenuOpen(true);
  };

  const closeAuthMenu = () => {
    setIsMenuOpen(false);
    setIsAuthExpanded(false);
  };

  const toggleAuthMenu = () => {
    if (isMenuOpen) {
      closeAuthMenu();
    } else {
      openAuthMenu();
    }
  };

  const closeLoginButton = () => {
    setIsLoginExpanded(false);
  };

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Проверяем для авторизованного контейнера
      if (authContainerRef.current && !authContainerRef.current.contains(target)) {
        closeAuthMenu();
      }
      
      // Проверяем для ссылки "Вход"
      if (loginLinkRef.current && !loginLinkRef.current.contains(target)) {
        closeLoginButton();
      }
    };

    if (isMenuOpen || isLoginExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, isLoginExpanded]);

  // Для мобильной версии
  if (isMobile) {
    const mobileItems = getFilteredMenuItems();
    
    return (
      <div className={styles.navigation}>
        {isAuthenticated && user ? (
          <div className={styles.authContainer} ref={authContainerRef}>
            <button
              className={`${styles.loginButton} ${isAuthExpanded ? styles.expanded : ''}`}
              onClick={toggleAuthMenu}
            >
              <img 
                src={user.avatar || 'https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg'} 
                alt="Avatar" 
                className={styles.avatar}
              />
              <div className={styles.buttonContent}>
                <div className={`${styles.buttonText} ${styles.userName}`}>
                  {user.displayName || user.name || user.username || 'Пользователь'}
                </div>
                <div className={styles.arrowIcon}>▼</div>
              </div>
            </button>
            {isMenuOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.menuItems}>
                  {mobileItems.map(item => (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={styles.menuItem}
                      onClick={() => handleMenuItemClick(item)}
                    >
                      {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
                      <span className={styles.menuLabel}>{item.label}</span>
                      {item.adminOnly && (
                        <span className={styles.adminBadge}>ADMIN</span>
                      )}
                    </Link>
                  ))}
                  <div className={styles.menuDivider}></div>
                  <button
                    className={`${styles.menuItem} ${styles.logoutItem}`}
                    onClick={logout}
                  >
                    <span className={styles.menuIcon}>🚪</span>
                    <span className={styles.menuLabel}>Выйти</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/auth"
            className={styles.loginButton}
            onMouseEnter={() => setIsLoginExpanded(true)}
            onMouseLeave={() => setIsLoginExpanded(false)}
            ref={loginLinkRef}
          >
            <div className={styles.avatarPlaceholder}>
              <img 
                src="https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg" 
                alt="Avatar" 
                className={styles.avatar}
              />
            </div>
            <div className={`${styles.buttonContent} ${isLoginExpanded ? styles.visible : ''}`}>
              <div className={`${styles.buttonText} ${styles.loginText}`}>
                Войти
              </div>
            </div>
          </Link>
        )}
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className={styles.navigation}>
      {isAuthenticated && user ? (
        <div 
          className={styles.authContainer} 
          ref={authContainerRef}
        >
          <button
            className={`${styles.loginButton} ${isAuthExpanded ? styles.expanded : ''}`}
            onClick={toggleAuthMenu}
          >
            <img 
              src={user.avatar || 'https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg'} 
              alt="Avatar" 
              className={styles.avatar}
            />
            <div className={styles.buttonContent}>
              <div className={`${styles.buttonText} ${styles.userName}`}>
                {user.displayName || user.name || user.username || 'Пользователь'}
              </div>
              
            </div>
          </button>
          
          <DropdownMenu
            isOpen={isMenuOpen}
            items={getFilteredMenuItems()}
            userRole={user?.role}
            onItemClick={handleMenuItemClick}
            onLogout={logout}
          />
        </div>
      ) : (
        <Link
          to="/auth"
          className={styles.loginButton}
          onMouseEnter={() => setIsLoginExpanded(true)}
          onMouseLeave={() => setIsLoginExpanded(false)}
          ref={loginLinkRef}
        >
          <div className={styles.avatarPlaceholder}>
            <img 
              src="https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg" 
              alt="Avatar" 
              className={styles.avatar}
            />
          </div>
          <div className={`${styles.buttonContent} ${isLoginExpanded ? styles.visible : ''}`}>
            <div className={`${styles.buttonText} ${styles.loginText}`}>
              Войти
            </div>
          </div>
        </Link>
      )}
    </div>
  );
};

export default MenuAuth;