// src/components/Cabinet/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import api from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Wifi, Smartphone, Calendar, AlertCircle } from 'lucide-react';

interface VpnUser {
  device_limit: number;
  email: string;
  expiry_time: {
    nanos: number;
    seconds: number;
  };
  internal_squads: string[];
  sub_url: string;
  tgid: string;
  username: string;
  uuid: string;
}

interface VpnResponse {
  users: VpnUser[];
}

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'payment' | 'referral_bonus';
  createdAt: string;
  description: string;
}

// Мок-данные для дашборда (пока нет транзакций)
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    amount: 500,
    currency: 'RUB',
    status: 'completed',
    type: 'payment',
    createdAt: new Date().toISOString(),
    description: 'Оплата тарифа "Стандарт"',
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [vpnData, setVpnData] = useState<VpnUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<{ date: string; amount: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Получаем данные VPN подписки
        if (user?.username) {
          // Формируем email для Remna в формате username@cherryon.art
          const remnaEmail = `${user.username}@cherryon.art`;
          console.log('📡 Fetching VPN data for email:', remnaEmail);
          
          const { data } = await api.get<VpnResponse>(`/api/remna/users/by-email/${encodeURIComponent(remnaEmail)}`);
          console.log('📥 VPN API response:', data);
          
          if (data?.users && data.users.length > 0) {
            setVpnData(data.users[0]);
          } else {
            console.warn('No VPN user found for email:', remnaEmail);
          }
        } else {
          console.warn('No username available, using mock data');
        }
        
        // TODO: Получение транзакций — нужен эндпоинт
        // Пока используем мок-данные
        setTransactions(MOCK_TRANSACTIONS);
        
        const chart = MOCK_TRANSACTIONS.slice().reverse().map((t: Transaction) => ({
          date: new Date(t.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
          amount: t.amount,
        }));
        setChartData(chart);
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        setError(err.response?.data?.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user?.username]);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Проверяем, есть ли данные подписки
  const hasSubscription = vpnData && vpnData.expiry_time?.seconds > 0;
  const isActive = hasSubscription && vpnData!.expiry_time.seconds * 1000 > Date.now();
  
  const trafficUsed = 0; // TODO: нужен эндпоинт для трафика
  const trafficLimit = vpnData?.device_limit ?? 100;
  const trafficPercent = trafficLimit > 0 ? (trafficUsed / trafficLimit) * 100 : 0;
  
  const devicesUsed = 0; // TODO: нужен эндпоинт для устройств
  const devicesLimit = vpnData?.device_limit ?? 5;
  
  const expireAt = vpnData?.expiry_time?.seconds 
    ? new Date(vpnData.expiry_time.seconds * 1000).toISOString()
    : null;

  const getStatusIcon = () => {
    if (!hasSubscription) return <AlertCircle size={20} strokeWidth={1.5} />;
    if (isActive) return <Wifi size={20} strokeWidth={1.5} />;
    return <AlertCircle size={20} strokeWidth={1.5} />;
  };

  const getStatusText = () => {
    if (!hasSubscription) return 'Нет подписки';
    if (isActive) return 'Активна';
    return 'Истекла';
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Дашборд</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            {getStatusIcon()}
            <span className={styles.cardTitle}>Подписка</span>
          </div>
          <div className={styles.cardValue}>{getStatusText()}</div>
          {expireAt && (
            <div className={styles.cardSub}>
              <Calendar size={12} strokeWidth={1.5} />
              до {new Date(expireAt).toLocaleDateString()}
            </div>
          )}
          {vpnData?.username && (
            <div className={styles.cardSub}>
              <span>VPN: {vpnData.username}</span>
            </div>
          )}
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <TrendingUp size={18} strokeWidth={1.5} />
            <span className={styles.cardTitle}>Трафик</span>
          </div>
          <div className={styles.cardValue}>
            {trafficUsed} / {trafficLimit} GB
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${Math.min(trafficPercent, 100)}%` }} />
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Smartphone size={18} strokeWidth={1.5} />
            <span className={styles.cardTitle}>Устройства</span>
          </div>
          <div className={styles.cardValue}>
            {devicesUsed} / {devicesLimit}
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <TrendingUp size={18} strokeWidth={1.5} />
            <h3 className={styles.sectionTitle}>Динамика расходов</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="var(--color-text-muted)" />
              <YAxis stroke="var(--color-text-muted)" />
              <Tooltip contentStyle={{ background: 'var(--color-surface)', borderColor: 'var(--color-glass-border)' }} />
              <Line type="monotone" dataKey="amount" stroke="var(--color-accent)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className={styles.history}>
        <h3 className={styles.sectionTitle}>Последние операции</h3>
        {transactions.length === 0 ? (
          <p className={styles.emptyHistory}>Нет операций</p>
        ) : (
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
                      {t.status === 'completed' ? 'Выполнено' : 
                       t.status === 'pending' ? 'Ожидает' : 'Ошибка'}
                    </span>
                   </td>
                   <td>{t.description}</td>
                 </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;