// src/lib/api.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const configuredApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE_URL = configuredApiUrl
  ? `${configuredApiUrl.replace(/\/api$/i, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const isAuthEndpoint = (url = '') => /\/auth\/(login|register|telegram|refresh)\/?$/.test(url);

// Проверка, истек ли токен
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = jwtDecode<{ exp?: number }>(token);
    return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

// Обновление токена
let refreshPromise: Promise<string> | null = null;

const refreshToken = async (): Promise<string> => {
  if (refreshPromise) {
    return refreshPromise;
  }
  
  refreshPromise = (async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
        withCredentials: true,
      });
      const newToken = response.data?.jwt;
      if (typeof newToken !== 'string' || !newToken) {
        throw new Error('Refresh endpoint did not return a JWT');
      }
      localStorage.setItem('accessToken', newToken);
      return newToken;
    } finally {
      refreshPromise = null;
    }
  })();
  
  return refreshPromise;
};

// Интерцептор запроса — проверяем токен перед отправкой
api.interceptors.request.use(async (config) => {
  // Older call sites include `/api` even though the client base URL already does.
  if (config.url?.startsWith('/api/')) {
    config.url = config.url.slice('/api'.length);
  }

  const isAuthRequest = isAuthEndpoint(config.url);
  const token = localStorage.getItem('accessToken');
  
  if (token && !isAuthRequest && isTokenExpired(token)) {
    try {
      const newToken = await refreshToken();
      config.headers.Authorization = `Bearer ${newToken}`;
    } catch (error) {
      console.error('❌ Не удалось обновить токен:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/auth';
      throw new Error('Session expired');
    }
  } else if (token && !isAuthRequest && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Интерцептор ответа — на случай если токен протух между запросами
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (
      originalRequest &&
      error.response?.status === 401 &&
      !isAuthEndpoint(originalRequest.url) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
