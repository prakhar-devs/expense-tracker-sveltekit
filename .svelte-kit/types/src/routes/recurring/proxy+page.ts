// @ts-nocheck
import { supabase } from '$lib/supabaseClient';
import type { PageLoad } from './$types';
import type { RecurringTransaction } from '$lib/constants';

export const load = async ({ parent }: Parameters<PageLoad>[0]) => {
    const { session } = await parent();
    if (!session?.user) return { preloaded: null };

    // Recurring page specifically loads:
    // 1. Recurring Rules
    const { data: recurringData } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(200);

    return {
        preloaded: {
            recurring: (recurringData || []) as RecurringTransaction[]
        }
    };
};
