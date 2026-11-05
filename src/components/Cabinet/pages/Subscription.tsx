// src/components/Cabinet/pages/Subscription.tsx
import React, { useState } from 'react';
import styles from './Subscription.module.css';
import { Copy, CheckCircle, Monitor, Apple, Smartphone, Server } from 'lucide-react';

const Subscription: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const configLink = 'https://example.com/config/subscription.txt';

  const platforms = [
    { name: 'Windows', icon: Monitor, link: 'https://example.com/windows' },
    { name: 'macOS', icon: Apple, link: 'https://example.com/macos' },
    { name: 'Android', icon: Smartphone, link: 'https://example.com/android' },
    { name: 'iOS', icon: Apple, link: 'https://example.com/ios' },
    { name: 'Linux', icon: Server, link: 'https://example.com/linux' },
  ];

  const copyConfigLink = () => {
    navigator.clipboard.writeText(configLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <button 
            className={`${styles.copyButton} ${copied ? styles.copied : ''}`} 
            onClick={copyConfigLink}
            aria-label={copied ? "Ссылка скопирована" : "Скопировать ссылку"}
          >
            {copied ? <CheckCircle size={20} strokeWidth={1.5} /> : <Copy size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Приложения по платформам</h2>
        <div className={styles.platformGrid}>
          {platforms.map(p => {
            const Icon = p.icon;
            return (
              <a key={p.name} href={p.link} className={styles.platformCard} target="_blank" rel="noopener noreferrer">
                <Icon size={18} strokeWidth={1.5} />
                <span>{p.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Subscription;