import React, { useRef, useState } from 'react';
import TelegramWidgetPortal from './TelegramWidgetPortal';
import { VALIDATION_RULES } from '../../../constants/validation';

interface LoginFormProps {
  formData: { loginEmail: string; loginPassword: string };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  showTelegram: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
  showTelegram,
}) => {
  const telegramButtonRef = useRef<HTMLDivElement>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetPlaceholder, setShowResetPlaceholder] = useState(false);

  const toggleResetForm = () => {
    setIsResetOpen((isOpen) => !isOpen);
    setShowResetPlaceholder(false);
    if (!isResetOpen) setResetEmail(formData.loginEmail);
  };

  const handleResetSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowResetPlaceholder(true);
  };

  return (
    <>
      {showTelegram && !isResetOpen && (
        <TelegramWidgetPortal buttonRef={telegramButtonRef} isVisible />
      )}
      <div className="card-front">
        <div className="center-wrap">
          <div className="section text-center">
            <h4 className="mb-4 pb-3">{'\u0412\u043e\u0439\u0442\u0438'}</h4>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="loginEmail"
                  className="form-style"
                  placeholder={'\u0412\u0430\u0448 email'}
                  value={formData.loginEmail}
                  onChange={onInputChange}
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                />
                <i className="input-icon uil uil-at" aria-hidden="true" />
              </div>
              <div className="form-group mt-2">
                <input
                  type="password"
                  name="loginPassword"
                  className="form-style"
                  placeholder={'\u041f\u0430\u0440\u043e\u043b\u044c'}
                  value={formData.loginPassword}
                  onChange={onInputChange}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                />
                <i className="input-icon uil uil-lock-alt" aria-hidden="true" />
              </div>
              <button type="submit" className="btn mt-4" disabled={isSubmitting}>
                {isSubmitting ? '\u041f\u043e\u0434\u043e\u0436\u0434\u0438\u0442\u0435...' : '\u0412\u043e\u0439\u0442\u0438'}
              </button>
            </form>

            <div className="password-reset">
              <button
                type="button"
                className="password-reset__toggle"
                aria-expanded={isResetOpen}
                aria-controls="password-reset-panel"
                onClick={toggleResetForm}
              >
                {'\u0417\u0430\u0431\u044b\u043b\u0438 \u043f\u0430\u0440\u043e\u043b\u044c?'}
              </button>
              <div
                id="password-reset-panel"
                className={`password-reset__panel${isResetOpen ? ' is-open' : ''}`}
                aria-hidden={!isResetOpen}
              >
                <form onSubmit={handleResetSubmit}>
                  <label className="password-reset__label" htmlFor="password-reset-email">
                    {'\u0423\u043a\u0430\u0436\u0438\u0442\u0435 email, \u043a\u043e\u0442\u043e\u0440\u044b\u0439 \u0432\u044b \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u043b\u0438 \u043f\u0440\u0438 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438'}
                  </label>
                  <div className="form-group">
                    <input
                      id="password-reset-email"
                      type="email"
                      className="form-style password-reset__input"
                      placeholder="Email"
                      pattern={VALIDATION_RULES.EMAIL_REGEX.source}
                      title={'\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0439 email'}
                      autoComplete="email"
                      value={resetEmail}
                      onChange={(event) => {
                        setResetEmail(event.target.value);
                        setShowResetPlaceholder(false);
                      }}
                      required
                      disabled={!isResetOpen}
                    />
                    <i className="input-icon uil uil-at" aria-hidden="true" />
                  </div>
                  <button type="submit" className="btn password-reset__submit" disabled={!isResetOpen}>
                    {'\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0441\u0441\u044b\u043b\u043a\u0443'}
                  </button>
                  {showResetPlaceholder && (
                    <p className="password-reset__notice" role="status">
                      {'\u0424\u043e\u0440\u043c\u0430 \u0433\u043e\u0442\u043e\u0432\u0430, \u043d\u043e \u043e\u0442\u043f\u0440\u0430\u0432\u043a\u0430 \u043f\u0438\u0441\u044c\u043c\u0430 \u043f\u043e\u043a\u0430 \u043d\u0435 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0430.'}
                    </p>
                  )}
                </form>
              </div>
            </div>

            {showTelegram && (
              <div className="telegram-auth-container">
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
                  {'\u0411\u044b\u0441\u0442\u0440\u044b\u0439 \u0432\u0445\u043e\u0434 \u0447\u0435\u0440\u0435\u0437 Telegram'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
