-- ============================================================
-- Migration: Add recurring_transactions and budgets tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Recurring Transactions Table
CREATE TABLE IF NOT EXISTS public.recurring_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric(12, 2) NOT NULL,
  category text NOT NULL,
  note text,
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  start_date date NOT NULL,
  end_date date,
  max_occurrences integer,
  occurrences_created integer NOT NULL DEFAULT 0,
  next_run_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own recurring transactions"
  ON public.recurring_transactions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. Budgets Table
CREATE TABLE IF NOT EXISTS public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  period_type text NOT NULL CHECK (period_type IN ('weekly', 'monthly', 'custom')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  budget_amount numeric(12, 2) NOT NULL,
  alert_threshold integer NOT NULL DEFAULT 80 CHECK (alert_threshold BETWEEN 0 AND 100),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own budgets"
  ON public.budgets
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Add recurring_id reference column to transactions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS recurring_id uuid REFERENCES public.recurring_transactions(id) ON DELETE SET NULL;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
