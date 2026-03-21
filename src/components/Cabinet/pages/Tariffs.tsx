// src/components/Cabinet/pages/Tariffs.tsx
import React, { useState, useEffect } from 'react';
import styles from './Tariffs.module.css';
import api from '../lib/api';
import type { Tariff } from '../types/types';
import { useAuth } from '../../../hooks/useAuth';

const Tariffs: React.FC = () => {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const { data } = await api.get<Tariff[]>('/client/tariffs');
        // Проверяем, что data — это массив
        const tariffsData = Array.isArray(data) ? data : [];
        setTariffs(tariffsData);
        
        // Получаем уникальные категории
        const cats = [...new Set(tariffsData.map(t => t.category))];
        setCategories(cats);
        if (cats.length > 0) {
          setActiveCategory(cats[0]);
        }
      } catch (error) {
        console.error('Ошибка загрузки тарифов:', error);
        setTariffs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTariffs();
  }, []);

  const handleBuy = async (tariffId: number) => {
    try {
      const { data } = await api.post('/client/payments/balance', { tariffId });
      alert(`Успешно оплачено! Списан ${data.amount} ${user?.currency}`);
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка оплаты');
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;

  // Фильтруем тарифы по выбранной категории
  const filteredTariffs = tariffs.filter(t => t.category === activeCategory);

  return (
    <div className={styles.tariffsPage}>
      <h1 className={styles.title}>Тарифы</h1>

      {categories.length > 1 && (
        <div className={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className={styles.grid}>
        {filteredTariffs.length > 0 ? (
          filteredTariffs.map(tariff => (
            <div key={tariff.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{tariff.name}</h3>
              <div className={styles.cardSpecs}>
                <span>📅 {tariff.duration} дн.</span>
                <span>💾 {tariff.traffic} GB</span>
                <span>📱 {tariff.devices} устр.</span>
              </div>
              <div className={styles.cardPrice}>
                {tariff.price} {tariff.currency}
              </div>
              <button
                className={styles.buyButton}
                onClick={() => handleBuy(tariff.id)}
                disabled={!user || (user.balance !== undefined && user.balance < tariff.price && tariff.price > 0)}
              >
                {user && user.balance !== undefined && user.balance < tariff.price && tariff.price > 0 
                  ? 'Недостаточно средств' 
                  : tariff.price === 0 
                    ? 'Активировать' 
                    : 'Оплатить'}
              </button>
            </div>
          ))
        ) : (
          <div className={styles.noTariffs}>Нет тарифов в этой категории</div>
        )}
      </div>

      <div className={styles.balanceInfo}>
        Ваш баланс: {user?.balance} {user?.currency}
        <button className={styles.topupButton} onClick={() => alert('Пополнение баланса в разработке')}>
          Пополнить
        </button>
      </div>
    </div>
  );
};

export default Tariffs;