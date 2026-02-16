import React, { Suspense, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';
import '../../Pages/Auth/Auth.css'; // ✅ изолированные стили
import AuthBackground from '../../Pages/Auth/AuthBackground';

const AuthLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Определяем мобильное устройство
    const checkMobile = () => {
      const mobile = window.innerWidth <= 767;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Добавляем класс к body для изоляции
    document.body.classList.add('auth-layout', 'auth-page-isolated');

    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('auth-layout', 'auth-page-isolated');
    };
  }, []);

  return (
    <div className="auth-layout">
      {/* Рендерим фон только если не мобильное устройство */}
      {!isMobile && <AuthBackground />}

      <div className="auth-content">
        <Suspense fallback={<div className="auth-loading">Загрузка...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AuthLayout;
