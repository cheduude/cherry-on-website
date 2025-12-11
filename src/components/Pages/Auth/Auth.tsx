import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import LoginForm from './Log';
import SignupForm from './Reg';
import './Auth.css';

// Интерфейс для ошибок валидации
interface ValidationErrors {
  [key: string]: string;
}

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(mode !== 'register');
  const { login, signup } = useAuth();
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setIsLogin(mode !== 'register');
    setErrors({});
    setSubmitError(null);
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

  // Базовая функция валидации
  const validateForm = (formType: 'login' | 'signup'): boolean => {
    const newErrors: ValidationErrors = {};

    if (formType === 'login') {
      if (!formData.loginEmail.trim()) {
        newErrors.loginEmail = 'Email обязателен';
      } else if (!/\S+@\S+\.\S+/.test(formData.loginEmail)) {
        newErrors.loginEmail = 'Введите корректный email';
      }

      if (!formData.loginPassword.trim()) {
        newErrors.loginPassword = 'Пароль обязателен';
      } else if (formData.loginPassword.length < 6) {
        newErrors.loginPassword = 'Пароль должен содержать минимум 6 символов';
      }
    }

    if (formType === 'signup') {
      if (!formData.signupName.trim()) {
        newErrors.signupName = 'Имя обязательно';
      } else if (formData.signupName.length < 2) {
        newErrors.signupName = 'Имя должно содержать минимум 2 символа';
      }

      if (!formData.signupEmail.trim()) {
        newErrors.signupEmail = 'Email обязателен';
      } else if (!/\S+@\S+\.\S+/.test(formData.signupEmail)) {
        newErrors.signupEmail = 'Введите корректный email';
      }

      if (!formData.signupPassword.trim()) {
        newErrors.signupPassword = 'Пароль обязателен';
      } else if (formData.signupPassword.length < 6) {
        newErrors.signupPassword = 'Пароль должен содержать минимум 6 символов';
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Подтвердите пароль';
      } else if (formData.signupPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Убираем ошибку при вводе
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (submitError) setSubmitError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm('login')) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Login data:', {
        email: formData.loginEmail,
        password: formData.loginPassword
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      login({
        avatar: 'https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg',
        email: formData.loginEmail,
        name: formData.loginEmail.split('@')[0]
      });
      
    } catch (error) {
      setSubmitError('Ошибка входа. Проверьте email и пароль.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm('signup')) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Signup data:', {
        name: formData.signupName,
        email: formData.signupEmail,
        password: formData.signupPassword
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      signup({
        avatar: 'https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg',
        email: formData.signupEmail,
        name: formData.signupName
      });
      
    } catch (error) {
      setSubmitError('Ошибка регистрации. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <a href="https://front.codes/" className="logo" target="_blank" rel="noopener noreferrer">
        <img src="https://assets.codepen.io/1462889/fcy.png" alt="Front Codes" />
      </a>

      {submitError && (
        <div className="auth-error-message">
          {submitError}
        </div>
      )}

      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="auth-section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span>Log In</span>
                  <span>Sign Up</span>
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
                      errors={errors}
                      isSubmitting={isSubmitting}
                    />
                    <SignupForm 
                      formData={formData}
                      onInputChange={handleInputChange}
                      onSubmit={handleSignupSubmit}
                      errors={errors}
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