<script lang="ts">
    import AppLayout from "$lib/components/AppLayout.svelte";
    import * as Card from "$lib/components/ui/card";
    import { formatCurrency } from "$lib/formatters";
    import { preferencesStore } from "$lib/stores/preferences.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Progress } from "$lib/components/ui/progress";
    import { Plus } from "lucide-svelte";
    import { createBudgetsQuery, createTransactionsQuery } from "$lib/data";
    import { auth } from "$lib/stores/auth.svelte";

    let { data } = $props();

    const budgetsQuery = createBudgetsQuery(
        () => auth.user?.id,
        () => data.preloaded?.budgets,
    );
    const transactionsQuery = createTransactionsQuery(
        () => auth.user?.id,
        () => data.preloaded?.transactions,
    );

    let budgets = $derived(budgetsQuery.data || []);
    let transactions = $derived(transactionsQuery.data || []);

    // Helper to calculate spending for a category
    function getSpentAmount(category: string) {
        return transactions
            .filter((t) => t.category === category && t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);
    }

    let budgetStats = $derived(
        budgets.map((budget) => {
            const spent = getSpentAmount(budget.category);
            const progress =
                budget.budget_amount > 0
                    ? (spent / budget.budget_amount) * 100
                    : 0;
            return {
                ...budget,
                spent,
                remaining: Math.max(0, budget.budget_amount - spent),
                progress: Math.min(100, progress),
            };
        }),
    );
</script>

<AppLayout>
    <div class="flex flex-col h-full animate-fade-in overflow-hidden">
        <div class="shrink-0 bg-background pb-4 pt-2 border-b border-border/40">
            <div
                class="flex items-center justify-between gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div class="min-w-0">
                    <h1
                        class="font-display text-2xl sm:text-3xl font-bold text-foreground truncate"
                    >
                        Budgets
                    </h1>
                    <p
                        class="text-muted-foreground text-sm sm:text-base truncate hidden sm:block"
                    >
                        Manage your spending limits
                    </p>
                </div>
                <Button class="gap-2 shrink-0">
                    <Plus class="h-4 w-4" />
                    <span class="hidden sm:inline">New Budget</span>
                    <span class="inline sm:hidden">New</span>
                </Button>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto pt-6 pb-6 w-full">
            {#if budgetStats.length === 0}
                <Card.Root
                    class="border-dashed border-border/50 max-w-4xl mx-auto"
                >
                    <Card.Content
                        class="flex flex-col items-center justify-center py-16 text-center"
                    >
                        <p class="text-muted-foreground mb-4">
                            You haven't set up any budgets yet.
                        </p>
                        <Button variant="outline"
                            >Create your first budget</Button
                        >
                    </Card.Content>
                </Card.Root>
            {:else}
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {#each budgetStats as budget (budget.id)}
                        <Card.Root
                            class="border-border/50 shadow-sm overflow-hidden flex flex-col"
                        >
                            <Card.Header class="pb-2">
                                <div class="flex justify-between items-start">
                                    <Card.Title class="text-xl"
                                        >{budget.category}</Card.Title
                                    >
                                    <span
                                        class="text-xs font-medium px-2 py-1 rounded-full bg-muted"
                                    >
                                        {budget.period_type}
                                    </span>
                                </div>
                            </Card.Header>
                            <Card.Content class="space-y-4 flex-1">
                                <div class="space-y-2">
                                    <div class="flex justify-between text-sm">
                                        <span class="text-muted-foreground"
                                            >Spent</span
                                        >
                                        <span
                                            class="font-semibold text-foreground"
                                        >
                                            {formatCurrency(
                                                budget.spent,
                                                preferencesStore,
                                            )}
                                        </span>
                                    </div>
                                    <Progress
                                        value={budget.progress}
                                        class="h-2"
                                        indicatorClass={budget.progress < 20
                                            ? "bg-income"
                                            : budget.progress <= 70
                                              ? "bg-warning"
                                              : "bg-expense"}
                                    />
                                    <div
                                        class="flex justify-between text-xs text-muted-foreground"
                                    >
                                        <span
                                            >{budget.progress.toFixed(0)}% used</span
                                        >
                                        <span
                                            >of {formatCurrency(
                                                budget.budget_amount,
                                                preferencesStore,
                                            )}</span
                                        >
                                    </div>
                                </div>
                            </Card.Content>
                            <div
                                class="border-t border-border/50 flex justify-between items-center bg-muted/20 p-4 px-6"
                            >
                                <span
                                    class="text-xs text-muted-foreground uppercase font-semibold"
                                    >Remaining</span
                                >
                                <span
                                    class="text-lg font-bold {budget.remaining >
                                    0
                                        ? 'text-income'
                                        : 'text-expense'}"
                                >
                                    {formatCurrency(
                                        budget.remaining,
                                        preferencesStore,
                                    )}
                                </span>
                            </div>
                        </Card.Root>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</AppLayout>
