import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header/Header';
import Footer from './components/Layout/Footer/Footer';
import { useDeviceDetect } from './hooks/useDeviceDetect';
import { useAuth } from './hooks/useAuth';
import './App.css';

// Ленивая загрузка страниц для оптимизации
const Home = React.lazy(() => import('./components/Pages/Home/Home'));
const Services = React.lazy(() => import('./components/Pages/Services/Services'));

function App() {
  const { isMobile } = useDeviceDetect();
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="app-wrapper">
        {/* Нативные заголовки безопасности */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:;" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

        <div className="site-body">
          <Header isMobile={isMobile} isAuthenticated={isAuthenticated} />
          <main className="main-content">
            <Suspense fallback={<div className="loading">Загрузка...</div>}>
              <Routes>
                <Route path="/" element={<Home isMobile={isMobile} />} />
                <Route 
                  path="/services" 
                  element={<Services isMobile={isMobile} isAuthenticated={isAuthenticated} />} 
                />
              </Routes>
            </Suspense>
          </main>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;