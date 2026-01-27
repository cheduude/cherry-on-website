// src/components/Layout/Header/DropdownMenu.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './MenuAuth.module.css';

interface DropdownMenuProps {
  isOpen: boolean;
  isClosing?: boolean; // Добавляем пропс для анимации закрытия
  items: Array<{
    id: string;
    label: string;
    path: string;
    icon?: string;
    adminOnly?: boolean;
  }>;
  userRole?: string;
  onItemClick: (item: any) => void;
  onLogout: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  isClosing,
  items,
  userRole,
  onItemClick,
  onLogout,
}) => {
  if (!isOpen && !isClosing) return null;

  const animationClass = isClosing ? 'disappearing' : 'appearing';

  return (
    <div className={`${styles.dropdownMenu} ${styles[animationClass]}`}>
      <div className={`${styles.menuHeader} ${styles[animationClass]}`}>
        <div className={styles.menuTitle}>Личный кабинет</div>
        {userRole && (
          <div className={styles.userRole}>Роль: {userRole}</div>
        )}
      </div>
      
      <div className={styles.menuItems}>
        {items.map((item, index) => (
          <Link
            key={item.id}
            to={item.path}
            className={`${styles.menuItem} ${styles[animationClass]}`}
            onClick={() => onItemClick(item)}
            style={{ animationDelay: isClosing ? `${(items.length - index - 1) * 0.05}s` : `${index * 0.05 + 0.05}s` }}
          >
            {item.icon && <span className={styles.menuIcon}>{item.icon}</span>}
            <span className={styles.menuLabel}>{item.label}</span>
            {item.adminOnly && (
              <span className={styles.adminBadge}>ADMIN</span>
            )}
          </Link>
        ))}
        
        <div className={`${styles.menuDivider} ${styles[animationClass]}`}></div>
        
        <button
          className={`${styles.menuItem} ${styles.logoutItem} ${styles[animationClass]}`}
          onClick={onLogout}
          style={{ animationDelay: isClosing ? '0.05s' : `${items.length * 0.05 + 0.05}s` }}
        >
          <span className={styles.menuIcon}>🚪</span>
          <span className={styles.menuLabel}>Выйти</span>
        </button>
      </div>
    </div>
  );
};

export default DropdownMenu;