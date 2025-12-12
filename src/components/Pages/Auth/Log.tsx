import React from 'react';

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
  return (
    <div className="card-front">
      <div className="center-wrap">
        <div className="section text-center">
          <h4 className="mb-4 pb-3">Log In</h4>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input 
                type="text" // Изменено с email на text, чтобы убрать встроенную валидацию
                name="loginEmail" 
                className="form-style"
                placeholder="Your Email" 
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
                placeholder="Your Password" 
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
          <p className="mb-0 mt-4 text-center">
            <a href="#0" className="link">Forgot your password?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;