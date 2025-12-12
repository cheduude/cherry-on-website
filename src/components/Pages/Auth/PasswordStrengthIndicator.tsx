import React from 'react';
import { VALIDATION_RULES } from '../../../constants/validation';
import './PasswordStrengthIndicator.css';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  if (!password) return null;
  
  // Расчет силы пароля
  const calculateStrength = () => {
    let score = 0;
    const maxScore = 100;
    
    // Длина
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    
    // Разнообразие символов
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/\d/.test(password)) score += 15;
    if (/[@$!%*?&]/.test(password)) score += 15;
    
    return Math.min(score, maxScore);
  };
  
  const getStrengthLevel = (strength: number) => {
    if (strength < 40) return 'weak';
    if (strength < 60) return 'medium';
    if (strength < 80) return 'strong';
    return 'very-strong';
  };
  
  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'weak': return '#ff6b6b';
      case 'medium': return '#ffd166';
      case 'strong': return '#06d6a0';
      case 'very-strong': return '#118ab2';
      default: return '#ccc';
    }
  };
  
  const getStrengthText = (level: string) => {
    switch (level) {
      case 'weak': return 'Слабый';
      case 'medium': return 'Средний';
      case 'strong': return 'Сильный';
      case 'very-strong': return 'Очень сильный';
      default: return '';
    }
  };
  
  const strength = calculateStrength();
  const level = getStrengthLevel(strength);
  const color = getStrengthColor(level);
  const text = getStrengthText(level);
  
  // Проверка соответствия требованиям
  const checkRequirements = () => {
    const errors: string[] = [];
    
    if (password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
      errors.push(`Минимум ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} символов`);
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Заглавная буква (A-Z)');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Строчная буква (a-z)');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Цифра (0-9)');
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push('Специальный символ (@$!%*?&)');
    }
    
    return errors;
  };
  
  const requirements = checkRequirements();
  
  return (
    <div className="password-strength-indicator">
      <div className="strength-bar">
        <div 
          className="strength-fill"
          style={{
            width: `${strength}%`,
            backgroundColor: color
          }}
        />
      </div>
      <div className="strength-info">
        <span className="strength-text">{text}</span>
        <span className="strength-percentage">{strength}%</span>
      </div>
      {requirements.length > 0 && (
        <ul className="password-errors">
          {requirements.map((req, index) => (
            <li key={index} className="error-item">{req}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;