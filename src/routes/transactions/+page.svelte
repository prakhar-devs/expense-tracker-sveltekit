<script lang="ts">
    import AppLayout from "$lib/components/AppLayout.svelte";
    import TransactionItem from "$lib/components/TransactionItem.svelte";
    import TransactionForm from "$lib/components/TransactionForm.svelte";
    import { Button } from "$lib/components/ui/button";
    import {
        Plus,
        Search,
        X,
        Calendar as CalendarIcon,
        RotateCcw,
        Filter,
    } from "lucide-svelte";
    import {
        createTransactionsPagedQuery,
        createCategoriesQuery,
    } from "$lib/data";
    import * as Card from "$lib/components/ui/card";
    import * as Select from "$lib/components/ui/select";
    import * as Popover from "$lib/components/ui/popover";
    import { Calendar } from "$lib/components/ui/calendar";
    import { Input } from "$lib/components/ui/input";
    import { auth } from "$lib/stores/auth";
    import { cn } from "$lib/utils";
    import { format } from "date-fns";
    import { CalendarDate, getLocalTimeZone } from "@internationalized/date";

    let { data } = $props();

    let txFormOpen = $state(false);
    let showMobileFilters = $state(false);
    let page = $state(1);

    // Filter state
    let searchTerm = $state("");
    let typeFilter = $state<"all" | "income" | "expense">("all");
    let dateFrom = $state<CalendarDate | undefined>();
    let dateTo = $state<CalendarDate | undefined>();

    // Reset page when filters change
    $effect(() => {
        searchTerm;
        typeFilter;
        dateFrom;
        dateTo;
        page = 1;
    });

    function resetFilters() {
        searchTerm = "";
        typeFilter = "all";
        dateFrom = undefined;
        dateTo = undefined;
    }

    // Use the paginated query hook
    const query = createTransactionsPagedQuery(
        () => $auth.user?.id,
        () => page,
        () => ({
            search: searchTerm || undefined,
            type: typeFilter === "all" ? undefined : typeFilter,
            dateFrom: dateFrom?.toString(),
            dateTo: dateTo?.toString(),
        }),
        () =>
            page === 1 &&
            !searchTerm &&
            typeFilter === "all" &&
            !dateFrom &&
            !dateTo
                ? data.preloaded?.transactionsPaged
                : undefined,
    );

    let transactions = $derived(query.data?.data || []);
    let isLoading = $derived(query.isLoading);
    let hasNextPage = $derived(
        query.data ? query.data.page < query.data.totalPages : false,
    );

    function loadMore() {
        if (hasNextPage) {
            page += 1; // Increment page to load more
        }
    }
</script>

<AppLayout>
    <div class="flex flex-col h-full animate-fade-in overflow-hidden">
        <div class="shrink-0 bg-background pb-4 pt-2 border-b border-border/40">
            <div class="flex items-center justify-between gap-4">
                <div class="min-w-0">
                    <h1
                        class="font-display text-2xl sm:text-3xl font-bold text-foreground truncate"
                    >
                        Transactions
                    </h1>
                    <p
                        class="text-muted-foreground text-sm sm:text-base truncate hidden sm:block"
                    >
                        View and manage your transaction history
                    </p>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                    <!-- Filter Toggle (Mobile Only) -->
                    <Button
                        variant="ghost"
                        size="icon"
                        onclick={() => (showMobileFilters = !showMobileFilters)}
                        class={cn(
                            "lg:hidden h-10 w-10 transition-colors",
                            showMobileFilters && "bg-primary/10 text-primary",
                        )}
                    >
                        <Filter class="h-5 w-5" />
                    </Button>

                    <TransactionForm bind:open={txFormOpen}>
                        <Button
                            onclick={() => (txFormOpen = true)}
                            class="hidden sm:flex h-10 w-auto px-3 sm:px-4 sm:h-10 gap-2 shadow-sm shrink-0"
                        >
                            <Plus class="h-4 w-4" />
                            <span class="inline sm:hidden">Add</span>
                            <span class="hidden sm:inline">Add Transaction</span
                            >
                        </Button>
                    </TransactionForm>
                </div>
            </div>
        </div>

        <div
            class={cn(
                "shrink-0 bg-background border-b border-border/40 overflow-hidden transition-all duration-300",
                showMobileFilters
                    ? "pb-4 pt-4 h-auto opacity-100"
                    : "h-0 lg:h-auto pb-0 pt-0 lg:pb-4 lg:pt-4 opacity-0 lg:opacity-100",
            )}
        >
            <div
                class="flex flex-col lg:flex-row gap-3 items-start lg:items-center"
            >
                <!-- Search - flexible width -->
                <div class="relative w-full lg:flex-1 lg:min-w-[200px]">
                    <Search
                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    />
                    <Input
                        placeholder="Search..."
                        bind:value={searchTerm}
                        class="pl-9 pr-9 h-11 lg:h-10 w-full bg-muted/5 border-border/50 focus:bg-background transition-colors"
                    />
                    {#if searchTerm}
                        <button
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                            onclick={() => (searchTerm = "")}
                        >
                            <X class="h-4 w-4" />
                        </button>
                    {/if}
                </div>

                <div class="flex items-center gap-2 w-full lg:w-auto">
                    <!-- Type Selector -->
                    <div class="flex-1 lg:w-36 shrink-0">
                        <Select.Root type="single" bind:value={typeFilter}>
                            <Select.Trigger
                                class="w-full h-11 lg:h-10 bg-muted/5 border-border/50"
                            >
                                <span class="truncate">
                                    {typeFilter === "all"
                                        ? "All Types"
                                        : typeFilter.charAt(0).toUpperCase() +
                                          typeFilter.slice(1)}
                                </span>
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="all">All Types</Select.Item>
                                <Select.Item value="income">Income</Select.Item>
                                <Select.Item value="expense"
                                    >Expense</Select.Item
                                >
                            </Select.Content>
                        </Select.Root>
                    </div>

                    <!-- Date Range -->
                    <div class="flex items-center gap-1.5 flex-1 lg:flex-none">
                        <Popover.Root>
                            <Popover.Trigger>
                                {#snippet child({ props })}
                                    <Button
                                        {...props}
                                        variant="outline"
                                        class={cn(
                                            "flex-1 lg:w-[130px] justify-start text-left font-normal h-11 lg:h-10 px-3 bg-muted/5 border-border/50",
                                            !dateFrom &&
                                                "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon
                                            class="mr-2 h-4 w-4 shrink-0"
                                        />
                                        <span class="truncate">
                                            {dateFrom
                                                ? format(
                                                      dateFrom.toDate(
                                                          getLocalTimeZone(),
                                                      ),
                                                      "MMM d",
                                                  )
                                                : "From"}
                                        </span>
                                    </Button>
                                {/snippet}
                            </Popover.Trigger>
                            <Popover.Content class="w-auto p-0" align="start">
                                <Calendar type="single" bind:value={dateFrom} />
                            </Popover.Content>
                        </Popover.Root>

                        <Popover.Root>
                            <Popover.Trigger>
                                {#snippet child({ props })}
                                    <Button
                                        {...props}
                                        variant="outline"
                                        class={cn(
                                            "flex-1 lg:w-[130px] justify-start text-left font-normal h-11 lg:h-10 px-3 bg-muted/5 border-border/50",
                                            !dateTo && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon
                                            class="mr-2 h-4 w-4 shrink-0"
                                        />
                                        <span class="truncate">
                                            {dateTo
                                                ? format(
                                                      dateTo.toDate(
                                                          getLocalTimeZone(),
                                                      ),
                                                      "MMM d",
                                                  )
                                                : "To"}
                                        </span>
                                    </Button>
                                {/snippet}
                            </Popover.Trigger>
                            <Popover.Content class="w-auto p-0" align="start">
                                <Calendar type="single" bind:value={dateTo} />
                            </Popover.Content>
                        </Popover.Root>
                    </div>

                    <!-- Reset Button - only shows if any filter is active -->
                    {#if searchTerm || typeFilter !== "all" || dateFrom || dateTo}
                        <Button
                            variant="ghost"
                            size="icon"
                            onclick={resetFilters}
                            class="h-11 w-11 lg:h-10 lg:w-10 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title="Reset Filters"
                        >
                            <RotateCcw class="h-4 w-4" />
                        </Button>
                    {/if}
                </div>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto pt-6 pb-6 w-full">
            <Card.Root class="border-border/50 shadow-sm w-full">
                <Card.Content class="p-0">
                    {#if isLoading && transactions.length === 0}
                        <div class="space-y-3 p-4">
                            {#each Array(5) as _}
                                <div
                                    class="h-16 animate-pulse rounded-lg bg-muted"
                                ></div>
                            {/each}
                        </div>
                    {:else if transactions.length === 0}
                        <div class="py-16 text-center">
                            <p class="text-muted-foreground">
                                No transactions found.
                            </p>
                        </div>
                    {:else}
                        <div class="divide-y divide-border/50">
                            {#each transactions as transaction (transaction.id)}
                                <div
                                    class="p-4 sm:px-6 hover:bg-muted/30 transition-colors"
                                >
                                    <TransactionItem {transaction} />
                                </div>
                            {/each}
                        </div>
                    {/if}

                    {#if hasNextPage}
                        <div
                            class="p-4 border-t border-border/50 flex justify-center"
                        >
                            <Button
                                variant="outline"
                                onclick={loadMore}
                                disabled={isLoading}
                            >
                                {isLoading ? "Loading..." : "Load More"}
                            </Button>
                        </div>
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</AppLayout>
