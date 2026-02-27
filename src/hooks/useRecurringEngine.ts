import { useEffect, useRef } from "react";
import { format, addDays, addWeeks, addMonths, addYears, parseISO, isToday, isBefore, isEqual } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useRecurringTransactions } from "./useData";
import { useQueryClient } from "@tanstack/react-query";
import { RecurringFrequency } from "@/lib/constants";

function getNextRunDate(current: string, frequency: RecurringFrequency): string {
    const date = parseISO(current);
    switch (frequency) {
        case "daily": return format(addDays(date, 1), "yyyy-MM-dd");
        case "weekly": return format(addWeeks(date, 1), "yyyy-MM-dd");
        case "monthly": return format(addMonths(date, 1), "yyyy-MM-dd");
        case "yearly": return format(addYears(date, 1), "yyyy-MM-dd");
    }
}

export const useRecurringEngine = () => {
    const { data: recurringRules } = useRecurringTransactions();
    const qc = useQueryClient();
    const processedRef = useRef(false);

    useEffect(() => {
        if (!recurringRules || processedRef.current) return;
        processedRef.current = true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eligible = recurringRules.filter((r) => {
            if (!r.is_active) return false;
            const nextRun = parseISO(r.next_run_date);
            nextRun.setHours(0, 0, 0, 0);
            return isBefore(nextRun, today) || isEqual(nextRun, today);
        });

        if (eligible.length === 0) return;

        (async () => {
            for (const rule of eligible) {
                // Idempotency check: has a transaction already been created for this rule today?
                const { data: existing } = await supabase
                    .from("transactions")
                    .select("id")
                    .eq("recurring_id", rule.id)
                    .eq("date", format(today, "yyyy-MM-dd"))
                    .limit(1);

                if (existing && existing.length > 0) continue;

                // Create the transaction
                const { error: txError } = await supabase.from("transactions").insert({
                    type: rule.type,
                    amount: rule.amount,
                    category: rule.category,
                    note: rule.note,
                    date: format(today, "yyyy-MM-dd"),
                    user_id: rule.user_id,
                    recurring_id: rule.id,
                });

                if (txError) { console.error("Recurring engine: tx error", txError); continue; }

                const newOccurrences = rule.occurrences_created + 1;
                const newNextRun = getNextRunDate(rule.next_run_date, rule.frequency as RecurringFrequency);

                // Check end conditions
                let isActive = rule.is_active;
                if (rule.end_date && !isBefore(today, parseISO(rule.end_date))) isActive = false;
                if (rule.max_occurrences && newOccurrences >= rule.max_occurrences) isActive = false;

                await supabase
                    .from("recurring_transactions")
                    .update({
                        occurrences_created: newOccurrences,
                        next_run_date: newNextRun,
                        is_active: isActive,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", rule.id);
            }

            // Refresh queries
            qc.invalidateQueries({ queryKey: ["transactions"] });
            qc.invalidateQueries({ queryKey: ["recurring"] });
        })();
    }, [recurringRules, qc]);
};
