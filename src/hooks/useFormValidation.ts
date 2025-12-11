import { useState, useCallback } from 'react';
import { VALIDATION_RULES, VALIDATION_MESSAGES } from '../constants/validation';

interface ValidationErrors {
  [key: string]: string;
}

interface UseFormValidationReturn {
  errors: ValidationErrors;
  validateField: (name: string, value: string) => string;
  validateForm: (formData: Record<string, string>) => boolean;
  resetErrors: () => void;
}

export const useFormValidation = (): UseFormValidationReturn => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: string, value: string): string => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = VALIDATION_MESSAGES.EMAIL_REQUIRED;
        } else if (!VALIDATION_RULES.EMAIL_REGEX.test(value)) {
          error = VALIDATION_MESSAGES.EMAIL_INVALID;
        }
        break;

      case 'password':
        if (!value.trim()) {
          error = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
        } else if (value.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
          error = VALIDATION_MESSAGES.PASSWORD_TOO_SHORT;
        } else if (value.length > VALIDATION_RULES.MAX_PASSWORD_LENGTH) {
          error = VALIDATION_MESSAGES.PASSWORD_TOO_LONG;
        } else if (!VALIDATION_RULES.PASSWORD_REGEX.test(value)) {
          error = VALIDATION_MESSAGES.PASSWORD_WEAK;
        }
        break;

      case 'name':
      case 'signupName':
        if (!value.trim()) {
          error = VALIDATION_MESSAGES.NAME_REQUIRED;
        } else if (value.length < VALIDATION_RULES.MIN_USERNAME_LENGTH) {
          error = VALIDATION_MESSAGES.NAME_TOO_SHORT;
        } else if (value.length > VALIDATION_RULES.MAX_USERNAME_LENGTH) {
          error = VALIDATION_MESSAGES.NAME_TOO_LONG;
        }
        break;

      case 'confirmPassword':
        // Это будет проверяться в validateForm
        break;

      default:
        break;
    }

    return error;
  }, []);

  const validateForm = useCallback((formData: Record<string, string>): boolean => {
    const newErrors: ValidationErrors = {};

    // Валидация логина
    if (formData.loginEmail) {
      const emailError = validateField('email', formData.loginEmail);
      if (emailError) newErrors.loginEmail = emailError;
    }

    if (formData.loginPassword) {
      const passwordError = validateField('password', formData.loginPassword);
      if (passwordError) newErrors.loginPassword = passwordError;
    }

    // Валидация регистрации
    if (formData.signupName) {
      const nameError = validateField('name', formData.signupName);
      if (nameError) newErrors.signupName = nameError;
    }

    if (formData.signupEmail) {
      const emailError = validateField('email', formData.signupEmail);
      if (emailError) newErrors.signupEmail = emailError;
    }

    if (formData.signupPassword) {
      const passwordError = validateField('password', formData.signupPassword);
      if (passwordError) newErrors.signupPassword = passwordError;
    }

    // Проверка совпадения паролей для регистрации
    if (formData.signupPassword && formData.confirmPassword) {
      if (formData.signupPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  const resetErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    resetErrors,
  };
};