// @ts-nocheck
import { supabase } from '$lib/supabaseClient';
import { format, subMonths } from 'date-fns';
import type { PageLoad } from './$types';
import type { Budget, RecurringTransaction, Transaction } from '$lib/constants';

export const load = async ({ parent }: Parameters<PageLoad>[0]) => {
    const { session } = await parent();
    if (!session?.user) return { preloaded: null };

    const twelveMonthsAgo = format(subMonths(new Date(), 12), 'yyyy-MM-dd');

    // Notifications page loads: Budgets, Transactions, Recurring 
    const [budgetsRes, txsRes, recurringRes] = await Promise.all([
        supabase
            .from('budgets')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100),

        supabase
            .from('transactions')
            .select('*')
            .gte('date', twelveMonthsAgo)
            .order('date', { ascending: false })
            .order('created_at', { ascending: false }),

        supabase
            .from('recurring_transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200)
    ]);

    return {
        preloaded: {
            budgets: (budgetsRes.data || []) as Budget[],
            transactions: (txsRes.data || []) as Transaction[],
            recurring: (recurringRes.data || []) as RecurringTransaction[]
        }
    };
};
