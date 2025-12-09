import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginForm from './Log';
import SignupForm from './Reg';
import './Auth.css';

const Auth: React.FC = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const [isLogin, setIsLogin] = useState(mode !== 'register');

    useEffect(() => {
    setIsLogin(mode !== 'register');
  }, [mode]);

    useEffect(() => {
    return () => {
      document.body.classList.remove('auth-page-isolated');
    };
    }, []);

    const [formData, setFormData] = useState({
    loginEmail: '',
    loginPassword: '',
    signupName: '',
    signupEmail: '',
    signupPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login data:', {
      email: formData.loginEmail,
      password: formData.loginPassword
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup data:', {
      name: formData.signupName,
      email: formData.signupEmail,
      password: formData.signupPassword
    });
  };

  return (
    <div className="auth-container">
      <a href="https://front.codes/" className="logo" target="_blank" rel="noopener noreferrer">
        <img src="https://assets.codepen.io/1462889/fcy.png" alt="Front Codes" />
      </a>

      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5">
              <div className="auth-section pb-5 pt-5 pt-sm-2 text-center">
                <h6 className="mb-0 pb-3">
                  <span>Log In</span>
                  <span>Sign Up</span>
                </h6>
                
                <input 
                  className="checkbox" 
                  type="checkbox" 
                  id="reg-log" 
                  name="reg-log"
                  checked={!isLogin}
                  onChange={() => setIsLogin(!isLogin)}
                />
                <label htmlFor="reg-log"></label>
                
                <div className="card-3d-wrap mx-auto">
                  <div className="card-3d-wrapper">
                    <LoginForm 
                      formData={formData}
                      onInputChange={handleInputChange}
                      onSubmit={handleLoginSubmit}
                    />
                    <SignupForm 
                      formData={formData}
                      onInputChange={handleInputChange}
                      onSubmit={handleSignupSubmit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;