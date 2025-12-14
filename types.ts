export type Language = 'tr' | 'en' | 'de';

export interface User {
  name: string;
  email: string;
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
  type: 'savings' | 'investment' | 'debt';
}

export interface Template {
  id: string;
  title: string;
  icon: string;
  type: 'budget' | 'guide' | 'calculator' | 'video' | 'portfolio';
  isSaved: boolean;
  isInTrash: boolean;
}

export interface AppState {
  user: User | null;
  language: Language;
  isAuthenticated: boolean;
  activeTab: 'dashboard' | 'library' | 'trash';
}