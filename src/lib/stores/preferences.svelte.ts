import { browser } from '$app/environment';
import type { UserPreferences } from '$lib/constants';
import { auth } from '$lib/stores/auth.svelte';
import { supabase } from '$lib/supabaseClient';

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'system',
    accentColor: '#0f172a',
    density: 'comfortable',
    currency: 'USD',
    firstDayOfWeek: 1,
    sidebarCollapsed: false,
    showAnimations: true,
    appLockEnabled: false,
    appLockPin: '',
    biometricsEnabled: false,
};

class PreferencesStore {
    state = $state<UserPreferences>(browser
        ? (() => {
            try {
                const saved = localStorage.getItem('user-preferences');
                return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
            } catch { return DEFAULT_PREFERENCES; }
        })()
        : DEFAULT_PREFERENCES);

    get theme() { return this.state.theme; }
    get accentColor() { return this.state.accentColor; }
    get density() { return this.state.density; }
    get currency() { return this.state.currency; }
    get firstDayOfWeek() { return this.state.firstDayOfWeek; }
    get sidebarCollapsed() { return this.state.sidebarCollapsed; }
    get showAnimations() { return this.state.showAnimations; }
    get appLockEnabled() { return this.state.appLockEnabled; }
    get appLockPin() { return this.state.appLockPin; }
    get biometricsEnabled() { return this.state.biometricsEnabled; }

    applyToDOM(prefs: UserPreferences) {
        if (!browser) return;
        const root = document.documentElement;

        // Theme
        const resolved = prefs.theme === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : prefs.theme;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);

        // Accent Color
        root.style.setProperty('--primary-hex', prefs.accentColor);
        let hex = prefs.accentColor.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            root.style.setProperty('--primary-foreground', yiq >= 128 ? '222 47% 11%' : '210 40% 98%');
        }

        // Density
        prefs.density === 'compact' ? root.classList.add('compact') : root.classList.remove('compact');

        // Animations
        prefs.showAnimations ? root.classList.remove('no-animations') : root.classList.add('no-animations');

        localStorage.setItem('user-preferences', JSON.stringify(prefs));
    }

    async syncToDatabase(prefs: UserPreferences) {
        if (!browser) return;
        const user = auth.user;
        if (!user) return;
        supabase.from('profiles').update({ preferences: prefs }).eq('user_id', user.id).then();
    }

    setPreferences(prefs: UserPreferences, sync = true) {
        this.state = prefs;
        this.applyToDOM(prefs);
        if (sync) this.syncToDatabase(prefs);
    }

    mergePreferences(patch: Partial<UserPreferences>, sync = true) {
        const next = { ...this.state, ...patch };
        this.state = next;
        this.applyToDOM(next);
        if (sync) this.syncToDatabase(next);
    }

    initApply() {
        this.applyToDOM(this.state);
    }
}

export const preferencesStore = new PreferencesStore();
