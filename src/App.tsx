// src/App.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import MainLayout from './components/Layout/MainLayout/MainLayout';
import AuthLayout from './components/Layout/AuthLayout/AuthLayout';
import ScrollToTop from './components/Pages/Home/ScrollToTop';
import AdminAccessPage from './components/Pages/Admin';
import './styles/themes.css';
const Home = React.lazy(() => import('./components/Pages/Home/Home'));
const Services = React.lazy(() => import('./components/Pages/Services/Services'));
const Auth = React.lazy(() => import('./components/Pages/Auth/Auth'));
const OrdersPage = React.lazy(() => import('./components/Pages/Orders/OrdersPage'));
const SupportPage = React.lazy(() => import('./components/Pages/Support/SupportPage'));

const App: React.FC = () => {
  return (
    
    <NotificationProvider>
      <ScrollToTop />
      <Suspense fallback={<div className="loading">Загрузка...</div>}>
        <Routes>
          
          {/* AUTH LAYOUT */}
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<Auth />} />
          </Route>
          
          {/* MAIN LAYOUT */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home isMobile={false} />} />
            <Route path="/services" element={<Services isMobile={false} isAuthenticated={false} />} />
            <Route path="/contacts" element={<div>Контакты</div>} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminAccessPage />} />
            <Route path="/support" element={<SupportPage />} />
            
          </Route>

          {/* REDIRECT ALL UNKNOWN */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </NotificationProvider>
  );
};

export default App;
