import { useCallback } from 'react';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../constants/validation';

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: number; // 0-100
  strengthLevel: 'weak' | 'medium' | 'strong' | 'very-strong';
}

export const usePasswordValidation = () => {
  const validatePassword = useCallback((password: string): PasswordValidationResult => {
    const errors: string[] = [];
    
    // Проверка длины
    if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
      errors.push(VALIDATION_MESSAGES.PASSWORD_TOO_SHORT);
    }
    
    if (password.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH) {
      errors.push(VALIDATION_MESSAGES.PASSWORD_TOO_LONG);
    }
    
    // Проверка по регулярному выражению
    if (!VALIDATION_RULES.PASSWORD_REGEX.test(password)) {
      errors.push(VALIDATION_MESSAGES.PASSWORD_WEAK);
    }
    
    // Расчет силы пароля
    const strength = calculatePasswordStrength(password);
    const strengthLevel = getStrengthLevel(strength);
    
    return {
      isValid: errors.length === 0,
      errors,
      strength,
      strengthLevel
    };
  }, []);

  const validatePasswordMatch = useCallback((password: string, confirmPassword: string): boolean => {
    return password === confirmPassword;
  }, []);

  return {
    validatePassword,
    validatePasswordMatch
  };
};

// Вспомогательные функции
const calculatePasswordStrength = (password: string): number => {
  let score = 0;
  
  // Длина
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  
  // Разнообразие символов
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[@$!%*?&]/.test(password)) score += 15;
  
  // Штраф за последовательности
  if (/(.)\1{2,}/.test(password)) score -= 10; // Три одинаковых символа подряд
  if (/123|abc|qwe|asd|zxc/.test(password.toLowerCase())) score -= 10;
  
  return Math.min(Math.max(score, 0), 100);
};

const getStrengthLevel = (strength: number): 'weak' | 'medium' | 'strong' | 'very-strong' => {
  if (strength < 40) return 'weak';
  if (strength < 60) return 'medium';
  if (strength < 80) return 'strong';
  return 'very-strong';
};