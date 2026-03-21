// ================================================
// 3. src/components/Auth/Reg.tsx (SignupForm)
// ================================================
import React from 'react';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

interface SignupFormProps {
  formData: {
    signupEmail: string;
    signupPassword: string;
    confirmPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  isSubmitting
}) => {
  return (
    <div className="card-back">
      <div className="center-wrap">
        <div className="section text-center">
          <h4 className="mb-4 pb-3">Регистрация</h4>
          <form onSubmit={onSubmit}>  
            <div className="form-group mt-2">
              <input
                type="text"
                name="signupEmail"
                className="form-style"
                placeholder="Ваш Email"
                id="signupemail"
                autoComplete="off"
                value={formData.signupEmail}
                onChange={onInputChange}
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-at"></i>
            </div>  
            <div className="form-group mt-2">
              <input
                type="password"
                name="signupPassword"
                className="form-style"
                placeholder="Пароль"
                id="signuppass"
                autoComplete="off"
                value={formData.signupPassword}
                onChange={onInputChange}
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-lock-alt"></i>
              <PasswordStrengthIndicator password={formData.signupPassword} />
            </div>
            <div className="form-group mt-2">
              <input
                type="password"
                name="confirmPassword"
                className="form-style"
                placeholder="Подтвердите пароль"
                id="confirmpass"
                autoComplete="off"
                value={formData.confirmPassword}
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
              {isSubmitting ? 'Подождите...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;