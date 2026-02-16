// src/components/Layout/MainLayout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useDeviceDetect } from '../../../hooks/useDeviceDetect';
// УДАЛИТЬ импорт useAuth отсюда!

const MainLayout: React.FC = () => {
  const { isMobile } = useDeviceDetect();

  return (
    <div className="site-wrapper">
      {/* Header сам берет useAuth внутри себя */}
      <Header isMobile={isMobile} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;