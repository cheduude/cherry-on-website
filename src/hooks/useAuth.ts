// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  signup: (userData: User) => void;
  updateUser: (userData: Partial<User>) => void;
}

// Глобальная переменная для синхронизации между всеми вызовами useAuth
let globalAuthState = {
  isAuthenticated: false,
  user: null as User | null
};

// Список всех компонентов, которые слушают изменения
const listeners = new Set<(state: typeof globalAuthState) => void>();

// Функция для уведомления всех компонентов
const notifyListeners = () => {
  listeners.forEach(listener => listener(globalAuthState));
};

// Функция для обновления состояния везде
const updateGlobalAuthState = (newState: typeof globalAuthState) => {
  globalAuthState = newState;
  notifyListeners();
};

export const useAuth = (): UseAuthReturn => {
  // Локальное состояние для каждого компонента
  const [localState, setLocalState] = useState(() => globalAuthState);

  // Подписываемся на глобальные изменения
  useEffect(() => {
    const handleGlobalChange = (newState: typeof globalAuthState) => {
      setLocalState(newState);
    };

    listeners.add(handleGlobalChange);
    
    // При монтировании загружаем из localStorage
    const loadFromStorage = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser) as User;
          const newState = {
            isAuthenticated: true,
            user: parsedUser
          };
          updateGlobalAuthState(newState);
        } catch (error) {
          console.error('Ошибка парсинга user:', error);
        }
      }
    };

    loadFromStorage();

    return () => {
      listeners.delete(handleGlobalChange);
    };
  }, []);

  // Слушаем события от других вкладок
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'token' || event.key === 'user') {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser) as User;
            updateGlobalAuthState({
              isAuthenticated: true,
              user: parsedUser
            });
          } catch (error) {
            updateGlobalAuthState({
              isAuthenticated: false,
              user: null
            });
          }
        } else {
          updateGlobalAuthState({
            isAuthenticated: false,
            user: null
          });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback((userData: User) => {
    console.log('🔐 LOGIN вызван с данными:', userData);
    
    // Добавляем обязательные поля
    const userWithDefaults = {
      ...userData,
      displayName: userData.displayName || userData.name || userData.username || 'Пользователь',
      role: userData.role || 'user',
      username: userData.username || userData.email?.split('@')[0] || 'user'
    };
    
    // Сохраняем в localStorage
    localStorage.setItem('token', 'telegram-auth-token');
    localStorage.setItem('user', JSON.stringify(userWithDefaults));
    
    console.log('✅ Данные сохранены в localStorage');
    
    // Обновляем глобальное состояние
    updateGlobalAuthState({
      isAuthenticated: true,
      user: userWithDefaults
    });
    
    // Триггерим событие для синхронизации
    window.dispatchEvent(new Event('auth-state-changed'));
    
    return Promise.resolve();
  }, []);

  const signup = useCallback((userData: User) => {
    const userWithDefaults = {
      ...userData,
      displayName: userData.displayName || userData.name || userData.username || 'Пользователь',
      role: userData.role || 'user',
      username: userData.username || userData.email?.split('@')[0] || 'user'
    };
    
    localStorage.setItem('token', 'telegram-auth-token');
    localStorage.setItem('user', JSON.stringify(userWithDefaults));
    
    updateGlobalAuthState({
      isAuthenticated: true,
      user: userWithDefaults
    });
    
    window.dispatchEvent(new Event('auth-state-changed'));
    
    return Promise.resolve();
  }, []);

  const logout = useCallback(() => {
    console.log('🚪 LOGOUT вызван');
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    updateGlobalAuthState({
      isAuthenticated: false,
      user: null
    });
    
    window.dispatchEvent(new Event('auth-state-changed'));
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (localState.user) {
      const updatedUser = { ...localState.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      updateGlobalAuthState({
        isAuthenticated: true,
        user: updatedUser
      });
      
      window.dispatchEvent(new Event('auth-state-changed'));
    }
  }, [localState.user]);

  return {
    isAuthenticated: localState.isAuthenticated,
    user: localState.user,
    login,
    logout,
    signup,
    updateUser,
  };
};