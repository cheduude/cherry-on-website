// App.tsx (исправленный)
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import MainLayout from './components/Layout/MainLayout/MainLayout';
import AuthLayout from './components/Layout/AuthLayout/AuthLayout';
import ScrollToTop from './components/Pages/Home/ScrollToTop';
import AdminAccessPage from './components/Pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import { PageLoader } from './components/Layout/PageTransition';
import './styles/themes.css';

// Публичные страницы
const Home = React.lazy(() => import('./components/Pages/Home/Home'));
const Services = React.lazy(() => import('./components/Pages/Services/Services'));
const Auth = React.lazy(() => import('./components/Pages/Auth/Auth'));
const OrdersPage = React.lazy(() => import('./components/Pages/Orders/OrdersPage'));
const SupportPage = React.lazy(() => import('./components/Pages/Support/SupportPage'));
const TestimonialsPage = React.lazy(() => import('./components/Pages/Home/TestimonialsPage'));
const DocumentPage = React.lazy(() => import('./components/Pages/Documents/DocumentPage'));

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
      <Routes>
        {/* AUTH LAYOUT — без хедера и футера */}
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        {/* MAIN LAYOUT — с хедером и футером; Suspense/переход внутри layout */}
        <Route element={<MainLayout />}>
          {/* Публичные страницы */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contacts" element={<Navigate to="/support" replace />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/pp" element={<DocumentPage />} />
          <Route path="/tos" element={<DocumentPage />} />
          <Route path="/cp" element={<DocumentPage />} />
          <Route path="/po" element={<DocumentPage />} />

          {/* Админ-панель (только admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']} redirectTo="/auth">
                <AdminAccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/access"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'moderator']} redirectTo="/auth">
                <AdminAccessPage />
              </ProtectedRoute>
            }
          />

          {/* Редактор контента (editor и admin) - отдельный маршрут */}
          <Route
            path="/editor"
            element={
              <ProtectedRoute allowedRoles={['editor', 'admin']} redirectTo="/auth">
                <React.Suspense fallback={<PageLoader />}>
                  <ContentEditor />
                </React.Suspense>
              </ProtectedRoute>
            }
          />

          {/* Личный кабинет (только авторизованные) */}
          <Route
            path="/cabinet"
            element={
              <ProtectedRoute allowedRoles={['user', 'editor', 'admin']} redirectTo="/auth">
                <React.Suspense fallback={<PageLoader />}>
                  <CabinetLayout />
                </React.Suspense>
              </ProtectedRoute>
            }
          >
            <Route index element={
              <ProtectedRoute allowedRoles={['admin']} redirectTo="/cabinet/subscription">
                <React.Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </React.Suspense>
              </ProtectedRoute>
            } />
            <Route path="tariffs" element={<Tariffs />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="referrals" element={<Referrals />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Редирект на главную для неизвестных маршрутов */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  );
};

export default App;
