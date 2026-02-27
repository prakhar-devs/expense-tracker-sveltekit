import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { PlusCircle, Trash2, Edit2, Target, TrendingDown, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBudgets, useAddBudget, useDeleteBudget, useBudgetStatuses, useTransactions } from "@/hooks/useData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { formatCurrency } from "@/lib/formatters";
import { EXPENSE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const budgetSchema = z.object({
    category: z.string().min(1, "Category required"),
    period_type: z.enum(["weekly", "monthly", "custom"]),
    budget_amount: z.coerce.number().positive("Amount must be > 0"),
    alert_threshold: z.coerce.number().int().min(10).max(100).default(80),
});

type BudgetForm = z.infer<typeof budgetSchema>;

const BudgetsPage = () => {
    const { isLoading } = useBudgets();
    const statuses = useBudgetStatuses();
    const addBudget = useAddBudget();
    const deleteBudget = useDeleteBudget();
    const { preferences } = usePreferences();
    const { data: transactions } = useTransactions();
    const [dialogOpen, setDialogOpen] = useState(false);

    const form = useForm<BudgetForm>({
        resolver: zodResolver(budgetSchema),
        defaultValues: { category: "", period_type: "monthly", budget_amount: undefined as any, alert_threshold: 80 },
    });

    const watchedPeriod = form.watch("period_type");

    const onSubmit = async (values: BudgetForm) => {
        const today = new Date();
        let start: Date, end: Date;
        if (values.period_type === "monthly") {
            start = startOfMonth(today);
            end = endOfMonth(today);
        } else {
            start = startOfWeek(today, { weekStartsOn: preferences.firstDayOfWeek === 1 ? 1 : 0 });
            end = endOfWeek(today, { weekStartsOn: preferences.firstDayOfWeek === 1 ? 1 : 0 });
        }

        await addBudget.mutateAsync({
            category: values.category,
            period_type: values.period_type,
            start_date: format(start, "yyyy-MM-dd"),
            end_date: format(end, "yyyy-MM-dd"),
            budget_amount: values.budget_amount,
            alert_threshold: values.alert_threshold,
            is_active: true,
        });
        form.reset();
        setDialogOpen(false);
    };

    // Insights
    const insights = generateInsights(statuses, transactions ?? []);

    const statusColor = (status: string) =>
        status === "danger" ? "bg-red-500" : status === "warning" ? "bg-yellow-500" : "bg-emerald-500";
    const textColor = (status: string) =>
        status === "danger" ? "text-red-500" : status === "warning" ? "text-yellow-500" : "text-emerald-500";

    return (
        <div className="flex flex-col h-full animate-fade-in overflow-hidden">
            {/* Header */}
            <div className="shrink-0 bg-background pb-4 pt-2 border-b border-border/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-foreground">Budgets</h1>
                        <p className="text-muted-foreground">{statuses.length} active budget{statuses.length !== 1 ? "s" : ""}</p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2"><PlusCircle className="h-4 w-4" />New Budget</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="font-display">Create Budget</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField control={form.control} name="category" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {EXPENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="period_type" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Period</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="budget_amount" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Budget Amount ({preferences.currency})</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" min="0.01" placeholder="e.g. 5000" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="alert_threshold" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Alert at (% spent)</FormLabel>
                                            <FormControl>
                                                <Input type="number" min="10" max="100" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <Button type="submit" className="w-full" disabled={addBudget.isPending}>
                                        {addBudget.isPending ? "Creating..." : "Create Budget"}
                                    </Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-6 pb-6 space-y-6">
                {/* Budget Cards */}
                {isLoading ? (
                    <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />)}</div>
                ) : statuses.length === 0 ? (
                    <Card className="border-dashed border-border">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center gap-3">
                            <Target className="h-10 w-10 text-muted-foreground/40" />
                            <p className="font-medium text-muted-foreground">No budgets set</p>
                            <p className="text-sm text-muted-foreground/70">Set spending limits per category to track your goals</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {statuses.map((s) => (
                            <Card key={s.budget.id} className={cn("border-border/50 shadow-sm overflow-hidden", s.status === "danger" && "border-red-500/40", s.status === "warning" && "border-yellow-500/40")}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <span className="font-semibold text-foreground">{s.budget.category}</span>
                                            <Badge variant="outline" className="ml-2 text-xs capitalize">{s.budget.period_type}</Badge>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Badge className={cn("text-xs", s.status === "safe" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : s.status === "warning" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-red-500/10 text-red-500 border-red-500/20")}>
                                                {s.percentage.toFixed(0)}%
                                            </Badge>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete this budget?</AlertDialogTitle>
                                                        <AlertDialogDescription>This will remove the spending limit for {s.budget.category}.</AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => deleteBudget.mutate(s.budget.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>

                                    <Progress value={Math.min(s.percentage, 100)} className="h-2 mb-2" indicatorClassName={statusColor(s.status)} />

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            Spent: <span className={cn("font-medium", textColor(s.status))}>{formatCurrency(s.spent, preferences)}</span>
                                        </span>
                                        <span className="text-muted-foreground">
                                            {s.remaining >= 0 ? "Left: " : "Over: "}
                                            <span className={cn("font-medium", s.remaining >= 0 ? "text-foreground" : "text-red-500")}>
                                                {formatCurrency(Math.abs(s.remaining), preferences)}
                                            </span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground/60 mt-1">
                                        Budget: {formatCurrency(s.budget.budget_amount, preferences)} · Alert at {s.budget.alert_threshold}%
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Smart Insights */}
                {insights.length > 0 && (
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                <Lightbulb className="h-4 w-4 text-yellow-500" />
                                Smart Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {insights.map((insight, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm">
                                    <span>{insight.icon}</span>
                                    <p className="text-muted-foreground">{insight.text}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

function generateInsights(statuses: ReturnType<typeof useBudgetStatuses>, transactions: any[]) {
    const insights: { icon: string; text: string }[] = [];

    statuses.forEach((s) => {
        if (s.status === "danger") {
            insights.push({ icon: "🚨", text: `Your ${s.budget.category} budget has been exceeded by ${((s.percentage - 100)).toFixed(0)}%.` });
        } else if (s.status === "warning") {
            const daysLeft = Math.round((new Date(s.budget.end_date).getTime() - Date.now()) / 86400000);
            if (daysLeft > 0 && s.spent > 0) {
                const dailyRate = s.spent / (new Date().getDate());
                const projectedOverrun = dailyRate * daysLeft + s.spent - s.budget.budget_amount;
                if (projectedOverrun > 0) {
                    insights.push({ icon: "📊", text: `At your current rate, your ${s.budget.category} budget may exceed by ${Math.round(projectedOverrun)} in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.` });
                }
            }
        }
    });

    return insights.slice(0, 5);
}

export default BudgetsPage;
