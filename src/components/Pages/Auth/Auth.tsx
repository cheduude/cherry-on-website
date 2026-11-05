// src/components/Auth/Auth.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../contexts/NotificationContext';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../../../constants/validation';
import LoginForm from './Log';
import SignupForm from './Reg';
import api from '../../../lib/api';

interface TelegramUserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const formParam = searchParams.get('form');
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const checkboxRef = useRef<HTMLInputElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const currentRequestRef = useRef<AbortController | null>(null);

  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    signupEmail: '',
    signupPassword: '',
    confirmPassword: '',
  });

  // Редирект если уже авторизован
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Обработка параметра form для показа регистрации
  useEffect(() => {
    const isRegisterMode = formParam === 'register';
    
    if (isRegisterMode && isLogin) {
      setIsLogin(false);
      
      const timer = setTimeout(() => {
        if (checkboxRef.current) {
          setIsAnimating(true);
          checkboxRef.current.checked = true;
          navigate('/auth', { replace: true });
          
          setTimeout(() => setIsAnimating(false), isMobile ? 400 : 800);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [formParam, isLogin, navigate, isMobile]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (currentRequestRef.current) currentRequestRef.current.abort();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Валидация пароля с детальными проверками
  const validatePassword = useCallback((password: string): string[] => {
    const errors: string[] = [];
    
    if (!password.trim()) {
      errors.push(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
      return errors;
    }
    
    if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
      errors.push(VALIDATION_MESSAGES.PASSWORD_TOO_SHORT);
    }
    
    if (password.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH) {
      errors.push(VALIDATION_MESSAGES.PASSWORD_TOO_LONG);
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Пароль должен содержать заглавную букву (A-Z)');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Пароль должен содержать строчную букву (a-z)');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Пароль должен содержать цифру (0-9)');
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Пароль должен содержать специальный символ (@$!%*?&)');
    }
    
    return errors;
  }, []);

  const validateLoginForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.loginEmail.trim()) {
      errors.push(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    } else if (!VALIDATION_RULES.EMAIL_REGEX.test(formData.loginEmail)) {
      errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);
    }

    errors.push(...validatePassword(formData.loginPassword));

    if (errors.length > 0) {
      showError('Ошибка входа', errors.join('. '));
      return false;
    }
    return true;
  };

  const validateSignupForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.signupEmail.trim()) {
      errors.push(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    } else if (!VALIDATION_RULES.EMAIL_REGEX.test(formData.signupEmail)) {
      errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);
    }

    errors.push(...validatePassword(formData.signupPassword));

    if (!formData.confirmPassword.trim()) {
      errors.push('Подтвердите пароль');
    } else if (formData.signupPassword !== formData.confirmPassword) {
      errors.push(VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH);
    }

    if (errors.length > 0) {
      showError('Ошибка регистрации', errors.join('. '));
      return false;
    }
    return true;
  };

  // Создание объекта пользователя из ответа сервера
  const createUserObject = (data: any, email: string, defaultName?: string) => {
    const userFromServer = data.user || data.data?.user || {};
    const token = data.token || data.accessToken || data.jwt || data.JWT;
    
    if (!token) {
      throw new Error('Сервер не вернул токен авторизации');
    }

    const userId = userFromServer.id ?? userFromServer._id ?? Date.now();
    const numericId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    return {
      id: numericId,
      name: userFromServer.name || userFromServer.username || defaultName || 'Пользователь',
      email: userFromServer.email || email,
      avatar: userFromServer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random&color=fff&size=32&bold=true`,
      role: userFromServer.role || 'user',
      username: userFromServer.username || email.split('@')[0],
      token,
    };
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/api/auth/login', {
        login: formData.loginEmail.trim(),
        password: formData.loginPassword.trim(),
      });

      const data = response.data;
      const token = data.token || data.accessToken || data.jwt || data.JWT;
      
      if (!token) {
        throw new Error('Сервер не вернул токен');
      }
      
      localStorage.setItem('accessToken', token);
      
      // Принудительное обновление refresh_token
      try {
        console.log('🔄 Принудительное обновление refresh_token...');
        const refreshResponse = await api.post('/api/auth/refresh', {}, {
          withCredentials: true,
        });
        if (refreshResponse.data.jwt) {
          localStorage.setItem('accessToken', refreshResponse.data.jwt);
        }
      } catch (refreshError) {
        console.warn('⚠️ Не удалось обновить refresh_token:', refreshError);
      }
      
      const user = createUserObject(data, formData.loginEmail, formData.loginEmail.split('@')[0]);
      user.token = localStorage.getItem('accessToken') || token;
      await login(user);
      showSuccess('Успешный вход', 'Вы успешно вошли в систему');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Неверный email или пароль';
      const statusCode = error.response?.status;
      const errorText = error.response?.data?.message?.toLowerCase() || error.message?.toLowerCase() || '';
      
      if (statusCode === 404 || errorText.includes('not found') || errorText.includes('не найден')) {
        errorMessage = 'Пользователь с таким email не найден';
      } else if (statusCode === 401 || errorText.includes('unauthorized') || errorText.includes('не авторизован')) {
        errorMessage = 'Неверный пароль';
      } else if (statusCode === 403 || errorText.includes('forbidden')) {
        errorMessage = 'Доступ запрещён. Возможно, аккаунт заблокирован';
      } else if (statusCode === 400 || errorText.includes('bad request')) {
        errorMessage = 'Некорректные данные для входа';
      } else if (statusCode === 500 || errorText.includes('internal server')) {
        errorMessage = 'Ошибка на сервере. Попробуйте позже';
      } else if (errorText.includes('password') || errorText.includes('пароль')) {
        errorMessage = 'Неверный пароль';
      } else if (errorText.includes('user') && (errorText.includes('not exist') || errorText.includes('не существует'))) {
        errorMessage = 'Пользователь с таким email не найден';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showError('Ошибка входа', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignupForm()) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/api/auth/register', {
        login: formData.signupEmail.trim(),
        password: formData.signupPassword.trim(),
      });

      const data = response.data;
      const token = data.token || data.accessToken || data.jwt || data.JWT;
      
      if (!token) {
        throw new Error('Сервер не вернул токен');
      }
      
      localStorage.setItem('accessToken', token);
      
      // Принудительное обновление refresh_token
      try {
        console.log('🔄 Принудительное обновление refresh_token...');
        const refreshResponse = await api.post('/api/auth/refresh', {}, {
          withCredentials: true,
        });
        if (refreshResponse.data.jwt) {
          localStorage.setItem('accessToken', refreshResponse.data.jwt);
        }
      } catch (refreshError) {
        console.warn('⚠️ Не удалось обновить refresh_token:', refreshError);
      }
      
      const user = createUserObject(data, formData.signupEmail, 'Пользователь');
      user.token = localStorage.getItem('accessToken') || token;
      await signup(user);
      showSuccess('Успешная регистрация', 'Вы успешно зарегистрировались');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Ошибка регистрации';
      const statusCode = error.response?.status;
      const errorText = error.response?.data?.message?.toLowerCase() || error.message?.toLowerCase() || '';
      
      if (statusCode === 409 || 
          errorText.includes('already exists') || 
          errorText.includes('already exist') ||
          errorText.includes('already registered') ||
          errorText.includes('уже существует') ||
          errorText.includes('уже зарегистрирован')) {
        errorMessage = 'Пользователь с таким email уже существует';
      } else if (statusCode === 400 && (errorText.includes('password') || errorText.includes('пароль'))) {
        errorMessage = 'Пароль не соответствует требованиям безопасности';
      } else if (statusCode === 500 || errorText.includes('internal server')) {
        errorMessage = 'Ошибка на сервере. Попробуйте позже';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showError('Ошибка регистрации', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Telegram авторизация
  const handleTelegramAuth = useCallback(async (userData: TelegramUserData) => {
    if (!userData?.id) {
      showError('Ошибка авторизации', 'Не получены данные от Telegram');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/api/auth/telegram', {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        username: userData.username,
        photo_url: userData.photo_url,
        auth_date: userData.auth_date,
        hash: userData.hash,
      });

      const data = response.data;
      console.log('📥 Server response:', data);

      // Ищем токен
      const token = data.JWT || data.token || data.accessToken || data.jwt;

      console.log('🔑 Token found:', token ? `${token.substring(0, 30)}...` : 'NOT FOUND');

      if (!token) {
        console.warn('⚠️ No token in response');
        throw new Error('Сервер не вернул токен авторизации');
      }

      // Сохраняем JWT
      localStorage.setItem('accessToken', token);
      
      // Принудительное обновление refresh_token через refresh эндпоинт
      try {
        console.log('🔄 Принудительное обновление refresh_token...');
        const refreshResponse = await api.post('/api/auth/refresh', {}, {
          withCredentials: true,
        });
        console.log('✅ Refresh_token обновлен');
        
        // Если пришел новый JWT, обновляем его
        if (refreshResponse.data.jwt) {
          localStorage.setItem('accessToken', refreshResponse.data.jwt);
          console.log('✅ JWT тоже обновлен');
        }
      } catch (refreshError) {
        console.warn('⚠️ Не удалось обновить refresh_token:', refreshError);
        // Не фатально, продолжаем с тем что есть
      }

      // Получаем данные пользователя из ответа
      const userFromServer = data.user || data.data?.user || data.result?.user || {};

      const name = userFromServer.name || 
                   `${userData.first_name || ''} ${userData.last_name || ''}`.trim() ||
                   userData.username || 
                   `User${userData.id}`;
      
      const email = userFromServer.email || 
                    (userData.username ? `${userData.username}@telegram.com` : `tg${userData.id}@telegram.com`);
      
      const avatar = userFromServer.avatar || 
                     userData.photo_url || 
                     `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.first_name || 'User')}&background=random&color=fff&size=128&bold=true`;

      const userRole = userFromServer.role === 'admin' ? 'admin' : 'user';

      const user = {
        id: userData.id,
        name,
        email,
        avatar,
        username: userFromServer.username || userData.username || `user${userData.id}`,
        displayName: userFromServer.displayName || name,
        role: userRole as 'user' | 'admin',
        token: localStorage.getItem('accessToken') || token,
      };

      await login(user);
      showSuccess('Успешный вход', 'Вы вошли через Telegram');
    } catch (error: any) {
      console.error('Telegram auth error:', error);
      
      let errorMessage = 'Ошибка авторизации через Telegram';
      const statusCode = error.response?.status;
      const errorText = error.response?.data?.message?.toLowerCase() || error.message?.toLowerCase() || '';
      
      if (statusCode === 401 || errorText.includes('unauthorized') || errorText.includes('invalid hash')) {
        errorMessage = 'Недействительные данные Telegram. Попробуйте еще раз';
      } else if (statusCode === 409 || errorText.includes('already exists')) {
        errorMessage = 'Аккаунт Telegram уже привязан к другому пользователю';
      } else if (statusCode === 500 || errorText.includes('internal server')) {
        errorMessage = 'Ошибка на сервере. Попробуйте позже';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      showError('Ошибка авторизации', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [login, showError, showSuccess]);

  // Слушаем события от Telegram
  useEffect(() => {
    const handleTelegramMessage = (event: MessageEvent) => {
      const allowedOrigins = ['https://oauth.telegram.org', 'https://telegram.org', 'https://web.telegram.org'];
      if (!allowedOrigins.includes(event.origin) && event.origin !== window.location.origin) return;

      if (event.data?.event === 'auth_result') {
        handleTelegramAuth(event.data.result);
        return;
      }

      let userData;
      if (typeof event.data === 'string') {
        try { userData = JSON.parse(event.data); } catch { return; }
      } else if (event.data && typeof event.data === 'object') {
        userData = event.data;
      } else {
        return;
      }

      if (userData?.id && userData?.hash) {
        handleTelegramAuth(userData);
      }
    };

    (window as any).onTelegramAuth = handleTelegramAuth;
    window.addEventListener('message', handleTelegramMessage);

    return () => {
      window.removeEventListener('message', handleTelegramMessage);
      delete (window as any).onTelegramAuth;
    };
  }, [handleTelegramAuth]);

  const handleFormToggle = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsLogin(!isLogin);
    
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = window.setTimeout(() => setIsAnimating(false), isMobile ? 300 : 600);
  }, [isAnimating, isLogin, isMobile]);

  if (isAuthenticated) return null;

  return (
    <div className={`auth-container ${isMobile ? 'auth-mobile-view' : ''}`}>
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="auth-section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span>Вход</span>
                  <span>Регистрация</span>
                </h6>
                <input
                  ref={checkboxRef}
                  className={`checkbox ${isAnimating ? 'animate-on-load' : ''} ${isMobile ? 'mobile-checkbox' : ''}`}
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                  checked={!isLogin}
                  onChange={handleFormToggle}
                />
                <label htmlFor="reg-log"></label>
                <div className={`card-3d-wrap mx-auto ${isMobile ? 'mobile-card-3d' : ''}`}>
                  <div className={`card-3d-wrapper ${isMobile ? 'mobile-card-wrapper' : ''}`}>
                    <LoginForm
                      formData={formData}
                      onInputChange={handleInputChange}
                      onSubmit={handleLoginSubmit}
                      isSubmitting={isSubmitting}
                      showTelegram={isLogin}
                    />
                    <SignupForm
                      formData={formData}
                      onInputChange={handleInputChange}
                      onSubmit={handleSignupSubmit}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;