import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '$lib/supabaseClient';
import { browser } from '$app/environment';

class AuthStore {
    session = $state<Session | null>(null);
    user = $state<User | null>(null);
    loading = $state(true);

    subscription: { unsubscribe: () => void } | null = null;

    constructor() {
        if (browser) {
            this.initialize();
        }
    }

    async initialize() {
        // Listen to auth state changes
        const { data } = supabase.auth.onAuthStateChange((_, session) => {
            this.session = session;
            this.user = session?.user ?? null;
            this.loading = false;
        });
        this.subscription = data.subscription;

        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        this.session = session;
        this.user = session?.user ?? null;
        this.loading = false;
    }

    destroy() {
        this.subscription?.unsubscribe();
    }

    async signOut() {
        await supabase.auth.signOut();
    }
}

export const auth = new AuthStore();
