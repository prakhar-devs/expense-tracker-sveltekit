import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Transaction, Category, Profile, RecurringTransaction, Budget, BudgetStatus } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import { format, subMonths } from "date-fns";

export const PAGE_SIZE = 20;

/** Analytics hook — fetches last 12 months for charts, dashboard stats, budget calculations. */

export const useTransactions = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      // Limit to last 12 months — enough for all analytics/charts/budgets
      const since = format(subMonths(new Date(), 12), "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .gte("date", since)
        .order("date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });
};

export interface TransactionFilters {
  type?: "income" | "expense" | "all";
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

/** Paginated hook — server-side filters + range for the Transactions list page. */
export const useTransactionsPaged = (
  page: number,
  filters: TransactionFilters = {}
) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["transactions-paged", user?.id, page, filters],
    queryFn: async (): Promise<PagedResult<Transaction>> => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Build count query
      let countQ = supabase
        .from("transactions")
        .select("id", { count: "exact", head: true });

      // Build data query
      let dataQ = supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      // Apply filters to both queries
      if (filters.type && filters.type !== "all") {
        countQ = countQ.eq("type", filters.type);
        dataQ = dataQ.eq("type", filters.type);
      }
      if (filters.category && filters.category !== "all") {
        countQ = countQ.eq("category", filters.category);
        dataQ = dataQ.eq("category", filters.category);
      }
      if (filters.dateFrom) {
        countQ = countQ.gte("date", filters.dateFrom);
        dataQ = dataQ.gte("date", filters.dateFrom);
      }
      if (filters.dateTo) {
        countQ = countQ.lte("date", filters.dateTo);
        dataQ = dataQ.lte("date", filters.dateTo);
      }
      // Free-text search (category or note, case-insensitive)
      if (filters.search) {
        const term = `%${filters.search}%`;
        countQ = countQ.or(`category.ilike.${term},note.ilike.${term}`);
        dataQ = dataQ.or(`category.ilike.${term},note.ilike.${term}`);
      }

      const [{ count, error: cErr }, { data, error: dErr }] = await Promise.all([countQ, dataQ]);
      if (cErr) throw cErr;
      if (dErr) throw dErr;

      const total = count ?? 0;
      return {
        data: (data ?? []) as Transaction[],
        total,
        page,
        totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      };
    },
    enabled: !!user,
    placeholderData: (prev) => prev, // keep showing old data while new page loads
  });
};

export const useAddTransaction = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (tx: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert({ ...tx, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
};

export const useUpdateTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
      const { data, error } = await supabase
        .from("transactions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
};

export const useDeleteTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
};

export const useCategories = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["categories", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100); // categories are small by nature
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user,
  });
};

export const useAddCategory = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (cat: { name: string; type: "income" | "expense" }) => {
      const { data, error } = await supabase
        .from("categories")
        .insert({ ...cat, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data as any as Profile;
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (updates: { full_name?: string; preferences?: any }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user!.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
};

// ─── Recurring Transactions ─────────────────────────────────────────

export const useRecurringTransactions = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["recurring", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recurring_transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200); // reasonable cap for recurring rules
      if (error) throw error;
      return data as RecurringTransaction[];
    },
    enabled: !!user,
  });
};

export const useAddRecurring = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (rec: Omit<RecurringTransaction, "id" | "user_id" | "created_at" | "updated_at" | "occurrences_created">) => {
      const { data, error } = await supabase
        .from("recurring_transactions")
        .insert({ ...rec, user_id: user!.id, occurrences_created: 0 })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });
};

export const useUpdateRecurring = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<RecurringTransaction> & { id: string }) => {
      const { data, error } = await supabase
        .from("recurring_transactions")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });
};

export const useDeleteRecurring = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("recurring_transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring"] }),
  });
};

// ─── Budgets ────────────────────────────────────────────────────────

export const useBudgets = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100); // budgets are small by nature
      if (error) throw error;
      return data as Budget[];
    },
    enabled: !!user,
  });
};

export const useAddBudget = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (budget: Omit<Budget, "id" | "user_id" | "created_at">) => {
      const { data, error } = await supabase
        .from("budgets")
        .insert({ ...budget, user_id: user!.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

export const useUpdateBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Budget> & { id: string }) => {
      const { data, error } = await supabase
        .from("budgets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

export const useDeleteBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

export const useBudgetStatuses = (): BudgetStatus[] => {
  const { data: budgets } = useBudgets();
  const { data: transactions } = useTransactions();

  return useMemo(() => {
    if (!budgets || !transactions) return [];
    return budgets
      .filter((b) => b.is_active)
      .map((budget) => {
        const start = new Date(budget.start_date);
        const end = new Date(budget.end_date);
        const spent = transactions
          .filter((t) => {
            const d = new Date(t.date);
            return (
              t.type === "expense" &&
              t.category === budget.category &&
              d >= start &&
              d <= end
            );
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const percentage = budget.budget_amount > 0 ? (spent / budget.budget_amount) * 100 : 0;
        const remaining = budget.budget_amount - spent;
        const status: BudgetStatus["status"] =
          percentage >= 100 ? "danger" : percentage >= budget.alert_threshold ? "warning" : "safe";

        return { budget, spent, remaining, percentage, status };
      });
  }, [budgets, transactions]);
};
