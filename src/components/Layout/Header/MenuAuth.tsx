// src/components/Layout/Header/MenuAuth.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { MENU_CONFIG } from '../../../constants/menu';
import ProfilePanel from './ProfilePanel';
import styles from './MenuAuth.module.css';
import type { MenuAuthProps, MenuItem } from '../../../types';

const MenuAuth: React.FC<MenuAuthProps> = ({ isMobile }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoginExpanded, setIsLoginExpanded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'gif' | 'unknown'>('image');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const loginLinkRef = useRef<HTMLAnchorElement>(null);

  // Определяем тип медиа по URL аватара
  useEffect(() => {
    if (user?.avatar) {
      const url = user.avatar.toLowerCase();
      if (url.endsWith('.gif') || url.includes('.gif?')) {
        setMediaType('gif');
      } else if (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || 
                 url.includes('.mp4?') || url.includes('.webm?') || url.includes('.ogg?')) {
        setMediaType('video');
      } else {
        setMediaType('image');
      }
    }
  }, [user?.avatar]);

  // Функция для фильтрации пунктов меню
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

  // Обработчик выхода
  const handleLogout = () => {
    logout();
    setIsPanelOpen(false);
  };

  // Закрытие при клике вне кнопки (для неавторизованного состояния)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (loginLinkRef.current && !loginLinkRef.current.contains(target)) {
        setIsLoginExpanded(false);
      }
    };

    if (isLoginExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLoginExpanded]);

  // Функция для рендера аватара в кнопке
  const renderAvatar = (size: 'small' | 'medium' = 'medium') => {
    if (!user) return null;

    const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.displayName || user.name || user.username || 'User'
    )}&background=7C3AED&color=fff&size=${size === 'small' ? 32 : 120}&bold=true`;

    const avatarClass = size === 'small' ? styles.avatar : styles.avatar;

    if (avatarError) {
      return (
        <div className={`${avatarClass} ${styles.avatarFallback}`}>
          {user.displayName?.[0] || user.name?.[0] || user.username?.[0] || 'U'}
        </div>
      );
    }

    switch (mediaType) {
      case 'video':
        return (
          <video
            className={avatarClass}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setAvatarError(true)}
          >
            <source src={avatarUrl} type="video/mp4" />
            <source src={avatarUrl} type="video/webm" />
            <source src={avatarUrl} type="video/ogg" />
          </video>
        );
      
      case 'gif':
      default:
        return (
          <img
            className={avatarClass}
            src={avatarUrl}
            alt={user.displayName || user.name || user.username || 'User'}
            onError={() => setAvatarError(true)}
          />
        );
    }
  };

  // Для мобильной версии
  if (isMobile) {
    if (isAuthenticated && user) {
      return (
        <div className={styles.navigation}>
          <button
            onClick={() => setIsPanelOpen(true)}
            className={styles.mobileAvatarButton}
            aria-label="Открыть профиль"
          >
            {renderAvatar('small')}
          </button>
          
          <ProfilePanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            user={user}
            menuItems={getFilteredMenuItems()}
            onLogout={handleLogout}
          />
        </div>
      );
    }
    
    return (
      <div className={styles.navigation}>
        <Link
          to="/auth"
          className={styles.mobileLoginButton}
          aria-label="Войти"
        >
          <span className={styles.mobileLoginIcon}>🔐</span>
        </Link>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className={styles.navigation}>
      {isAuthenticated && user ? (
        <>
          <button
            ref={buttonRef}
            className={`${styles.loginButton} ${isPanelOpen ? styles.expanded : ''}`}
            onClick={() => setIsPanelOpen(true)}
            aria-label="Открыть профиль"
            aria-expanded={isPanelOpen}
          >
            {renderAvatar('small')}
            <div className={styles.buttonContent}>
              <div className={`${styles.buttonText} ${styles.userName}`}>
                {user.displayName || user.name || user.username || 'Пользователь'}
              </div>
            </div>
          </button>
          
          <ProfilePanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            user={user}
            menuItems={getFilteredMenuItems()}
            onLogout={handleLogout}
          />
        </>
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
              src="https://ui-avatars.com/api/?name=User&background=7C3AED&color=fff&size=32&bold=true" 
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