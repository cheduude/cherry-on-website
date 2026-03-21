// ================================================
// src/components/Auth/Auth.tsx
// ================================================
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../contexts/NotificationContext';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../../../constants/validation';
import LoginForm from './Log';
import SignupForm from './Reg';

const API_BASE = 'https://aut.cherryon.art';

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
  const [shouldShowRegister, setShouldShowRegister] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const checkboxRef = useRef<HTMLInputElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const initTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Если пользователь уже авторизован - редиректим на главную
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User already authenticated in Auth, redirecting');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 767;
      setIsMobile(isMobileDevice);
      
      if (isMobileDevice) {
        document.body.classList.add('auth-mobile');
      } else {
        document.body.classList.remove('auth-mobile');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('auth-mobile');
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      const style = document.createElement('style');
      style.textContent = `
        .card-front, .card-back {
          -webkit-transform: translateZ(0);
          -moz-transform: translateZ(0);
          -ms-transform: translateZ(0);
          -o-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-perspective: 1000;
          perspective: 1000;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isMobile]);

  // Автоматически показываем регистрацию
  useEffect(() => {
    const isRegisterMode = formParam === 'register';
    
    if (isRegisterMode && !shouldShowRegister) {
      setShouldShowRegister(true);
      setIsLogin(false);
      
      initTimerRef.current = window.setTimeout(() => {
        if (checkboxRef.current) {
          setIsAnimating(true);
          checkboxRef.current.checked = true;
          navigate('/auth', { replace: true });
          
          const animationDuration = isMobile ? 400 : 800;
          animationTimeoutRef.current = window.setTimeout(() => {
            setIsAnimating(false);
          }, animationDuration);
        }
      }, 100);
    } else if (!isRegisterMode) {
      setShouldShowRegister(false);
      setIsLogin(true);
    }
    
    return () => {
      if (initTimerRef.current) clearTimeout(initTimerRef.current);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, [formParam, shouldShowRegister, navigate, isMobile]);

  // Очистка
  useEffect(() => {
    return () => {
      if (initTimerRef.current) clearTimeout(initTimerRef.current);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      document.body.classList.remove('auth-page-isolated');
    };
  }, []);

  const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    signupName: '',
    signupEmail: '',
    signupPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = useCallback((password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!password.trim()) {
      errors.push(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
    } else {
      if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
        errors.push(VALIDATION_MESSAGES.PASSWORD_TOO_SHORT);
      }
      if (password.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH) {
        errors.push(VALIDATION_MESSAGES.PASSWORD_TOO_LONG);
      }
      if (!VALIDATION_RULES.PASSWORD_REGEX.test(password)) {
        errors.push(VALIDATION_MESSAGES.PASSWORD_WEAK);
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }, []);

  const validateLoginForm = (): boolean => {
    const errors: string[] = [];
    if (!formData.loginEmail.trim()) errors.push(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    else if (!VALIDATION_RULES.EMAIL_REGEX.test(formData.loginEmail)) errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);

    const passwordValidation = validatePassword(formData.loginPassword);
    if (!passwordValidation.isValid) errors.push(...passwordValidation.errors);

    if (errors.length > 0) {
      showError('Ошибка входа', errors.join('. '));
      return false;
    }
    return true;
  };

  const validateSignupForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.signupEmail.trim()) errors.push(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    else if (!VALIDATION_RULES.EMAIL_REGEX.test(formData.signupEmail)) errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);

    const passwordValidation = validatePassword(formData.signupPassword);
    if (!passwordValidation.isValid) errors.push(...passwordValidation.errors);

    if (!formData.confirmPassword.trim()) errors.push('Подтвердите пароль');
    else if (formData.signupPassword !== formData.confirmPassword) errors.push(VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH);

    if (errors.length > 0) {
      showError('Ошибка регистрации', errors.join('. '));
      return false;
    }
    return true;
  };

  // ==================== РЕАЛЬНЫЙ API ====================
  const apiRequest = async (endpoint: string, body: object) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: abortControllerRef.current.signal,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Сервер вернул некорректный ответ');
    }

    if (!res.ok) {
      throw new Error(data.message || data.error || 'Неизвестная ошибка сервера');
    }
    return data;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsSubmitting(true);
    try {
      const data = await apiRequest('/api/auth/login', {
        login: formData.loginEmail.trim(),
        password: formData.loginPassword.trim()
      });

      const token = data.token || data.accessToken || data.jwt;
      const userFromServer = data.user || data.data?.user || {};

      const userForLogin = {
        id: (userFromServer.id || userFromServer._id || '').toString(),
        name: userFromServer.name || userFromServer.username || formData.loginEmail.split('@')[0],
        email: userFromServer.email || formData.loginEmail,
        avatar: userFromServer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.loginEmail)}&background=random&color=fff&size=32&bold=true`,
        role: userFromServer.role || 'user',
        username: userFromServer.username || formData.loginEmail.split('@')[0],
        token
      };

      await login(userForLogin);
      showSuccess('Успешный вход', 'Вы успешно вошли в систему');
      // Редирект произойдет автоматически через useEffect
    } catch (error: any) {
      showError('Ошибка входа', error.message || 'Неверный email или пароль');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignupForm()) return;

    setIsSubmitting(true);
    try {
      const data = await apiRequest('/api/auth/register', {
        login: formData.signupEmail.trim(),
        password: formData.signupPassword.trim()
      });

      const token = data.token || data.accessToken || data.jwt;
      const userFromServer = data.user || data.data?.user || {};

      const userForSignup = {
        id: (userFromServer.id || userFromServer._id || '').toString(),
        name: userFromServer.name || 'Пользователь',
        email: userFromServer.email || formData.signupEmail,
        avatar: userFromServer.avatar || `https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32&bold=true`,
        role: userFromServer.role || 'user',
        username: userFromServer.username || formData.signupEmail.split('@')[0],
        token
      };

      await signup(userForSignup);
      showSuccess('Успешная регистрация', 'Вы успешно зарегистрировались');
      // Редирект произойдет автоматически через useEffect
    } catch (error: any) {
      showError('Ошибка регистрации', error.message || 'Пользователь с таким email уже существует');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Исправленный обработчик Telegram авторизации
const handleTelegramAuth = useCallback(async (userData: TelegramUserData) => {
  console.log('📱 Processing Telegram auth:', userData);
  
  if (!userData || !userData.id) {
    showError('Ошибка авторизации', 'Не получены данные от Telegram');
    return;
  }
  
  setIsSubmitting(true);
  
  try {
    // Формируем данные пользователя так же, как в старом коде
    const name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() ||
                userData.username || `User${userData.id}`;
    const email = userData.username ? `${userData.username}@telegram.com` : `id${userData.id}@telegram.com`;
    const avatar = userData.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;

    const userForLogin = {
      id: userData.id.toString(),
      name,
      email,
      avatar,
      username: userData.username || `user${userData.id}`,
      displayName: name,
      role: 'user',
      auth_date: userData.auth_date,
      hash: userData.hash,
      token: 'telegram-auth-token' // Временный токен, если бэкенд не возвращает свой
    };

    // Сохраняем пользователя через хук useAuth
    await login(userForLogin);
    
    showSuccess('Успешный вход', 'Вы вошли через Telegram');
    
  } catch (error: any) {
    console.error('❌ Telegram auth error:', error);
    showError('Ошибка авторизации', error.message || 'Попробуйте еще раз');
  } finally {
    setIsSubmitting(false);
  }
}, [login, showError, showSuccess]);

  // Слушаем события от Telegram
  useEffect(() => {
    const handleTelegramMessage = (event: MessageEvent) => {
      console.log('📨 Message from:', event.origin);
      const allowedOrigins = [
        'https://oauth.telegram.org', 
        'https://telegram.org', 
        'https://web.telegram.org', 
        window.location.origin
      ];
      
      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data && event.data.event === 'auth_result') {
        handleTelegramAuth(event.data.result);
        return;
      }

      let userData;
      if (typeof event.data === 'string') {
        try { 
          userData = JSON.parse(event.data); 
        } catch { 
          return; 
        }
      } else if (event.data && typeof event.data === 'object') {
        userData = event.data;
      } else {
        return;
      }

      if (!userData.id || !userData.hash) return;
      handleTelegramAuth(userData);
    };

    // Глобальный callback для Telegram виджета
    (window as any).onTelegramAuth = (user: any) => handleTelegramAuth(user);
    
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
    const animationDuration = isMobile ? 300 : 600;
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = window.setTimeout(() => setIsAnimating(false), animationDuration);
  }, [isAnimating, isLogin, isMobile]);

  // Если авторизован - не показываем форму
  if (isAuthenticated) {
    return null;
  }

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