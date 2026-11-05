// App.tsx (исправленный)
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import MainLayout from './components/Layout/MainLayout/MainLayout';
import AuthLayout from './components/Layout/AuthLayout/AuthLayout';
import ScrollToTop from './components/Pages/Home/ScrollToTop';
import AdminAccessPage from './components/Pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/themes.css';

// Публичные страницы
const Home = React.lazy(() => import('./components/Pages/Home/Home'));
const Services = React.lazy(() => import('./components/Pages/Services/Services'));
const Auth = React.lazy(() => import('./components/Pages/Auth/Auth'));
const OrdersPage = React.lazy(() => import('./components/Pages/Orders/OrdersPage'));
const SupportPage = React.lazy(() => import('./components/Pages/Support/SupportPage'));
const TestimonialsPage = React.lazy(() => import('./components/Pages/Home/TestimonialsPage'));

// Личный кабинет
const CabinetLayout = React.lazy(() => import('./components/Cabinet/layout/CabinetLayout'));
const Dashboard = React.lazy(() => import('./components/Cabinet/pages/Dashboard'));
const Profile = React.lazy(() => import('./components/Cabinet/pages/Profile'));
const Tariffs = React.lazy(() => import('./components/Cabinet/pages/Tariffs'));
const Subscription = React.lazy(() => import('./components/Cabinet/pages/Subscription'));
const Referrals = React.lazy(() => import('./components/Cabinet/pages/Referrals'));

// Редактор контента
const ContentEditor = React.lazy(() => import('./components/Pages/Editor/ContentEditor'));

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <ScrollToTop />
      <Suspense fallback={<div className="loading">Загрузка...</div>}>
        <Routes>
          {/* AUTH LAYOUT — без хедера и футера */}
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<Auth />} />
          </Route>

          {/* MAIN LAYOUT — с хедером и футером */}
          <Route element={<MainLayout />}>
            {/* Публичные страницы */}
            <Route path="/" element={<Home isMobile={false} />} />
            <Route path="/services" element={<Services isMobile={false} isAuthenticated={false} />} />
            <Route path="/contacts" element={<div>Контакты</div>} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />

            {/* Админ-панель (только admin) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']} redirectTo="/auth">
                  <AdminAccessPage />
                </ProtectedRoute>
              }
            />

            {/* Редактор контента (editor и admin) - отдельный маршрут */}
            <Route
              path="/editor"
              element={
                <ProtectedRoute allowedRoles={['editor', 'admin', 'user']} redirectTo="/auth">
                  <ContentEditor />
                </ProtectedRoute>
              }
            />

            {/* Личный кабинет (только авторизованные) */}
            <Route
              path="/cabinet"
              element={
                <ProtectedRoute allowedRoles={['user', 'editor', 'admin']} redirectTo="/auth">
                  <CabinetLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="tariffs" element={<Tariffs />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="referrals" element={<Referrals />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Редирект на главную для неизвестных маршрутов */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </NotificationProvider>
  );
};

export default App;