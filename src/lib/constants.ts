export const EXPENSE_CATEGORIES = [
  "Shopping", "Food", "Travel", "Gaming", "Bills", "Health", "Other"
] as const;

export const INCOME_CATEGORIES = [
  "Salary", "Freelancing", "Business", "Investment", "Gift", "Other"
] as const;

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  recurring_id?: string | null;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  created_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  density: 'compact' | 'comfortable';
  currency: string;
  firstDayOfWeek: number;
  sidebarCollapsed: boolean;
  showAnimations: boolean;
  appLockEnabled: boolean;
  appLockPin: string;
  biometricsEnabled: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  preferences: UserPreferences | null;
  created_at: string;
  updated_at: string;
}

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurringEndCondition = 'never' | 'date' | 'occurrences';
export type BudgetPeriod = 'weekly' | 'monthly' | 'custom';

export interface RecurringTransaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string | null;
  frequency: RecurringFrequency;
  start_date: string;
  end_date: string | null;
  max_occurrences: number | null;
  occurrences_created: number;
  next_run_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  period_type: BudgetPeriod;
  start_date: string;
  end_date: string;
  budget_amount: number;
  alert_threshold: number;
  is_active: boolean;
  created_at: string;
}

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
}
