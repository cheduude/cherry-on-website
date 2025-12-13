// src/components/Layout/Header/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import MenuAuth from './MenuAuth';
import styles from './Header.module.css';
import type { HeaderProps } from '../../../types';

const Header: React.FC<HeaderProps> = ({ isMobile }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h1 className={styles.title}>Мой Домен: Услуги</h1>

          <nav className={styles.nav}>
            <ul>
              <li><Link to="/">Главная</Link></li>
              <li><Link to="/services">Услуги</Link></li>
              <li><Link to="/contacts">Контакты</Link></li>
            </ul>
          </nav>
        </div>

        {/* Кнопка логина — НЕ ТРОГАЕМ */}
        <MenuAuth isMobile={isMobile} />
      </div>
    </header>
  );
};

export default Header;
