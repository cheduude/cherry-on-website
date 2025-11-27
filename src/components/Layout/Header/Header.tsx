// src/components/Layout/Header/Header.tsx (Хедер с подключением MenuAuth.tsx)
import React from 'react';
import MenuAuth from './MenuAuth';
import styles from './Header.module.css';

const Header = ({ isMobile, isAuthenticated }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1>Мой Домен: Услуги</h1>
        <nav className={styles.nav}>
          <ul>
            <li><a href="/">Главная</a></li>
            <li><a href="/services">Услуги</a></li>
            <li><a href="/contacts">Контакты</a></li>
          </ul>
        </nav>
        <MenuAuth isAuthenticated={isAuthenticated} isMobile={isMobile} />
      </div>
    </header>
  );
};

export default Header;