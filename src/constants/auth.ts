// Аватары по умолчанию (локальный SVG-силуэт; цвет задаётся темой через CSS mask)
export const DEFAULT_AVATAR = '/avatars/default-avatar.svg';
export const FALLBACK_AVATAR = '/avatars/default-avatar.svg';

export const isDefaultAvatar = (avatar?: string | null): boolean => {
  if (!avatar) return true;
  return avatar === DEFAULT_AVATAR || avatar.includes('ui-avatars.com');
};

/** Returns a local default avatar when the value is empty or an old external generator URL. */
export const resolveAvatarUrl = (avatar?: string | null): string => {
  if (isDefaultAvatar(avatar)) {
    return DEFAULT_AVATAR;
  }
  return avatar as string;
};

// Маршруты аутентификации
export const AUTH_ROUTES = {
  LOGIN: '/auth',
  REGISTER: '/auth?mode=register',
  PROFILE: '/profile',
  HOME: '/',
  DASHBOARD: '/dashboard'
} as const;

// Сообщения и тексты
export const AUTH_TEXT = {
  LOGIN: 'Войти',
  LOGOUT: 'Выйти',
  REGISTER: 'Регистрация',
  PROFILE: 'Профиль',
  MENU: 'Меню',
  LOGIN_BUTTON: 'LOGIN',
  LOGOUT_BUTTON: 'LOGOUT'
} as const;

// Режимы аутентификации
export const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register'
} as const;

// Ключи для localStorage/sessionStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SESSION_ID: 'session_id'
} as const;

// Валидационные константы
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;

// Время (в миллисекундах)
export const AUTH_TIMING = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 часа
  TOKEN_REFRESH_INTERVAL: 10 * 60 * 1000, // 10 минут
  DEBOUNCE_DELAY: 300, // Задержка для дебаунса
  ANIMATION_DURATION: 300 // Длительность анимации
} as const;
