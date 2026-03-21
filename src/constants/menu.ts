// src/constants/menu.ts
export const MENU_ITEMS = {
  MY_ORDERS: 'my-orders',
  SETTINGS: 'settings',
  SUPPORT: 'support',
  ACCESS: 'access',
  LOGOUT: 'logout',
} as const;

export interface MenuItemConfig {
  id: string;
  label: string;
  path: string;
  icon?: string;
  adminOnly?: boolean;
  roles?: string[];
}

export const MENU_CONFIG = [
  {
    id: 'my-orders',
    label: 'Мои заказы',
    path: '/orders',
    icon: '📦',
  },
  {
  id: "cabinet",
  label: "Личный кабинет",
  path: "/cabinet",
  icon: "👤"
  },
  {
    id: 'settings',
    label: 'Настройки',
    path: '/settings',
    icon: '⚙️',
  },
  {
    id: 'support',
    label: 'Поддержка',
    path: '/support',
    icon: '🛟',
  },
  {
    id: 'access',
    label: 'Доступы',
    path: '/admin/access',
    icon: '🔐',
    adminOnly: true,
    roles: ['admin', 'superadmin', 'moderator'],
  },
  {
    id: 'logout',
    label: 'Выйти',
    path: '#logout',
    icon: '🚪',
  },
]