import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Добавлен useNavigate
import { useAuth } from '../../../hooks/useAuth';
import { useNotifications } from '../../../contexts/NotificationContext';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../../../constants/validation';
import LoginForm from './Log';
import SignupForm from './Reg';


const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode !== 'register');
  const { login, signup } = useAuth();
  const { showError, showSuccess } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate(); // Добавлен хук для навигации

  useEffect(() => {
    setIsLogin(mode !== 'register');
  }, [mode]);

  useEffect(() => {
    return () => {
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

  // Функция валидации пароля с использованием VALIDATION_RULES
  const validatePassword = useCallback((password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!password.trim()) {
      errors.push(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
    } else {
      // Проверка длины
      if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
        errors.push(VALIDATION_MESSAGES.PASSWORD_TOO_SHORT);
      }
      
      if (password.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH) {
        errors.push(VALIDATION_MESSAGES.PASSWORD_TOO_LONG);
      }
      
      // Проверка по регулярному выражению
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

    // Email валидация
    if (!formData.loginEmail.trim()) {
      errors.push(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    } else if (!VALIDATION_RULES.EMAIL_REGEX.test(formData.loginEmail)) {
      errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);
    }

    // Пароль валидация
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

    // Имя валидация
    if (!formData.signupName.trim()) {
      errors.push(VALIDATION_MESSAGES.NAME_REQUIRED);
    } else if (formData.signupName.length < VALIDATION_RULES.MIN_USERNAME_LENGTH) {
      errors.push(VALIDATION_MESSAGES.NAME_TOO_SHORT);
    } else if (formData.signupName.length > VALIDATION_RULES.MAX_USERNAME_LENGTH) {
      errors.push(VALIDATION_MESSAGES.NAME_TOO_LONG);
    }

    // Email валидация
    if (!formData.signupEmail.trim()) {
      errors.push(VALIDATION_MESSAGES.EMAIL_REQUIRED);
    } else if (!VALIDATION_RULES.EMAIL_REGEX.test(formData.signupEmail)) {
      errors.push(VALIDATION_MESSAGES.EMAIL_INVALID);
    }

    // Пароль валидация
    const passwordValidation = validatePassword(formData.signupPassword);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    // Подтверждение пароля
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
      
      // ДОБАВЛЕНО: Редирект на главную страницу
      navigate('/'); // или navigate('/dashboard') если нужен другой путь
      
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
      
      // ДОБАВЛЕНО: Редирект на главную страницу и после регистрации
      navigate('/');
      
    } catch (error) {
      showError('Ошибка регистрации', 'Пользователь с таким email уже существует');
    } finally {
      setIsSubmitting(false);
    }
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
                  className="checkbox" 
                  type="checkbox" 
                  id="reg-log" 
                  name="reg-log"
                  checked={!isLogin}
                  onChange={() => setIsLogin(!isLogin)}
                />
                <label htmlFor="reg-log"></label>
                
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
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