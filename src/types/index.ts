// src/types/index.ts
export interface User {
  avatar: string;
  username?: string;
  email?: string;
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
}