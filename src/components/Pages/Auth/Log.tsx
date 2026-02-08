import React, { useEffect, useRef, useState } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const popupCheckIntervalRef = useRef<number | null>(null);

  // ============================
  // ВНИМАНИЕ: ВАШИ ДАННЫЕ БОТА
  // ============================
  // ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА РЕАЛЬНЫЕ
  const BOT_ID = '8371332264'; // ⚠️ ВАШ ID БОТА (получите у @BotFather)
  const BOT_USERNAME = 'fsafss_bot'; // ⚠️ ВАШ USERNAME БОТА (например: @mybot_bot)
  const AUTH_CALLBACK_URL = `${window.location.origin}/api/auth/telegram/callback`; // ⚠️ URL вашего callback
  // ============================

  // Проверяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);
    };
    
    checkMobile();
  }, []);

  // Telegram Widget для мобильных
  useEffect(() => {
    if (isMobile && widgetRef.current) {
      // Удаляем старые элементы
      while (widgetRef.current.firstChild) {
        widgetRef.current.removeChild(widgetRef.current.firstChild);
      }

      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.async = true;
      
      // ⚠️ УКАЖИТЕ USERNAME ВАШЕГО БОТА
      script.setAttribute('data-telegram-login', BOT_USERNAME);
      
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '12');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      
      // ⚠️ УКАЖИТЕ URL ДЛЯ CALLBACK
      script.setAttribute('data-auth-url', AUTH_CALLBACK_URL);
      
      widgetRef.current.appendChild(script);
    }

    return () => {
      if (widgetRef.current) {
        while (widgetRef.current.firstChild) {
          widgetRef.current.removeChild(widgetRef.current.firstChild);
        }
      }
    };
  }, [isMobile, BOT_USERNAME, AUTH_CALLBACK_URL]);

  // Обработчик для десктопной авторизации через Telegram OAuth
  const handleTelegramClick = () => {
    // Закрываем предыдущий popup если есть
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }

    // Очищаем предыдущий интервал
    if (popupCheckIntervalRef.current) {
      clearInterval(popupCheckIntervalRef.current);
    }

    const origin = encodeURIComponent(window.location.origin);
    
    const width = 550;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    // Параметры для Telegram OAuth
    const params = new URLSearchParams({
      bot_id: BOT_ID, // ⚠️ ID вашего бота
      origin: origin,
      embed: '0',
      request_access: 'write',
      // ⚠️ URL для возврата после авторизации
      return_to: `${window.location.origin}/auth/telegram-callback.html`
    });
    
    const url = `https://oauth.telegram.org/auth?${params.toString()}`;
    
    // Открываем popup с Telegram OAuth
    const popup = window.open(
      url, 
      'telegram_oauth', 
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
    );
    
    if (!popup) {
      alert('Пожалуйста, разрешите всплывающие окна для этого сайта');
      return;
    }
    
    popupRef.current = popup;
    console.log('Telegram OAuth popup opened');
    
    // Проверяем закрытие popup каждые 500ms
    popupCheckIntervalRef.current = window.setInterval(() => {
      if (popup.closed) {
        console.log('Popup closed by user or automatically');
        if (popupCheckIntervalRef.current) {
          clearInterval(popupCheckIntervalRef.current);
        }
      }
    }, 500);
    
    // Автоматически закрываем через 3 минуты для безопасности
    setTimeout(() => {
      if (popup && !popup.closed) {
        console.log('Auto-closing popup after 3 minutes');
        popup.close();
      }
      if (popupCheckIntervalRef.current) {
        clearInterval(popupCheckIntervalRef.current);
      }
    }, 180000);
  };

  // Слушаем сообщения от popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('📨 Message received from:', event.origin, event.data);
      
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
      
      // Telegram OAuth возвращает данные авторизации
      if (event.data && event.data.event === 'auth_result') {
        console.log('✅ Telegram OAuth success:', event.data.result);
        
        // Закрываем popup
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
          console.log('Popup closed after successful auth');
        }
        
        // Очищаем интервал проверки
        if (popupCheckIntervalRef.current) {
          clearInterval(popupCheckIntervalRef.current);
        }
        
        // Вызываем глобальную функцию обработки авторизации
        if (window.onTelegramAuth) {
          window.onTelegramAuth(event.data.result);
        }
      }
      
      // Обработка ошибок от OAuth
      if (event.data && event.data.event === 'auth_error') {
        console.error('❌ Telegram OAuth error:', event.data.error);
        alert('Ошибка авторизации через Telegram: ' + event.data.error);
        
        // Закрываем popup
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
        }
        
        // Очищаем интервал проверки
        if (popupCheckIntervalRef.current) {
          clearInterval(popupCheckIntervalRef.current);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      
      // Очищаем интервал при размонтировании
      if (popupCheckIntervalRef.current) {
        clearInterval(popupCheckIntervalRef.current);
      }
      
      // Закрываем popup при размонтировании
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
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
          
          {/* Telegram Auth */}
          <div className="telegram-auth-container">
            {isMobile ? (
              // Для мобильных - оригинальный виджет
              <div 
                ref={widgetRef} 
                style={{ 
                  minHeight: '44px',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '15px'
                }}
              ></div>
            ) : (
              // Для десктопа - кнопка с OAuth popup
              <button
                onClick={handleTelegramClick}
                className="btn-telegram"
                disabled={isSubmitting}
                style={{
                  marginTop: '15px',
                  cursor: 'pointer',
                  zIndex: 1000,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span className="telegram-icon">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    width="18" 
                    height="18" 
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.57-1.38-.93-2.23-1.5-.98-.65-.34-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.24-.02-.1.02-1.79 1.15-5.06 3.38-.48.33-.91.49-1.3.48-.43-.01-1.27-.25-1.89-.46-.76-.26-1.36-.4-1.31-.84.03-.23.33-.47.91-.72 3.57-1.55 5.96-2.58 7.16-3.11 3.33-1.44 4.02-1.69 4.47-1.7.1 0 .32.02.46.14.11.1.14.23.16.33.01.1 0 .31-.01.43z"/>
                  </svg>
                </span>
                Войти через Telegram
              </button>
            )}
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

// Добавляем типизацию для глобальной функции
declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

export default LoginForm;