import { useMemo } from "react";
import { format, parseISO, differenceInDays, isToday, isTomorrow, addDays } from "date-fns";
import { Bell, AlertTriangle, CheckCircle, RefreshCw, TrendingDown, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useBudgetStatuses } from "@/hooks/useData";
import { useRecurringTransactions } from "@/hooks/useData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type NotificationType = "danger" | "warning" | "info" | "success";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description: string;
    category?: string;
    time?: string;
    meta?: string;
}

const ICON_MAP: Record<NotificationType, React.ReactNode> = {
    danger: <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />,
    success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />,
};

const BADGE_MAP: Record<NotificationType, string> = {
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

const BADGE_LABEL: Record<NotificationType, string> = {
    danger: "Alert",
    warning: "Warning",
    info: "Reminder",
    success: "Info",
};

const NotificationsPage = () => {
    const { preferences } = usePreferences();
    const budgetStatuses = useBudgetStatuses();
    const { data: recurringRules } = useRecurringTransactions();

    const notifications = useMemo<Notification[]>(() => {
        const list: Notification[] = [];

        // ── Budget Alerts ────────────────────────────────────────────────
        budgetStatuses.forEach((s) => {
            if (s.status === "danger") {
                list.push({
                    id: `budget-danger-${s.budget.id}`,
                    type: "danger",
                    title: `Budget exceeded: ${s.budget.category}`,
                    description: `You've spent ${formatCurrency(s.spent, preferences)} out of your ${formatCurrency(s.budget.budget_amount, preferences)} budget — that's ${s.percentage.toFixed(0)}%.`,
                    category: "Budget",
                    meta: s.remaining < 0 ? `${formatCurrency(-s.remaining, preferences)} over limit` : "At limit",
                });
            } else if (s.status === "warning") {
                list.push({
                    id: `budget-warning-${s.budget.id}`,
                    type: "warning",
                    title: `Budget alert: ${s.budget.category}`,
                    description: `You've used ${s.percentage.toFixed(0)}% of your ${formatCurrency(s.budget.budget_amount, preferences)} budget. Only ${formatCurrency(s.remaining, preferences)} remaining.`,
                    category: "Budget",
                    meta: `${s.budget.alert_threshold}% threshold triggered`,
                });
            } else if (s.percentage > 0) {
                list.push({
                    id: `budget-safe-${s.budget.id}`,
                    type: "success",
                    title: `On track: ${s.budget.category}`,
                    description: `You've spent ${formatCurrency(s.spent, preferences)} of ${formatCurrency(s.budget.budget_amount, preferences)}. ${formatCurrency(s.remaining, preferences)} still available.`,
                    category: "Budget",
                    meta: `${s.percentage.toFixed(0)}% used`,
                });
            }
        });

        // ── Recurring Reminders ──────────────────────────────────────────
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const in7Days = addDays(today, 7);

        recurringRules?.filter((r) => r.is_active).forEach((rule) => {
            const nextRun = parseISO(rule.next_run_date);
            const daysAway = differenceInDays(nextRun, today);

            if (nextRun <= in7Days) {
                let when = "";
                if (isToday(nextRun)) when = "today";
                else if (isTomorrow(nextRun)) when = "tomorrow";
                else when = `in ${daysAway} days (${format(nextRun, "MMM d")})`;

                const notifType: NotificationType = daysAway === 0 ? "info" : "info";

                list.push({
                    id: `recurring-${rule.id}`,
                    type: notifType,
                    title: `Upcoming: ${rule.category} (${rule.frequency})`,
                    description: `${rule.type === "income" ? "Income" : "Expense"} of ${formatCurrency(rule.amount, preferences)} is scheduled ${when}.`,
                    category: "Recurring",
                    time: format(nextRun, "MMM d, yyyy"),
                    meta: `${rule.frequency.charAt(0).toUpperCase() + rule.frequency.slice(1)} · ${rule.occurrences_created} run${rule.occurrences_created !== 1 ? "s" : ""} so far`,
                });
            }
        });

        // Sort: danger first, then warning, then info/success
        const ORDER: Record<NotificationType, number> = { danger: 0, warning: 1, info: 2, success: 3 };
        return list.sort((a, b) => ORDER[a.type] - ORDER[b.type]);
    }, [budgetStatuses, recurringRules, preferences]);

    const counts = {
        danger: notifications.filter((n) => n.type === "danger").length,
        warning: notifications.filter((n) => n.type === "warning").length,
        info: notifications.filter((n) => n.type === "info").length,
    };

    return (
        <div className="flex flex-col h-full animate-fade-in overflow-hidden">
            {/* Fixed Header */}
            <div className="shrink-0 bg-background pb-4 pt-2 border-b border-border/40">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-foreground">Notifications</h1>
                        <p className="text-muted-foreground">
                            {counts.danger > 0 && <span className="text-red-500 font-medium mr-2">{counts.danger} alert{counts.danger !== 1 ? "s" : ""}</span>}
                            {counts.warning > 0 && <span className="text-yellow-500 font-medium mr-2">{counts.warning} warning{counts.warning !== 1 ? "s" : ""}</span>}
                            {counts.info > 0 && <span className="text-blue-500 font-medium mr-2">{counts.info} reminder{counts.info !== 1 ? "s" : ""}</span>}
                            {notifications.length === 0 && "All clear — no notifications"}
                        </p>
                    </div>
                </div>

                {/* Summary pills */}
                {notifications.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {counts.danger > 0 && (
                            <div className="flex items-center gap-1.5 text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 rounded-full px-3 py-1">
                                <AlertTriangle className="h-3.5 w-3.5" /> {counts.danger} Budget Exceeded
                            </div>
                        )}
                        {counts.warning > 0 && (
                            <div className="flex items-center gap-1.5 text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full px-3 py-1">
                                <AlertTriangle className="h-3.5 w-3.5" /> {counts.warning} Budget Warning
                            </div>
                        )}
                        {counts.info > 0 && (
                            <div className="flex items-center gap-1.5 text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full px-3 py-1">
                                <RefreshCw className="h-3.5 w-3.5" /> {counts.info} Upcoming Recurring
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto pt-6 pb-6">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                        <div className="rounded-full bg-emerald-500/10 p-6">
                            <CheckCircle className="h-12 w-12 text-emerald-500" />
                        </div>
                        <div>
                            <p className="font-display text-xl font-semibold text-foreground">You're all caught up!</p>
                            <p className="text-muted-foreground mt-1">No budget alerts or upcoming recurring transactions in the next 7 days.</p>
                        </div>
                        <div className="flex gap-3 mt-2">
                            <Button variant="outline" size="sm" onClick={() => window.location.href = "/budgets"}>Manage Budgets</Button>
                            <Button variant="outline" size="sm" onClick={() => window.location.href = "/recurring"}>Manage Recurring</Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((n) => (
                            <Card key={n.id} className={cn(
                                "border-border/50 shadow-sm transition-all hover:shadow-md",
                                n.type === "danger" && "border-red-500/30 bg-red-500/[0.02]",
                                n.type === "warning" && "border-yellow-500/30 bg-yellow-500/[0.02]",
                            )}>
                                <CardContent className="p-4">
                                    <div className="flex gap-3">
                                        {ICON_MAP[n.type]}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <span className="font-semibold text-foreground text-sm">{n.title}</span>
                                                <Badge className={cn("text-xs", BADGE_MAP[n.type])}>{BADGE_LABEL[n.type]}</Badge>
                                                {n.category && (
                                                    <Badge variant="outline" className="text-xs">{n.category}</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">{n.description}</p>
                                            {n.meta && (
                                                <p className="text-xs text-muted-foreground/60 mt-1">{n.meta}</p>
                                            )}
                                        </div>
                                        {n.time && (
                                            <div className="shrink-0 text-right">
                                                <p className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
