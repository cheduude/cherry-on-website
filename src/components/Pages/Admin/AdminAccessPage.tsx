// src/pages/AdminAccessPage.tsx
import React from 'react';
import { useAuth } from '../../../hooks/useAuth';

const AdminAccessPage: React.FC = () => {
  const { user } = useAuth();
  const adminRoles = ['admin', 'superadmin', 'moderator'];

  if (!user || !adminRoles.includes(user.role || '')) {
    return (
      <div>
        <h1>Доступ запрещен</h1>
        <p>У вас недостаточно прав для просмотра этой страницы</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Управление доступом</h1>
      <p>Административная панель управления доступами</p>
      <p>Ваша роль: <strong>{user.role}</strong></p>
    </div>
  );
};

export default AdminAccessPage;