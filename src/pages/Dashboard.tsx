import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp, Target, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useTransactions, useBudgetStatuses } from "@/hooks/useData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { formatCurrency } from "@/lib/formatters";
import TransactionForm from "@/components/TransactionForm";
import TransactionItem from "@/components/TransactionItem";
import { useIsMobile } from "@/hooks/use-media-query";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { format, subMonths, subDays, subWeeks, startOfMonth, startOfDay, startOfWeek, endOfDay, endOfWeek, eachMonthOfInterval, eachDayOfInterval, eachWeekOfInterval } from "date-fns";

const PIE_COLORS = [
  "hsl(222, 60%, 18%)",
  "hsl(152, 60%, 40%)",
  "hsl(0, 72%, 51%)",
  "hsl(220, 9%, 46%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(190, 70%, 42%)",
];

const Dashboard = () => {
  const { data: transactions, isLoading } = useTransactions();
  const { preferences } = usePreferences();
  const budgetStatuses = useBudgetStatuses();
  const isMobile = useIsMobile();
  const [timeMode, setTimeMode] = useState<"months" | "weeks" | "days">("months");
  const [timeRange, setTimeRange] = useState(6);

  const stats = useMemo(() => {
    if (!transactions) return { income: 0, expense: 0, balance: 0 };
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const expenseByCategoryData = useMemo(() => {
    if (!transactions) return [];
    const map: Record<string, number> = {};
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const trendData = useMemo(() => {
    if (!transactions) return [];
    const now = new Date();

    if (timeMode === "months") {
      const start = startOfMonth(subMonths(now, timeRange - 1));
      const intervals = eachMonthOfInterval({ start, end: now });
      return intervals.map((monthStart) => {
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        const monthTxs = transactions.filter((t) => {
          const d = new Date(t.date);
          return d >= monthStart && d <= monthEnd;
        });
        return {
          label: format(monthStart, "MMM yyyy"),
          income: monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
          expense: monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
        };
      });
    } else if (timeMode === "weeks") {
      const start = startOfWeek(subWeeks(now, timeRange - 1));
      const intervals = eachWeekOfInterval({ start, end: now });
      return intervals.map((weekStart) => {
        const weekEnd = endOfWeek(weekStart);
        const weekTxs = transactions.filter((t) => {
          const d = new Date(t.date);
          return d >= weekStart && d <= weekEnd;
        });
        return {
          label: format(weekStart, "dd MMM"),
          income: weekTxs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
          expense: weekTxs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
        };
      });
    } else {
      const start = startOfDay(subDays(now, timeRange - 1));
      const intervals = eachDayOfInterval({ start, end: now });
      return intervals.map((day) => {
        const dayEnd = endOfDay(day);
        const dayTxs = transactions.filter((t) => {
          const d = new Date(t.date);
          return d >= day && d <= dayEnd;
        });
        return {
          label: format(day, "dd MMM"),
          income: dayTxs.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
          expense: dayTxs.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0),
        };
      });
    }
  }, [transactions, timeMode, timeRange]);

  const recent = transactions?.slice(0, 5) ?? [];

  return (
    <div className="flex flex-col h-full animate-fade-in overflow-hidden">
      {/* Fixed Header */}
      <div className="shrink-0 bg-background pb-4 pt-2 border-b border-border/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Your financial overview</p>
          </div>
          {!isMobile && <TransactionForm />}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="space-y-[var(--section-gap)] flex-1 overflow-y-auto pt-6 pb-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
              <Wallet className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold text-foreground">{formatCurrency(stats.balance, preferences)}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <ArrowDownLeft className="h-5 w-5 text-income" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold text-income">{formatCurrency(stats.income, preferences)}</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <ArrowUpRight className="h-5 w-5 text-expense" />
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-bold text-expense">{formatCurrency(stats.expense, preferences)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 min-w-0">
          <Card className="border-border/50 shadow-sm min-w-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="font-display text-lg font-semibold text-foreground">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden">
              {expenseByCategoryData.length === 0 ? (
                <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                  No expense data yet
                </div>
              ) : (
                <ChartContainer config={{}} className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseByCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {expenseByCategoryData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm min-w-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="font-display text-lg font-semibold text-foreground">Income vs Expense Trend</CardTitle>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select
                  value={timeMode}
                  onValueChange={(v) => {
                    setTimeMode(v as "months" | "weeks" | "days");
                    setTimeRange(v === "months" ? 6 : v === "weeks" ? 8 : 7);
                  }}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="weeks">Weeks</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex flex-1 items-center gap-3 min-w-0">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    Past {timeRange} {timeMode}
                  </span>
                  <Slider
                    value={[timeRange]}
                    onValueChange={(v) => setTimeRange(v[0])}
                    min={1}
                    max={15}
                    step={1}
                    className="flex-1 min-w-0"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-hidden">
              {trendData.length === 0 ? (
                <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                  No data yet
                </div>
              ) : (
                <ChartContainer config={{}} className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" width={40} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="income" stroke="hsl(152, 60%, 40%)" strokeWidth={2} dot={{ r: 3 }} name="Income" />
                      <Line type="monotone" dataKey="expense" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={{ r: 3 }} name="Expense" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-foreground">Recent Transactions</h2>
            {transactions && transactions.length > 5 && (
              <a href="/transactions" className="text-sm font-medium text-primary hover:underline">
                View all
              </a>
            )}
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[72px] animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <Card className="border-dashed border-border">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="mb-3 h-10 w-10 text-muted-foreground/50" />
                <p className="font-medium text-muted-foreground">No transactions yet</p>
                <p className="text-sm text-muted-foreground/70">Add your first transaction to get started</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recent.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} showActions={false} />
              ))}
            </div>
          )}
        </div>

        {/* Budget Widget */}
        {budgetStatuses.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Budget Overview
              </h2>
              <a href="/budgets" className="text-sm font-medium text-primary hover:underline">Manage budgets</a>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {budgetStatuses.slice(0, 4).map((s) => {
                const color = s.status === "danger" ? "bg-red-500" : s.status === "warning" ? "bg-yellow-500" : "bg-emerald-500";
                const textCol = s.status === "danger" ? "text-red-500" : s.status === "warning" ? "text-yellow-500" : "text-emerald-500";
                return (
                  <Card key={s.budget.id} className={cn("border-border/50 shadow-sm", s.status === "danger" && "border-red-500/30", s.status === "warning" && "border-yellow-500/30")}>
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm text-foreground">{s.budget.category}</span>
                        <span className={cn("text-xs font-semibold", textCol)}>{s.percentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={Math.min(s.percentage, 100)} className="h-1.5 mb-2" indicatorClassName={color} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatCurrency(s.spent, preferences)} spent</span>
                        <span>{s.remaining >= 0 ? formatCurrency(s.remaining, preferences) + " left" : "Over budget"}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
