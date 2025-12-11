import React from 'react';

interface SignupFormProps {
  formData: {
    signupName: string;
    signupEmail: string;
    signupPassword: string;
    confirmPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ 
  formData, 
  onInputChange, 
  onSubmit,
  errors,
  isSubmitting 
}) => {
  return (
    <div className="card-back">
      <div className="center-wrap">
        <div className="section text-center">
          <h4 className="mb-4 pb-3">Sign Up</h4>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="signupName" 
                className={`form-style ${errors.signupName ? 'error' : ''}`}
                placeholder="Your Full Name" 
                id="logname" 
                autoComplete="off"
                value={formData.signupName}
                onChange={onInputChange}
                required
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-user"></i>
              {errors.signupName && (
                <div className="error-message">{errors.signupName}</div>
              )}
            </div>	
            <div className="form-group mt-2">
              <input 
                type="email" 
                name="signupEmail" 
                className={`form-style ${errors.signupEmail ? 'error' : ''}`}
                placeholder="Your Email" 
                id="signupemail" 
                autoComplete="off"
                value={formData.signupEmail}
                onChange={onInputChange}
                required
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-at"></i>
              {errors.signupEmail && (
                <div className="error-message">{errors.signupEmail}</div>
              )}
            </div>	
            <div className="form-group mt-2">
              <input 
                type="password" 
                name="signupPassword" 
                className={`form-style ${errors.signupPassword ? 'error' : ''}`}
                placeholder="Your Password" 
                id="signuppass" 
                autoComplete="off"
                value={formData.signupPassword}
                onChange={onInputChange}
                required
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-lock-alt"></i>
              {errors.signupPassword && (
                <div className="error-message">{errors.signupPassword}</div>
              )}
            </div>
            <div className="form-group mt-2">
              <input 
                type="password" 
                name="confirmPassword" 
                className={`form-style ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm Password" 
                id="confirmpass" 
                autoComplete="off"
                value={formData.confirmPassword}
                onChange={onInputChange}
                required
                disabled={isSubmitting}
              />
              <i className="input-icon uil uil-lock-alt"></i>
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
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