// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';
import api from '../lib/api';

interface DecodedToken {
  sub: string;
  exp: number;
  iat?: number;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  userId: string | null;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  signup: (userData: User) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  fetchUserDetails: (uuid: string) => Promise<any>;
  refreshUserData: () => Promise<void>;
}

let globalAuthState = {
  isAuthenticated: false,
  user: null as User | null,
  loading: true,
  userId: null as string | null,
};

const listeners = new Set<(state: typeof globalAuthState) => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener(globalAuthState));
};

const updateGlobalAuthState = (newState: typeof globalAuthState) => {
  globalAuthState = newState;
  notifyListeners();
};

// Извлечение UUID из токена
const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.sub;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const useAuth = (): UseAuthReturn => {
  const [localState, setLocalState] = useState(globalAuthState);

  // Получение данных пользователя с бэкенда по UUID
  const fetchUserDetails = useCallback(async (uuid: string) => {
    try {
      const { data } = await api.get(`/users/${uuid}`);
      return data;
    } catch (err) {
      console.error('Failed to fetch user details');
      return null;
    }
  }, []);

  // Обновление данных пользователя из бэкенда
  const refreshUserData = useCallback(async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.warn('No user ID in token');
      return;
    }

    try {
      const userData = await fetchUserDetails(userId);
      if (userData) {
        // Сохраняем старые данные из localStorage (чтобы не потерять имя/аватар)
        const savedUser = localStorage.getItem('user');
        let oldUserData = {};
        try {
          if (savedUser) oldUserData = JSON.parse(savedUser);
        } catch (e) {}
        
        const updatedUser: User = {
          id: userData.user_uuid || userData.id || userId,
          email: userData.email || (oldUserData as any).email,
          name: userData.first_name || userData.name || (oldUserData as any).name || (oldUserData as any).displayName,
          username: userData.username || (oldUserData as any).username,
          displayName: userData.first_name || userData.name || (oldUserData as any).displayName || (oldUserData as any).name,
          avatar: userData.photo_url || (oldUserData as any).avatar,
          role: userData.roles?.includes('admin') ? 'admin' : 'user',
          token: localStorage.getItem('accessToken') || undefined,
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        updateGlobalAuthState({
          isAuthenticated: true,
          user: updatedUser,
          loading: false,
          userId: userId,
        });
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  }, [fetchUserDetails]);

  useEffect(() => {
    const handleChange = (state: typeof globalAuthState) => {
      setLocalState(state);
    };

    listeners.add(handleChange);

    const accessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    const userId = getUserIdFromToken();

    if (accessToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        updateGlobalAuthState({
          isAuthenticated: true,
          user: parsedUser,
          loading: false,
          userId: userId,
        });
        
        // Фоновое обновление данных пользователя
        refreshUserData();
      } catch {
        logout();
      }
    } else if (accessToken && userId) {
      // Есть токен, но нет сохранённого пользователя — получаем из API
      refreshUserData();
    } else {
      updateGlobalAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        userId: null,
      });
    }

    return () => {
      listeners.delete(handleChange);
    };
  }, [refreshUserData]);

  const login = useCallback(async (userData: User) => {
    const userId = getUserIdFromToken();
    localStorage.setItem('user', JSON.stringify(userData));

    updateGlobalAuthState({
      isAuthenticated: true,
      user: userData,
      loading: false,
      userId: userId,
    });
    
    // Обновляем данные из API для получения полной информации
    await refreshUserData();
  }, [refreshUserData]);

  const signup = useCallback(async (userData: User) => {
    const userId = getUserIdFromToken();
    localStorage.setItem('user', JSON.stringify(userData));

    updateGlobalAuthState({
      isAuthenticated: true,
      user: userData,
      loading: false,
      userId: userId,
    });
    
    await refreshUserData();
  }, [refreshUserData]);

  const logout = useCallback(() => {
    // refreshToken в httpOnly cookie, удалять не нужно (очистится на сервере)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    updateGlobalAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      userId: null,
    });
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (!localState.user) return;

    const updatedUser = { ...localState.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    updateGlobalAuthState({
      isAuthenticated: true,
      user: updatedUser,
      loading: false,
      userId: localState.userId,
    });
  }, [localState.user, localState.userId]);

  return {
    isAuthenticated: localState.isAuthenticated,
    user: localState.user,
    loading: localState.loading,
    userId: localState.userId,
    login,
    logout,
    signup,
    updateUser,
    fetchUserDetails,
    refreshUserData,
  };
};
