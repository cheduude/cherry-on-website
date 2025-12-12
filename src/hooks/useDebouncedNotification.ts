// src/hooks/useDebouncedNotification.ts
import { useRef, useCallback } from 'react';

interface UseDebouncedNotificationReturn {
  showDebouncedError: (
    showError: (title: string, message: string) => void,
    title: string,
    message: string,
    delay?: number
  ) => void;
  showDebouncedSuccess: (
    showSuccess: (title: string, message: string) => void,
    title: string,
    message: string,
    delay?: number
  ) => void;
  showDebouncedWarning: (
    showWarning: (title: string, message: string) => void,
    title: string,
    message: string,
    delay?: number
  ) => void;
  showDebouncedInfo: (
    showInfo: (title: string, message: string) => void,
    title: string,
    message: string,
    delay?: number
  ) => void;
  clearDebounce: () => void;
}

export const useDebouncedNotification = (): UseDebouncedNotificationReturn => {
  const errorTimeout = useRef<number | null>(null);
  const successTimeout = useRef<number | null>(null);
  const warningTimeout = useRef<number | null>(null);
  const infoTimeout = useRef<number | null>(null);

  const showDebouncedError = useCallback((
    showError: (title: string, message: string) => void,
    title: string,
    message: string,
    delay: number = 100
  ) => {
    if (errorTimeout.current !== null) {
      window.clearTimeout(errorTimeout.current);
    }

    errorTimeout.current = window.setTimeout(() => {
      showError(title, message);
    }, delay);
  }, []);

  const showDebouncedSuccess = useCallback((
    showSuccess: (title: string, message: string) => void,
    title: string,
    message: string,
    delay: number = 100
  ) => {
    if (successTimeout.current !== null) {
      window.clearTimeout(successTimeout.current);
    }

    successTimeout.current = window.setTimeout(() => {
      showSuccess(title, message);
    }, delay);
  }, []);

  const showDebouncedWarning = useCallback((
    showWarning: (title: string, message: string) => void,
    title: string,
    message: string,
    delay: number = 100
  ) => {
    if (warningTimeout.current !== null) {
      window.clearTimeout(warningTimeout.current);
    }

    warningTimeout.current = window.setTimeout(() => {
      showWarning(title, message);
    }, delay);
  }, []);

  const showDebouncedInfo = useCallback((
    showInfo: (title: string, message: string) => void,
    title: string,
    message: string,
    delay: number = 100
  ) => {
    if (infoTimeout.current !== null) {
      window.clearTimeout(infoTimeout.current);
    }

    infoTimeout.current = window.setTimeout(() => {
      showInfo(title, message);
    }, delay);
  }, []);

  const clearDebounce = useCallback(() => {
    [errorTimeout, successTimeout, warningTimeout, infoTimeout].forEach(ref => {
      if (ref.current !== null) {
        window.clearTimeout(ref.current);
        ref.current = null;
      }
    });
  }, []);

  return {
    showDebouncedError,
    showDebouncedSuccess,
    showDebouncedWarning,
    showDebouncedInfo,
    clearDebounce,
  };
};