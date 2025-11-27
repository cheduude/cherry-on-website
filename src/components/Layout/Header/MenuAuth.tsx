// src/components/Layout/Header/MenuAuth.tsx (Меню входа/выхода с аватаркой и дропдауном on hover)
import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import styles from './MenuAuth.module.css';

const MenuAuth = ({ isMobile }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={styles['auth-button']}
      onMouseEnter={() => !isMobile && setIsOpen(true)}
      onMouseLeave={() => !isMobile && setIsOpen(false)}
      onClick={() => isMobile && setIsOpen(!isOpen)}  // Для мобильки on click
    >
      {isAuthenticated ? (
        <>
          <div className={styles['avatar-circle']}>
            <img src={user?.avatar || '/assets/default-avatar.png'} alt="Avatar" />
          </div>
          {isOpen && (
            <div className={styles.dropdown}>
              <button>Профиль</button>
              <button>Настройки</button>
              <button onClick={logout}>Выйти</button>
            </div>
          )}
        </>
      ) : (
        <button>Войти</button>
      )}
    </div>
  );
};

export default MenuAuth;