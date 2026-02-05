import React, { useState, useRef, useEffect } from 'react';
import styles from './TestimonialsPage.module.css';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find(option => option.value === value) || null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current || !listRef.current) return;
      
      const target = event.target as Node;
      
      // Проверяем, кликнули ли мы на кнопку
      const isClickOnButton = buttonRef.current?.contains(target);
      // Проверяем, кликнули ли мы в список
      const isClickOnList = listRef.current?.contains(target);
      // Проверяем, кликнули ли мы вообще в контейнер
      const isClickOnContainer = containerRef.current?.contains(target);
      
      // Если клик был на кнопку - она сама обработает открытие/закрытие
      if (isClickOnButton) {
        return;
      }
      
      // Если клик был вне контейнера, закрываем список
      if (!isClickOnContainer) {
        setIsOpen(false);
        return;
      }
      
      // Если клик был внутри контейнера, но не на кнопку и не в список, закрываем
      if (isClickOnContainer && !isClickOnButton && !isClickOnList) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside as any);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as any);
    };
  }, []);

  // Обновление выбранной опции при изменении value извне
  useEffect(() => {
    const option = options.find(opt => opt.value === value);
    setSelectedOption(option || null);
  }, [value, options]);

  const handleToggle = (e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    // Закрываем список, если он открыт, или открываем, если закрыт
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: Option, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  // Закрытие при нажатии Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Фокус на кнопке при закрытии для доступности
  useEffect(() => {
    if (!isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div 
      className={`${styles.customSelectContainer} ${disabled ? styles.disabled : ''}`} 
      ref={containerRef}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.customSelectButton} ${isOpen ? styles.open : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={selectedOption ? selectedOption.label : placeholder}
      >
        <span className={styles.selectedValue}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={styles.selectArrow}>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 16 16" 
            fill="currentColor"
            className={`${styles.arrowIcon} ${isOpen ? styles.arrowRotated : ''}`}
          >
            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
          </svg>
        </span>
      </button>
      
      {isOpen && (
        <div 
          className={styles.optionsList} 
          role="listbox"
          ref={listRef}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.optionItem} ${selectedOption?.value === option.value ? styles.selected : ''}`}
              onClick={(e) => handleSelect(option, e)}
              role="option"
              aria-selected={selectedOption?.value === option.value}
            >
              <span className={styles.optionLabel}>{option.label}</span>
              {selectedOption?.value === option.value && (
                <span className={styles.checkIcon}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;