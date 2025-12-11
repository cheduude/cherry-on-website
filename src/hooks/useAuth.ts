import { useState, useEffect } from 'react';
import type { User } from '../types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  signup: (userData: User) => void; // Добавьте этот метод
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
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const signup = (userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    isAuthenticated,
    user,
    login,
    signup, // Экспортируем метод
    logout
  };
};