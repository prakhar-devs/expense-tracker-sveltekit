<script lang="ts">
    import AppLayout from "$lib/components/AppLayout.svelte";
    import * as Card from "$lib/components/ui/card";
    import {
        Bell,
        AlertTriangle,
        AlertCircle,
        Calendar as CalendarIcon,
        ArrowRight,
        Trash2,
        CheckCircle2,
    } from "lucide-svelte";
    import {
        createBudgetsQuery,
        createTransactionsQuery,
        createRecurringTransactionsQuery,
    } from "$lib/data";
    import { auth } from "$lib/stores/auth";
    import {
        format,
        isAfter,
        isBefore,
        addDays,
        parseISO,
        startOfDay,
        endOfDay,
    } from "date-fns";
    import { formatCurrency } from "$lib/formatters";
    import { preferencesStore } from "$lib/stores/preferences";
    import { cn } from "$lib/utils";

    let { data } = $props();

    const budgetsQuery = createBudgetsQuery(
        () => $auth.user?.id,
        data.preloaded?.budgets,
    );
    const transactionsQuery = createTransactionsQuery(
        () => $auth.user?.id,
        data.preloaded?.transactions,
    );
    const recurringQuery = createRecurringTransactionsQuery(
        () => $auth.user?.id,
        data.preloaded?.recurring,
    );

    let budgets = $derived(budgetsQuery.data || []);
    let transactions = $derived(transactionsQuery.data || []);
    let recurring = $derived(recurringQuery.data || []);

    // Notification types
    interface Notification {
        id: string;
        type: "critical" | "warning" | "reminder";
        title: string;
        message: string;
        date: string;
        icon: any;
        href?: string;
    }

    let notifications = $derived.by(() => {
        const alerts: Notification[] = [];
        const now = new Date();
        const threeDaysFromNow = addDays(now, 3);

        // 1. Budget Alerts
        budgets.forEach((budget) => {
            const spent = transactions
                .filter(
                    (t) =>
                        t.category === budget.category && t.type === "expense",
                )
                .reduce((sum, t) => sum + t.amount, 0);

            const progress =
                budget.budget_amount > 0
                    ? (spent / budget.budget_amount) * 100
                    : 0;
            const threshold = budget.alert_threshold || 80;

            if (spent >= budget.budget_amount) {
                alerts.push({
                    id: `budget-crit-${budget.id}`,
                    type: "critical",
                    title: "Budget Exceeded!",
                    message: `You've spent ${formatCurrency(spent, $preferencesStore)} in ${budget.category}, exceeding your ${formatCurrency(budget.budget_amount, $preferencesStore)} limit.`,
                    date: new Date().toISOString(),
                    icon: AlertCircle,
                    href: "/budgets",
                });
            } else if (progress >= threshold) {
                alerts.push({
                    id: `budget-warn-${budget.id}`,
                    type: "warning",
                    title: "Approaching Budget Limit",
                    message: `You've used ${progress.toFixed(0)}% of your ${formatCurrency(budget.budget_amount, $preferencesStore)} budget for ${budget.category}.`,
                    date: new Date().toISOString(),
                    icon: AlertTriangle,
                    href: "/budgets",
                });
            }
        });

        // 2. Upcoming Recurring Reminders
        recurring.forEach((rec) => {
            if (!rec.is_active || !rec.next_run_date) return;

            const nextDate = parseISO(rec.next_run_date);
            if (
                isBefore(nextDate, threeDaysFromNow) &&
                isAfter(nextDate, startOfDay(now))
            ) {
                alerts.push({
                    id: `recur-${rec.id}`,
                    type: "reminder",
                    title: "Upcoming Payment",
                    message: `Your recurring payment for ${rec.category} (${formatCurrency(rec.amount, $preferencesStore)}) is due on ${format(nextDate, "MMM do")}.`,
                    date: rec.next_run_date,
                    icon: CalendarIcon,
                    href: "/recurring",
                });
            }
        });

        // Sort by date (desc)
        return alerts.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
    });
</script>

<AppLayout>
    <div class="flex flex-col h-full animate-fade-in overflow-hidden">
        <div class="shrink-0 bg-background pb-4 pt-2 border-b border-border/40">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="font-display text-3xl font-bold text-foreground">
                        Notifications
                    </h1>
                    <p class="text-muted-foreground">
                        Alerts and reminders for your finances
                    </p>
                </div>
                {#if notifications.length > 0}
                    <div
                        class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2"
                    >
                        <Bell class="h-4 w-4" />
                        {notifications.length} New
                    </div>
                {/if}
            </div>
        </div>

        <div
            class="flex-1 overflow-y-auto pt-6 pb-20 w-full max-w-3xl mx-auto space-y-4 px-4 sm:px-0"
        >
            {#if notifications.length === 0}
                <Card.Root class="border-dashed border-border/50 bg-muted/20">
                    <Card.Content
                        class="flex flex-col items-center justify-center py-20 text-center gap-4"
                    >
                        <div
                            class="w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-inner border border-border/30"
                        >
                            <CheckCircle2
                                class="h-10 w-10 text-muted-foreground/30"
                            />
                        </div>
                        <div>
                            <p
                                class="font-display text-xl font-bold text-foreground"
                            >
                                You're all caught up!
                            </p>
                            <p
                                class="text-muted-foreground mt-1 max-w-[250px] mx-auto"
                            >
                                No new notifications at the moment. We'll alert
                                you when something needs your attention.
                            </p>
                        </div>
                    </Card.Content>
                </Card.Root>
            {:else}
                <div class="grid gap-3">
                    {#each notifications as notification (notification.id)}
                        <a href={notification.href} class="block group">
                            <Card.Root
                                class={cn(
                                    "border-l-4 transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99]",
                                    notification.type === "critical"
                                        ? "border-l-expense bg-expense/5"
                                        : notification.type === "warning"
                                          ? "border-l-warning bg-warning/5"
                                          : "border-l-primary bg-primary/5",
                                )}
                            >
                                <Card.Content class="p-4 sm:p-5">
                                    <div class="flex gap-4">
                                        <div
                                            class={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                                notification.type === "critical"
                                                    ? "bg-expense text-expense-foreground"
                                                    : notification.type ===
                                                        "warning"
                                                      ? "bg-warning text-warning-foreground"
                                                      : "bg-primary text-primary-foreground",
                                            )}
                                        >
                                            <notification.icon
                                                class="h-5 w-5"
                                            />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div
                                                class="flex items-center justify-between gap-2 mb-1"
                                            >
                                                <h3
                                                    class="font-bold text-foreground truncate"
                                                >
                                                    {notification.title}
                                                </h3>
                                                <span
                                                    class="text-[10px] whitespace-nowrap text-muted-foreground uppercase font-bold tracking-wider"
                                                >
                                                    {format(
                                                        parseISO(
                                                            notification.date,
                                                        ),
                                                        "MMM d",
                                                    )}
                                                </span>
                                            </div>
                                            <p
                                                class="text-sm text-muted-foreground leading-relaxed"
                                            >
                                                {notification.message}
                                            </p>
                                        </div>
                                        <div
                                            class="flex items-center justify-center sm:px-2"
                                        >
                                            <ArrowRight
                                                class="h-5 w-5 text-muted-foreground/30 transition-transform group-hover:translate-x-1"
                                            />
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card.Root>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</AppLayout>
