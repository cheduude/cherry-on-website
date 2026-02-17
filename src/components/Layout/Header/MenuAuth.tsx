// src/components/Layout/Header/MenuAuth.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { MENU_CONFIG } from '../../../constants/menu';
import ProfilePanel from './ProfilePanel';
import styles from './MenuAuth.module.css';
import type { MenuAuthProps, MenuItem } from '../../../types';

const MenuAuth: React.FC<MenuAuthProps> = ({ isMobile }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'gif' | 'unknown'>('image');

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

  // Фильтрация пунктов меню
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

  const handleLogout = () => {
    logout();
    setIsPanelOpen(false);
  };

  // Рендер аватара (общий для всех состояний)
  const renderAvatar = (size: 'small' | 'medium' = 'medium') => {
    if (!user) return null;

    const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.displayName || user.name || user.username || 'User'
    )}&background=7C3AED&color=fff&size=${size === 'small' ? 32 : 120}&bold=true`;

    if (avatarError) {
      return (
        <div className={`${styles.avatar} ${styles.avatarFallback}`}>
          {user.displayName?.[0] || user.name?.[0] || user.username?.[0] || 'U'}
        </div>
      );
    }

    switch (mediaType) {
      case 'video':
        return (
          <video
            className={styles.avatar}
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
            className={styles.avatar}
            src={avatarUrl}
            alt={user.displayName || user.name || user.username || 'User'}
            onError={() => setAvatarError(true)}
          />
        );
    }
  };

  // Мобильная версия
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
        <Link to="/auth" className={styles.mobileLoginButton} aria-label="Войти">
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
            className={styles.loginButton}
            onClick={() => setIsPanelOpen(true)}
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
        </>
      ) : (
        <Link to="/auth" className={styles.loginButton} aria-label="Войти">
          <img
            src="https://ui-avatars.com/api/?name=User&background=7C3AED&color=fff&size=32&bold=true"
            alt="Login"
            className={styles.avatar}
          />
        </Link>
      )}
    </div>
  );
};

export default MenuAuth;