// src/types/index.ts
import { AUTH_ROUTES, AUTH_TEXT, AUTH_MODES } from '../constants/auth';

export interface User {
  avatar: string;
  username?: string;
  email?: string;
  id?: string | number;
  name?: string;
  role?: string;
}

export interface HeaderProps {
  isMobile: boolean;
  isAuthenticated: boolean;
}

export interface MenuAuthProps {
  isMobile: boolean;
}

export interface HomeProps {
  isMobile: boolean;
}

export interface ServicesProps {
  isMobile: boolean;
  isAuthenticated: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Типы для маршрутов
export type AuthRoute = typeof AUTH_ROUTES[keyof typeof AUTH_ROUTES];
export type AuthMode = typeof AUTH_MODES[keyof typeof AUTH_MODES];

// Типы для форм аутентификации
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
}

// Пропсы для компонентов аутентификации
export interface AuthFormProps {
  onSubmit: (data: LoginFormData | SignupFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;
}

export interface LoginFormProps extends AuthFormProps {
  initialEmail?: string;
  onForgotPassword?: () => void;
  onSignupClick?: () => void;
}

export interface SignupFormProps extends AuthFormProps {
  onLoginClick?: () => void;
}