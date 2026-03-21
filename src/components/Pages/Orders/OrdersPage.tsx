import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLenisCleanup } from '../../../hooks/useLenisCleanup';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../contexts/NotificationContext';
import { iconMap } from '../Services/Services';
import styles from './OrdersPage.module.css';
import { Package } from 'lucide-react';

// Интерфейс для заказа
interface Order {
  id: string;
  customer_uuid: string;
  status: 'NEW' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  shop_card: {
    uuid: string;
    name: string;
    description: string;
    category: string;
    price: number;
    visible: boolean;
    iconName: keyof typeof iconMap;
  };
  price: number;
  created_at: number;
}

const ORDERS_STORAGE_KEY = 'user_orders';

const DynamicIcon = ({ iconName, className }: { iconName: keyof typeof iconMap; className?: string }) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) return <Package className={className} />;
  return <IconComponent className={className} />;
};

const getStatusText = (status: Order['status']): string => {
  switch (status) {
    case 'NEW': return 'Новый';
    case 'PAID': return 'Оплачен';
    case 'PROCESSING': return 'В обработке';
    case 'COMPLETED': return 'Выполнен';
    case 'CANCELLED': return 'Отменён';
    default: return 'Неизвестно';
  }
};

const getStatusColor = (status: Order['status']): string => {
  switch (status) {
    case 'NEW': return '#3498db';
    case 'PAID': return '#2ecc71';
    case 'PROCESSING': return '#f39c12';
    case 'COMPLETED': return '#27ae60';
    case 'CANCELLED': return '#e74c3c';
    default: return '#95a5a6';
  }
};

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const formatPrice = (price: number): string => {
  if (price === 0) return 'Договорная';
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price);
};

const OrdersPage: React.FC = () => {
  useLenisCleanup();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { showError, showSuccess, showInfo } = useNotifications();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'ALL'>('ALL');

  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setError('Необходимо авторизоваться для просмотра заказов');
      setIsLoading(false);
      return;
    }
    loadOrders();
  }, [isAuthenticated, user]);

  // Функция для центрирования модального окна
  const centerModal = useCallback(() => {
    if (!modalContentRef.current || !modalOverlayRef.current) return;

    const modal = modalContentRef.current;
    const overlay = modalOverlayRef.current;

    // Сбрасываем inline-стили
    modal.style.removeProperty('top');
    modal.style.removeProperty('left');
    modal.style.removeProperty('transform');
    modal.style.removeProperty('margin');

    // Получаем размеры
    const modalHeight = modal.offsetHeight;
    const overlayHeight = overlay.offsetHeight;
    const windowHeight = window.innerHeight;

    // Если модалка выше окна, выравниваем по верхнему краю с отступом
    if (modalHeight > windowHeight - 40) {
      modal.style.top = '20px';
      modal.style.left = '50%';
      modal.style.transform = 'translateX(-50%)';
      modal.style.margin = '0';
    } else {
      // Стандартное центрирование
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.margin = '0';
    }
  }, []);

  // Блокировка скролла и центрирование модалки
  useEffect(() => {
    if (selectedOrder) {
      scrollPositionRef.current = window.scrollY;

      // Блокируем скролл body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll'; // Сохраняем ширину скроллбара

      // Центрируем модальное окно после рендера
      setTimeout(() => {
        centerModal();
      }, 10);

      // Добавляем обработчик resize для перецентрирования
      const handleResize = () => {
        centerModal();
      };

      window.addEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleResize);
      }

      return () => {
        window.removeEventListener('resize', handleResize);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleResize);
        }
      };
    } else {
      // Восстанавливаем скролл
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';

      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
    };
  }, [selectedOrder, centerModal]);

  // Центрируем при изменении контента (например, после загрузки)
  useEffect(() => {
    if (selectedOrder) {
      const timer = setTimeout(() => {
        centerModal();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [selectedOrder, centerModal]);

  const loadOrders = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const stored = localStorage.getItem(`${ORDERS_STORAGE_KEY}_${user.id}`);
      let userOrders: Order[] = [];
      if (stored) {
        try {
          userOrders = JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing stored orders:', e);
        }
      }
      userOrders.sort((a, b) => b.created_at - a.created_at);
      setOrders(userOrders);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Не удалось загрузить заказы');
      showError('Ошибка загрузки', err.message || 'Не удалось загрузить заказы');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderClick = (order: Order) => setSelectedOrder(order);
  const handleCloseModal = () => setSelectedOrder(null);
  const handlePayOrder = (_order: Order) => {
    showInfo('Оплата в разработке', 'Функционал оплаты будет доступен после интеграции платежной системы', 4000);
  };
  const handleCancelOrder = async (orderUuid: string) => {
    if (!user?.id) return;
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const currentOrders = [...orders];
      const orderIndex = currentOrders.findIndex(o => o.id === orderUuid);
      if (orderIndex === -1) throw new Error('Заказ не найден');
      const updatedOrder = { ...currentOrders[orderIndex], status: 'CANCELLED' as const };
      currentOrders[orderIndex] = updatedOrder;
      localStorage.setItem(`${ORDERS_STORAGE_KEY}_${user.id}`, JSON.stringify(currentOrders));
      setOrders(currentOrders);
      if (selectedOrder && selectedOrder.id === orderUuid) setSelectedOrder(updatedOrder);
      showSuccess('Заказ отменён', 'Статус заказа успешно изменён');
    } catch (err: any) {
      console.error('Error cancelling order:', err);
      showError('Ошибка', err.message || 'Не удалось отменить заказ');
    } finally {
      setIsUpdating(false);
    }
  };
  const handleGoToServices = () => navigate('/services');

  const filteredOrders = filterStatus === 'ALL' ? orders : orders.filter(order => order.status === filterStatus);

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'NEW').length,
    paid: orders.filter(o => o.status === 'PAID').length,
    processing: orders.filter(o => o.status === 'PROCESSING').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.notAuthorized}>
          <h1 className={styles.notAuthorizedTitle}>Необходима авторизация</h1>
          <p className={styles.notAuthorizedText}>
            Для просмотра заказов пожалуйста <Link to="/auth" className={styles.notAuthorizedLink}>войдите в систему</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Мои <span className={styles.gradientText}>заказы</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Управляйте вашими заказами и отслеживайте их статус
          </p>
          <button className={styles.goToServicesButton} onClick={handleGoToServices}>
            <span>←</span> К услугам
          </button>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Всего заказов</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.new}</div>
            <div className={styles.statLabel}>Новые</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.paid}</div>
            <div className={styles.statLabel}>Оплачено</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.processing}</div>
            <div className={styles.statLabel}>В обработке</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.completed}</div>
            <div className={styles.statLabel}>Выполнено</div>
          </div>
        </div>
      </section>

      <section className={styles.filtersSection}>
        <div className={styles.filtersContainer}>
          <button className={`${styles.filterButton} ${filterStatus === 'ALL' ? styles.activeFilter : ''}`} onClick={() => setFilterStatus('ALL')}>
            Все
          </button>
          <button className={`${styles.filterButton} ${filterStatus === 'NEW' ? styles.activeFilter : ''}`} onClick={() => setFilterStatus('NEW')}>
            Новые
          </button>
          <button className={`${styles.filterButton} ${filterStatus === 'PAID' ? styles.activeFilter : ''}`} onClick={() => setFilterStatus('PAID')}>
            Оплаченные
          </button>
          <button className={`${styles.filterButton} ${filterStatus === 'PROCESSING' ? styles.activeFilter : ''}`} onClick={() => setFilterStatus('PROCESSING')}>
            В обработке
          </button>
          <button className={`${styles.filterButton} ${filterStatus === 'COMPLETED' ? styles.activeFilter : ''}`} onClick={() => setFilterStatus('COMPLETED')}>
            Выполненные
          </button>
          <button className={`${styles.filterButton} ${filterStatus === 'CANCELLED' ? styles.activeFilter : ''}`} onClick={() => setFilterStatus('CANCELLED')}>
            Отменённые
          </button>
        </div>
      </section>

      <section className={styles.ordersSection}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Загрузка заказов...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryButton} onClick={loadOrders}>
              Попробовать снова
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyContainer}>
            <div className={styles.emptyIcon}>📦</div>
            <h3 className={styles.emptyTitle}>Заказы не найдены</h3>
            <p className={styles.emptyText}>
              {filterStatus === 'ALL'
                ? 'У вас пока нет заказов. Перейдите в раздел услуг, чтобы сделать заказ.'
                : `Нет заказов со статусом "${getStatusText(filterStatus as Order['status'])}"`}
            </p>
            <button className={styles.emptyButton} onClick={handleGoToServices}>
              Перейти к услугам
            </button>
          </div>
        ) : (
          <div className={styles.ordersGrid}>
            {filteredOrders.map((order) => (
              <div key={order.id} className={styles.orderCard} onClick={() => handleOrderClick(order)}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderIconWrapper}>
                    <DynamicIcon iconName={order.shop_card.iconName} className={styles.orderIcon} />
                  </div>
                  <div className={styles.orderInfo}>
                    <h3 className={styles.orderName}>{order.shop_card.name}</h3>
                    <p className={styles.orderDate}>{formatDate(order.created_at)}</p>
                  </div>
                  <span className={styles.orderStatus} style={{ backgroundColor: getStatusColor(order.status) }}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className={styles.orderBody}>
                  <p className={styles.orderDescription}>{order.shop_card.description}</p>
                </div>
                <div className={styles.orderFooter}>
                  <span className={styles.orderPrice}>{formatPrice(order.price)}</span>
                  <span className={styles.orderNumber}>#{order.id.slice(0, 8)}</span>
                </div>
                {order.status === 'NEW' && (
                  <div className={styles.orderActions}>
                    <button className={styles.payButton} onClick={(e) => { e.stopPropagation(); handlePayOrder(order); }}>
                      Оплатить
                    </button>
                    <button className={styles.cancelButton} onClick={(e) => { e.stopPropagation(); handleCancelOrder(order.id); }} disabled={isUpdating}>
                      {isUpdating ? 'Отмена...' : 'Отменить'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedOrder && (
        <div ref={modalOverlayRef} className={styles.modalOverlay} onClick={handleCloseModal}>
          <div ref={modalContentRef} className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={handleCloseModal}>×</button>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Детали заказа</h2>
              <span className={styles.modalStatus} style={{ backgroundColor: getStatusColor(selectedOrder.status) }}>
                {getStatusText(selectedOrder.status)}
              </span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Номер заказа:</span>
                <span className={styles.modalValue}>{selectedOrder.id}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Услуга:</span>
                <span className={styles.modalValue}>{selectedOrder.shop_card.name}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Описание:</span>
                <span className={styles.modalValue}>{selectedOrder.shop_card.description}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Категория:</span>
                <span className={styles.modalValue}>{selectedOrder.shop_card.category}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Цена:</span>
                <span className={styles.modalPrice}>{formatPrice(selectedOrder.price)}</span>
              </div>
              <div className={styles.modalRow}>
                <span className={styles.modalLabel}>Дата создания:</span>
                <span className={styles.modalValue}>{formatDate(selectedOrder.created_at)}</span>
              </div>
            </div>
            {selectedOrder.status === 'NEW' && (
              <div className={styles.modalFooter}>
                <button className={styles.modalPayButton} onClick={() => handlePayOrder(selectedOrder)}>
                  Оплатить заказ
                </button>
                <button className={styles.modalCancelButton} onClick={() => handleCancelOrder(selectedOrder.id)} disabled={isUpdating}>
                  {isUpdating ? 'Отмена...' : 'Отменить заказ'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;