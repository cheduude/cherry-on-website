// src/components/Admin/ShopCardsUI.tsx
import React, { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useNotifications } from '../../../contexts/NotificationContext';
import styles from './AdminUI.module.css';

interface ShopCard {
  uuid: string;
  name: string;
  description: string;
  category: string;
  price: number;
  visible: boolean;
  iconName?: string;
}

// Мок данные для разработки
const MOCK_CARDS: ShopCard[] = [
  { uuid: 'cert-001', name: 'Цифровой сертификат - Базовый', description: 'До 50 Мбит/с, 1 устройство', category: 'certificates', price: 499, visible: true },
  { uuid: 'cert-002', name: 'Цифровой сертификат - Стандарт', description: 'До 150 Мбит/с, 3 устройства', category: 'certificates', price: 799, visible: true },
  { uuid: 'cert-003', name: 'Цифровой сертификат - Премиум', description: 'До 500 Мбит/с, 10 устройств', category: 'certificates', price: 1299, visible: true },
  { uuid: 'vps-001', name: 'VPS - Начальный', description: '1 vCPU, 2GB RAM, 20GB SSD', category: 'vps', price: 890, visible: true },
  { uuid: 'vps-002', name: 'VPS - Стандарт', description: '2 vCPU, 4GB RAM, 50GB SSD', category: 'vps', price: 1490, visible: false },
  { uuid: 'nvme-001', name: 'NVMe диск 100GB', description: 'Быстрое облачное хранилище', category: 'storage', price: 299, visible: true },
];

const ShopCardsUI: React.FC = () => {
  const [cards, setCards] = useState<ShopCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ShopCard | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCard, setNewCard] = useState<Partial<ShopCard>>({ name: '', description: '', category: '', price: 0, visible: true });
  const [useMock, setUseMock] = useState(true);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCards(MOCK_CARDS);
      } else {
        const { data } = await api.get('/api/shop_card/get');
        setCards(data?.shop_cards || []);
      }
    } catch (error) {
      console.error('Failed to fetch shop cards:', error);
      setCards(MOCK_CARDS);
      showError('Ошибка', 'Не удалось загрузить товары, используются тестовые данные');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (uuid: string, visible: boolean) => {
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setCards(prev => prev.map(c => c.uuid === uuid ? { ...c, visible: !visible } : c));
        showSuccess('Успешно', !visible ? 'Товар опубликован' : 'Товар скрыт');
      } else {
        await api.post('/api/shop_card/update', { uuid, visible: !visible });
        setCards(prev => prev.map(c => c.uuid === uuid ? { ...c, visible: !visible } : c));
        showSuccess('Успешно', !visible ? 'Товар опубликован' : 'Товар скрыт');
      }
    } catch (error) {
      showError('Ошибка', 'Не удалось обновить товар');
    }
  };

  const deleteCard = async (uuid: string) => {
    if (!confirm('Удалить товар? Это действие нельзя отменить.')) return;
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setCards(prev => prev.filter(c => c.uuid !== uuid));
        showSuccess('Успешно', 'Товар удален');
      } else {
        await api.delete(`/api/shop_card/delete/${uuid}`);
        setCards(prev => prev.filter(c => c.uuid !== uuid));
        showSuccess('Успешно', 'Товар удален');
      }
    } catch (error) {
      showError('Ошибка', 'Не удалось удалить товар');
    }
  };

  const createCard = async () => {
    if (!newCard.name || !newCard.category || !newCard.price) {
      showError('Ошибка', 'Заполните все обязательные поля');
      return;
    }
    
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const createdCard: ShopCard = {
          uuid: `new-${Date.now()}`,
          name: newCard.name,
          description: newCard.description || '',
          category: newCard.category,
          price: newCard.price,
          visible: newCard.visible ?? true,
        };
        setCards(prev => [...prev, createdCard]);
        showSuccess('Успешно', 'Товар создан');
        setShowCreateModal(false);
        setNewCard({ name: '', description: '', category: '', price: 0, visible: true });
      } else {
        await api.post('/api/shop_card/create', newCard);
        await fetchCards();
        showSuccess('Успешно', 'Товар создан');
        setShowCreateModal(false);
        setNewCard({ name: '', description: '', category: '', price: 0, visible: true });
      }
    } catch (error) {
      showError('Ошибка', 'Не удалось создать товар');
    }
  };

  const updateCard = async () => {
    if (!editing) return;
    
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setCards(prev => prev.map(c => c.uuid === editing.uuid ? editing : c));
        showSuccess('Успешно', 'Товар обновлен');
        setEditing(null);
      } else {
        await api.post('/api/shop_card/update', editing);
        await fetchCards();
        showSuccess('Успешно', 'Товар обновлен');
        setEditing(null);
      }
    } catch (error) {
      showError('Ошибка', 'Не удалось обновить товар');
    }
  };

  const categories = [...new Set(cards.map(c => c.category))];

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span>Загрузка товаров...</span>
      </div>
    );
  }

  return (
    <div className={styles.adminUI}>
      <div className={styles.header}>
        <div>
          <h2>Управление товарами</h2>
          <p className={styles.subtitle}>Всего товаров: {cards.length}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.createBtn} onClick={() => setShowCreateModal(true)}>
            <i className="fas fa-plus"></i> Создать товар
          </button>
          <button className={styles.refreshBtn} onClick={fetchCards}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Категория</th>
              <th>Описание</th>
              <th>Цена</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.uuid}>
                <td className={styles.nameCell}>{card.name}</td>
                <td><span className={styles.categoryBadge}>{card.category}</span></td>
                <td className={styles.descCell}>{card.description}</td>
                <td className={styles.priceCell}>{card.price.toLocaleString()} ₽</td>
                <td>
                  <span className={`${styles.statusBadge} ${card.visible ? styles.statusActive : styles.statusInactive}`}>
                    {card.visible ? 'Активен' : 'Скрыт'}
                  </span>
                </td>
                <td>
                  <button className={styles.actionBtn} onClick={() => setEditing(card)} title="Редактировать">
                    ✏️
                  </button>
                  <button className={styles.actionBtn} onClick={() => toggleVisibility(card.uuid, card.visible)} title={card.visible ? 'Скрыть' : 'Показать'}>
                    {card.visible ? '🔒' : '🔓'}
                  </button>
                  <button className={styles.actionBtn} onClick={() => deleteCard(card.uuid)} title="Удалить">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка редактирования */}
      {editing && (
        <div className={styles.modal} onClick={() => setEditing(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Редактировать товар</h3>
            <div className={styles.formGroup}>
              <label>Название</label>
              <input
                type="text"
                value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Описание</label>
              <textarea
                value={editing.description}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Категория</label>
                <select
                  value={editing.category}
                  onChange={e => setEditing({ ...editing, category: e.target.value })}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Цена (₽)</label>
                <input
                  type="number"
                  value={editing.price}
                  onChange={e => setEditing({ ...editing, price: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={editing.visible}
                  onChange={e => setEditing({ ...editing, visible: e.target.checked })}
                />
                <span>Видимый на сайте</span>
              </label>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.saveBtn} onClick={updateCard}>Сохранить</button>
              <button className={styles.cancelBtn} onClick={() => setEditing(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка создания */}
      {showCreateModal && (
        <div className={styles.modal} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Создать товар</h3>
            <div className={styles.formGroup}>
              <label>Название *</label>
              <input
                type="text"
                value={newCard.name}
                onChange={e => setNewCard({ ...newCard, name: e.target.value })}
                placeholder="Введите название"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Описание</label>
              <textarea
                value={newCard.description}
                onChange={e => setNewCard({ ...newCard, description: e.target.value })}
                rows={3}
                placeholder="Введите описание"
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Категория *</label>
                <input
                  type="text"
                  value={newCard.category}
                  onChange={e => setNewCard({ ...newCard, category: e.target.value })}
                  placeholder="certificates, vps, storage..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Цена (₽) *</label>
                <input
                  type="number"
                  value={newCard.price}
                  onChange={e => setNewCard({ ...newCard, price: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={newCard.visible}
                  onChange={e => setNewCard({ ...newCard, visible: e.target.checked })}
                />
                <span>Видимый на сайте</span>
              </label>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.saveBtn} onClick={createCard}>Создать</button>
              <button className={styles.cancelBtn} onClick={() => setShowCreateModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopCardsUI;