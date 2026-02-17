import React, { useEffect, useState, useRef } from 'react';
import TelegramWidgetPortal from './TelegramWidgetPortal';

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
  const [tgUser, setTgUser] = useState<any>(null);
  const telegramButtonRef = useRef<HTMLDivElement>(null);

  // Загружаем пользователя из localStorage (если уже входил)
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.auth_date) setTgUser(user);
    }
  }, []);

  // Слушаем успешную авторизацию Telegram
  useEffect(() => {
    const handler = (e: any) => {
      const user = e.detail;
      setTgUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    };

    window.addEventListener('telegram-auth', handler);
    return () => window.removeEventListener('telegram-auth', handler);
  }, []);

  return (
    <>
      {/* Реальный widget с привязкой к позиции фейковой кнопки */}
      <TelegramWidgetPortal 
        buttonRef={telegramButtonRef} 
        isVisible={!tgUser}
      />

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
                  placeholder="Пароль"
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

            {/* ===== TELEGRAM BUTTON ===== */}

            <div className="telegram-auth-container">
              {!tgUser ? (
                <>
                  {/* Фейковая кнопка для позиционирования */}
                  <div 
                    ref={telegramButtonRef}
                    className="tg-fake-button"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M9.036 15.803l-.379 5.342c.542 0 .777-.233 1.059-.513l2.543-2.43 5.274 3.861c.967.533 1.651.253 1.912-.895l3.467-16.24c.31-1.449-.523-2.016-1.463-1.67L1.24 9.307C-.166 9.847-.145 10.64.998 10.99l5.66 1.767 13.145-8.287c.618-.386 1.18-.173.717.213"/>
                    </svg>
                    Войти через Telegram
                  </div>
                  <p className="telegram-text">
                    Быстрый вход через Telegram
                  </p>
                  <p className="mb-0 mt-4 text-center">
            <a href="#0" className="link">Забыли пароль?</a>
          </p>
                </>
              ) : (
                <div className="tg-user-button">
                  <img
                    src={
                      tgUser.photo_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        tgUser.first_name || 'User'
                      )}`
                    }
                    alt=""
                  />
                  <span>{tgUser.first_name} {tgUser.last_name || ''}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;