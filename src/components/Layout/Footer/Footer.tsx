// src/components/Layout/Footer/Footer.tsx (Футер с ручной сайт-мапой)
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <ul className={styles.sitemap}>
          <li><a href="/">Главная</a></li>
          <li><a href="/services">Услуги</a></li>
          <li><a href="/contacts">Контакты</a></li>
          <li><a href="/privacy">Политика конфиденциальности</a></li>
        </ul>
        <p>Поддержка: support@domain.com</p>
        <p>© 2025 Мой Домен. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;