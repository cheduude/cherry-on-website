// ================================================
// 2. src/components/Auth/Log.tsx
// ================================================
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
  showTelegram: boolean;   // ← Новый пропс
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
  showTelegram
}) => {
  const [tgUser, setTgUser] = useState<any>(null);
  const telegramButtonRef = useRef<HTMLDivElement>(null);

  // Загружаем пользователя из localStorage
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
      {/* Реальный widget — показываем ТОЛЬКО когда мы на стороне логина */}
      {showTelegram && (
        <TelegramWidgetPortal
          buttonRef={telegramButtonRef}
          isVisible={!tgUser}
        />
      )}

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

            {/* TELEGRAM WIDGET — показываем ТОЛЬКО когда мы на стороне логина */}
{showTelegram && (
  <div className="telegram-auth-container">
    {!tgUser ? (
      <>
        {/* Пустой контейнер для позиционирования реального виджета */}
        <div
          ref={telegramButtonRef}
          className="telegram-widget-placeholder"
          style={{
            width: '100%',
            maxWidth: '280px',
            height: '72px',
            margin: '0 auto',
            position: 'relative',
            backgroundColor: 'transparent',
          }}
        />
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
)}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;