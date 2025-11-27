// src/components/Pages/Services/Services.tsx (Страница услуг — плейсхолдеры для блоков, lazy подгрузка)
import React from 'react';
import purify from 'dompurify';  // XSS защита для desc
import styles from './Services.module.css';

const services = [
  { name: 'VPN', desc: 'Безопасный VPN.' },
  { name: 'Прошивка роутера', desc: 'Кастомные настройки.' },
  // ... добавь все
];

const Services = ({ isMobile, isAuthenticated }) => {
  return (
    <div className={styles.services}>
      <h2>Наши услуги</h2>
      <div className={styles.grid}>
        {services.map((service, i) => (
          <div key={i} className={styles.card}>
            <h3>{service.name}</h3>
            <p dangerouslySetInnerHTML={{ __html: purify.sanitize(service.desc) }} />
            {isAuthenticated && <button>Заказать</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;