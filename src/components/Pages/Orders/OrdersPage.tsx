// src/pages/OrdersPage.tsx
import React from 'react';
import { useLenisCleanup } from '../../../hooks/useLenisCleanup';
const OrdersPage: React.FC = () => {
  useLenisCleanup();
  return (
    <div>
      <h1>Мои заказы</h1>
      <p>Здесь будут отображаться ваши заказы</p>
    </div>
  );
};

export default OrdersPage;