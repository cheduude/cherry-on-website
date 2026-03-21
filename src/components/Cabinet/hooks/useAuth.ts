// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import api from '../lib/api';
import type { User } from '../types/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/client/auth/me');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/client/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    await fetchUser();
    return data;
  };

  const register = async (email: string, password: string, name?: string) => {
    const { data } = await api.post('/client/auth/register', { email, password, name });
    localStorage.setItem('accessToken', data.accessToken);
    await fetchUser();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, login, register, logout };
};