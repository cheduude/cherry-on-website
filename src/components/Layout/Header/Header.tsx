// src/components/Layout/Header/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuAuth from './MenuAuth';
import styles from './Header.module.css';
import type { HeaderProps } from '../../../types';
import CherryLogo from '../../CherryLogo/CherryLogo';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import { useAuth } from '../../../hooks/useAuth';
import { MENU_CONFIG } from '../../../constants/menu';
import NotificationBell from './NotificationBell';
import { ResolvedAvatar } from '../../ui/ResolvedAvatar';
import {
  Home,
  Wrench,
  Star,
  Shield,
  LogIn,
  Mail,
  Clock,
  MessageCircle,
  LogOut,
  User,
  Lock,
  LifeBuoy,
} from 'lucide-react';

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Фильтрация пунктов меню пользователя для мобильной версии
  const getFilteredMenuItems = () => {
    if (!isAuthenticated || !user) return [];

    return MENU_CONFIG.filter(item => {
      if (item.id === 'logout') return false;
      if (item.adminOnly && item.roles) {
        return item.roles.includes(user.role || 'user');
      }
      return true;
    });
  };

  // Список пунктов навигации для мобильного меню с иконками lucide-react
  const mobileNavItems = [
    { to: '/', label: 'Главная', icon: Home },
    { to: '/services', label: 'Услуги', icon: Wrench },
    { to: '/testimonials', label: 'Отзывы', icon: Star },
  ];

  // Фильтруем навигационные пункты: скрываем текущую страницу
  const filteredMobileNavItems = mobileNavItems.filter(item => {
    if (item.to === '/') {
      return location.pathname !== '/';
    }
    return !location.pathname.startsWith(item.to);
  });

  // Функция для рендера иконки
  const renderIcon = (IconComponent: any, size: number = 20) => {
    return <IconComponent size={size} strokeWidth={1.5} />;
  };

  // Функция для получения компонента иконки по имени
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      User: User,
      Lock: Lock,
      LifeBuoy: LifeBuoy,
      LogOut: LogOut,
    };
    return icons[iconName];
  };

  // Закрываем меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest(`.${styles.mobileMenu}`) && !target.closest(`.${styles.menuToggle}`)) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Блокируем скролл при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const userMenuItems = getFilteredMenuItems();

  return (
    <header className={`${styles.header} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.container}>
        {/* Левая часть: логотип/название + мобильное меню */}
        <div className={styles.leftSection}>
          {isMobile && (
            <button
              className={`${styles.menuToggle} ${isMenuOpen ? styles.active : ''}`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isMenuOpen}
            >
              <span className={styles.hamburger}></span>
              <span className={styles.hamburger}></span>
              <span className={styles.hamburger}></span>
            </button>
          )}

          <Link to="/" className={styles.logoLink}>
            <span className={styles.logoIcon}>
              <CherryLogo />
            </span>
          </Link>
        </div>

        {/* Десктопная навигация */}
        {!isMobile && (
          <nav className={styles.nav} role="navigation" aria-label="Основное меню">
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link to="/" className={styles.navLink}>
                  <Home size={18} strokeWidth={1.5} className={styles.navIcon} />
                  Главная
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/services" className={styles.navLink}>
                  <Wrench size={18} strokeWidth={1.5} className={styles.navIcon} />
                  Услуги
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/testimonials" className={styles.navLink}>
                  <Star size={18} strokeWidth={1.5} className={styles.navIcon} />
                  Отзывы
                </Link>
              </li>
              {user?.role === 'admin' && (
                <li className={styles.navItem}>
                  <Link to="/admin" className={styles.navLink}>
                    <Shield size={18} strokeWidth={1.5} className={styles.navIcon} />
                    Админка
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}

        {/* Правая часть: авторизация, уведомления, переключатель темы */}
        <div className={styles.rightSection}>
          {!isMobile && (
            <>
              <MenuAuth isMobile={false} />
              <NotificationBell />
            </>
          )}
          {isMobile && isAuthenticated && <NotificationBell />}
          <ThemeToggle />
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobile && (
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileMenuLogo}>
                <div className={styles.mobileMenuLogoIcon}>
                  <CherryLogo />
                </div>
                <div className={styles.mobileMenuLogoText}>
                  <span className={styles.mobileMenuTitle}>CherryOn Services</span>
                  <span className={styles.mobileMenuSubtitle}>Авантюрный щитпост</span>
                </div>
              </div>
            </div>

            {/* Блок информации о пользователе (если авторизован) */}
            {isAuthenticated && user && (
              <div className={styles.userInfoSection}>
                <div className={styles.userInfoHeader}>
                  <ResolvedAvatar
                    avatar={user.avatar}
                    alt="Аватар"
                    className={styles.userAvatar}
                  />
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>
                      {user.displayName || user.name || user.username || 'Пользователь'}
                    </div>
                    {user.role && (
                      <div className={styles.userRole}>
                        <span className={styles.roleBadge}>{user.role.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Меню пользователя - скрываем пункт "Личный кабинет", если уже в кабинете */}
                <div className={styles.menuSection}>
                  <ul className={styles.mobileNavList}>
                    {userMenuItems
                      .filter(item => {
                        if (location.pathname.startsWith('/cabinet') && item.path === '/cabinet') {
                          return false;
                        }
                        return true;
                      })
                      .map(item => {
                        const IconComponent = getIconComponent(item.icon || '');
                        return (
                          <li key={item.id} className={styles.mobileNavItem}>
                            <Link
                              to={item.path}
                              className={styles.mobileNavLink}
                              onClick={closeMenu}
                            >
                              <span className={styles.mobileNavIcon}>
                                {IconComponent ? <IconComponent size={18} strokeWidth={1.5} /> : '📋'}
                              </span>
                              <div className={styles.navContent}>
                                <span className={styles.mobileNavText}>{item.label}</span>
                                {item.adminOnly && (
                                  <span className={styles.navBadge}>ADMIN</span>
                                )}
                              </div>
                            </Link>
                          </li>
                        );
                      })}

                    {/* Кнопка выхода */}
                    <li className={styles.mobileNavItem}>
                      <button
                        className={`${styles.mobileNavLink} ${styles.logoutButton}`}
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                      >
                        <span className={styles.mobileNavIcon}>
                          <LogOut size={18} strokeWidth={1.5} />
                        </span>
                        <div className={styles.navContent}>
                          <span className={styles.mobileNavText}>Выйти</span>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Основная навигация - фильтруем текущую страницу */}
            <div className={styles.menuSection}>
              <div className={styles.sectionTitle}>Навигация</div>
              <nav className={styles.mobileNav} role="navigation" aria-label="Мобильное меню">
                <ul className={styles.mobileNavList}>
                  {filteredMobileNavItems.map(item => (
                    <li key={item.to} className={styles.mobileNavItem}>
                      <Link
                        to={item.to}
                        className={styles.mobileNavLink}
                        onClick={closeMenu}
                      >
                        <span className={styles.mobileNavIcon}>
                          {renderIcon(item.icon, 18)}
                        </span>
                        <span className={styles.mobileNavText}>{item.label}</span>
                      </Link>
                    </li>
                  ))}

                  {!isAuthenticated && (
                    <li className={styles.mobileNavItem}>
                      <Link
                        to="/auth"
                        className={`${styles.mobileNavLink} ${styles.authLink}`}
                        onClick={closeMenu}
                      >
                        <span className={styles.mobileNavIcon}>
                          <LogIn size={19} strokeWidth={1.7} />
                        </span>
                        <span className={styles.mobileNavText}>Войти в аккаунт</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>

            {/* Блок поддержки */}
            <div className={styles.supportSection}>
              <div className={styles.supportTitle}>
                <span className={styles.supportIcon}>
                  <MessageCircle size={18} strokeWidth={1.5} />
                </span>
                Контакты
              </div>
              <a href="mailto:mainserev@cherryon.art" className={styles.supportItem}>
                <span className={styles.supportIcon}>
                  <Mail size={16} strokeWidth={1.5} />
                </span>
                <span className={styles.supportText}>
                  Email: <span className={styles.supportContact}>mainserev@cherryon.art</span>
                </span>
              </a>
              <div className={`${styles.supportItem} ${styles.supportItemStatic}`}>
                <span className={styles.supportIcon}>
                  <Clock size={16} strokeWidth={1.5} />
                </span>
                <span className={styles.supportText}>Работаем 24/7</span>
              </div>
            </div>

            {/* Футер меню */}
            <div className={styles.mobileMenuFooter}>
              <p className={styles.mobileMenuHours}>Всегда на связи</p>
              <p className={styles.mobileMenuCopyright}>© {new Date().getFullYear()} CherryOn</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
