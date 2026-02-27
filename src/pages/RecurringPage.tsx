import { useState } from "react";
import { format, parseISO } from "date-fns";
import { RefreshCw, Pause, Play, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRecurringTransactions, useUpdateRecurring, useDeleteRecurring } from "@/hooks/useData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { formatCurrency } from "@/lib/formatters";
import TransactionForm from "@/components/TransactionForm";

const FREQ_LABELS: Record<string, string> = {
    daily: "Every day", weekly: "Every week", monthly: "Every month", yearly: "Every year",
};

const RecurringPage = () => {
    const { data: rules, isLoading } = useRecurringTransactions();
    const updateRecurring = useUpdateRecurring();
    const deleteRecurring = useDeleteRecurring();
    const { preferences } = usePreferences();

    const toggle = (id: string, is_active: boolean) =>
        updateRecurring.mutate({ id, is_active: !is_active });

    const active = rules?.filter((r) => r.is_active) ?? [];
    const paused = rules?.filter((r) => !r.is_active) ?? [];

    return (
        <div className="flex flex-col h-full animate-fade-in overflow-hidden">
            <div className="shrink-0 bg-background pb-4 pt-2 border-b border-border/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-foreground">Recurring Transactions</h1>
                        <p className="text-muted-foreground">{active.length} active rule{active.length !== 1 ? "s" : ""}</p>
                    </div>
                    <TransactionForm
                        trigger={
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                New Recurring
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-6 pb-6 space-y-6">
                {isLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />)}
                    </div>
                ) : !rules?.length ? (
                    <Card className="border-dashed border-border">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <RefreshCw className="h-10 w-10 text-muted-foreground/40" />
                            <p className="font-medium text-muted-foreground">No recurring transactions</p>
                            <p className="text-sm text-muted-foreground/70">Create a transaction and toggle "Make this recurring"</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {active.length > 0 && (
                            <div>
                                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Active</h2>
                                <div className="space-y-3">
                                    {active.map((rule) => (
                                        <RecurringCard key={rule.id} rule={rule} preferences={preferences}
                                            onToggle={() => toggle(rule.id, rule.is_active)}
                                            onDelete={() => deleteRecurring.mutate(rule.id)} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {paused.length > 0 && (
                            <div>
                                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Paused</h2>
                                <div className="space-y-3">
                                    {paused.map((rule) => (
                                        <RecurringCard key={rule.id} rule={rule} preferences={preferences}
                                            onToggle={() => toggle(rule.id, rule.is_active)}
                                            onDelete={() => deleteRecurring.mutate(rule.id)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const RecurringCard = ({ rule, preferences, onToggle, onDelete }: any) => (
    <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-0.5 rounded-full p-1.5 ${rule.type === "income" ? "bg-income/10" : "bg-expense/10"}`}>
                        <RefreshCw className={`h-4 w-4 ${rule.type === "income" ? "text-income" : "text-expense"}`} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{rule.category}</span>
                            <Badge variant={rule.is_active ? "default" : "secondary"} className="text-xs">
                                {rule.is_active ? "Active" : "Paused"}
                            </Badge>
                            <Badge variant="outline" className="text-xs">{FREQ_LABELS[rule.frequency]}</Badge>
                        </div>
                        <p className={`text-lg font-bold mt-0.5 ${rule.type === "income" ? "text-income" : "text-expense"}`}>
                            {rule.type === "expense" ? "−" : "+"}{formatCurrency(rule.amount, preferences)}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1">
                            <span>Next: {format(parseISO(rule.next_run_date), "MMM d, yyyy")}</span>
                            <span>Runs: {rule.occurrences_created} time{rule.occurrences_created !== 1 ? "s" : ""}</span>
                            {rule.end_date && <span>Until: {format(parseISO(rule.end_date), "MMM d, yyyy")}</span>}
                            {rule.max_occurrences && <span>Max: {rule.max_occurrences}</span>}
                        </div>
                        {rule.note && <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{rule.note}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle} title={rule.is_active ? "Pause" : "Resume"}>
                        {rule.is_active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete recurring rule?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will stop future automatic transactions. Past transactions will not be affected.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default RecurringPage;
