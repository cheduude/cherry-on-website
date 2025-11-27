// src/hooks/useAuth.ts (Простая аутентификация — плейсхолдер)
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setUser({ avatar: '/assets/avatar.png' });  // Плейсхолдер
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, logout };
};