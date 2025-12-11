import React from 'react';

interface LoginFormProps {
  formData: {
    loginEmail: string;
    loginPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  formData, 
  onInputChange, 
  onSubmit,
  errors,
  isSubmitting 
}) => {
  return (
    <div className="card-front">
      <div className="center-wrap">
        <div className="section text-center">
          <h4 className="mb-4 pb-3">Log In</h4>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input 
                type="email" 
                name="loginEmail" 
                className={`form-style ${errors.loginEmail ? 'error' : ''}`}
                placeholder="Your Email" 
                id="logemail" 
                autoComplete="off"
                value={formData.loginEmail}
                onChange={onInputChange}
                required
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-at"></i>
              {errors.loginEmail && (
                <div className="error-message">{errors.loginEmail}</div>
              )}
            </div>	
            <div className="form-group mt-2">
              <input 
                type="password" 
                name="loginPassword" 
                className={`form-style ${errors.loginPassword ? 'error' : ''}`}
                placeholder="Your Password" 
                id="logpass" 
                autoComplete="off"
                value={formData.loginPassword}
                onChange={onInputChange}
                required
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-lock-alt"></i>
              {errors.loginPassword && (
                <div className="error-message">{errors.loginPassword}</div>
              )}
            </div>
            <button 
              type="submit" 
              className="btn mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Подождите...' : 'Войти'}
            </button>
          </form>
          <p className="mb-0 mt-4 text-center">
            <a href="#0" className="link">Forgot your password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;