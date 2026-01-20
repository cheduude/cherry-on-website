// src/components/Layout/Header/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuAuth from './MenuAuth';
import styles from './Header.module.css';
import type { HeaderProps } from '../../../types';
import CherryLogo from '../../CherryLogo/CherryLogo';
import ThemeToggle from '../../ThemeToggle/ThemeToggle';
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
        {/* Правая часть: авторизация */}
        <div className={styles.rightSection}>
          <MenuAuth isMobile={isMobile} />
          <ThemeToggle />
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