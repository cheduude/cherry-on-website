import React from 'react';
import styles from './Subscription.module.css';

const Subscription: React.FC = () => {
  const platforms = [
    { name: 'Windows', link: 'https://example.com/windows' },
    { name: 'macOS', link: 'https://example.com/macos' },
    { name: 'Android', link: 'https://example.com/android' },
    { name: 'iOS', link: 'https://example.com/ios' },
    { name: 'Linux', link: 'https://example.com/linux' },
  ];

  const configLink = 'https://example.com/config/subscription.txt';

  return (
    <div className={styles.subscription}>
      <h1 className={styles.title}>Подключение VPN</h1>

      <div className={styles.section}>
        <h2>Инструкция</h2>
        <ol className={styles.instructions}>
          <li>Скачайте приложение для вашей платформы</li>
          <li>Импортируйте конфигурацию по ссылке ниже</li>
          <li>Подключитесь и пользуйтесь</li>
        </ol>
      </div>

      <div className={styles.section}>
        <h2>Конфигурация</h2>
        <div className={styles.configLink}>
          <a href={configLink} target="_blank" rel="noopener noreferrer">
            Скачать конфигурацию
          </a>
        </div>
        <div className={styles.copyHint}>
          или скопируйте ссылку: <code>{configLink}</code>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Приложения по платформам</h2>
        <div className={styles.platformGrid}>
          {platforms.map(p => (
            <a key={p.name} href={p.link} className={styles.platformCard} target="_blank" rel="noopener noreferrer">
              {p.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;