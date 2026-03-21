import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => void;
  signup: (userData: User) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

let globalAuthState = {
  isAuthenticated: false,
  user: null as User | null,
};

const listeners = new Set<(state: typeof globalAuthState) => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener(globalAuthState));
};

const updateGlobalAuthState = (newState: typeof globalAuthState) => {
  globalAuthState = newState;
  notifyListeners();
};

export const useAuth = (): UseAuthReturn => {
  const [localState, setLocalState] = useState(globalAuthState);

  useEffect(() => {
    const handleChange = (state: typeof globalAuthState) => {
      setLocalState(state);
    };

    listeners.add(handleChange);

    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User;
        updateGlobalAuthState({
          isAuthenticated: true,
          user: parsedUser,
        });
      } catch {
        logout();
      }
    }

    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const login = useCallback(async (userData: User) => {
    localStorage.setItem('token', userData.token || '');
    localStorage.setItem('user', JSON.stringify(userData));

    updateGlobalAuthState({
      isAuthenticated: true,
      user: userData,
    });
  }, []);

  const signup = useCallback(async (userData: User) => {
    localStorage.setItem('token', userData.token || '');
    localStorage.setItem('user', JSON.stringify(userData));

    updateGlobalAuthState({
      isAuthenticated: true,
      user: userData,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    updateGlobalAuthState({
      isAuthenticated: false,
      user: null,
    });
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (!localState.user) return;

    const updatedUser = { ...localState.user, ...userData };

    localStorage.setItem('user', JSON.stringify(updatedUser));

    updateGlobalAuthState({
      isAuthenticated: true,
      user: updatedUser,
    });
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