<script lang="ts">
    import type { PageData } from "./$types";
    let { data } = $props();
    import { format, parseISO } from "date-fns";
    import { RefreshCw, Pause, Play, Trash2, Plus } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import {
        createRecurringTransactionsQuery,
        createUpdateRecurringMutation,
        createDeleteRecurringMutation,
    } from "$lib/data";
    import { preferencesStore } from "$lib/stores/preferences.svelte";
    import { formatCurrency } from "$lib/formatters";
    import TransactionForm from "$lib/components/TransactionForm.svelte";
    import { auth } from "$lib/stores/auth.svelte";
    import AppLayout from "$lib/components/AppLayout.svelte";

    const recurringQuery = createRecurringTransactionsQuery(
        () => auth.user?.id,
        () => data.preloaded?.recurring,
    );
    const updateRecurring = createUpdateRecurringMutation();
    const deleteRecurring = createDeleteRecurringMutation();

    const FREQ_LABELS: Record<string, string> = {
        daily: "Every day",
        weekly: "Every week",
        monthly: "Every month",
        yearly: "Every year",
    };

    function toggle(id: string, is_active: boolean) {
        updateRecurring.mutate({ id, is_active: !is_active });
    }

    let rules = $derived(
        recurringQuery.data || data.preloaded?.recurring || [],
    );
    let isLoading = $derived(recurringQuery.isLoading && rules.length === 0);

    let active = $derived(rules.filter((r) => r.is_active));
    let paused = $derived(rules.filter((r) => !r.is_active));
</script>

<AppLayout>
    <div class="flex flex-col h-full animate-fade-in overflow-hidden">
        <div class="shrink-0 bg-background pb-4 pt-2 border-b border-border/40">
            <div
                class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div>
                    <h1 class="font-display text-3xl font-bold text-foreground">
                        Recurring Transactions
                    </h1>
                    <p class="text-muted-foreground">
                        {active.length} active rule{active.length !== 1
                            ? "s"
                            : ""}
                    </p>
                </div>
                <TransactionForm>
                    <Button class="gap-2">
                        <Plus class="h-4 w-4" />
                        New Recurring
                    </Button>
                </TransactionForm>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto pt-6 pb-6 space-y-6">
            {#if isLoading}
                <div class="space-y-3">
                    {#each [1, 2, 3] as i}
                        <div
                            class="h-24 animate-pulse rounded-lg bg-muted"
                        ></div>
                    {/each}
                </div>
            {:else if !rules.length}
                <Card.Root class="border-dashed border-border">
                    <Card.Content
                        class="flex flex-col items-center justify-center py-16 text-center gap-3"
                    >
                        <RefreshCw class="h-10 w-10 text-muted-foreground/40" />
                        <p class="font-medium text-muted-foreground">
                            No recurring transactions
                        </p>
                        <p class="text-sm text-muted-foreground/70">
                            Create a transaction and toggle "Make this
                            recurring"
                        </p>
                    </Card.Content>
                </Card.Root>
            {:else}
                {#if active.length > 0}
                    <div>
                        <h2
                            class="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3"
                        >
                            Active
                        </h2>
                        <div class="space-y-3">
                            {#each active as rule (rule.id)}
                                <Card.Root class="border-border/50 shadow-sm">
                                    <Card.Content class="p-4">
                                        <div
                                            class="flex items-start justify-between gap-4"
                                        >
                                            <div
                                                class="flex items-start gap-3 min-w-0"
                                            >
                                                <div
                                                    class="mt-0.5 rounded-full p-1.5 {rule.type ===
                                                    'income'
                                                        ? 'bg-income/10'
                                                        : 'bg-expense/10'}"
                                                >
                                                    <RefreshCw
                                                        class="h-4 w-4 {rule.type ===
                                                        'income'
                                                            ? 'text-income'
                                                            : 'text-expense'}"
                                                    />
                                                </div>
                                                <div class="min-w-0">
                                                    <div
                                                        class="flex items-center gap-2 flex-wrap"
                                                    >
                                                        <span
                                                            class="font-semibold text-foreground"
                                                            >{rule.category}</span
                                                        >
                                                        <Badge
                                                            variant="default"
                                                            class="text-xs"
                                                            >Active</Badge
                                                        >
                                                        <Badge
                                                            variant="outline"
                                                            class="text-xs"
                                                            >{FREQ_LABELS[
                                                                rule.frequency
                                                            ]}</Badge
                                                        >
                                                    </div>
                                                    <p
                                                        class="text-lg font-bold mt-0.5 {rule.type ===
                                                        'income'
                                                            ? 'text-income'
                                                            : 'text-expense'}"
                                                    >
                                                        {rule.type === "expense"
                                                            ? "−"
                                                            : "+"}{formatCurrency(
                                                            rule.amount,
                                                            preferencesStore,
                                                        )}
                                                    </p>
                                                    <div
                                                        class="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1"
                                                    >
                                                        <span
                                                            >Next: {format(
                                                                parseISO(
                                                                    rule.next_run_date,
                                                                ),
                                                                "MMM d, yyyy",
                                                            )}</span
                                                        >
                                                        <span
                                                            >Runs: {rule.occurrences_created}
                                                            time{rule.occurrences_created !==
                                                            1
                                                                ? "s"
                                                                : ""}</span
                                                        >
                                                        {#if rule.end_date}<span
                                                                >Until: {format(
                                                                    parseISO(
                                                                        rule.end_date,
                                                                    ),
                                                                    "MMM d, yyyy",
                                                                )}</span
                                                            >{/if}
                                                        {#if rule.max_occurrences}<span
                                                                >Max: {rule.max_occurrences}</span
                                                            >{/if}
                                                    </div>
                                                    {#if rule.note}<p
                                                            class="text-xs text-muted-foreground/70 mt-0.5 truncate"
                                                        >
                                                            {rule.note}
                                                        </p>{/if}
                                                </div>
                                            </div>
                                            <div
                                                class="flex items-center gap-1 shrink-0"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    class="h-8 w-8"
                                                    onclick={() =>
                                                        toggle(
                                                            rule.id,
                                                            rule.is_active,
                                                        )}
                                                    title="Pause"
                                                >
                                                    <Pause class="h-4 w-4" />
                                                </Button>
                                                <AlertDialog.Root>
                                                    <AlertDialog.Trigger>
                                                        {#snippet child({
                                                            props,
                                                        })}
                                                            <Button
                                                                {...props}
                                                                variant="ghost"
                                                                size="icon"
                                                                class="h-8 w-8 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2
                                                                    class="h-4 w-4"
                                                                />
                                                            </Button>
                                                        {/snippet}
                                                    </AlertDialog.Trigger>
                                                    <AlertDialog.Content>
                                                        <AlertDialog.Header>
                                                            <AlertDialog.Title
                                                                >Delete
                                                                recurring rule?</AlertDialog.Title
                                                            >
                                                            <AlertDialog.Description
                                                            >
                                                                This will stop
                                                                future automatic
                                                                transactions.
                                                                Past
                                                                transactions
                                                                will not be
                                                                affected.
                                                            </AlertDialog.Description>
                                                        </AlertDialog.Header>
                                                        <AlertDialog.Footer>
                                                            <AlertDialog.Cancel
                                                                >Cancel</AlertDialog.Cancel
                                                            >
                                                            <AlertDialog.Action
                                                                onclick={() =>
                                                                    deleteRecurring.mutate(
                                                                        rule.id,
                                                                    )}
                                                                class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialog.Action>
                                                        </AlertDialog.Footer>
                                                    </AlertDialog.Content>
                                                </AlertDialog.Root>
                                            </div>
                                        </div>
                                    </Card.Content>
                                </Card.Root>
                            {/each}
                        </div>
                    </div>
                {/if}
                {#if paused.length > 0}
                    <div>
                        <h2
                            class="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3"
                        >
                            Paused
                        </h2>
                        <div class="space-y-3">
                            {#each paused as rule (rule.id)}
                                <Card.Root
                                    class="border-border/50 shadow-sm opacity-75"
                                >
                                    <Card.Content class="p-4">
                                        <div
                                            class="flex items-start justify-between gap-4"
                                        >
                                            <div
                                                class="flex items-start gap-3 min-w-0"
                                            >
                                                <div
                                                    class="mt-0.5 rounded-full p-1.5 {rule.type ===
                                                    'income'
                                                        ? 'bg-income/10'
                                                        : 'bg-expense/10'}"
                                                >
                                                    <RefreshCw
                                                        class="h-4 w-4 {rule.type ===
                                                        'income'
                                                            ? 'text-income'
                                                            : 'text-expense'}"
                                                    />
                                                </div>
                                                <div class="min-w-0">
                                                    <div
                                                        class="flex items-center gap-2 flex-wrap"
                                                    >
                                                        <span
                                                            class="font-semibold text-foreground"
                                                            >{rule.category}</span
                                                        >
                                                        <Badge
                                                            variant="secondary"
                                                            class="text-xs"
                                                            >Paused</Badge
                                                        >
                                                        <Badge
                                                            variant="outline"
                                                            class="text-xs"
                                                            >{FREQ_LABELS[
                                                                rule.frequency
                                                            ]}</Badge
                                                        >
                                                    </div>
                                                    <p
                                                        class="text-lg font-bold mt-0.5 {rule.type ===
                                                        'income'
                                                            ? 'text-income'
                                                            : 'text-expense'}"
                                                    >
                                                        {rule.type === "expense"
                                                            ? "−"
                                                            : "+"}{formatCurrency(
                                                            rule.amount,
                                                            preferencesStore,
                                                        )}
                                                    </p>
                                                    <div
                                                        class="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-1"
                                                    >
                                                        <span
                                                            >Next: {format(
                                                                parseISO(
                                                                    rule.next_run_date,
                                                                ),
                                                                "MMM d, yyyy",
                                                            )}</span
                                                        >
                                                        <span
                                                            >Runs: {rule.occurrences_created}
                                                            time{rule.occurrences_created !==
                                                            1
                                                                ? "s"
                                                                : ""}</span
                                                        >
                                                        {#if rule.end_date}<span
                                                                >Until: {format(
                                                                    parseISO(
                                                                        rule.end_date,
                                                                    ),
                                                                    "MMM d, yyyy",
                                                                )}</span
                                                            >{/if}
                                                        {#if rule.max_occurrences}<span
                                                                >Max: {rule.max_occurrences}</span
                                                            >{/if}
                                                    </div>
                                                    {#if rule.note}<p
                                                            class="text-xs text-muted-foreground/70 mt-0.5 truncate"
                                                        >
                                                            {rule.note}
                                                        </p>{/if}
                                                </div>
                                            </div>
                                            <div
                                                class="flex items-center gap-1 shrink-0"
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    class="h-8 w-8"
                                                    onclick={() =>
                                                        toggle(
                                                            rule.id,
                                                            rule.is_active,
                                                        )}
                                                    title="Resume"
                                                >
                                                    <Play class="h-4 w-4" />
                                                </Button>
                                                <AlertDialog.Root>
                                                    <AlertDialog.Trigger>
                                                        {#snippet child({
                                                            props,
                                                        })}
                                                            <Button
                                                                {...props}
                                                                variant="ghost"
                                                                size="icon"
                                                                class="h-8 w-8 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2
                                                                    class="h-4 w-4"
                                                                />
                                                            </Button>
                                                        {/snippet}
                                                    </AlertDialog.Trigger>
                                                    <AlertDialog.Content>
                                                        <AlertDialog.Header>
                                                            <AlertDialog.Title
                                                                >Delete
                                                                recurring rule?</AlertDialog.Title
                                                            >
                                                            <AlertDialog.Description
                                                            >
                                                                This will stop
                                                                future automatic
                                                                transactions.
                                                                Past
                                                                transactions
                                                                will not be
                                                                affected.
                                                            </AlertDialog.Description>
                                                        </AlertDialog.Header>
                                                        <AlertDialog.Footer>
                                                            <AlertDialog.Cancel
                                                                >Cancel</AlertDialog.Cancel
                                                            >
                                                            <AlertDialog.Action
                                                                onclick={() =>
                                                                    deleteRecurring.mutate(
                                                                        rule.id,
                                                                    )}
                                                                class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete
                                                            </AlertDialog.Action>
                                                        </AlertDialog.Footer>
                                                    </AlertDialog.Content>
                                                </AlertDialog.Root>
                                            </div>
                                        </div>
                                    </Card.Content>
                                </Card.Root>
                            {/each}
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</AppLayout>
