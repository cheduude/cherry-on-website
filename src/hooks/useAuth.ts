// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import type { User } from '../types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  signup: (userData: User) => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        console.error('Ошибка парсинга user:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  const login = (userData: User) => {
    const userWithDisplayName = {
      ...userData,
      displayName: userData.displayName || userData.name || userData.username || 'Пользователь',
    };
    
    setIsAuthenticated(true);
    setUser(userWithDisplayName);
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify(userWithDisplayName));
  };

  const signup = (userData: User) => {
    const userWithDisplayName = {
      ...userData,
      displayName: userData.displayName || userData.name || userData.username || 'Пользователь',
    };
    
    setIsAuthenticated(true);
    setUser(userWithDisplayName);
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify(userWithDisplayName));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return {
    isAuthenticated,
    user,
    login,
    signup,
    logout,
    updateUser,
  };
};