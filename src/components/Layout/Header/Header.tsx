// src/components/Layout/Header/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuAuth from './MenuAuth';
import styles from './Header.module.css';
import type { HeaderProps } from '../../../types';
import CherryLogo from '../../CherryLogo/CherryLogo';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
import { useAuth } from '../../../hooks/useAuth'; // Добавляем useAuth
import { MENU_CONFIG } from '../../../constants/menu'; // Добавляем конфиг меню

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const { isAuthenticated, user, logout } = useAuth(); // Получаем данные аутентификации
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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

  const handleMenuItemClick = (item: any) => {
    if (item.id === 'logout') {
      logout();
    }
    closeMenu();
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
                <Link to="/" className={styles.navLink}>Главная</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/services" className={styles.navLink}>Услуги</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/contacts" className={styles.navLink}>Контакты</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/admin" className={styles.navLink}>Админка</Link>
              </li>
            </ul>
          </nav>
        )}
        
        {/* Правая часть: авторизация (только для десктопа) */}
        <div className={styles.rightSection}>
          {!isMobile && <MenuAuth isMobile={false} />}
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
                  <img 
                    src={user.avatar || 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=64&bold=true'} 
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
                
                {/* Меню пользователя */}
                <div className={styles.menuSection}>
                  <div className={styles.sectionTitle}>Личный кабинет</div>
                  <ul className={styles.mobileNavList}>
                    {userMenuItems.map(item => (
                      <li key={item.id} className={styles.mobileNavItem}>
                        <Link
                          to={item.path}
                          className={styles.mobileNavLink}
                          onClick={closeMenu}
                        >
                          <span className={styles.mobileNavIcon}>{item.icon || '📋'}</span>
                          <div className={styles.navContent}>
                            <span className={styles.mobileNavText}>{item.label}</span>
                            {item.adminOnly && (
                              <span className={styles.navBadge}>ADMIN</span>
                            )}
                          </div>
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
                      >
                        <span className={styles.mobileNavIcon}>🚪</span>
                        <div className={styles.navContent}>
                          <span className={styles.mobileNavText}>Выйти</span>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Основная навигация */}
            <div className={styles.menuSection}>
              <div className={styles.sectionTitle}>Навигация</div>
              <nav className={styles.mobileNav} role="navigation" aria-label="Мобильное меню">
                <ul className={styles.mobileNavList}>
                  <li className={styles.mobileNavItem}>
                    <Link
                      to="/"
                      className={styles.mobileNavLink}
                      onClick={closeMenu}
                    >
                      <span className={styles.mobileNavIcon}>🏠</span>
                      <span className={styles.mobileNavText}>Главная</span>
                    </Link>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <Link
                      to="/services"
                      className={styles.mobileNavLink}
                      onClick={closeMenu}
                    >
                      <span className={styles.mobileNavIcon}>🔧</span>
                      <span className={styles.mobileNavText}>Услуги</span>
                    </Link>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <Link
                      to="/contacts"
                      className={styles.mobileNavLink}
                      onClick={closeMenu}
                    >
                      <span className={styles.mobileNavIcon}>📞</span>
                      <span className={styles.mobileNavText}>Контакты</span>
                    </Link>
                  </li>
                  {!isAuthenticated && (
                    <li className={styles.mobileNavItem}>
                      <Link
                        to="/auth"
                        className={`${styles.mobileNavLink} ${styles.authLink}`}
                        onClick={closeMenu}
                      >
                        <span className={styles.mobileNavIcon}>🔐</span>
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
                <span className={styles.supportIcon}>💬</span>
                Поддержка
              </div>
              <a href="mailto:support@mydomain.ru" className={styles.supportItem}>
                <span className={styles.supportIcon}>✉️</span>
                <span className={styles.supportText}>
                  Email: <span className={styles.supportContact}>support@mydomain.ru</span>
                </span>
              </a>
              <div className={styles.supportItem}>
                <span className={styles.supportIcon}>🕐</span>
                <span className={styles.supportText}>Работаем 24/7</span>
              </div>
            </div>
            
            {/* Футер меню */}
            <div className={styles.mobileMenuFooter}>
              <p className={styles.mobileMenuHours}>Всегда на связи</p>
              <p className={styles.mobileMenuCopyright}>© {new Date().getFullYear()} Сетевые услуги</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;