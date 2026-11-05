// src/components/Admin/AnalyticsUI.tsx
import React from 'react';
import styles from './AdminUI.module.css';

const AnalyticsUI: React.FC = () => {
  return (
    <div className={styles.analyticsUI}>
      <div className={styles.header}>
        <h2>Аналитика</h2>
        <p className={styles.subtitle}>Статистика посещений и продаж</p>
      </div>

      <div className={styles.analyticsGrid}>
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsIcon}>👥</div>
          <div className={styles.analyticsValue}>—</div>
          <div className={styles.analyticsLabel}>Всего посетителей</div>
          <div className={styles.analyticsNote}>В разработке</div>
        </div>
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsIcon}>📊</div>
          <div className={styles.analyticsValue}>—</div>
          <div className={styles.analyticsLabel}>Конверсия</div>
          <div className={styles.analyticsNote}>В разработке</div>
        </div>
        <div className={styles.analyticsCard}>
          <div className={styles.analyticsIcon}>💰</div>
          <div className={styles.analyticsValue}>—</div>
          <div className={styles.analyticsLabel}>Средний чек</div>
          <div className={styles.analyticsNote}>В разработке</div>
        </div>
      </div>

      <div className={styles.placeholderChart}>
        <i className="fas fa-chart-line"></i>
        <p>Графики и статистика появятся после подключения аналитики</p>
      </div>
    </div>
  );
};

export default AnalyticsUI;