// src/constants/menu.ts
export const MENU_ITEMS = {
  MY_ORDERS: 'my-orders',
  EDITOR: 'editor',
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
    id: "cabinet",
    label: "Личный кабинет",
    path: "/cabinet",
    icon: "User"
  },
  {
    id: 'editor',
    label: 'Панель редактора',
    path: '/editor',
    icon: 'Edit3',
  },
  {
    id: 'support',
    label: 'Поддержка',
    path: '/support',
    icon: 'LifeBuoy',
  },
  {
    id: 'access',
    label: 'Доступы',
    path: '/admin/access',
    icon: 'Lock',
    adminOnly: true,
    roles: ['admin', 'superadmin', 'moderator'],
  },
  {
    id: 'logout',
    label: 'Выйти',
    path: '#logout',
    icon: 'LogOut',
  },
];
