import { supabase } from '$lib/supabaseClient';
import { format, subMonths } from 'date-fns';
import type { PageLoad } from './$types';
import type { Budget, Transaction } from '$lib/constants';

export const load: PageLoad = async ({ parent }) => {
    const { session } = await parent();
    if (!session?.user) return { preloaded: null };

    const twelveMonthsAgo = format(subMonths(new Date(), 12), 'yyyy-MM-dd');

    const [budgetsRes, txsRes] = await Promise.all([
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
            .order('created_at', { ascending: false })
    ]);

    return {
        preloaded: {
            budgets: (budgetsRes.data || []) as Budget[],
            transactions: (txsRes.data || []) as Transaction[]
        }
    };
};
