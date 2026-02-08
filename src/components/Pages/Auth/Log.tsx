// src/components/Auth/Log.tsx
import React, { useEffect, useRef } from 'react';

interface LoginFormProps {
  formData: {
    loginEmail: string;
    loginPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isSubmitting
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (widgetRef.current) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      script.setAttribute('data-telegram-login', 'fsafss_bot'); 
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '12');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      widgetRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="card-front">
      <div className="center-wrap">
        <div className="section text-center">
          <h4 className="mb-4 pb-3">Войти</h4>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="loginEmail"
                className="form-style"
                placeholder="Ваш email"
                id="logemail"
                autoComplete="off"
                value={formData.loginEmail}
                onChange={onInputChange}
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-at"></i>
            </div>
            <div className="form-group mt-2">
              <input
                type="password"
                name="loginPassword"
                className="form-style"
                placeholder="Введите пароль"
                id="logpass"
                autoComplete="off"
                value={formData.loginPassword}
                onChange={onInputChange}
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-lock-alt"></i>
            </div>
            <button
              type="submit"
              className="btn mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Подождите...' : 'Войти'}
            </button>
          </form>
          {/* Telegram Widget */}
          <div className="telegram-auth-container">
            <div ref={widgetRef} />
            <p className="telegram-text">
              Быстрый и безопасный вход через Telegram
            </p>
          </div>
          <p className="mb-0 mt-4 text-center">
            <a href="#0" className="link">Забыли пароль?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;