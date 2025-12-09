import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="auth-background"></div>
      <div className="auth-content">
        <Suspense fallback={<div className="auth-loading">Загрузка...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AuthLayout;