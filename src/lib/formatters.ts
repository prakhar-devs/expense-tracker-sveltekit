import { UserPreferences } from "@/lib/constants";

export const formatCurrency = (amount: number, preferences: UserPreferences) => {
    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: preferences.currency,
    }).format(amount);
};

export const formatNumber = (amount: number) => {
    return new Intl.NumberFormat(undefined).format(amount);
};

export const formatDate = (date: string | Date) => {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
    }).format(new Date(date));
};
