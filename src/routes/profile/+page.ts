import { supabase } from '$lib/supabaseClient';
import { format, subMonths } from 'date-fns';
import type { PageLoad } from './$types';
import type { Category, Profile, Transaction } from '$lib/constants';

export const load: PageLoad = async ({ parent }) => {
    const { session } = await parent();
    if (!session?.user) return { preloaded: null };

    const userId = session.user.id;
    const twelveMonthsAgo = format(subMonths(new Date(), 12), 'yyyy-MM-dd');

    // Profile loads: Options profile, Recent txs, and categories list
    const [profileRes, txsRes, categoriesRes] = await Promise.all([
        supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single(),

        supabase
            .from('transactions')
            .select('*')
            .gte('date', twelveMonthsAgo)
            .order('date', { ascending: false })
            .order('created_at', { ascending: false }),

        supabase
            .from('categories')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(100)
    ]);

    return {
        preloaded: {
            profile: (profileRes.data || null) as Profile | null,
            transactions: (txsRes.data || []) as Transaction[],
            categories: (categoriesRes.data || []) as Category[]
        }
    };
};
