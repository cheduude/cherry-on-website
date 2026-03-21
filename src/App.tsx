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
const TestimonialsPage = React.lazy(() => import('./components/Pages/Home/TestimonialsPage'));

// ── Новые импорты для кабинета ──
const CabinetLayout = React.lazy(() => import('./components/Cabinet/layout/CabinetLayout'));
const Dashboard     = React.lazy(() => import('./components/Cabinet/pages/Dashboard'));
const Profile       = React.lazy(() => import('./components/Cabinet/pages/Profile'));
const Tariffs       = React.lazy(() => import('./components/Cabinet/pages/Tariffs'));
const Subscription       = React.lazy(() => import('./components/Cabinet/pages/Subscription'));
const Referrals       = React.lazy(() => import('./components/Cabinet/pages/Referrals'));


const App: React.FC = () => {
  // Временная заглушка авторизации (замени на реальную позже)
  const isAuthenticated = true; // true для теста, false — редирект на /auth

  const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
  };

  return (
    <NotificationProvider>
      <ScrollToTop />
      <Suspense fallback={<div className="loading">Загрузка...</div>}>
        <Routes>

          {/* AUTH LAYOUT */}
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<Auth />} />
          </Route>

          {/* MAIN LAYOUT — публичные страницы */}
          <Route element={<MainLayout />}>

          <Route path="/" element={<Home isMobile={false} />} />
          <Route path="/services" element={<Services isMobile={false} isAuthenticated={false} />} />
          <Route path="/contacts" element={<div>Контакты</div>} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminAccessPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />

          {/* ЛИЧНЫЙ КАБИНЕТ */}
          <Route
            path="/cabinet"
            element={
              <RequireAuth>
                <CabinetLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tariffs" element={<Tariffs />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="profile" element={<Profile />} />
          </Route>

        </Route>
          {/* REDIRECT ALL UNKNOWN */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </NotificationProvider>
  );
};

export default App;