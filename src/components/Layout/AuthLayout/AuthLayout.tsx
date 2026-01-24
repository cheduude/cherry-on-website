import React, { Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';
import '../../Pages/Auth/Auth.css'; // ✅ Теперь изолированные стили
import AuthBackground from '../../Pages/Auth/AuthBackground';
const AuthLayout: React.FC = () => {
  useEffect(() => {
    // Добавляем класс к body для изоляции
    document.body.classList.add('auth-layout', 'auth-page-isolated');
    
    return () => {
      document.body.classList.remove('auth-layout', 'auth-page-isolated');
    };
  }, []);

  return (
    <div className="auth-layout">
      
      <div className="auth-background"></div>
      <AuthBackground />
      <div className="auth-content">
        
        <Suspense fallback={<div className="auth-loading">Загрузка...</div>}>
          <Outlet />
          
        </Suspense>
        
      </div>
    </div>
  );
};

export default AuthLayout;