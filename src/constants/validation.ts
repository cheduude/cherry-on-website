export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email обязателен',
  EMAIL_INVALID: 'Введите корректный email',
  PASSWORD_REQUIRED: 'Пароль обязателен',
  PASSWORD_TOO_SHORT: `Пароль должен содержать минимум ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} символов`,
  PASSWORD_TOO_LONG: `Пароль не должен превышать ${VALIDATION_RULES.MAX_PASSWORD_LENGTH} символов`,
  PASSWORD_WEAK: 'Пароль должен содержать хотя бы одну заглавную букву, одну строчную и одну цифру',
  NAME_REQUIRED: 'Имя обязательно',
  NAME_TOO_SHORT: `Имя должно содержать минимум ${VALIDATION_RULES.MIN_USERNAME_LENGTH} символа`,
  NAME_TOO_LONG: `Имя не должно превышать ${VALIDATION_RULES.MAX_USERNAME_LENGTH} символов`,
  PASSWORDS_NOT_MATCH: 'Пароли не совпадают',
  TERMS_REQUIRED: 'Необходимо согласиться с условиями',
} as const;