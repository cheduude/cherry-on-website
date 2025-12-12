import React, { useState, useEffect } from 'react';
import Notification from './Notification';
import './NotificationSystem.css';

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // в миллисекундах, если undefined - не исчезает автоматически
  timestamp: Date;
}

interface NotificationSystemProps {
  notifications: NotificationData[];
  onRemove: (id: string) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-system">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          data={notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationSystem;