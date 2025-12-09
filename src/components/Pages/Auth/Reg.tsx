import React from 'react';

interface SignupFormProps {
  formData: {
    signupName: string;
    signupEmail: string;
    signupPassword: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ formData, onInputChange, onSubmit }) => {
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
                className="form-style" 
                placeholder="Your Full Name" 
                id="logname" 
                autoComplete="off"
                value={formData.signupName}
                onChange={onInputChange}
                required
              />
              <i className="input-icon uil uil-user"></i>
            </div>	
            <div className="form-group mt-2">
              <input 
                type="email" 
                name="signupEmail" 
                className="form-style" 
                placeholder="Your Email" 
                id="signupemail" 
                autoComplete="off"
                value={formData.signupEmail}
                onChange={onInputChange}
                required
              />
              <i className="input-icon uil uil-at"></i>
            </div>	
            <div className="form-group mt-2">
              <input 
                type="password" 
                name="signupPassword" 
                className="form-style" 
                placeholder="Your Password" 
                id="signuppass" 
                autoComplete="off"
                value={formData.signupPassword}
                onChange={onInputChange}
                required
              />
              <i className="input-icon uil uil-lock-alt"></i>
            </div>
            <button type="submit" className="btn mt-4">submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;