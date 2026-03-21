import React, { useEffect, useState } from 'react';
import styles from './Referrals.module.css';
import api from '../lib/api';
import type { ReferralStats } from '../types/types';

const Referrals: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/client/referral-stats');
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const copyLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
      alert('Ссылка скопирована');
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <div className={styles.referrals}>
      <h1 className={styles.title}>Реферальная программа</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Приглашено</div>
          <div className={styles.cardValue}>{stats?.totalReferrals}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Заработано</div>
          <div className={styles.cardValue}>{stats?.totalEarned}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Уровень 1</div>
          <div className={styles.cardValue}>{stats?.level1}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Уровень 2</div>
          <div className={styles.cardValue}>{stats?.level2}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Уровень 3</div>
          <div className={styles.cardValue}>{stats?.level3}</div>
        </div>
      </div>

      <div className={styles.linkSection}>
        <h3>Ваша реферальная ссылка</h3>
        <div className={styles.linkBox}>
          <code className={styles.linkCode}>{stats?.referralLink}</code>
          <button onClick={copyLink} className={styles.copyButton}>Копировать</button>
        </div>
        <p className={styles.note}>Приглашайте друзей и получайте бонусы за их покупки!</p>
      </div>
    </div>
  );
};

export default Referrals;