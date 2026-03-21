// src/components/Header/NotificationBell.tsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './NotificationBell.module.css';
import { useNotificationStore } from './notificationStore';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  useEffect(() => {
    setHasUnread(unreadCount > 0);
  }, [unreadCount]);

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Если клик был по кнопке колокольчика — не закрываем
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }
      
      // Если клик был внутри дропдауна — не закрываем
      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }
      
      // Иначе закрываем окно
      if (isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside as EventListener);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as EventListener);
    };
  }, [isOpen]);

  const triggerShake = () => {
    // Запускаем анимацию тряски
    setIsShaking(true);
    
    // Очищаем предыдущий таймер, если есть
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
    }
    
    // Убираем класс после окончания анимации
    shakeTimeoutRef.current = setTimeout(() => {
      setIsShaking(false);
      shakeTimeoutRef.current = null;
    }, 400);
  };

  const handleBellClick = () => {
    const newIsOpen = !isOpen;
    
    // Тряска происходит ТОЛЬКО когда открываем окно (с закрытого на открытое)
    if (!isOpen) {
      triggerShake();
    }
    
    // Переключаем состояние открытия/закрытия
    setIsOpen(newIsOpen);
    
    // Если открываем окно и есть непрочитанные, отмечаем всё прочитанным
    if (newIsOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} ч назад`;
    return `${Math.floor(diffMins / 1440)} д назад`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '💬';
    }
  };

  return (
    <div className={styles.bellContainer} ref={containerRef}>
      <button
        ref={buttonRef}
        className={`${styles.bellButton} ${hasUnread ? styles.hasUnread : ''} ${isOpen ? styles.active : ''} ${isShaking ? styles.shaking : ''}`}
        onClick={handleBellClick}
        aria-label="Уведомления"
      >
        <svg className={styles.bellIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {hasUnread && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h3>Уведомления</h3>
            {notifications.length > 0 && (
              <button className={styles.markAllRead} onClick={markAllAsRead}>
                Прочитать всё
              </button>
            )}
          </div>
          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🔔</span>
                <p>Нет уведомлений</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={styles.notificationIcon}>{getIcon(notification.type)}</div>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <span className={styles.notificationTitle}>{notification.title}</span>
                      <span className={styles.notificationTime}>{formatTime(notification.timestamp)}</span>
                    </div>
                    <p className={styles.notificationMessage}>{notification.message}</p>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;