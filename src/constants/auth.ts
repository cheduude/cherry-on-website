// Аватары по умолчанию
export const DEFAULT_AVATAR = "https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg";
export const FALLBACK_AVATAR = "https://pbs.twimg.com/profile_images/378800000639740507/fc0aaad744734cd1dbc8aeb3d51f8729_400x400.jpeg";

// Маршруты аутентификации
export const AUTH_ROUTES = {
  LOGIN: '/auth',
  REGISTER: '/auth?mode=register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HOME: '/',
  DASHBOARD: '/dashboard'
} as const;

// Сообщения и тексты
export const AUTH_TEXT = {
  LOGIN: 'Войти',
  LOGOUT: 'Выйти',
  REGISTER: 'Регистрация',
  PROFILE: 'Профиль',
  SETTINGS: 'Настройки',
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