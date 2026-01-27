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
  
  // Для мобильной версии показываем только компактную кнопку
  if (isMobile) {
    if (isAuthenticated && user) {
      return (
        <div className={styles.navigation}>
          <Link
            to="/profile"
            className={styles.mobileAvatarButton}
          >
            <img 
              src={user.avatar || 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32&bold=true'} 
              alt="Avatar" 
              className={styles.mobileAvatar}
            />
          </Link>
        </div>
      );
    }
    
    return (
      <div className={styles.navigation}>
        <Link
          to="/auth"
          className={styles.mobileLoginButton}
        >
          <span className={styles.mobileLoginIcon}>🔐</span>
        </Link>
      </div>
    );
  }

  // Десктопная версия (остается без изменений)
  const getFilteredMenuItems = (): MenuItem[] => {
    if (!isAuthenticated || !user) return [];

    return MENU_CONFIG.filter(item => {
      if (item.id === 'logout') return false;
      
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
      
      if (authContainerRef.current && !authContainerRef.current.contains(target)) {
        closeAuthMenu();
      }
      
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
              src={user.avatar || 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32&bold=true'} 
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
              src="https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32&bold=true" 
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