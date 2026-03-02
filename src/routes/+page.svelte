<script lang="ts">
    import AppLayout from "$lib/components/AppLayout.svelte";
    import * as Card from "$lib/components/ui/card";
    import TransactionItem from "$lib/components/TransactionItem.svelte";
    import TransactionForm from "$lib/components/TransactionForm.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Plus } from "lucide-svelte";
    import { createTransactionsQuery, createBudgetsQuery } from "$lib/data";
    import { auth } from "$lib/stores/auth.svelte";
    import { preferencesStore } from "$lib/stores/preferences.svelte";
    import { formatCurrency } from "$lib/formatters";
    import Chart from "$lib/components/ui/chart.svelte";
    import {
        startOfDay,
        startOfWeek,
        startOfMonth,
        format as formatDate,
        subDays,
        subWeeks,
        subMonths as subMonthsDate,
        isSameDay,
        isSameWeek,
        isSameMonth,
        parseISO,
    } from "date-fns";
    import { page } from "$app/state";
    import { browser } from "$app/environment";

    let { data } = $props();
    let txFormOpen = $state(false);
    let initialType = $state<"expense" | "income">("expense");
    let timeframe = $state<"day" | "week" | "month">("day");
    let chartUnits = $state(15);

    $effect(() => {
        if (!browser) return;
        const action = page.url.searchParams.get("action");
        if (action === "add_expense" || action === "add_income") {
            initialType = action === "add_expense" ? "expense" : "income";
            txFormOpen = true;

            // Clean up the URL
            const url = new URL(page.url);
            url.searchParams.delete("action");
            history.replaceState({}, "", url);
        }
    });

    const transactionsQuery = createTransactionsQuery(
        () => auth.user?.id,
        () => data.preloaded?.transactions,
    );
    const budgetsQuery = createBudgetsQuery(
        () => auth.user?.id,
        () => data.preloaded?.budgets,
    );

    let transactions = $derived(transactionsQuery.data || []);
    let budgets = $derived(budgetsQuery.data || []);

    // Calculate quick stats
    let totalIncome = $derived(
        transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0),
    );

    let totalExpenses = $derived(
        transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0),
    );

    let balance = $derived(totalIncome - totalExpenses);

    let recentTransactions = $derived(transactions.slice(0, 5));

    // ─── Pie Chart Data (Category Breakdown) ────────────────────────
    let pieChartData = $derived.by(() => {
        const expenseTxs = transactions.filter((t) => t.type === "expense");
        const categoryMap = new Map<string, number>();

        expenseTxs.forEach((t) => {
            categoryMap.set(
                t.category,
                (categoryMap.get(t.category) || 0) + t.amount,
            );
        });

        const sorted = [...categoryMap.entries()].sort((a, b) => b[1] - a[1]);

        return {
            labels: sorted.map((item) => item[0]),
            datasets: [
                {
                    data: sorted.map((item) => item[1]),
                    backgroundColor: [
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444",
                        "#8b5cf6",
                        "#06b6d4",
                        "#f43f5e",
                        "#ec4899",
                        "#d946ef",
                        "#a855f7",
                        "#6366f1",
                        "#0ea5e9",
                        "#14b8a6",
                        "#22c55e",
                        "#84cc16",
                        "#eab308",
                        "#f97316",
                    ],
                    borderWidth: 0,
                    hoverOffset: 4,
                },
            ],
        };
    });

    // ─── Line Chart Data (Financial Trends) ──────────────────────────
    let lineChartData = $derived.by(() => {
        const units = Math.max(1, Math.min(15, chartUnits));
        const labels: string[] = [];
        const incomeData: number[] = [];
        const expenseData: number[] = [];
        const now = new Date();

        for (let i = units - 1; i >= 0; i--) {
            let start: Date;
            let label: string;
            let checkFn: (d1: Date, d2: Date) => boolean;

            if (timeframe === "day") {
                start = subDays(now, i);
                label = formatDate(start, "MMM d");
                checkFn = isSameDay;
            } else if (timeframe === "week") {
                start = startOfWeek(subWeeks(now, i));
                label = `W ${formatDate(start, "w")}`;
                checkFn = isSameWeek;
            } else {
                start = startOfMonth(subMonthsDate(now, i));
                label = formatDate(start, "MMM");
                checkFn = isSameMonth;
            }

            labels.push(label);

            const filteredTxs = transactions.filter((t) =>
                checkFn(parseISO(t.date), start),
            );

            incomeData.push(
                filteredTxs
                    .filter((t) => t.type === "income")
                    .reduce((sum, t) => sum + t.amount, 0),
            );

            expenseData.push(
                filteredTxs
                    .filter((t) => t.type === "expense")
                    .reduce((sum, t) => sum + t.amount, 0),
            );
        }

        return {
            labels,
            datasets: [
                {
                    label: "Income",
                    data: incomeData,
                    borderColor: "#10b981",
                    backgroundColor: "#10b98133",
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: "Expenses",
                    data: expenseData,
                    borderColor: "#ef4444",
                    backgroundColor: "#ef444433",
                    fill: true,
                    tension: 0.4,
                },
            ],
        };
    });
</script>

<AppLayout>
    <!-- KEY FIX: min-w-0 + overflow-hidden on the root container prevents children from
         blowing out the layout on narrow viewports. w-full alone isn't enough because
         flex/grid children can still set an implicit minimum width. -->
    <div
        class="flex flex-col gap-6 animate-fade-in w-full min-w-0 overflow-hidden"
    >
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 class="font-display text-3xl font-bold text-foreground">
                    Dashboard
                </h1>
                <p class="text-muted-foreground mt-1">
                    Overview of your recent financial activity
                </p>
            </div>
            <TransactionForm bind:open={txFormOpen} {initialType}>
                <Button
                    onclick={() => {
                        initialType = "expense";
                        txFormOpen = true;
                    }}
                    class="hidden sm:flex gap-2"
                >
                    <Plus class="h-4 w-4" />
                    New Transaction
                </Button>
            </TransactionForm>
        </div>

        <!-- Quick Stats -->
        <div class="grid gap-4 md:grid-cols-3">
            <Card.Root>
                <Card.Content class="p-6">
                    <div
                        class="flex items-center justify-between space-y-0 pb-2"
                    >
                        <p class="text-sm font-medium leading-none">
                            Total Balance
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <div
                            class="text-2xl font-bold {balance >= 0
                                ? 'text-foreground'
                                : 'text-expense'}"
                        >
                            {formatCurrency(balance, preferencesStore)}
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>
            <Card.Root>
                <Card.Content class="p-6">
                    <div
                        class="flex items-center justify-between space-y-0 pb-2"
                    >
                        <p class="text-sm font-medium leading-none">
                            Total Income
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="text-2xl font-bold text-income">
                            +{formatCurrency(totalIncome, preferencesStore)}
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>
            <Card.Root>
                <Card.Content class="p-6">
                    <div
                        class="flex items-center justify-between space-y-0 pb-2"
                    >
                        <p class="text-sm font-medium leading-none">
                            Total Expenses
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="text-2xl font-bold text-expense">
                            -{formatCurrency(totalExpenses, preferencesStore)}
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>

        <div class="grid gap-6 lg:grid-cols-3 w-full min-w-0">
            <!-- Line Chart: Financial Trends -->
            <!-- KEY FIX: min-w-0 on the card prevents the card itself from overflowing its grid cell -->
            <Card.Root
                class="lg:col-span-2 shadow-sm border-border/50 min-w-0 w-full"
            >
                <Card.Header
                    class="flex flex-col items-start pb-4 gap-4 px-3 sm:px-6"
                >
                    <div class="space-y-1 w-full">
                        <Card.Title class="text-xl">Financial Trends</Card.Title
                        >
                        <Card.Description
                            >Income vs Expenses over time</Card.Description
                        >
                    </div>
                    <!-- KEY FIX: The controls row was a horizontal flex that forced width on tiny screens.
                         We now keep it fully column-stacked below sm, with w-full on every child. -->
                    <div
                        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full bg-muted/40 p-2 rounded-xl border border-border/40"
                    >
                        <!-- Slider Units Selector -->
                        <div class="flex items-center gap-3 w-full px-1">
                            <div class="flex flex-col gap-0.5 shrink-0">
                                <span
                                    class="text-[10px] uppercase font-bold text-muted-foreground whitespace-nowrap leading-none"
                                    >Range</span
                                >
                                <span
                                    class="text-[11px] font-bold text-primary leading-none"
                                    >{chartUnits}
                                    {timeframe}{chartUnits > 1 ? "s" : ""}</span
                                >
                            </div>
                            <!-- KEY FIX: min-w-0 + w-full so the range input fills available space
                                 and doesn't create a fixed-width overflow -->
                            <input
                                type="range"
                                min="1"
                                max="15"
                                bind:value={chartUnits}
                                class="w-full min-w-0 h-1.5 bg-background rounded-full appearance-none cursor-pointer accent-primary border border-border/20
                                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                                       [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2
                                       [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md
                                       [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:bg-primary
                                       [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:rounded-full
                                       [&::-moz-range-thumb]:shadow-md"
                            />
                        </div>

                        <div
                            class="hidden sm:block w-px h-6 bg-border/40 shrink-0"
                        ></div>

                        <!-- Timeframe Toggles -->
                        <div
                            class="flex items-center gap-1 w-full bg-background/50 p-1 rounded-lg"
                        >
                            {#each ["day", "week", "month"] as t}
                                <button
                                    class="flex-1 px-2 py-1.5 text-xs font-semibold rounded-md transition-all {timeframe ===
                                    t
                                        ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'}"
                                    onclick={() => (timeframe = t as any)}
                                >
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            {/each}
                        </div>
                    </div>
                </Card.Header>
                <!-- KEY FIX: px-0 on tiny screens, and the inner div uses w-full + min-w-0
                     so Chart.js receives a container that truly matches viewport width -->
                <Card.Content class="px-1 xs:px-3 sm:px-6 pb-6 w-full min-w-0">
                    <div
                        class="h-[200px] xs:h-[220px] sm:h-[300px] w-full min-w-0 relative"
                    >
                        <Chart
                            type="line"
                            data={lineChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "top",
                                        align: "end",
                                        labels: {
                                            boxWidth: 10,
                                            usePointStyle: true,
                                            pointStyle: "circle",
                                            font: { size: 10 },
                                        },
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { display: false },
                                        ticks: {
                                            font: { size: 10 },
                                            maxTicksLimit: 5,
                                        },
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: {
                                            font: { size: 10 },
                                            maxRotation: 45,
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Pie Chart: Category Breakdown -->
            <Card.Root class="shadow-sm border-border/50 min-w-0 w-full">
                <Card.Header class="px-3 sm:px-6">
                    <Card.Title class="text-xl">Category Breakdown</Card.Title>
                    <Card.Description>Top expense categories</Card.Description>
                </Card.Header>
                <Card.Content class="px-1 xs:px-3 sm:px-6 pb-6 w-full min-w-0">
                    <div
                        class="h-[200px] xs:h-[220px] sm:h-[300px] w-full min-w-0 relative flex items-center justify-center"
                    >
                        {#if pieChartData.labels.length > 0}
                            <Chart
                                type="doughnut"
                                data={pieChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: "bottom",
                                            labels: {
                                                boxWidth: 8,
                                                usePointStyle: true,
                                                padding: 12,
                                                font: { size: 10 },
                                            },
                                        },
                                    },
                                    cutout: "65%",
                                }}
                            />
                        {:else}
                            <div
                                class="text-center py-12 text-muted-foreground italic"
                            >
                                No expense data yet
                            </div>
                        {/if}
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Recent Transactions -->
            <!-- KEY FIX: min-w-0 prevents the card from overflowing when TransactionItem
                 content (long merchant names etc.) sets an implicit min-width -->
            <Card.Root
                class="lg:col-span-3 shadow-sm border-border/50 min-w-0 w-full"
            >
                <Card.Header class="px-3 sm:px-6">
                    <Card.Title class="text-xl">Recent Transactions</Card.Title>
                    <Card.Description
                        >Your 5 most recent activities</Card.Description
                    >
                </Card.Header>
                <Card.Content class="px-2 sm:px-6">
                    {#if recentTransactions.length === 0}
                        <div class="py-12 text-center text-muted-foreground">
                            No recent transactions found
                        </div>
                    {:else}
                        <div class="space-y-1 w-full min-w-0">
                            {#each recentTransactions as transaction (transaction.id)}
                                <!-- KEY FIX: overflow-hidden truncates any text that would
                                     otherwise push the row wider than the card -->
                                <div
                                    class="px-1 sm:px-2 py-1 rounded-lg hover:bg-muted/30 transition-colors overflow-hidden min-w-0"
                                >
                                    <TransactionItem {transaction} />
                                </div>
                            {/each}
                        </div>
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</AppLayout>
