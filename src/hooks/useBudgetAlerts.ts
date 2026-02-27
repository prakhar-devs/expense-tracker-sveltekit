import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useBudgetStatuses } from "./useData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { formatCurrency } from "@/lib/formatters";

const ALERTED_KEY = "spendwise_budget_alerts";

export const useBudgetAlerts = () => {
    const statuses = useBudgetStatuses();
    const { preferences } = usePreferences();
    const alertedRef = useRef<Set<string>>(new Set());

    // Load already-alerted budgets from localStorage on mount
    useEffect(() => {
        const today = new Date().toDateString();
        const stored = localStorage.getItem(ALERTED_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.date === today) {
                alertedRef.current = new Set(parsed.ids);
            } else {
                localStorage.removeItem(ALERTED_KEY);
            }
        }
    }, []);

    useEffect(() => {
        if (!statuses.length) return;

        statuses.forEach((s) => {
            const key = `${s.budget.id}:${s.status}`;
            if (alertedRef.current.has(key)) return;

            if (s.status === "warning") {
                toast.warning(`⚠️ Budget Alert: ${s.budget.category}`, {
                    description: `You've used ${s.percentage.toFixed(0)}% of your ${formatCurrency(s.budget.budget_amount, preferences)} budget. ${formatCurrency(s.remaining, preferences)} remaining.`,
                    duration: 6000,
                });
                alertedRef.current.add(key);
            } else if (s.status === "danger") {
                toast.error(`🚨 Budget Exceeded: ${s.budget.category}`, {
                    description: `You've ${s.remaining < 0 ? `overspent by ${formatCurrency(-s.remaining, preferences)}` : "hit your limit"}! Budget: ${formatCurrency(s.budget.budget_amount, preferences)}.`,
                    duration: 8000,
                });
                alertedRef.current.add(key);
            }
        });

        // Persist to localStorage
        const today = new Date().toDateString();
        localStorage.setItem(ALERTED_KEY, JSON.stringify({ date: today, ids: [...alertedRef.current] }));
    }, [statuses, preferences]);
};
