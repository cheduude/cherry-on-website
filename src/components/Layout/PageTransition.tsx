import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const PageLoader: React.FC = () => (
  <div className="page-loader" role="status" aria-live="polite">
    <span className="page-loader__label">Загрузка...</span>
  </div>
);

/** Keeps chrome mounted while lazy pages load and fades content on route change. */
const PageTransition: React.FC = () => {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <div key={location.pathname} className="page-transition">
        <Outlet />
      </div>
    </Suspense>
  );
};

export default PageTransition;
export { PageLoader };
