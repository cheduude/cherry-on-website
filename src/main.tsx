// src/main.tsx
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';

const savedTheme = localStorage.getItem('theme');
const initialTheme = savedTheme === 'dark' || savedTheme === 'light'
  ? savedTheme
  : window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
document.documentElement.dataset.theme = initialTheme;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  
    <BrowserRouter>
      <App />
    </BrowserRouter>
  
);
