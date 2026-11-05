// src/components/Admin/ContentUI.tsx
import React from 'react';
import styles from './AdminUI.module.css';

const ContentUI: React.FC = () => {
  const openEditor = () => {
    window.location.href = '/editor';
  };

  return (
    <div className={styles.contentRedirect}>
      <div className={styles.redirectCard}>
        <i className="fas fa-edit"></i>
        <h2>Редактор контента</h2>
        <p>Управление текстами и ссылками на всех страницах сайта</p>
        <button className={styles.redirectBtn} onClick={openEditor}>
          Перейти в редактор
        </button>
        <div className={styles.redirectHint}>
          <i className="fas fa-external-link-alt"></i>
          Откроется в новой вкладке
        </div>
      </div>
    </div>
  );
};

export default ContentUI;