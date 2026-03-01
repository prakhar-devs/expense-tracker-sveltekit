import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { supabase } from '$lib/supabaseClient';
import type { Transaction, Category, Profile, RecurringTransaction, Budget, BudgetStatus } from '$lib/constants';
import { auth } from '$lib/stores/auth';
import { format, subMonths } from 'date-fns';
import { derived } from 'svelte/store';
import { queueOfflineMutation } from '$lib/syncEngine';

export const PAGE_SIZE = 20;

import { get } from 'svelte/store';

function getUserId() {
    return get(auth).user?.id;
}

// ─── Transactions ───────────────────────────────────────────────────

export function createTransactionsQuery(getUserId: () => string | undefined, initialData?: Transaction[]) {
    return createQuery(() => {
        const userId = getUserId();
        return {
            queryKey: ['transactions', userId],
            queryFn: async () => {
                const since = format(subMonths(new Date(), 12), 'yyyy-MM-dd');
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .gte('date', since)
                    .order('date', { ascending: false })
                    .order('created_at', { ascending: false });
                if (error) throw error;
                return data as Transaction[];
            },
            enabled: !!userId,
            initialData,
        }
    });
}

export interface TransactionFilters {
    type?: 'income' | 'expense' | 'all';
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

export function createTransactionsPagedQuery(
    getUserId: () => string | undefined,
    getPage: () => number,
    getFilters: () => TransactionFilters = () => ({}),
    getInitialData?: () => PagedResult<Transaction> | undefined
) {
    return createQuery(() => {
        const userId = getUserId();
        const page = getPage();
        const filters = getFilters();
        const initialData = getInitialData?.();
        return {
            queryKey: ['transactions-paged', userId, page, filters],
            queryFn: async (): Promise<PagedResult<Transaction>> => {
                if (!userId) {
                    return { data: [], total: 0, page: 1, totalPages: 1 };
                }
                const from = (page - 1) * PAGE_SIZE;
                const to = from + PAGE_SIZE - 1;

                let countQ = supabase.from('transactions').select('id', { count: 'exact', head: true });
                let dataQ = supabase
                    .from('transactions')
                    .select('*')
                    .order('date', { ascending: false })
                    .order('created_at', { ascending: false })
                    .range(from, to);

                if (filters.type && filters.type !== 'all') {
                    countQ = countQ.eq('type', filters.type);
                    dataQ = dataQ.eq('type', filters.type);
                }
                if (filters.category && filters.category !== 'all') {
                    countQ = countQ.eq('category', filters.category);
                    dataQ = dataQ.eq('category', filters.category);
                }
                if (filters.dateFrom) { countQ = countQ.gte('date', filters.dateFrom); dataQ = dataQ.gte('date', filters.dateFrom); }
                if (filters.dateTo) { countQ = countQ.lte('date', filters.dateTo); dataQ = dataQ.lte('date', filters.dateTo); }
                if (filters.search) {
                    const term = `%${filters.search}%`;
                    countQ = countQ.or(`category.ilike.${term},note.ilike.${term}`);
                    dataQ = dataQ.or(`category.ilike.${term},note.ilike.${term}`);
                }

                const [{ count, error: cErr }, { data, error: dErr }] = await Promise.all([countQ, dataQ]);
                if (cErr) throw cErr;
                if (dErr) throw dErr;
                const total = count ?? 0;
                return { data: (data ?? []) as Transaction[], total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
            },
            enabled: !!userId,
            initialData,
            placeholderData: (prev) => prev,
        };
    });
}

export function createAddTransactionMutation() {
    const qc = useQueryClient();
    const userId = getUserId();
    return createMutation(() => ({
        onMutate: async (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
            await qc.cancelQueries({ queryKey: ['transactions', userId] });
            await qc.cancelQueries({ queryKey: ['transactions-paged', userId] });
            const previousTxs = qc.getQueryData(['transactions', userId]);

            const tempId = crypto.randomUUID();
            const optimisticTx = {
                ...tx,
                id: tempId,
                user_id: userId!,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            qc.setQueryData(['transactions', userId], (old: any) => old ? [optimisticTx, ...old] : [optimisticTx]);
            return { previousTxs, tempId };
        },
        mutationFn: async (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                await queueOfflineMutation('add_transaction', { ...tx, user_id: userId! });
                return; // Resolve immediately for offline
            }
            const { data, error } = await supabase.from('transactions').insert({ ...tx, user_id: userId! }).select().single();
            if (error) throw error;
            return data;
        },
        onError: (err, newTx, context: any) => {
            if (context?.previousTxs) {
                qc.setQueryData(['transactions', userId], context.previousTxs);
            }
        },
        onSettled: () => {
            if (typeof navigator === 'undefined' || navigator.onLine) {
                qc.invalidateQueries({ queryKey: ['transactions'] });
                qc.invalidateQueries({ queryKey: ['transactions-paged'] });
                qc.invalidateQueries({ queryKey: ['budgets'] });
            }
        },
    }));
}

export function createUpdateTransactionMutation() {
    const qc = useQueryClient();
    return createMutation(() => ({
        mutationFn: async ({ id, ...updates }: Partial<Transaction> & { id: string }) => {
            const { data, error } = await supabase.from('transactions').update(updates).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['transactions'] });
            qc.invalidateQueries({ queryKey: ['transactions-paged'] });
            qc.invalidateQueries({ queryKey: ['budgets'] });
        },
    }));
}

export function createDeleteTransactionMutation() {
    const qc = useQueryClient();
    const userId = getUserId();
    return createMutation(() => ({
        onMutate: async (id: string) => {
            await qc.cancelQueries({ queryKey: ['transactions', userId] });
            await qc.cancelQueries({ queryKey: ['transactions-paged', userId] });
            const previousTxs = qc.getQueryData(['transactions', userId]);

            qc.setQueryData(['transactions', userId], (old: any) => old ? old.filter((t: any) => t.id !== id) : []);
            return { previousTxs };
        },
        mutationFn: async (id: string) => {
            if (typeof navigator !== 'undefined' && !navigator.onLine) {
                await queueOfflineMutation('delete_transaction', id);
                return;
            }
            const { error } = await supabase.from('transactions').delete().eq('id', id);
            if (error) throw error;
        },
        onError: (err, newTx, context: any) => {
            if (context?.previousTxs) {
                qc.setQueryData(['transactions', userId], context.previousTxs);
            }
        },
        onSettled: () => {
            if (typeof navigator === 'undefined' || navigator.onLine) {
                qc.invalidateQueries({ queryKey: ['transactions'] });
                qc.invalidateQueries({ queryKey: ['transactions-paged'] });
                qc.invalidateQueries({ queryKey: ['budgets'] });
            }
        },
    }));
}

// ─── Categories ──────────────────────────────────────────────────────

export function createCategoriesQuery(getUserId: () => string | undefined, initialData?: Category[]) {
    return createQuery(() => {
        const userId = getUserId();
        return {
            queryKey: ['categories', userId],
            queryFn: async () => {
                const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: true }).limit(100);
                if (error) throw error;
                return data as Category[];
            },
            enabled: !!userId,
        };
    });
}

export function createAddCategoryMutation() {
    const qc = useQueryClient();
    const userId = getUserId();
    return createMutation(() => ({
        mutationFn: async (cat: { name: string; type: 'income' | 'expense' }) => {
            const { data, error } = await supabase.from('categories').insert({ ...cat, user_id: userId! }).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
    }));
}

export function createDeleteCategoryMutation() {
    const qc = useQueryClient();
    return createMutation(() => ({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
    }));
}

// ─── Profile ─────────────────────────────────────────────────────────

export function createProfileQuery(getUserId: () => string | undefined, initialData?: Profile | null) {
    return createQuery(() => {
        const userId = getUserId();
        return {
            queryKey: ['profile', userId],
            queryFn: async () => {
                const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId!).single();
                if (error) throw error;
                return data as Profile;
            },
            enabled: !!userId,
        };
    });
}

export function createUpdateProfileMutation() {
    const qc = useQueryClient();
    const userId = getUserId();
    return createMutation(() => ({
        mutationFn: async (updates: { full_name?: string; preferences?: any }) => {
            const { data, error } = await supabase.from('profiles').update(updates).eq('user_id', userId!).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
    }));
}

// ─── Recurring Transactions ──────────────────────────────────────────

export function createRecurringTransactionsQuery(getUserId: () => string | undefined, initialData?: RecurringTransaction[]) {
    return createQuery(() => {
        const userId = getUserId();
        return {
            queryKey: ['recurring', userId],
            queryFn: async () => {
                const { data, error } = await supabase.from('recurring_transactions').select('*').order('created_at', { ascending: false }).limit(200);
                if (error) throw error;
                return data as RecurringTransaction[];
            },
            enabled: !!userId,
        };
    });
}

export function createAddRecurringMutation() {
    const qc = useQueryClient();
    const userId = getUserId();
    return createMutation(() => ({
        mutationFn: async (rec: Omit<RecurringTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'occurrences_created'>) => {
            const { data, error } = await supabase.from('recurring_transactions').insert({ ...rec, user_id: userId!, occurrences_created: 0 }).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
    }));
}

export function createUpdateRecurringMutation() {
    const qc = useQueryClient();
    return createMutation(() => ({
        mutationFn: async ({ id, ...updates }: Partial<RecurringTransaction> & { id: string }) => {
            const { data, error } = await supabase.from('recurring_transactions').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
    }));
}

export function createDeleteRecurringMutation() {
    const qc = useQueryClient();
    return createMutation(() => ({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('recurring_transactions').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['recurring'] }),
    }));
}

// ─── Budgets ─────────────────────────────────────────────────────────

export function createBudgetsQuery(getUserId: () => string | undefined, initialData?: Budget[]) {
    return createQuery(() => {
        const userId = getUserId();
        return {
            queryKey: ['budgets', userId],
            queryFn: async () => {
                const { data, error } = await supabase.from('budgets').select('*').order('created_at', { ascending: false }).limit(100);
                if (error) throw error;
                return data as Budget[];
            },
            enabled: !!userId,
        };
    });
}

export function createAddBudgetMutation() {
    const qc = useQueryClient();
    const userId = getUserId();
    return createMutation(() => ({
        mutationFn: async (budget: Omit<Budget, 'id' | 'user_id' | 'created_at'>) => {
            const { data, error } = await supabase.from('budgets').insert({ ...budget, user_id: userId! }).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
    }));
}

export function createUpdateBudgetMutation() {
    const qc = useQueryClient();
    return createMutation(() => ({
        mutationFn: async ({ id, ...updates }: Partial<Budget> & { id: string }) => {
            const { data, error } = await supabase.from('budgets').update(updates).eq('id', id).select().single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
    }));
}

export function createDeleteBudgetMutation() {
    const qc = useQueryClient();
    return createMutation(() => ({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('budgets').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
    }));
}
