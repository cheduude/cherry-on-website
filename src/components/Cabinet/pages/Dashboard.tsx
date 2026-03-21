import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import type { Subscription, Transaction } from '../types/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<{ date: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, transRes] = await Promise.all([
          api.get<Subscription>('/client/subscription'),
          api.get<Transaction[]>('/client/transactions?limit=10'),
        ]);
        setSubscription(subRes.data);
        setTransactions(Array.isArray(transRes.data) ? transRes.data : []);

        // для графика можно получить отдельные данные, пока заглушка
        setChartData([
          { date: '01.03', amount: 100 },
          { date: '05.03', amount: 200 },
          { date: '10.03', amount: 150 },
          { date: '15.03', amount: 300 },
          { date: '20.03', amount: 250 },
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  const trafficPercent = subscription
    ? (subscription.trafficUsed / subscription.trafficLimit) * 100
    : 0;

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Дашборд</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Баланс</div>
          <div className={styles.cardValue}>{user?.balance} {user?.currency}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Подписка</div>
          <div className={styles.cardValue}>
            {subscription?.status === 'active' ? 'Активна' : subscription?.status === 'trial' ? 'Триал' : 'Истекла'}
          </div>
          {subscription && (
            <div className={styles.cardSub}>
              до {new Date(subscription.expiresAt).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Трафик</div>
          <div className={styles.cardValue}>
            {subscription?.trafficUsed} / {subscription?.trafficLimit} GB
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${trafficPercent}%` }} />
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Устройства</div>
          <div className={styles.cardValue}>
            {subscription?.devicesUsed} / {subscription?.devicesLimit}
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.sectionTitle}>Динамика расходов</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" stroke="var(--color-text-muted)" />
            <YAxis stroke="var(--color-text-muted)" />
            <Tooltip contentStyle={{ background: 'var(--color-surface)', borderColor: 'var(--color-glass-border)' }} />
            <Line type="monotone" dataKey="amount" stroke="var(--color-accent)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.history}>
        <h3 className={styles.sectionTitle}>Последние операции</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Сумма</th>
              <th>Статус</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>{t.amount} {t.currency}</td>
                <td>
                  <span className={`${styles.status} ${styles[t.status]}`}>
                    {t.status === 'completed' ? 'Выполнено' : t.status === 'pending' ? 'Ожидает' : 'Ошибка'}
                  </span>
                </td>
                <td>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;