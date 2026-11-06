// src/components/Cabinet/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './Profile.module.css';
import api from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import { ResolvedAvatar } from '../../ui/ResolvedAvatar';
import { User, Mail, Lock, KeyRound, CheckCircle, AlertCircle, Calendar, Loader2 } from 'lucide-react';

// Схема валидации для смены пароля
const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Минимум 6 символов'),
  newPassword: z.string().min(6, 'Минимум 6 символов'),
  confirmPassword: z.string().min(6),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

type PasswordForm = z.infer<typeof passwordSchema>;

const Profile: React.FC = () => {
  const { user, userId, fetchUserDetails } = useAuth();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  // Определяем, вошёл ли пользователь через Telegram
  const isTelegramUser = user?.email?.endsWith('@telegram.com') || 
                          user?.username?.includes('tg') ||
                          (user?.id && typeof user.id === 'number' && user.id > 100000000);

  useEffect(() => {
    const loadUserDetails = async () => {
      if (userId) {
        setLoading(true);
        const details = await fetchUserDetails(userId);
        setUserDetails(details);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    loadUserDetails();
  }, [userId, fetchUserDetails]);

  const onSubmit = async (data: PasswordForm) => {
    setError(null);
    setSuccess(null);
    
    try {
      await api.post('/client/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccess('Пароль успешно изменён');
      reset();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка смены пароля');
    }
  };

  // Формируем отображаемое имя
  const getDisplayName = () => {
    if (userDetails?.name) return userDetails.name;
    if (userDetails?.username) return userDetails.username;
    if (user?.displayName) return user.displayName;
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    if (user?.email && !isTelegramUser) return user.email;
    return 'Пользователь';
  };

  // Форматируем дату регистрации
  const getRegistrationDate = () => {
    if (userDetails?.created_at) {
      const date = new Date(userDetails.created_at);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    if (userDetails?.registeredAt) {
      const date = new Date(userDetails.registeredAt);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return 'Нет данных';
  };

  // Получаем email
  const getEmail = () => {
    if (userDetails?.email) return userDetails.email;
    return user?.email;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader2 size={24} className={styles.spinner} />
        <span>Загрузка данных...</span>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      <h1 className={styles.title}>Профиль</h1>

      <div className={styles.card}>
        <div className={styles.avatarSection}>
          <ResolvedAvatar
            avatar={userDetails?.avatar || user?.avatar}
            alt="Аватар"
            className={styles.avatar}
          />
        </div>
        
        <div className={styles.infoRow}>
          <span className={styles.label}>
            <User size={16} strokeWidth={1.5} />
            Имя
          </span>
          <span>{getDisplayName()}</span>
        </div>

        {!isTelegramUser && (
          <>
            <div className={styles.infoRow}>
              <span className={styles.label}>
                <Mail size={16} strokeWidth={1.5} />
                Email
              </span>
              <span>{getEmail()}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>
                <Calendar size={16} strokeWidth={1.5} />
                Дата регистрации
              </span>
              <span>{getRegistrationDate()}</span>
            </div>
          </>
        )}

        
      </div>

      {/* Форма смены пароля — только для локальных аккаунтов */}
      {!isTelegramUser && (
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Смена пароля</h2>
          
          {error && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} strokeWidth={1.5} />
              {error}
            </div>
          )}
          {success && (
            <div className={styles.successMessage}>
              <CheckCircle size={16} strokeWidth={1.5} />
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.field}>
              <label>
                <KeyRound size={14} strokeWidth={1.5} />
                Текущий пароль
              </label>
              <input 
                type="password" 
                {...register('currentPassword')} 
                disabled={isSubmitting}
                placeholder="••••••"
              />
              {errors.currentPassword && (
                <span className={styles.error}>{errors.currentPassword.message}</span>
              )}
            </div>
            
            <div className={styles.field}>
              <label>
                <Lock size={14} strokeWidth={1.5} />
                Новый пароль
              </label>
              <input 
                type="password" 
                {...register('newPassword')} 
                disabled={isSubmitting}
                placeholder="••••••"
              />
              {errors.newPassword && (
                <span className={styles.error}>{errors.newPassword.message}</span>
              )}
            </div>
            
            <div className={styles.field}>
              <label>
                <Lock size={14} strokeWidth={1.5} />
                Подтвердите пароль
              </label>
              <input 
                type="password" 
                {...register('confirmPassword')} 
                disabled={isSubmitting}
                placeholder="••••••"
              />
              {errors.confirmPassword && (
                <span className={styles.error}>{errors.confirmPassword.message}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Смена пароля...' : 'Изменить пароль'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;