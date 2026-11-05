// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Проверка, истек ли токен
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
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
      const response = await axios.post('/api/auth/refresh', {}, {
        withCredentials: true,
      });
      const newToken = response.data.jwt;
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
  const token = localStorage.getItem('accessToken');
  
  if (token && isTokenExpired(token)) {
    console.log('⏰ Токен протух, обновляем перед запросом...');
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
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Интерцептор ответа — на случай если токен протух между запросами
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
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