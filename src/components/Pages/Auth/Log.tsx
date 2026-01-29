import React from 'react';

interface LoginFormProps {
  formData: {
    loginEmail: string;
    loginPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTelegramLogin: () => void; // Новая пропс для Telegram логина
  isSubmitting: boolean;
  isTelegramLoading?: boolean; // Опциональная пропс для состояния загрузки Telegram
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  formData, 
  onInputChange, 
  onSubmit,
  onTelegramLogin,
  isSubmitting,
  isTelegramLoading = false
}) => {
  const handleTelegramClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onTelegramLogin();
  };

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

          {/* Кнопка Telegram */}
          <div className="telegram-auth-container">
            
            
            <button 
              type="button" 
              className="btn-telegram"
              onClick={handleTelegramClick}
              disabled={isTelegramLoading}
            >
              <span className="telegram-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" width="18" height="18">
                  <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"/>
                </svg>
              </span>
              {isTelegramLoading ? 'Подключение...' : 'Telegram'}
            </button>
            
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