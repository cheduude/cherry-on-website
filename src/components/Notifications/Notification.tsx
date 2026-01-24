import React, { useEffect, useState } from 'react';
import type { NotificationData } from './NotificationSystem';
import './Notification.css';

interface NotificationProps {
  data: NotificationData;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ data, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (data.duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, data.duration);

      return () => clearTimeout(timer);
    }
  }, [data.duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
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

  const getIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': 
      default: return '💬';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`notification-card ${data.type} ${isClosing ? 'closing' : ''}`}>
      <div className="bg-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      <div className="notification-content">
        <div className="app-icon">{getIcon(data.type)}</div>
        <div className="notification-body">
          <div className="content-header">
            <h3>{data.title}</h3>
            <span className="timestamp">{formatTime(data.timestamp)}</span>
          </div>
          <p>{data.message}</p>
        </div>
        <button className="notification-close" onClick={handleClose}>×</button>
      </div>
    </div>
  );
};

export default Notification;

    