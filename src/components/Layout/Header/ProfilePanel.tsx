// src/components/Layout/Header/ProfilePanel.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProfilePanel.module.css';
import { resolveAvatarUrl } from '../../../constants/auth';
import { X, LogOut, LayoutDashboard, LifeBuoy, Lock, User, Shield, Home, Wrench, Star, Phone } from 'lucide-react';

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

  // Если пользователя нет — не рендерим ничего (панель не показывается даже при isOpen)
  if (!user) return null;

  // Разделяем пункты меню на основные и дополнительные
  const mainMenuItems = menuItems.slice(0, 4);
  const additionalMenuItems = menuItems.slice(4);

  // Функция для рендера иконки по имени/ID
  const renderIcon = (itemId: string, iconName?: string, size: number = 18) => {
    // Сначала проверяем по ID пункта меню
    switch (itemId) {
      case 'cabinet':
        return <User size={size} strokeWidth={1.5} />;
      case 'support':
        return <LifeBuoy size={size} strokeWidth={1.5} />;
      case 'access':
        return <Lock size={size} strokeWidth={1.5} />;
      case 'home':
        return <Home size={size} strokeWidth={1.5} />;
      case 'services':
        return <Wrench size={size} strokeWidth={1.5} />;
      case 'testimonials':
        return <Star size={size} strokeWidth={1.5} />;
      case 'contacts':
        return <Phone size={size} strokeWidth={1.5} />;
      default:
        // Если ID не найден, пробуем по iconName
        switch (iconName) {
          case '👤':
          case 'User':
            return <User size={size} strokeWidth={1.5} />;
          case '🛟':
          case 'LifeBuoy':
            return <LifeBuoy size={size} strokeWidth={1.5} />;
          case '🔐':
          case 'Lock':
            return <Lock size={size} strokeWidth={1.5} />;
          default:
            return <LayoutDashboard size={size} strokeWidth={1.5} />;
        }
    }
  };

  // Функция для рендера аватара с поддержкой разных форматов и заглушкой из lucide-react
  const renderAvatar = () => {
    const avatarUrl = resolveAvatarUrl(user.avatar);

    // Если произошла ошибка загрузки — локальная SVG-заглушка через img не нужна: lucide fallback
    if (avatarError) {
      return (
        <div className={styles.avatarFallback}>
          <User size={48} strokeWidth={1.2} />
        </div>
      );
    }

    // Рендерим в зависимости от типа медиа
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
            Ваш браузер не поддерживает видео.
          </video>
        );
      
      case 'gif':
        return (
          <img
            className={styles.avatar}
            src={avatarUrl}
            alt={user.displayName || user.name || user.username || 'User'}
            onError={() => setAvatarError(true)}
          />
        );
      
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

  return (
    <>
      {/* Оверлей всегда в DOM, видимость через класс visible */}
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${isOpen ? styles.visible : ''}`}
        aria-hidden="true"
      />

      {/* Панель всегда в DOM, видимость через класс open */}
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
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Шапка профиля */}
        <div className={styles.header}>
          <div className={styles.avatarWrapper}>
            {renderAvatar()}
          </div>

          <div className={styles.userInfo}>
            <h2 className={styles.userName}>
              {user.displayName || user.name || user.username || 'Пользователь'}
            </h2>
            {/* Отображаем роль только для администратора */}
            {user.role === 'admin' && (
              <span className={styles.userRole}>
                <Shield size={14} strokeWidth={1.5} style={{ marginRight: '4px' }} />
                Администратор
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
                <span className={styles.menuIcon}>
                  {renderIcon(item.id, item.icon, 18)}
                </span>
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
                  <span className={styles.menuIcon}>
                    {renderIcon(item.id, item.icon, 18)}
                  </span>
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
          <span className={styles.logoutIcon}>
            <LogOut size={18} strokeWidth={1.5} />
          </span>
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
