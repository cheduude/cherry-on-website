// src/components/Layout/MainLayout/MainLayout.tsx
import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import PageTransition from '../PageTransition';
import { useDeviceDetect } from '../../../hooks/useDeviceDetect';

const MainLayout: React.FC = () => {
  const { isMobile } = useDeviceDetect();

  return (
    <div className="site-wrapper">
      <Header isMobile={isMobile} />
      <main className="main-content">
        <PageTransition />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;