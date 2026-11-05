// src/components/Cabinet/pages/Referrals.tsx
import React, { useEffect, useState } from 'react';
import styles from './Referrals.module.css';
import api from '../../../lib/api';
import type { ReferralStats } from '../types/types';
import { Users, Gift, Copy, CheckCircle } from 'lucide-react';

const Referrals: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data } = await api.get<ReferralStats>('/client/referral-stats');
        setStats(data);
      } catch (err: any) {
        console.error('Referral stats error:', err);
        setError(err.response?.data?.message || 'Ошибка загрузки статистики');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;
  if (!stats) return <div className={styles.noData}>Нет данных</div>;

  return (
    <div className={styles.referrals}>
      <h1 className={styles.title}>Реферальная программа</h1>

      <div className={styles.cards}>
        {/* Карточка с количеством приглашённых */}
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <Users size={28} strokeWidth={1.5} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardTitle}>Приглашено друзей</div>
            <div className={styles.cardValue}>{stats.totalReferrals}</div>
          </div>
        </div>

        {/* Карточка со скидкой от приглашённых */}
        <div className={styles.card}>
          <div className={styles.cardIcon}>
            <Gift size={28} strokeWidth={1.5} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardTitle}>Скидка от приглашённых</div>
            <div className={styles.cardValue}>{stats.totalEarned}%</div>
            <div className={styles.cardNote}>на следующий платёж</div>
          </div>
        </div>
      </div>

      <div className={styles.linkSection}>
        <h3>Ваша реферальная ссылка</h3>
        <div className={styles.linkBox}>
          <code className={styles.linkCode}>{stats.referralLink || 'Ссылка будет доступна позже'}</code>
          <button 
            className={`${styles.copyButton} ${copied ? styles.copied : ''}`} 
            onClick={copyLink}
            aria-label={copied ? "Ссылка скопирована" : "Скопировать ссылку"}
          >
            {copied ? <CheckCircle size={18} strokeWidth={1.5} /> : <Copy size={18} strokeWidth={1.5} />}
          </button>
        </div>
        <p className={styles.note}>
          Приглашайте друзей — каждый приглашённый даёт вам скидку на следующие платежи!
        </p>
      </div>
    </div>
  );
};

export default Referrals;