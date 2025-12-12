import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import styles from './MenuAuth.module.css';
import type { MenuAuthProps } from '../../../types';

const MenuAuth: React.FC<MenuAuthProps> = ({ isMobile }) => {
  const { isAuthenticated: authStatus, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleAuthAction = () => {
    if (authStatus) {
      // Если авторизован - выходим
      logout();
    } else {
      // Если не авторизован - переходим на страницу авторизации
      navigate('/auth');
    }
  };

  // Для мобильных устройств
  if (isMobile) {
    return (
      <div className={styles.navigation}>
        <div 
          className={styles.button}
          onClick={handleAuthAction}
        >
          <img 
            src={user?.avatar || "https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg"} 
            alt="Avatar" 
          />
          <div className={styles.logout}>
            {authStatus ? 'LOGOUT' : 'LOGIN'}
          </div>
        </div>
      </div>
    );
  }

  // Для десктопа
  return (
    <div className={styles.navigation}>
      <div 
        className={styles.button}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleAuthAction}
      >
        <img 
          src={user?.avatar || "https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg"} 
          alt="Avatar" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg";
          }}
        />
        <div className={`${styles.logout} ${isHovered ? styles.visible : ''}`}>
          {authStatus ? 'LOGOUT' : 'Вход'}
        </div>
      </div>
    </div>
  );
};

export default MenuAuth;