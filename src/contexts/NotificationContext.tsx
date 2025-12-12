import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import NotificationSystem, { type NotificationData, type NotificationType } from '../components/Notifications/NotificationSystem';

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message: string, duration?: number) => void;
  showError: (title: string, message: string, duration?: number) => void;
  showSuccess: (title: string, message: string, duration?: number) => void;
  showWarning: (title: string, message: string, duration?: number) => void;
  showInfo: (title: string, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const notificationTimeouts = useRef<Record<string, number>>({});
  const lastNotificationTime = useRef<Record<string, number>>({});

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const now = Date.now();
    const notificationKey = `${type}-${title}-${message}`;
    const lastTime = lastNotificationTime.current[notificationKey] || 0;
    
    // Дебаунс: 1.5 секунды между одинаковыми уведомлениями
    const DEBOUNCE_DELAY = 1500;
    
    // Если такое же уведомление было показано недавно, пропускаем
    if (now - lastTime < DEBOUNCE_DELAY) {
      // Очищаем предыдущий таймаут, если он есть
      if (notificationTimeouts.current[notificationKey]) {
        window.clearTimeout(notificationTimeouts.current[notificationKey]);
      }
      
      // Устанавливаем новый таймаут для показа
      notificationTimeouts.current[notificationKey] = window.setTimeout(() => {
        showNotification(type, title, message, duration);
      }, DEBOUNCE_DELAY - (now - lastTime));
      
      return;
    }

    // Показываем уведомление
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newNotification: NotificationData = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Ограничиваем количество уведомлений
    if (notifications.length >= 5) {
      setNotifications(prev => prev.slice(0, 5));
    }

    // Запоминаем время показа
    lastNotificationTime.current[notificationKey] = now;

    // Очищаем таймаут после показа
    if (notificationTimeouts.current[notificationKey]) {
      delete notificationTimeouts.current[notificationKey];
    }

  }, [notifications.length]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    showNotification('error', title, message, duration);
  }, [showNotification]);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    showNotification('success', title, message, duration);
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string, duration?: number) => {
    showNotification('warning', title, message, duration);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string, duration?: number) => {
    showNotification('info', title, message, duration);
  }, [showNotification]);

  // Очистка при размонтировании
  React.useEffect(() => {
    return () => {
      Object.values(notificationTimeouts.current).forEach(timeoutId => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showError,
      showSuccess,
      showWarning,
      showInfo,
    }}>
      {children}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
};