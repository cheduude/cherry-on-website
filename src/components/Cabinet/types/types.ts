export interface User {
  // Обязательные поля (всегда есть)
  id: number;
  email: string;
  role: 'user' | 'admin';
  
  // Опциональные поля из основного сайта
  name?: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  token?: string;
  
  // Опциональные поля из кабинета (могут отсутствовать, если пользователь не в кабинете)
  balance?: number;
  currency?: string;
  language?: 'ru' | 'en';
}

export interface Subscription {
  id: number;
  status: 'active' | 'expired' | 'trial';
  planName: string;
  expiresAt: string;
  trafficUsed: number;     // в GB
  trafficLimit: number;    // в GB
  devicesLimit: number;
  devicesUsed: number;
}

export interface Tariff {
  id: number;
  name: string;
  duration: number;        // дни
  price: number;
  currency: string;
  traffic: number;         // GB
  devices: number;
  category: string;
  description?: string;
}

export interface Transaction {
  id: number;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'payment' | 'referral_bonus';
  createdAt: string;
  description: string;
}

export interface ReferralStats {
  totalReferrals: number;
  totalEarned: number;
  level1: number;
  level2: number;
  level3: number;
  referralLink: string;
}