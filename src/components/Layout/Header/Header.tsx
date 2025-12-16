// src/components/Layout/Header/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuAuth from './MenuAuth';
import styles from './Header.module.css';
import type { HeaderProps } from '../../../types';

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Закрываем меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest(`.${styles.mobileNav}`) && !target.closest(`.${styles.menuToggle}`)) {
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

  return (
    <header className={`${styles.header} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.container}>
        {/* Левая часть: иконка + логотип/название + мобильное меню */}
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
            {/* Иконка для десктопной версии */}
            {!isMobile && (
              <div className={styles.logoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            
            <h1 className={styles.logo}>
              Мой Домен
              <span className={styles.logoSubtitle}>Услуги</span>
            </h1>
          </Link>
        </div>

        {/* Десктопная навигация */}
        {!isMobile && (
          <nav className={styles.nav} role="navigation" aria-label="Основное меню">
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link to="/" className={styles.navLink}>
                  <span className={styles.navIcon}>🏠</span>
                  <span className={styles.navText}>Главная</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/services" className={styles.navLink}>
                  <span className={styles.navIcon}>🔧</span>
                  <span className={styles.navText}>Услуги</span>
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/contacts" className={styles.navLink}>
                  <span className={styles.navIcon}>📞</span>
                  <span className={styles.navText}>Контакты</span>
                </Link>
              </li>
            </ul>
          </nav>
        )}

        {/* Правая часть: авторизация */}
        <div className={styles.rightSection}>
          <MenuAuth isMobile={isMobile} />
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobile && (
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileMenuHeader}>
              <span className={styles.mobileMenuTitle}>Меню</span>
              
            </div>
            
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
              </ul>
            </nav>
            
            <div className={styles.mobileMenuFooter}>
              <div className={styles.mobileMenuInfo}>
                <p className={styles.mobileMenuContact}>support@mydomain.ru</p>
                <p className={styles.mobileMenuHours}>Работаем 24/7</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;