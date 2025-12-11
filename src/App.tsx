import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Layout/Header/Header';
import Footer from './components/Layout/Footer/Footer';
import { useDeviceDetect } from './hooks/useDeviceDetect';
import ScrollToTop from './components/Pages/Home/ScrollToTop';
import GlassButtons from './components/Layout/GlassButtons/GlassButtons';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Ленивая загрузка страниц для оптимизации
const Home = React.lazy(() => import('./components/Pages/Home/Home'));
const Services = React.lazy(() => import('./components/Pages/Services/Services'));
const Auth = React.lazy(() => import('./components/Pages/Auth/Auth'));

// Компонент для управления изоляцией страницы авторизации
const AuthPageIsolation = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  useEffect(() => {
    const body = document.body;
    
    if (isAuthPage) {
      // Добавляем класс для изоляции стилей
      body.classList.add('auth-page-isolated');
      // Отключаем скролл на основной странице
      body.style.overflow = 'hidden';
      
      // Скрываем все элементы основного layout
      const elementsToHide = document.querySelectorAll('.glass-buttons, header, footer');
      elementsToHide.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    } else {
      // Убираем класс изоляции
      body.classList.remove('auth-page-isolated');
      body.style.overflow = '';
      
      // Показываем все элементы основного layout
      const elementsToShow = document.querySelectorAll('.glass-buttons, header, footer');
      elementsToShow.forEach(el => {
        (el as HTMLElement).style.display = '';
      });
    }

    return () => {
      // Cleanup
      body.classList.remove('auth-page-isolated');
      body.style.overflow = '';
    };
  }, [isAuthPage]);

  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const { isMobile } = useDeviceDetect();
  const { isAuthenticated } = useAuth();

  // Определяем, показывать ли Header на странице авторизации
  const showHeaderAndFooter = location.pathname !== '/auth';

  return (
    <>
      {/* Применяем изоляцию только для Auth страницы */}
      <AuthPageIsolation>
        <div className="app-wrapper">
          {/* Нативные заголовки безопасности */}
          <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;" />
          <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

          {/* Скрываем GlassButtons на странице авторизации */}
          {showHeaderAndFooter}
          
          <div className="site-body">
            {showHeaderAndFooter && <Header isMobile={isMobile} isAuthenticated={isAuthenticated} />}
            <main className="main-content">
              <Suspense fallback={<div className="loading">Загрузка...</div>}>
                <Routes>
                  <Route path="/" element={<Home isMobile={isMobile} />} />
                  <Route 
                    path="/services" 
                    element={<Services isMobile={isMobile} isAuthenticated={isAuthenticated} />} 
                  />
                  <Route path="/auth" element={<Auth />} />
                </Routes>
              </Suspense>
            </main>
          </div>
          {showHeaderAndFooter && <Footer />}
          <ScrollToTop />
        </div>
      </AuthPageIsolation>
    </>
  );
}

// Обернуть App в Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;