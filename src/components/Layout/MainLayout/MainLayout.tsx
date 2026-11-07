// src/components/Layout/MainLayout/MainLayout.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import PageTransition from '../PageTransition';
import { useDeviceDetect } from '../../../hooks/useDeviceDetect';

const MainLayout: React.FC = () => {
  const { isMobile } = useDeviceDetect();
  const location = useLocation();
  const isCabinet = location.pathname.startsWith('/cabinet');

  return (
    <div className={`site-wrapper${isCabinet ? ' site-wrapper--cabinet' : ''}`}>
      <Header isMobile={isMobile} />
      <main className="main-content">
        <PageTransition />
      </main>
      {!isCabinet && <Footer />}
    </div>
  );
};

export default MainLayout;