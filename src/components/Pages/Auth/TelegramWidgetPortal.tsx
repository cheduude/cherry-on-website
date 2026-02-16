import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const BOT_USERNAME = 'fsafss_bot';

interface TelegramWidgetPortalProps {
  buttonRef: React.RefObject<HTMLDivElement | null>; // Изменено: добавляем null
  isVisible: boolean;
}

export default function TelegramWidgetPortal({ buttonRef, isVisible }: TelegramWidgetPortalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  // Глобальный callback Telegram
  useEffect(() => {
    (window as any).onTelegramAuth = (user: any) => {
      window.dispatchEvent(
        new CustomEvent('telegram-auth', { detail: user })
      );
    };

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, []);

  // Обновляем позицию виджета
  useEffect(() => {
    if (!isVisible || !buttonRef.current) return;

    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });
      }
    };

    // Обновляем позицию
    updatePosition();

    // Обновляем при скролле и ресайзе
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, buttonRef]);

  // Вставка скрипта виджета
  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;

    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');

    containerRef.current.appendChild(script);
  }, [isVisible]);

  const root = document.getElementById('tg-root');
  if (!root || !isVisible) return null;

  return createPortal(
    <div 
      className="tg-real-widget"
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
        zIndex: 999999,
        opacity: 0.01,
      }}
    >
      <div 
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>,
    root
  );
}