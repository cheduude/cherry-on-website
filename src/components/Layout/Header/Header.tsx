// src/components/Layout/Header/Header.tsx (Хедер с подключением MenuAuth.tsx)
import React from 'react';
import MenuAuth from './MenuAuth';
import styles from './Header.module.css';
import type { HeaderProps } from '../../../types';



const Header: React.FC<HeaderProps> = ({ isMobile }) => {
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
          <MenuAuth isMobile={isMobile} />
        </nav>
      </div>
    </header>
  );
};

export default Header;