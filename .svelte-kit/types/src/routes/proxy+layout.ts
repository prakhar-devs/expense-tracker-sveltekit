// @ts-nocheck
import { supabase } from '$lib/supabaseClient';
import type { LayoutLoad } from './$types';

export const ssr = false; // Keep SSR disabled to access localStorage safely for the session

export const load = async () => {
    // Just fetch auth at the layout level so it cascades everywhere.
    const { data: { session } } = await supabase.auth.getSession();

    return {
        session
    };
};
;null as any as LayoutLoad;