export const PASSWORD_SPECIAL_CHARACTERS = '!@#$%^&*()-_=+[]{}|;:,.<>?/~`';

const escapedPasswordSpecialCharacters = Array.from(PASSWORD_SPECIAL_CHARACTERS)
  .map((character) => '\\^[]-'.includes(character) ? `\\${character}` : character)
  .join('');

export const PASSWORD_SPECIAL_CHAR_REGEX = new RegExp(`[${escapedPasswordSpecialCharacters}]`);

export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 50,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  PASSWORD_SPECIAL_CHARACTERS,
  PASSWORD_SPECIAL_CHAR_REGEX,
  PASSWORD_REGEX: new RegExp(
    `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${escapedPasswordSpecialCharacters}])[A-Za-z\\d${escapedPasswordSpecialCharacters}]{${8},${50}}$`,
  ),
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email обязателен',
  EMAIL_INVALID: 'Введите корректный email',
  PASSWORD_REQUIRED: 'Пароль обязателен',
  PASSWORD_TOO_SHORT: `Пароль должен содержать минимум ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} символов`,
  PASSWORD_TOO_LONG: `Пароль не должен превышать ${VALIDATION_RULES.MAX_PASSWORD_LENGTH} символов`,
  PASSWORD_WEAK: `Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву, одну цифру и один специальный символ (${PASSWORD_SPECIAL_CHARACTERS})`,
  NAME_REQUIRED: 'Имя обязательно',
  NAME_TOO_SHORT: `Имя должно содержать минимум ${VALIDATION_RULES.MIN_USERNAME_LENGTH} символа`,
  NAME_TOO_LONG: `Имя не должно превышать ${VALIDATION_RULES.MAX_USERNAME_LENGTH} символов`,
  PASSWORDS_NOT_MATCH: 'Пароли не совпадают',
  TERMS_REQUIRED: 'Необходимо согласиться с условиями',
} as const;
