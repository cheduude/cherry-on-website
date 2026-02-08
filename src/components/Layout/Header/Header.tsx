// src/components/Layout/Header/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuAuth from './MenuAuth';
import styles from './Header.module.css';
import type { HeaderProps } from '../../../types';
import CherryLogo from '../../CherryLogo/CherryLogo';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import { useAuth } from '../../../hooks/useAuth';
import { MENU_CONFIG } from '../../../constants/menu';

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeItem, setActiveItem] = useState<string>('');

  const toggleMenu = () => {
    if (isClosing) return;
    
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
    }
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 250);
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

  const handleMenuItemClick = (item: any) => {
    setActiveItem(item.id);
    if (item.id === 'logout') {
      logout();
    }
    closeMenu();
  };

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mobileMenu = document.querySelector(`.${styles.mobileMenu}`);
      const menuToggle = document.querySelector(`.${styles.menuToggle}`);
      
      if (isMenuOpen && 
          mobileMenu && 
          !mobileMenu.contains(target) && 
          menuToggle && 
          !menuToggle.contains(target)) {
        closeMenu();
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    
    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  // Блокируем скролл при открытом меню
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Компенсация скроллбара
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
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
              className={`${styles.menuToggle} ${isMenuOpen ? styles.active : ''} ${isClosing ? styles.closing : ''}`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className={`${styles.hamburger} ${styles.line1}`}></span>
              <span className={`${styles.hamburger} ${styles.line2}`}></span>
              <span className={`${styles.hamburger} ${styles.line3}`}></span>
              <span className={styles.menuToggleGlow}></span>
            </button>
          )}
          
          <Link to="/" className={styles.logoLink} aria-label="На главную">
            <div className={styles.logoContainer}>
              <span className={styles.logoIcon}>
                <CherryLogo />
              </span>
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>CherryOn Services</span>
                <span className={styles.logoSubtitle}>Авантюрный щитпост</span>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Десктопная навигация */}
        {!isMobile && (
          <nav className={styles.nav} role="navigation" aria-label="Основное меню">
            <ul className={styles.navList}>
              {[
                { path: '/', label: 'Главная', icon: '🏠' },
                { path: '/services', label: 'Услуги', icon: '🔧' },
                { path: '/contacts', label: 'Контакты', icon: '📞' },
                { path: '/admin', label: 'Админка', icon: '⚙️' },
              ].map((item) => (
                <li key={item.path} className={styles.navItem}>
                  <Link 
                    to={item.path} 
                    className={styles.navLink}
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
                    <span className={styles.navText}>{item.label}</span>
                    <span className={styles.navUnderline}></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        
        {/* Правая часть: авторизация + переключатель темы */}
        <div className={styles.rightSection}>
          {!isMobile && <MenuAuth isMobile={false} />}
          <ThemeToggle />
          
          {/* Мобильная версия кнопки входа */}
          {isMobile && <MenuAuth isMobile={true} />}
        </div>
      </div>
      
      {/* Мобильное меню */}
      {isMobile && (
        <div 
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''} ${isClosing ? styles.closing : ''}`}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Мобильное меню"
        >
          <div className={styles.mobileMenuOverlay} onClick={closeMenu}></div>
          
          <div className={styles.mobileMenuContent}>
            {/* Шапка меню */}
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileMenuLogo}>
                <div className={styles.mobileMenuLogoIcon} aria-hidden="true">
                  <CherryLogo />
                </div>
                <div className={styles.mobileMenuLogoText}>
                  <span className={styles.mobileMenuTitle}>CherryOn Services</span>
                  <span className={styles.mobileMenuSubtitle}>Авантюрный щитпост</span>
                </div>
              </div>
              
              <button
                className={styles.closeButton}
                onClick={closeMenu}
                aria-label="Закрыть меню"
              >
                <svg className={styles.closeIcon} width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            {/* Блок информации о пользователе (если авторизован) */}
            {isAuthenticated && user && (
              <div className={styles.userInfoSection}>
                <div className={styles.userInfoHeader}>
                  <div className={styles.avatarContainer}>
                    <img
                      src={user.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                      alt="Аватар пользователя"
                      className={styles.userAvatar}
                      loading="lazy"
                    />
                    <div className={styles.avatarStatus}></div>
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>
                      {user.displayName || user.name || user.username || 'Пользователь'}
                    </div>
                    <div className={styles.userDetails}>
                      {user.email && (
                        <div className={styles.userEmail}>{user.email}</div>
                      )}
                      {user.role && (
                        <div className={styles.userRole}>
                          <span className={styles.roleBadge}>
                            {user.role === 'admin' ? 'АДМИНИСТРАТОР' : 'ПОЛЬЗОВАТЕЛЬ'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Меню пользователя */}
                <div className={styles.menuSection}>
                  <div className={styles.sectionTitle}>
                    <svg className={styles.sectionIcon} width="16" height="16" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    Личный кабинет
                  </div>
                  
                  <nav className={styles.userNav} aria-label="Меню пользователя">
                    <ul className={styles.mobileNavList}>
                      {userMenuItems.map(item => (
                        <li key={item.id} className={styles.mobileNavItem}>
                          <Link
                            to={item.path}
                            className={`${styles.mobileNavLink} ${activeItem === item.id ? styles.active : ''}`}
                            onClick={() => handleMenuItemClick(item)}
                            aria-current={activeItem === item.id ? 'page' : undefined}
                          >
                            <span className={styles.mobileNavIcon} aria-hidden="true">
                              {item.icon || '📋'}
                            </span>
                            <div className={styles.navContent}>
                              <span className={styles.mobileNavText}>{item.label}</span>
                              {item.adminOnly && (
                                <span className={styles.navBadge} aria-label="Только для администраторов">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <svg className={styles.chevronIcon} width="16" height="16" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                            </svg>
                          </Link>
                        </li>
                      ))}
                      
                      {/* Кнопка выхода */}
                      <li className={styles.mobileNavItem}>
                        <button
                          className={`${styles.mobileNavLink} ${styles.logoutButton}`}
                          onClick={() => {
                            logout();
                            closeMenu();
                          }}
                          aria-label="Выйти из аккаунта"
                        >
                          <span className={styles.mobileNavIcon} aria-hidden="true">🚪</span>
                          <div className={styles.navContent}>
                            <span className={styles.mobileNavText}>Выйти</span>
                          </div>
                          <svg className={styles.chevronIcon} width="16" height="16" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
            
            {/* Основная навигация */}
            <div className={styles.menuSection}>
              <div className={styles.sectionTitle}>
                <svg className={styles.sectionIcon} width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                </svg>
                Навигация
              </div>
              
              <nav className={styles.mobileNav} role="navigation" aria-label="Мобильное меню">
                <ul className={styles.mobileNavList}>
                  {[
                    { path: '/', label: 'Главная', icon: '🏠' },
                    { path: '/services', label: 'Услуги', icon: '🔧' },
                    { path: '/contacts', label: 'Контакты', icon: '📞' },
                  ].map(item => (
                    <li key={item.path} className={styles.mobileNavItem}>
                      <Link
                        to={item.path}
                        className={`${styles.mobileNavLink} ${location.pathname === item.path ? styles.active : ''}`}
                        onClick={closeMenu}
                        aria-current={location.pathname === item.path ? 'page' : undefined}
                      >
                        <span className={styles.mobileNavIcon} aria-hidden="true">{item.icon}</span>
                        <span className={styles.mobileNavText}>{item.label}</span>
                        <svg className={styles.chevronIcon} width="16" height="16" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                      </Link>
                    </li>
                  ))}
                  
                  {/* Кнопка входа для неавторизованных */}
                  {!isAuthenticated && (
                    <li className={styles.mobileNavItem}>
                      <Link
                        to="/auth"
                        className={`${styles.mobileNavLink} ${styles.authLink}`}
                        onClick={closeMenu}
                      >
                        <span className={styles.mobileNavIcon} aria-hidden="true">🔐</span>
                        <div className={styles.navContent}>
                          <span className={styles.mobileNavText}>Войти в аккаунт</span>
                          <span className={styles.authHint}>Полный доступ</span>
                        </div>
                        <svg className={styles.chevronIcon} width="16" height="16" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
            
            {/* Блок поддержки */}
            <div className={styles.supportSection}>
              <div className={styles.supportTitle}>
                <svg className={styles.supportIcon} width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
                Поддержка
              </div>
              
              <div className={styles.supportItems}>
                <a 
                  href="mailto:support@mydomain.ru" 
                  className={styles.supportItem}
                  onClick={closeMenu}
                >
                  <span className={styles.supportItemIcon} aria-hidden="true">✉️</span>
                  <div className={styles.supportItemContent}>
                    <span className={styles.supportItemText}>Email поддержка</span>
                    <span className={styles.supportContact}>support@mydomain.ru</span>
                  </div>
                </a>
                
                <div className={styles.supportItem}>
                  <span className={styles.supportItemIcon} aria-hidden="true">🕐</span>
                  <div className={styles.supportItemContent}>
                    <span className={styles.supportItemText}>Режим работы</span>
                    <span className={styles.supportContact}>24/7</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Футер меню */}
            <div className={styles.mobileMenuFooter}>
              <div className={styles.footerContent}>
                <p className={styles.mobileMenuHours}>
                  <svg className={styles.footerIcon} width="14" height="14" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                  Всегда на связи
                </p>
                <p className={styles.mobileMenuCopyright}>
                  © {new Date().getFullYear()} CherryOn Services
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;