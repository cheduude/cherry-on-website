// src/components/Pages/Editor/ContentEditor.tsx
import React, { useState, useEffect } from 'react';
import styles from './ContentEditor.module.css';
import api from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { 
  Save, 
  Eye, 
  Globe,
  Home, 
  FileText, 
  Star, 
  LifeBuoy, 
  Footprints, 
  CheckCircle, 
  Loader2,
  LayoutDashboard,
  User,
  ShoppingBag,
  CreditCard,
  Users,
} from 'lucide-react';

interface ContentField {
  key: string;
  value: string;
  description: string;
  type: 'text' | 'textarea' | 'link';
}

const ContentEditor: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const [contents, setContents] = useState<ContentField[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Страницы для редактирования
  const pages = [
    // Публичные страницы
    { id: 'home', name: 'Главная', icon: Home, group: 'public' },
    { id: 'services', name: 'Услуги', icon: FileText, group: 'public' },
    { id: 'testimonials', name: 'Отзывы', icon: Star, group: 'public' },
    { id: 'support', name: 'Поддержка', icon: LifeBuoy, group: 'public' },
    { id: 'footer', name: 'Футер', icon: Footprints, group: 'public' },
    
    // Страницы личного кабинета
    { id: 'cabinet_dashboard', name: 'Дашборд', icon: LayoutDashboard, group: 'cabinet' },
    { id: 'cabinet_profile', name: 'Профиль', icon: User, group: 'cabinet' },
    { id: 'cabinet_tariffs', name: 'Тарифы', icon: ShoppingBag, group: 'cabinet' },
    { id: 'cabinet_orders', name: 'Заказы', icon: CreditCard, group: 'cabinet' },
    { id: 'cabinet_subscription', name: 'Подписка', icon: CreditCard, group: 'cabinet' },
    { id: 'cabinet_referrals', name: 'Рефералы', icon: Users, group: 'cabinet' },
  ];

  // Группы страниц
  useEffect(() => {
    fetchContent();
  }, [activePage]);

  const fetchContent = async () => {
    setLoadingContent(true);
    try {
      const { data } = await api.get(`/api/content/${activePage}`);
      setContents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      setContents([]);
    } finally {
      setLoadingContent(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/api/content/${activePage}`, { contents });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setContents(prev => prev.map(c => c.key === key ? { ...c, value } : c));
  };

  if (authLoading || loadingContent) {
    return (
      <div className={styles.loading}>
        <Loader2 size={32} className={styles.spinner} />
        <span>Загрузка...</span>
      </div>
    );
  }

  // Группировка страниц
  const publicPages = pages.filter(p => p.group === 'public');
  const cabinetPages = pages.filter(p => p.group === 'cabinet');

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <div>
          <h1>Редактор контента</h1>
          <p className={styles.subtitle}>Управление текстами и ссылками на сайте</p>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.previewButton} 
            onClick={() => window.open('/', '_blank')}
          >
            <Eye size={16} />
            Предпросмотр
          </button>
          <button 
            className={styles.saveButton} 
            onClick={handleSave} 
            disabled={saving}
          >
            {saveSuccess ? <CheckCircle size={16} /> : <Save size={16} />}
            {saving ? 'Сохранение...' : saveSuccess ? 'Сохранено!' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Публичные страницы */}
      <div className={styles.pageGroup}>
        <h2 className={styles.groupTitle}>
          <Globe size={20} />
          Публичные страницы
        </h2>
        <div className={styles.pagesNav}>
          {publicPages.map(page => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                className={`${styles.pageBtn} ${activePage === page.id ? styles.active : ''}`}
                onClick={() => setActivePage(page.id)}
              >
                <Icon size={18} />
                {page.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Страницы личного кабинета */}
      <div className={styles.pageGroup}>
        <h2 className={styles.groupTitle}>
          <LayoutDashboard size={20} />
          Личный кабинет
        </h2>
        <div className={styles.pagesNav}>
          {cabinetPages.map(page => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                className={`${styles.pageBtn} ${activePage === page.id ? styles.active : ''}`}
                onClick={() => setActivePage(page.id)}
              >
                <Icon size={18} />
                {page.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.content}>
        {contents.length === 0 ? (
          <div className={styles.empty}>Нет полей для редактирования</div>
        ) : (
          contents.map(field => (
            <div key={field.key} className={styles.field}>
              <label className={styles.label}>
                {field.description}
                <span className={styles.key}>{field.key}</span>
              </label>
              
              {field.type === 'textarea' ? (
                <textarea
                  value={field.value}
                  onChange={e => handleChange(field.key, e.target.value)}
                  rows={4}
                  className={styles.textarea}
                />
              ) : field.type === 'link' ? (
                <div className={styles.linkField}>
                  <input
                    type="text"
                    value={field.value}
                    onChange={e => handleChange(field.key, e.target.value)}
                    className={styles.input}
                    placeholder="https://..."
                  />
                  <span className={styles.linkHint}>
                    Введите полный URL (например, /services или https://example.com)
                  </span>
                </div>
              ) : (
                <input
                  type="text"
                  value={field.value}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className={styles.input}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentEditor;