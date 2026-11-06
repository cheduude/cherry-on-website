// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from './Layout/PageTransition';

interface ProtectedRouteProps {
  allowedRoles?: ('user' | 'editor' | 'admin' | 'superadmin' | 'moderator')[];
  redirectTo?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = ['user', 'editor', 'admin'], 
  redirectTo = '/auth',
  children 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }
  
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    // For role mismatches honor redirectTo (e.g. /cabinet → /cabinet/subscription),
    // falling back to home only when redirectTo still points at auth.
    const fallback = redirectTo && redirectTo !== '/auth' ? redirectTo : '/';
    return <Navigate to={fallback} replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
