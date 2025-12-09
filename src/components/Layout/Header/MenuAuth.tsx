import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Добавляем useNavigate
import { useAuth } from '../../../hooks/useAuth';
import styles from './MenuAuth.module.css';
import type { MenuAuthProps } from '../../../types';

const MenuAuth: React.FC<MenuAuthProps> = ({ isMobile }) => {
  const { isAuthenticated: authStatus, user, logout } = useAuth();
  const navigate = useNavigate(); // Хук для навигации
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Обработчики для навигации
  const handleLoginClick = () => {
    navigate('/auth');
    setIsDropdownOpen(false);
  };

  const handleRegisterClick = () => {
    navigate('/auth?mode=register');
    setIsDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsDropdownOpen(false);
  };

  // Для мобильных устройств - сворачиваемое меню
  if (isMobile) {
    return (
      <div className={styles.navigation} ref={dropdownRef}>
        <div 
          className={styles.button}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img 
            src={user?.avatar || "https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg"} 
            alt="Avatar" 
          />
          {authStatus ? (
            <div className={styles.logout}>
              {isDropdownOpen ? 'MENU' : 'LOGOUT'}
            </div>
          ) : (
            <div className={styles.logout}>LOGIN</div>
          )}
        </div>

        {isDropdownOpen && authStatus && (
          <div className={styles.mobileDropdown}>
            <button className={styles.dropdownItem} onClick={handleProfileClick}>
              Профиль
            </button>
            <button className={styles.dropdownItem} onClick={handleSettingsClick}>
              Настройки
            </button>
            <button className={styles.dropdownItem} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        )}

        {isDropdownOpen && !authStatus && (
          <div className={styles.mobileDropdown}>
            <button 
              className={styles.dropdownItem}
              onClick={handleLoginClick}
            >
              Войти
            </button>
            <button 
              className={styles.dropdownItem}
              onClick={handleRegisterClick}
            >
              Регистрация
            </button>
          </div>
        )}
      </div>
    );
  }

  // Для десктопа - hover эффект
  return (
    <div className={styles.navigation}>
      <a 
        className={styles.button}
        href={authStatus ? '#' : '/auth'} // Изменено с '/login' на '/auth'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(e) => {
          if (authStatus) {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
          }
          // Если не авторизован, переход на /auth уже в href
        }}
      >
        <img 
          src={user?.avatar || "https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg"} 
          alt="Avatar" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg";
          }}
        />
        <div className={`${styles.logout} ${isHovered ? styles.visible : ''}`}>
          {authStatus ? 'LOGOUT' : 'LOGIN'}
        </div>
      </a>

      {authStatus && isDropdownOpen && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <button 
            className={styles.dropdownItem}
            onClick={handleProfileClick}
          >
            Профиль
          </button>
          <button 
            className={styles.dropdownItem}
            onClick={handleSettingsClick}
          >
            Настройки
          </button>
          <button 
            className={styles.dropdownItem}
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuAuth;