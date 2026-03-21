// ================================================
// src/components/Auth/TelegramWidgetPortal.tsx
// ================================================
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const BOT_USERNAME = 'fsafss_bot';

interface TelegramWidgetPortalProps {
  buttonRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
}

export default function TelegramWidgetPortal({
  buttonRef,
  isVisible
}: TelegramWidgetPortalProps) {

  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });

  const [isFirefox, setIsFirefox] = useState(false);
  const scriptLoadedRef = useRef(false);

  // ============================================
  // Определяем Firefox
  // ============================================
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsFirefox(ua.includes('firefox'));
  }, []);

  // ============================================
  // Telegram callback
  // ============================================
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

  // ============================================
  // Позиционирование (viewport-координаты)
  // ============================================
  useEffect(() => {
    if (!isVisible || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    };

    updatePosition();

    // ResizeObserver — самый стабильный способ
    const resizeObserver = new ResizeObserver(() => {
      updatePosition();
    });

    resizeObserver.observe(buttonRef.current);

    // Scroll / resize fallback
    const handleScrollOrResize = () => {
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
    };

  }, [isVisible, buttonRef]);

  // ============================================
  // Вставка Telegram script
  // ============================================
  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    containerRef.current.innerHTML = '';
    scriptLoadedRef.current = false;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');

    script.onload = () => {
      scriptLoadedRef.current = true;
    };

    script.onerror = () => {
      console.error('Failed to load Telegram widget');
    };

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isVisible]);

  const root = document.getElementById('tg-root');
  if (!root || !isVisible) return null;

  // ============================================
  // FIXED портал (важно!)
  // ============================================
  const portalStyle: React.CSSProperties = {
    position: 'fixed',
    top: position.top,
    left: position.left,
    width: position.width,
    height: position.height,
    zIndex: 999999,
    pointerEvents: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  if (isFirefox) {
    portalStyle.transform = 'none';
    portalStyle.willChange = 'auto';
    portalStyle.isolation = 'isolate';
  }

  return createPortal(
    <div
      className={`tg-real-widget ${isFirefox ? 'tg-firefox-fix' : ''}`}
      style={portalStyle}
      data-testid="telegram-widget-portal"
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </div>,
    root
  );
}