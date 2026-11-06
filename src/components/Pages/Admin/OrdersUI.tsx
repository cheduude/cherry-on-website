// src/components/Admin/OrdersUI.tsx
import React, { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useNotifications } from '../../../contexts/NotificationContext';
import styles from './AdminUI.module.css';

interface Order {
  id: string;
  customer_uuid: string;
  customer_email?: string;
  customer_name?: string;
  status: 'NEW' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  shop_card: {
    uuid: string;
    name: string;
    price: number;
  };
  price: number;
  created_at: number;
}

// Мок данные для разработки
const MOCK_ORDERS: Order[] = [
  { id: 'order_001', customer_uuid: 'user1', customer_email: 'user1@example.com', customer_name: 'Иван Петров', status: 'NEW', shop_card: { uuid: 'cert-001', name: 'Цифровой сертификат - Базовый', price: 499 }, price: 499, created_at: Date.now() - 3600000 },
  { id: 'order_002', customer_uuid: 'user2', customer_email: 'user2@example.com', customer_name: 'Мария Смирнова', status: 'PAID', shop_card: { uuid: 'vps-001', name: 'VPS - Начальный', price: 890 }, price: 890, created_at: Date.now() - 86400000 },
  { id: 'order_003', customer_uuid: 'user3', customer_email: 'user3@example.com', customer_name: 'Алексей Иванов', status: 'PROCESSING', shop_card: { uuid: 'cert-002', name: 'Цифровой сертификат - Стандарт', price: 799 }, price: 799, created_at: Date.now() - 172800000 },
  { id: 'order_004', customer_uuid: 'user1', customer_email: 'user1@example.com', customer_name: 'Иван Петров', status: 'COMPLETED', shop_card: { uuid: 'nvme-001', name: 'NVMe диск 100GB', price: 299 }, price: 299, created_at: Date.now() - 259200000 },
  { id: 'order_005', customer_uuid: 'user4', customer_email: 'user4@example.com', customer_name: 'Ольга Кузнецова', status: 'CANCELLED', shop_card: { uuid: 'cert-003', name: 'Цифровой сертификат - Премиум', price: 1299 }, price: 1299, created_at: Date.now() - 345600000 },
];

const statusLabels: Record<string, string> = {
  NEW: 'Новый',
  PAID: 'Оплачен',
  PROCESSING: 'В обработке',
  COMPLETED: 'Выполнен',
  CANCELLED: 'Отменён',
};

const statusColors: Record<string, string> = {
  NEW: '#fbbf24',
  PAID: '#3b82f6',
  PROCESSING: '#a855f7',
  COMPLETED: '#22c55e',
  CANCELLED: '#ef4444',
};

const OrdersUI: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const useMock = import.meta.env.DEV;
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setOrders(MOCK_ORDERS);
      } else {
        const { data } = await api.get('/api/orders');
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
      showError('\u041e\u0448\u0438\u0431\u043a\u0430', '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0437\u0430\u043a\u0430\u0437\u044b \u0441 \u0441\u0435\u0440\u0432\u0435\u0440\u0430');
} finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        showSuccess('Успешно', `Статус заказа изменен на "${statusLabels[status]}"`);
      } else {
        await api.post('/api/order/update/status', { order_uuid: id, status });
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        showSuccess('Успешно', `Статус заказа изменен на "${statusLabels[status]}"`);
      }
    } catch (error) {
      showError('Ошибка', 'Не удалось обновить статус заказа');
    }
  };

  const getStats = () => {
    const total = orders.length;
    const newOrders = orders.filter(o => o.status === 'NEW').length;
    const paidOrders = orders.filter(o => o.status === 'PAID').length;
    const completedOrders = orders.filter(o => o.status === 'COMPLETED').length;
    const totalRevenue = orders
      .filter(o => o.status === 'PAID' || o.status === 'COMPLETED')
      .reduce((sum, o) => sum + o.price, 0);
    return { total, newOrders, paidOrders, completedOrders, totalRevenue };
  };

  const stats = getStats();

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
                          o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
                          o.customer_name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span>Загрузка заказов...</span>
      </div>
    );
  }

  return (
    <div className={styles.adminUI}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Всего заказов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🆕</div>
          <div className={styles.statValue}>{stats.newOrders}</div>
          <div className={styles.statLabel}>Новые</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statValue}>{stats.paidOrders}</div>
          <div className={styles.statLabel}>Оплачено</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{stats.completedOrders}</div>
          <div className={styles.statLabel}>Выполнено</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💵</div>
          <div className={styles.statValue}>{stats.totalRevenue.toLocaleString()} ₽</div>
          <div className={styles.statLabel}>Выручка</div>
        </div>
      </div>

      <div className={styles.header}>
        <div>
          <h2>Управление заказами</h2>
          <p className={styles.subtitle}>Управление статусами и отслеживание заказов</p>
        </div>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Поиск по ID, email или имени..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <select value={filter} onChange={e => setFilter(e.target.value)} className={styles.filterSelect}>
            <option value="all">Все заказы</option>
            <option value="NEW">Новые</option>
            <option value="PAID">Оплаченные</option>
            <option value="PROCESSING">В обработке</option>
            <option value="COMPLETED">Выполненные</option>
            <option value="CANCELLED">Отменённые</option>
          </select>
          <button className={styles.refreshBtn} onClick={fetchOrders}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID заказа</th>
              <th>Клиент</th>
              <th>Товар</th>
              <th>Сумма</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td className={styles.idCell}>#{order.id.slice(-8)}</td>
                <td>
                  <div className={styles.customerInfo}>
                    <div className={styles.customerName}>{order.customer_name || '—'}</div>
                    <div className={styles.customerEmail}>{order.customer_email || order.customer_uuid.slice(0, 8)}</div>
                  </div>
                </td>
                <td>{order.shop_card.name}</td>
                <td className={styles.priceCell}>{order.price.toLocaleString()} ₽</td>
                <td>{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  <span className={styles.statusBadge} style={{ backgroundColor: statusColors[order.status] + '20', color: statusColors[order.status] }}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}
                    className={styles.statusSelect}
                    style={{ borderColor: statusColors[order.status] }}
                  >
                    <option value="NEW">Новый</option>
                    <option value="PAID">Оплачен</option>
                    <option value="PROCESSING">В обработке</option>
                    <option value="COMPLETED">Выполнен</option>
                    <option value="CANCELLED">Отменён</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fas fa-shopping-cart"></i>
          <p>Заказы не найдены</p>
        </div>
      )}
    </div>
  );
};

export default OrdersUI;