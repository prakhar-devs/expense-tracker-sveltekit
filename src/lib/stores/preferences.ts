import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import type { UserPreferences } from '$lib/constants';

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

function createPreferencesStore() {
    const initial: UserPreferences = browser
        ? (() => {
            try {
                const saved = localStorage.getItem('user-preferences');
                return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
            } catch { return DEFAULT_PREFERENCES; }
        })()
        : DEFAULT_PREFERENCES;

    const { subscribe, set, update } = writable<UserPreferences>(initial);

    function applyToDOM(prefs: UserPreferences) {
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

    function setPreferences(prefs: UserPreferences) {
        set(prefs);
        applyToDOM(prefs);
    }

    function mergePreferences(patch: Partial<UserPreferences>) {
        update(current => {
            const next = { ...current, ...patch };
            applyToDOM(next);
            return next;
        });
    }

    function initApply() {
        applyToDOM(get({ subscribe }));
    }

    return { subscribe, setPreferences, mergePreferences, initApply };
}

export const preferencesStore = createPreferencesStore();
