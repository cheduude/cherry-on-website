import { useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

type Theme = 'dark' | 'light';
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

const getInitialTheme = (): Theme => {
  const active = document.documentElement.dataset.theme;
  if (active === 'dark' || active === 'light') return active;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    const viewTransitionDocument = document as ViewTransitionDocument;
    const applyTheme = () => {
      flushSync(() => setTheme(next));
      root.dataset.theme = next;
      localStorage.setItem('theme', next);
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      applyTheme();
      return;
    }

    if (!viewTransitionDocument.startViewTransition) {
      root.classList.add('theme-transition');
      applyTheme();
      window.setTimeout(() => root.classList.remove('theme-transition'), 350);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.ceil(Math.max(
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y),
    ));

    root.style.setProperty('--theme-origin-x', `${x}px`);
    root.style.setProperty('--theme-origin-y', `${y}px`);
    root.style.setProperty('--theme-reveal-radius', `${radius}px`);

    const transition = viewTransitionDocument.startViewTransition(applyTheme);
    const clearOrigin = () => {
      root.style.removeProperty('--theme-origin-x');
      root.style.removeProperty('--theme-origin-y');
      root.style.removeProperty('--theme-reveal-radius');
    };
    void transition.finished.then(clearOrigin, clearOrigin);
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043d\u0430 \u0441\u0432\u0435\u0442\u043b\u0443\u044e \u0442\u0435\u043c\u0443' : '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043d\u0430 \u0442\u0451\u043c\u043d\u0443\u044e \u0442\u0435\u043c\u0443'}
      aria-pressed={theme === 'light'}
    >
      <span className="icon sun" aria-hidden="true"><FaSun /></span>
      <span className="icon moon" aria-hidden="true"><FaMoon /></span>
    </button>
  );
};

export default ThemeToggle;
