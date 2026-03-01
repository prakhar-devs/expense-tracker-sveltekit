import { format, addDays, addWeeks, addMonths, addYears, parseISO, isBefore, isEqual } from 'date-fns';
import { supabase } from '$lib/supabaseClient';
import type { RecurringFrequency } from '$lib/constants';

function getNextRunDate(current: string, frequency: RecurringFrequency): string {
    const date = parseISO(current);
    switch (frequency) {
        case 'daily': return format(addDays(date, 1), 'yyyy-MM-dd');
        case 'weekly': return format(addWeeks(date, 1), 'yyyy-MM-dd');
        case 'monthly': return format(addMonths(date, 1), 'yyyy-MM-dd');
        case 'yearly': return format(addYears(date, 1), 'yyyy-MM-dd');
    }
}

export async function runRecurringEngine(rules: any[], invalidateTransactions: () => void) {
    if (!rules || rules.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eligible = rules.filter((r) => {
        if (!r.is_active) return false;
        const nextRun = parseISO(r.next_run_date);
        nextRun.setHours(0, 0, 0, 0);
        return isBefore(nextRun, today) || isEqual(nextRun, today);
    });

    if (eligible.length === 0) return;

    for (const rule of eligible) {
        const { data: existing } = await supabase
            .from('transactions')
            .select('id')
            .eq('recurring_id', rule.id)
            .eq('date', format(today, 'yyyy-MM-dd'))
            .limit(1);

        if (existing && existing.length > 0) continue;

        const { error: txError } = await supabase.from('transactions').insert({
            type: rule.type,
            amount: rule.amount,
            category: rule.category,
            note: rule.note,
            date: format(today, 'yyyy-MM-dd'),
            user_id: rule.user_id,
            recurring_id: rule.id,
        });

        if (txError) { console.error('Recurring engine: tx error', txError); continue; }

        const newOccurrences = rule.occurrences_created + 1;
        const newNextRun = getNextRunDate(rule.next_run_date, rule.frequency as RecurringFrequency);

        let isActive = rule.is_active;
        if (rule.end_date && !isBefore(today, parseISO(rule.end_date))) isActive = false;
        if (rule.max_occurrences && newOccurrences >= rule.max_occurrences) isActive = false;

        await supabase.from('recurring_transactions').update({
            occurrences_created: newOccurrences,
            next_run_date: newNextRun,
            is_active: isActive,
            updated_at: new Date().toISOString(),
        }).eq('id', rule.id);
    }

    invalidateTransactions();
}
