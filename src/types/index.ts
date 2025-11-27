// src/types/index.ts
export interface User {
  avatar: string;
  // Добавь больше полей позже
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