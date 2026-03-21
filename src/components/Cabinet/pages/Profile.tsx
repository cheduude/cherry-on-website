import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './Profile.module.css';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

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
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordForm) => {
    try {
      await api.post('/client/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      alert('Пароль успешно изменён');
      reset();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка смены пароля');
    }
  };

  return (
    <div className={styles.profile}>
      <h1 className={styles.title}>Профиль</h1>

      <div className={styles.card}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Email:</span>
          <span>{user?.email}</span>
        </div>
        {/* <div className={styles.infoRow}>
          <span className={styles.label}>Роль:</span>
          <span>{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</span>
        </div> */}
        <div className={styles.infoRow}>
          <span className={styles.label}>Баланс:</span>
          <span>{user?.balance} {user?.currency}</span>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Смена пароля</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Текущий пароль</label>
            <input type="password" {...register('currentPassword')} />
            {errors.currentPassword && <span className={styles.error}>{errors.currentPassword.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Новый пароль</label>
            <input type="password" {...register('newPassword')} />
            {errors.newPassword && <span className={styles.error}>{errors.newPassword.message}</span>}
          </div>
          <div className={styles.field}>
            <label>Подтвердите пароль</label>
            <input type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword.message}</span>}
          </div>
          <button type="submit" className={styles.submitButton}>Изменить пароль</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;