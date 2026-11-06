// ================================================
// src/components/Auth/TelegramWidgetPortal.tsx
// ================================================
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const BOT_USERNAME = 'main_cherryon_bot';

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

  // ============================================
  // Определяем Firefox
  // ============================================
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsFirefox(ua.includes('firefox'));
  }, []);

  // ============================================
  // Позиционирование (viewport-координаты)
  // ============================================
  useEffect(() => {
    if (!isVisible || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      setPosition((current) => {
        if (
          current.top === rect.top &&
          current.left === rect.left &&
          current.width === rect.width &&
          current.height === rect.height
        ) {
          return current;
        }

        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        };
      });
    };

    updatePosition();

    // Track the placeholder while the password reset panel animates its height.
    const trackingStartedAt = window.performance.now();
    let trackingFrame = 0;
    const trackAnimatedPosition = () => {
      updatePosition();
      if (window.performance.now() - trackingStartedAt < 500) {
        trackingFrame = window.requestAnimationFrame(trackAnimatedPosition);
      }
    };
    trackingFrame = window.requestAnimationFrame(trackAnimatedPosition);

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
      window.cancelAnimationFrame(trackingFrame);
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

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');

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
