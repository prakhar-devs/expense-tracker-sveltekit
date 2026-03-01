import { writable, derived } from 'svelte/store';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '$lib/supabaseClient';
import { browser } from '$app/environment';

interface AuthState {
    session: Session | null;
    user: User | null;
    loading: boolean;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        session: null,
        user: null,
        loading: true,
    });

    let subscription: { unsubscribe: () => void } | null = null;

    async function initialize() {
        if (!browser) return;

        // Listen to auth state changes
        const { data } = supabase.auth.onAuthStateChange((_, session) => {
            set({ session, user: session?.user ?? null, loading: false });
        });
        subscription = data.subscription;

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        set({ session, user: session?.user ?? null, loading: false });
    }

    function destroy() {
        subscription?.unsubscribe();
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    return { subscribe, initialize, destroy, signOut };
}

export const auth = createAuthStore();
