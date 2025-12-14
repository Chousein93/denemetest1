export type Language = 'en' | 'de' | 'tr';

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Goal {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  currency: string;
  type: 'savings' | 'debt' | 'investment';
  hasVideo?: boolean;
}

export interface Template {
  id: string;
  title: string;
  icon: string;
  type: 'budget' | 'guide' | 'calculator' | 'video' | 'portfolio';
  isSaved: boolean;
  isInTrash: boolean;
}

export interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export interface AppState {
  user: User | null;
  language: Language;
  isAuthenticated: boolean;
  activeTab: 'dashboard' | 'library' | 'trash';
}
