// src/components/Layout/Header/ProfilePanel.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfilePanel.module.css';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    avatar?: string;
    displayName?: string;
    name?: string;
    username?: string;
    role?: string;
    email?: string;
    phone?: string;
  } | null;
  menuItems: Array<{
    id: string;
    label: string;
    path: string;
    icon?: string;
    adminOnly?: boolean;
  }>;
  onLogout: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  isOpen,
  onClose,
  user,
  menuItems,
  onLogout,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
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

  // Закрытие по Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Блокировка скролла при открытой панели
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Закрытие при клике вне панели
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  // Разделяем пункты меню на основные и дополнительные
  const mainMenuItems = menuItems.slice(0, 4);
  const additionalMenuItems = menuItems.slice(4);

  // Функция для рендера аватара с поддержкой разных форматов
  const renderAvatar = () => {
    const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.displayName || user.name || user.username || 'User'
    )}&background=7C3AED&color=fff&size=120&bold=true&length=2`;

    const commonProps = {
      className: styles.avatar,
      style: { objectFit: 'cover' as const }
    };

    // Если произошла ошибка загрузки, показываем заглушку
    if (avatarError) {
      return (
        <div className={styles.avatarFallback}>
          {user.displayName?.[0] || user.name?.[0] || user.username?.[0] || 'U'}
        </div>
      );
    }

    // Рендерим в зависимости от типа медиа
    switch (mediaType) {
      case 'video':
        return (
          <video
            {...commonProps}
            autoPlay
            loop
            muted
            playsInline
            onError={() => setAvatarError(true)}
          >
            <source src={avatarUrl} type="video/mp4" />
            <source src={avatarUrl} type="video/webm" />
            <source src={avatarUrl} type="video/ogg" />
            Ваш браузер не поддерживает видео.
          </video>
        );
      
      case 'gif':
        return (
          <img
            {...commonProps}
            src={avatarUrl}
            alt={user.displayName || user.name || user.username || 'User'}
            onError={() => setAvatarError(true)}
          />
        );
      
      default:
        return (
          <img
            {...commonProps}
            src={avatarUrl}
            alt={user.displayName || user.name || user.username || 'User'}
            onError={() => setAvatarError(true)}
          />
        );
    }
  };

  return (
    <>
      {/* Оверлей */}
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
        aria-hidden="true"
      />

      {/* Панель */}
      <div
        ref={panelRef}
        className={`${styles.panel} ${isOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Профиль пользователя"
      >
        {/* Кнопка закрытия */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть панель"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Шапка профиля */}
        <div className={styles.header}>
          <div className={styles.avatarWrapper}>
            {renderAvatar()}
            {user.role && (
              <span className={styles.roleBadge}>
                {user.role === 'admin' ? '👑' : '⚡'}
              </span>
            )}
          </div>

          <div className={styles.userInfo}>
            <h2 className={styles.userName}>
              {user.displayName || user.name || user.username || 'Пользователь'}
            </h2>
            {user.role && (
              <span className={styles.userRole}>
                {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </span>
            )}
          </div>
        </div>

        {/* Основное меню */}
        <div className={styles.menuSection}>
          <h3 className={styles.sectionTitle}>Навигация</h3>
          <nav className={styles.menuNav}>
            {mainMenuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={styles.menuItem}
                onClick={onClose}
              >
                <span className={styles.menuIcon}>{item.icon || '📋'}</span>
                <span className={styles.menuLabel}>{item.label}</span>
                {item.adminOnly && (
                  <span className={styles.adminBadge}>ADMIN</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Дополнительное меню */}
        {additionalMenuItems.length > 0 && (
          <div className={styles.menuSection}>
            <h3 className={styles.sectionTitle}>Дополнительно</h3>
            <nav className={styles.menuNav}>
              {additionalMenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={styles.menuItem}
                  onClick={onClose}
                >
                  <span className={styles.menuIcon}>{item.icon || '📋'}</span>
                  <span className={styles.menuLabel}>{item.label}</span>
                  {item.adminOnly && (
                    <span className={styles.adminBadge}>ADMIN</span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Кнопка выхода */}
        <button
          className={styles.logoutButton}
          onClick={() => {
            onLogout();
            onClose();
          }}
        >
          <span className={styles.logoutIcon}>🚪</span>
          <span className={styles.logoutText}>Выйти из аккаунта</span>
        </button>

        {/* Версия приложения */}
        <div className={styles.version}>
          <span>Версия 2.0.0</span>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;