import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useData';
import { UserPreferences } from '@/lib/constants';

interface PreferencesContextType {
    preferences: UserPreferences;
    updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
    isLoading: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'system',
    accentColor: '#0f172a',
    density: 'comfortable',
    currency: 'USD',
    firstDayOfWeek: 1,
    sidebarCollapsed: false,
    showAnimations: true,
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const { data: profile, isLoading: isProfileLoading } = useProfile();
    const updateProfile = useUpdateProfile();
    const [preferences, setPreferences] = useState<UserPreferences>(() => {
        const saved = localStorage.getItem('user-preferences');
        return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    });

    // Sync with Profile data
    useEffect(() => {
        if (profile?.preferences) {
            setPreferences(profile.preferences);
            localStorage.setItem('user-preferences', JSON.stringify(profile.preferences));
        }
    }, [profile]);

    // Apply theme and other settings
    useEffect(() => {
        const root = window.document.documentElement;

        // Theme
        const resolvedTheme = preferences.theme === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : preferences.theme;

        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);

        // Accent Color
        root.style.setProperty('--primary-hex', preferences.accentColor);

        // Calculate contrast for foreground text so buttons are always readable
        let hex = preferences.accentColor.replace('#', '');
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            // Return either near-white or near-black depending on background brightness
            root.style.setProperty('--primary-foreground', yiq >= 128 ? '222 47% 11%' : '210 40% 98%');
        }

        // Density
        if (preferences.density === 'compact') {
            root.classList.add('compact');
        } else {
            root.classList.remove('compact');
        }

        // Animations
        if (!preferences.showAnimations) {
            root.classList.add('no-animations');
        } else {
            root.classList.remove('no-animations');
        }

        localStorage.setItem('user-preferences', JSON.stringify(preferences));
    }, [preferences]);

    const updatePreferences = async (updates: Partial<UserPreferences>) => {
        const newPrefs = { ...preferences, ...updates };
        setPreferences(newPrefs);

        if (user) {
            try {
                await updateProfile.mutateAsync({ preferences: newPrefs as any });
            } catch (error) {
                console.error('Failed to sync preferences to Supabase:', error);
            }
        }
    };

    return (
        <PreferencesContext.Provider value={{ preferences, updatePreferences, isLoading: isProfileLoading }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => {
    const context = useContext(PreferencesContext);
    if (context === undefined) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
};
