import { supabase } from '$lib/supabaseClient';
import { format, subMonths } from 'date-fns';
import type { PageLoad } from './$types';
import type { Budget, Transaction } from '$lib/constants';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
    const { session } = await parent();
    if (!session?.user) throw redirect(303, '/auth');

    const userId = session.user.id;
    const twelveMonthsAgo = format(subMonths(new Date(), 12), 'yyyy-MM-dd');

    // Dashboard requires:
    // 1. Transactions
    // 2. Budgets
    const [txsRes, budgetsRes] = await Promise.all([
        supabase
            .from('transactions')
            .select('*')
            .gte('date', twelveMonthsAgo)
            .order('date', { ascending: false })
            .order('created_at', { ascending: false }),

        supabase
            .from('budgets')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100),
    ]);

    return {
        preloaded: {
            transactions: (txsRes.data || []) as Transaction[],
            budgets: (budgetsRes.data || []) as Budget[]
        }
    };
};
