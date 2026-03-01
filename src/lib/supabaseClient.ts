// Supabase client for SvelteKit - uses PUBLIC_ env vars (exposed to browser)
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public';

import { browser } from '$app/environment';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    ...(browser && {
        auth: {
            storage: localStorage,
            persistSession: true,
            autoRefreshToken: true,
        }
    })
});
