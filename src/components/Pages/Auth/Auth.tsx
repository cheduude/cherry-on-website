import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../contexts/NotificationContext';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../../../constants/validation';
import LoginForm from './Log';
import SignupForm from './Reg';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const formParam = searchParams.get('form');
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuth();
  const { showError, showSuccess } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldShowRegister, setShouldShowRegister] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const checkboxRef = useRef<HTMLInputElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const initTimerRef = useRef<number | null>(null);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 767;
      setIsMobile(isMobileDevice);
      
      // Добавляем класс для CSS оптимизации
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
  // Включаем аппаратное ускорение для всех карточек на мобильных
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

  // Автоматически показываем регистрацию при наличии параметра form=register
  useEffect(() => {
    const isRegisterMode = formParam === 'register';
   
    if (isRegisterMode && !shouldShowRegister) {
      // Сначала устанавливаем состояние
      setShouldShowRegister(true);
      setIsLogin(false);
     
      // Добавляем небольшую задержку для инициализации компонента
      initTimerRef.current = window.setTimeout(() => {
        if (checkboxRef.current) {
          // Запускаем анимацию переворота
          setIsAnimating(true);
          checkboxRef.current.checked = true;
         
          // Очищаем параметр из URL чтобы при перезагрузке не срабатывало снова
          navigate('/auth', { replace: true });
         
          // Завершаем анимацию - на мобильных короче
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
      if (initTimerRef.current) {
        clearTimeout(initTimerRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [formParam, shouldShowRegister, navigate, isMobile]);

  // Очистка таймеров
  useEffect(() => {
    return () => {
      if (initTimerRef.current) {
        clearTimeout(initTimerRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Функция валидации пароля
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
   
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validateLoginForm = (): boolean => {
    const errors: string[] = [];
    if (!formData.loginEmail.trim()) {
      errors.push(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    } else if (!VALIDATION_RULES.EMAIL_REGEX.test(formData.loginEmail)) {
      errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);
    }
    const passwordValidation = validatePassword(formData.loginPassword);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
    if (errors.length > 0) {
      showError('Ошибка входа', errors.join('. '));
      return false;
    }
    return true;
  };

  const validateSignupForm = (): boolean => {
    const errors: string[] = [];
    if (!formData.signupName.trim()) {
      errors.push(VALIDATION_MESSAGES.NAME_REQUIRED);
    } else if (formData.signupName.length < VALIDATION_RULES.MIN_USERNAME_LENGTH) {
      errors.push(VALIDATION_MESSAGES.NAME_TOO_SHORT);
    } else if (formData.signupName.length > VALIDATION_RULES.MAX_USERNAME_LENGTH) {
      errors.push(VALIDATION_MESSAGES.NAME_TOO_LONG);
    }
    if (!formData.signupEmail.trim()) {
      errors.push(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    } else if (!VALIDATION_RULES.EMAIL_REGEX.test(formData.signupEmail)) {
      errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);
    }
    const passwordValidation = validatePassword(formData.signupPassword);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!validateLoginForm()) return;
   
    setIsSubmitting(true);
   
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      login({
        avatar: 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32&bold=true',
        email: formData.loginEmail,
        name: formData.loginEmail.split('@')[0]
      });
     
      showSuccess('Успешный вход', 'Вы успешно вошли в систему');
      navigate('/');
     
    } catch (error) {
      showError('Ошибка входа', 'Неверный email или пароль');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!validateSignupForm()) return;
   
    setIsSubmitting(true);
   
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
     
      signup({
        avatar: 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=32&bold=true',
        email: formData.signupEmail,
        name: formData.signupName
      });
     
      showSuccess('Успешная регистрация', 'Вы успешно зарегистрировались');
      navigate('/');
     
    } catch (error) {
      showError('Ошибка регистрации', 'Пользователь с таким email уже существует');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция обработки данных Telegram
  const handleTelegramAuth = useCallback(async (userData: any) => {
    console.log('📱 Processing Telegram auth:', userData);
   
    if (!userData || !userData.id) {
      showError('Ошибка авторизации', 'Не получены данные от Telegram');
      return;
    }
    setIsSubmitting(true);
    try {
      // Создаем объект пользователя
      const name = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() ||
                  userData.username ||
                  `User${userData.id}`;
     
      const email = userData.username ?
                  `${userData.username}@telegram.com` :
                  `id${userData.id}@telegram.com`;
     
      const avatar = userData.photo_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128&bold=true`;
     
      const userForLogin = {
        id: userData.id.toString(),
        name,
        email,
        avatar,
        username: userData.username || `user${userData.id}`,
        displayName: name,
        role: 'user',
        auth_date: userData.auth_date,
        hash: userData.hash
      };
     
      console.log('🔐 Logging in user:', userForLogin);
     
      // Вызываем login из useAuth
      await login(userForLogin);
     
      // Ждем сохранения
      await new Promise(resolve => setTimeout(resolve, 300));
     
      console.log('✅ Auth completed. Checking localStorage:');
      console.log('   Token:', localStorage.getItem('token') ? '✅ exists' : '❌ missing');
      console.log('   User:', localStorage.getItem('user') ? '✅ exists' : '❌ missing');
     
      if (localStorage.getItem('user')) {
        console.log('   User data:', JSON.parse(localStorage.getItem('user')!));
      }
     
      showSuccess('Успешный вход', 'Вы вошли через Telegram');
     
      // Переходим на главную с задержкой
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 800);
     
    } catch (error) {
      console.error('❌ Telegram auth error:', error);
      showError('Ошибка авторизации', 'Попробуйте еще раз');
    } finally {
      setIsSubmitting(false);
    }
  }, [login, navigate, showError, showSuccess]);

  

  // Обработчик сообщений от Telegram OAuth popup и widget
  useEffect(() => {
    const handleTelegramMessage = (event: MessageEvent) => {
      console.log('📨 Message from:', event.origin);
     
      // Проверяем origin для безопасности
      const allowedOrigins = [
        'https://oauth.telegram.org',
        'https://telegram.org',
        'https://web.telegram.org',
        window.location.origin
      ];
     
      if (!allowedOrigins.includes(event.origin)) {
        console.log('Ignored message from unknown origin:', event.origin);
        return;
      }
     
      // Обрабатываем данные от Telegram OAuth (десктоп)
      if (event.data && event.data.event === 'auth_result') {
        console.log('Telegram OAuth success:', event.data.result);
        handleTelegramAuth(event.data.result);
        return;
      }
     
      // Обрабатываем данные от Telegram Widget (мобильные)
      let userData;
      if (typeof event.data === 'string') {
        try {
          userData = JSON.parse(event.data);
        } catch (e) {
          console.log('Not JSON data:', event.data);
          return;
        }
      } else if (event.data && typeof event.data === 'object') {
        userData = event.data;
      } else {
        return;
      }
     
      // Проверяем, что это данные авторизации Telegram
      if (!userData.id || !userData.hash) {
        console.log('Not Telegram auth data:', userData);
        return;
      }
     
      console.log('Processing Telegram widget auth:', userData.id);
      handleTelegramAuth(userData);
    };
   
    // Глобальная функция для Telegram Widget (мобильные)
    (window as any).onTelegramAuth = (user: any) => {
      console.log('onTelegramAuth called (widget):', user);
      handleTelegramAuth(user);
    };
   
    // Добавляем обработчик сообщений
    window.addEventListener('message', handleTelegramMessage);
   
    // Очистка
    return () => {
      window.removeEventListener('message', handleTelegramMessage);
      delete (window as any).onTelegramAuth;
    };
  }, [handleTelegramAuth]);

  // Обработчик переключения форм
  const handleFormToggle = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsLogin(!isLogin);
    
    // На мобильных делаем анимацию короче
    const animationDuration = isMobile ? 300 : 600;
    
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    animationTimeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);
  }, [isAnimating, isLogin, isMobile]);

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