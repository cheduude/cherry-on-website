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
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);
  const [shouldShowRegister, setShouldShowRegister] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const checkboxRef = useRef<HTMLInputElement>(null);
  const animationTimeoutRef = useRef<number | null>(null);
  const initTimerRef = useRef<number | null>(null);

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
          
          // Завершаем анимацию
          animationTimeoutRef.current = window.setTimeout(() => {
            setIsAnimating(false);
          }, 800); // Длительность анимации
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
  }, [formParam, shouldShowRegister, navigate]);

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

  // Функция для обработки входа через Telegram
  const handleTelegramLogin = async () => {
    setIsTelegramLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const telegramUser = {
        id: '123456789',
        username: 'telegram_user',
        first_name: 'Telegram',
        last_name: 'User',
        photo_url: 'https://ui-avatars.com/api/?name=Telegram+User&background=random&color=fff&size=32&bold=true',
        auth_date: Date.now(),
        hash: 'test_hash'
      };
      
      login({
        avatar: telegramUser.photo_url,
        email: `${telegramUser.username}@telegram.com`,
        name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()
      });
      
      showSuccess('Успешный вход', 'Вы вошли через Telegram');
      navigate('/');
      
    } catch (error) {
      showError('Ошибка Telegram входа', 'Не удалось войти через Telegram. Попробуйте еще раз.');
      console.error('Telegram login error:', error);
    } finally {
      setIsTelegramLoading(false);
    }
  };

  // Обработчик переключения форм
  const handleFormToggle = () => {
    if (isAnimating) return; // Не позволяем переключать во время анимации
    
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
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
                  className={`checkbox ${isAnimating ? 'animate-on-load' : ''}`} 
                  type="checkbox" 
                  id="reg-log" 
                  name="reg-log"
                  checked={!isLogin}
                  onChange={handleFormToggle}
                />
                <label htmlFor="reg-log"></label>
                
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <LoginForm 
                      formData={formData}
                      onInputChange={handleInputChange}
                      onSubmit={handleLoginSubmit}
                      onTelegramLogin={handleTelegramLogin}
                      isSubmitting={isSubmitting}
                      isTelegramLoading={isTelegramLoading}
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