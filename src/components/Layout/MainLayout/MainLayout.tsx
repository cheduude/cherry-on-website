// src/components/Layout/MainLayout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useDeviceDetect } from '../../../hooks/useDeviceDetect';
import { useAuth } from '../../../hooks/useAuth';

const MainLayout: React.FC = () => {
  const { isMobile } = useDeviceDetect();
  const { isAuthenticated } = useAuth();

  return (
    <div className="site-wrapper">
      <Header isMobile={isMobile} isAuthenticated={isAuthenticated} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
