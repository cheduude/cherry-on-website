// src/components/Pages/Home/Home.tsx (Главная страница — плейсхолдер для услуг, готов к модернизации)
import React from 'react';
import styles from './Home.module.css';

const Home = ({ isMobile }) => {
  return (
    <div className={styles.home}>
      <h2>Добро пожаловать на наш домен!</h2>
      <p>Мы предоставляем услуги: VPN, прошивка роутеров, заказы из-за рубежа, подписки (Steam, ChatGPT, Grok, Spotify), сетевые диски NVMe.</p>
      <a href="/services">Посмотреть услуги</a>
    </div>
  );
};

export default Home;