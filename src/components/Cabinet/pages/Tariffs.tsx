// src/components/Cabinet/pages/Tariffs.tsx
import React, { useState, useEffect } from 'react';
import styles from './Tariffs.module.css';
import api from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { ShoppingCart, Clock, CheckCircle, XCircle, Package } from 'lucide-react';

// Интерфейс для товара/услуги
interface ShopCard {
  uuid: string;
  name: string;
  description: string;
  category: string;
  price: number;
  visible: boolean;
  cover_url?: string;
  created_at?: {
    nanos: number;
    seconds: number;
  };
}

// Интерфейс для заказа
interface Order {
  id: string;
  uuid?: string;
  order_uuid?: string;
  customer_uuid: string;
  status: 'NEW' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  shop_card: {
    uuid: string;
    name: string;
    description: string;
    category: string;
    price: number;
    visible: boolean;
    iconName?: string;
  };
  price: number;
  created_at: number;
}

interface ShopCardsResponse {
  shop_cards: ShopCard[];
}

interface OrdersResponse {
  orders: Order[];
}

// Ключ для хранения заказов в localStorage (бэкенд пока не готов)
const ORDERS_STORAGE_KEY = 'user_orders';

const Tariffs: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Функция для получения заказов из localStorage (пока бэкенд не готов)
  const getStoredOrders = (): Order[] => {
    if (!user?.id) return [];
    const stored = localStorage.getItem(`${ORDERS_STORAGE_KEY}_${user.id}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored orders:', e);
        return [];
      }
    }
    return [];
  };

  // Функция для сохранения заказов в localStorage
  const saveOrders = (ordersData: Order[]) => {
    if (!user?.id) return;
    localStorage.setItem(`${ORDERS_STORAGE_KEY}_${user.id}`, JSON.stringify(ordersData));
  };

  // Загрузка заказов пользователя
  const fetchOrders = async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Пытаемся получить заказы с бэкенда
      // Пока бэкенд не готов, используем localStorage
      // const { data } = await api.get<OrdersResponse>(`/api/orders/customer/${user.id}`);
      // const userOrders = data?.orders || [];
      
      // Временное решение - из localStorage
      const userOrders = getStoredOrders();
      
      // Сортируем по дате (новые сверху)
      const sortedOrders = userOrders.sort((a, b) => b.created_at - a.created_at);
      setOrders(sortedOrders);
    } catch (err: any) {
      console.error('❌ Orders fetch error:', err);
      setError(err.response?.data?.message || 'Ошибка загрузки заказов');
    } finally {
      setLoading(false);
    }
  };

  // Создание заказа
  const handleCreateOrder = async (tariff: ShopCard) => {
    if (!isAuthenticated) {
      alert('Необходимо авторизоваться');
      return;
    }

    setIsCreatingOrder(true);

    try {
      // Пытаемся отправить запрос на бэкенд
      // const { data } = await api.post('/api/order/create', {
      //   customer_uuid: user?.id,
      //   shop_card_uuid: tariff.uuid,
      //   price: tariff.price,
      // });
      
      // Временное решение - сохраняем в localStorage
      const existingOrders = getStoredOrders();
      
      const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        customer_uuid: String(user?.id),
        status: 'NEW',
        shop_card: {
          uuid: tariff.uuid,
          name: tariff.name,
          description: tariff.description,
          category: tariff.category,
          price: tariff.price,
          visible: tariff.visible,
        },
        price: tariff.price,
        created_at: Date.now(),
      };

      const updatedOrders = [newOrder, ...existingOrders];
      saveOrders(updatedOrders);
      
      // Обновляем список заказов
      setOrders(prev => [newOrder, ...prev]);
      
      alert(`✅ Заказ на "${tariff.name}" успешно создан!`);
    } catch (err: any) {
      console.error('❌ Order creation error:', err);
      alert(err.response?.data?.message || 'Ошибка создания заказа');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Получение статуса заказа с иконкой
  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'NEW':
        return { text: 'Новый', icon: <Clock size={14} />, className: styles.statusNew };
      case 'PAID':
        return { text: 'Оплачен', icon: <CheckCircle size={14} />, className: styles.statusPaid };
      case 'PROCESSING':
        return { text: 'В обработке', icon: <Clock size={14} />, className: styles.statusProcessing };
      case 'COMPLETED':
        return { text: 'Выполнен', icon: <CheckCircle size={14} />, className: styles.statusCompleted };
      case 'CANCELLED':
        return { text: 'Отменён', icon: <XCircle size={14} />, className: styles.statusCancelled };
      default:
        return { text: status, icon: null, className: '' };
    }
  };

  // Форматирование даты
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    if (price === 0) return 'Договорная';
    return `${price.toLocaleString()} ₽`;
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated, user?.id]);

  if (!isAuthenticated) {
    return (
      <div className={styles.tariffsPage}>
        <div className={styles.notAuth}>
          <Package size={48} />
          <h2>Войдите в аккаунт</h2>
          <p>Чтобы просматривать свои заказы, пожалуйста, авторизуйтесь</p>
          <a href="/auth" className={styles.loginLink}>Войти</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.tariffsPage}>
        <div className={styles.loading}>Загрузка заказов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.tariffsPage}>
        <div className={styles.error}>Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.tariffsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои заказы</h1>
        <p className={styles.subtitle}>Все ваши покупки в одном месте</p>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <Package size={64} />
          <h3>У вас пока нет заказов</h3>
          <p>Перейдите в раздел услуг, чтобы сделать первый заказ</p>
          <a href="/services" className={styles.shopLink}>Перейти к услугам</a>
        </div>
      ) : (
        <>
          <div className={styles.ordersList}>
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderIcon}>
                    <Package size={28} />
                  </div>
                  <div className={styles.orderContent}>
                    <div className={styles.orderHeader}>
                      <h3 className={styles.orderName}>{order.shop_card.name}</h3>
                      <span className={`${styles.statusBadge} ${statusInfo.className}`}>
                        {statusInfo.icon}
                        {statusInfo.text}
                      </span>
                    </div>
                    <p className={styles.orderDesc}>{order.shop_card.description}</p>
                    <div className={styles.orderFooter}>
                      <span className={styles.orderPrice}>{formatPrice(order.price)}</span>
                      <span className={styles.orderDate}>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.paymentInfo}>
            <p className={styles.paymentText}>
              💳 После создания заказа он появится в этом списке. Оплата осуществляется через Telegram-бота.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Tariffs;