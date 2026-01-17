// src/pages/SettingsPage.tsx
import React from 'react';
import { useLenisCleanup } from '../../../hooks/useLenisCleanup';
const SettingsPage: React.FC = () => {
  useLenisCleanup();
  return (
    <div>
      <h1>Настройки</h1>
      <p>Настройте параметры вашего аккаунта</p>
    </div>
  );
};

export default SettingsPage;