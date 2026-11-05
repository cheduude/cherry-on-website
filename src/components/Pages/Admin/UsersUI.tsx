// src/components/Admin/UsersUI.tsx
import React, { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { useNotifications } from '../../../contexts/NotificationContext';
import styles from './AdminUI.module.css';

interface User {
  uuid: string;
  email: string;
  name?: string;
  role: 'user' | 'editor' | 'admin';
  created_at: number;
  blocked?: boolean;
  avatar?: string;
}

// Мок данные для разработки
const MOCK_USERS: User[] = [
  { uuid: '1', email: 'admin@cherryon.art', name: 'Администратор', role: 'admin', created_at: Date.now() - 86400000 * 30, blocked: false },
  { uuid: '2', email: 'editor@cherryon.art', name: 'Редактор', role: 'editor', created_at: Date.now() - 86400000 * 15, blocked: false },
  { uuid: '3', email: 'user1@example.com', name: 'Иван Петров', role: 'user', created_at: Date.now() - 86400000 * 7, blocked: false },
  { uuid: '4', email: 'user2@example.com', name: 'Мария Смирнова', role: 'user', created_at: Date.now() - 86400000 * 3, blocked: true },
  { uuid: '5', email: 'user3@example.com', name: 'Алексей Иванов', role: 'user', created_at: Date.now() - 86400000 * 1, blocked: false },
];

const UsersUI: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [useMock, setUseMock] = useState(true);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (useMock) {
        // Мок данные
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsers(MOCK_USERS);
      } else {
        const { data } = await api.get('/api/users');
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // При ошибке используем мок
      setUsers(MOCK_USERS);
      showError('Ошибка', 'Не удалось загрузить пользователей, используются тестовые данные');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (uuid: string, role: 'user' | 'editor' | 'admin') => {
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setUsers(prev => prev.map(u => u.uuid === uuid ? { ...u, role } : u));
        showSuccess('Успешно', `Роль пользователя изменена на ${role === 'admin' ? 'Администратор' : role === 'editor' ? 'Редактор' : 'Пользователь'}`);
      } else {
        await api.put(`/api/users/${uuid}`, { role });
        setUsers(prev => prev.map(u => u.uuid === uuid ? { ...u, role } : u));
        showSuccess('Успешно', 'Роль пользователя обновлена');
      }
    } catch (error) {
      showError('Ошибка', 'Не удалось обновить роль');
    }
  };

  const toggleBlockUser = async (uuid: string, blocked: boolean) => {
    try {
      if (useMock) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setUsers(prev => prev.map(u => u.uuid === uuid ? { ...u, blocked: !blocked } : u));
        showSuccess('Успешно', !blocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован');
      } else {
        await api.put(`/api/users/${uuid}`, { blocked: !blocked });
        setUsers(prev => prev.map(u => u.uuid === uuid ? { ...u, blocked: !blocked } : u));
        showSuccess('Успешно', !blocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован');
      }
    } catch (error) {
      showError('Ошибка', 'Не удалось изменить статус пользователя');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Администратор';
      case 'editor': return 'Редактор';
      default: return 'Пользователь';
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return '#a855f7';
      case 'editor': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <span>Загрузка пользователей...</span>
      </div>
    );
  }

  return (
    <div className={styles.adminUI}>
      <div className={styles.header}>
        <div>
          <h2>Управление пользователями</h2>
          <p className={styles.subtitle}>Всего пользователей: {users.length}</p>
        </div>
        <div className={styles.headerActions}>
          <input
            type="text"
            placeholder="Поиск по email или имени..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.refreshBtn} onClick={fetchUsers}>
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Имя</th>
              <th>Роль</th>
              <th>Дата регистрации</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.uuid} className={user.blocked ? styles.blockedRow : ''}>
                <td className={styles.emailCell}>{user.email}</td>
                <td>{user.name || '—'}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={e => updateUserRole(user.uuid, e.target.value as any)}
                    className={styles.roleSelect}
                    style={{ backgroundColor: getRoleColor(user.role) + '20', borderColor: getRoleColor(user.role) }}
                  >
                    <option value="user">Пользователь</option>
                    <option value="editor">Редактор</option>
                    <option value="admin">Администратор</option>
                  </select>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  <span className={`${styles.statusBadge} ${user.blocked ? styles.statusBlocked : styles.statusActive}`}>
                    {user.blocked ? 'Заблокирован' : 'Активен'}
                  </span>
                </td>
                <td>
                  <button 
                    className={styles.actionBtn} 
                    onClick={() => toggleBlockUser(user.uuid, user.blocked || false)}
                    title={user.blocked ? 'Разблокировать' : 'Заблокировать'}
                  >
                    {user.blocked ? '🔓' : '🔒'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className={styles.emptyState}>
          <i className="fas fa-users"></i>
          <p>Пользователи не найдены</p>
        </div>
      )}
    </div>
  );
};

export default UsersUI;