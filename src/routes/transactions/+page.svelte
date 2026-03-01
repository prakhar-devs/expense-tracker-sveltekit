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
        Download,
        FileSpreadsheet,
        FileText,
    } from "lucide-svelte";
    import {
        createTransactionsPagedQuery,
        createCategoriesQuery,
        fetchFilteredTransactions,
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
    import { toast } from "svelte-sonner";
    import jsPDF from "jspdf";
    import autoTable from "jspdf-autotable";

    let { data } = $props();

    let txFormOpen = $state(false);
    let showMobileFilters = $state(false);
    let page = $state(1);

    // Filter state
    let searchTerm = $state("");
    let typeFilter = $state<"all" | "income" | "expense">("all");
    let dateFrom = $state<CalendarDate | undefined>();
    let dateTo = $state<CalendarDate | undefined>();
    let amountOrder = $state<"asc" | "desc" | "date">("date");

    // Reset page when filters change
    $effect(() => {
        searchTerm;
        typeFilter;
        dateFrom;
        dateTo;
        amountOrder;
        page = 1;
    });

    function resetFilters() {
        searchTerm = "";
        typeFilter = "all";
        dateFrom = undefined;
        dateTo = undefined;
        amountOrder = "date";
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
            amountOrder: amountOrder === "date" ? undefined : amountOrder,
        }),
        () =>
            page === 1 &&
            !searchTerm &&
            typeFilter === "all" &&
            !dateFrom &&
            !dateTo &&
            amountOrder === "date"
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

    async function handleDownloadCSV() {
        if (!$auth.user?.id) return;

        try {
            toast.loading("Preparing CSV report...");
            const filters = {
                search: searchTerm || undefined,
                type: typeFilter === "all" ? undefined : typeFilter,
                dateFrom: dateFrom?.toString(),
                dateTo: dateTo?.toString(),
                amountOrder: amountOrder === "date" ? undefined : amountOrder,
            };

            const allTransactions = await fetchFilteredTransactions(
                $auth.user.id,
                filters,
            );

            if (allTransactions.length === 0) {
                toast.dismiss();
                toast.error("No transactions to download");
                return;
            }

            const headers = ["Date", "Category", "Note", "Type", "Amount"];
            const rows = allTransactions.map((t) => [
                format(new Date(t.date), "yyyy-MM-dd"),
                t.category,
                t.note || "",
                t.type,
                t.amount.toFixed(2),
            ]);

            const csvContent = [
                headers.join(","),
                ...rows.map((row) =>
                    row
                        .map(
                            (cell) =>
                                `"${(cell || "").toString().replace(/"/g, '""')}"`,
                        )
                        .join(","),
                ),
            ].join("\n");

            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute(
                "download",
                `spendwise_report_${format(new Date(), "yyyy-MM-dd")}.csv`,
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.dismiss();
            toast.success("CSV report downloaded");
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Failed to download CSV");
        }
    }

    async function handleDownloadPDF() {
        if (!$auth.user?.id) return;

        try {
            toast.loading("Preparing PDF report...");
            const filters = {
                search: searchTerm || undefined,
                type: typeFilter === "all" ? undefined : typeFilter,
                dateFrom: dateFrom?.toString(),
                dateTo: dateTo?.toString(),
                amountOrder: amountOrder === "date" ? undefined : amountOrder,
            };

            const allTransactions = await fetchFilteredTransactions(
                $auth.user.id,
                filters,
            );

            if (allTransactions.length === 0) {
                toast.dismiss();
                toast.error("No transactions to download");
                return;
            }

            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(30);
            doc.text("SpendWise Transaction Report", 14, 20);
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated on: ${format(new Date(), "PPPP")}`, 14, 28);

            const tableData = allTransactions.map((t) => [
                format(new Date(t.date), "MMM d, yyyy"),
                t.category,
                t.note || "-",
                t.type.charAt(0).toUpperCase() + t.type.slice(1),
                `$${t.amount.toFixed(2)}`,
            ]);

            autoTable(doc, {
                startY: 40,
                head: [["Date", "Category", "Note", "Type", "Amount"]],
                body: tableData,
                headStyles: { fillColor: [79, 70, 229] }, // Indigo-600
                alternateRowStyles: { fillColor: [249, 250, 251] }, // Gray-50
                margin: { top: 40 },
                styles: { fontSize: 10, cellPadding: 4 },
            });

            doc.save(
                `spendwise_report_${format(new Date(), "yyyy-MM-dd")}.pdf`,
            );
            toast.dismiss();
            toast.success("PDF report downloaded");
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Failed to download PDF");
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

                    <Popover.Root>
                        <Popover.Trigger>
                            <Button
                                variant="outline"
                                class="h-10 w-10 sm:w-auto px-0 sm:px-4 gap-2 shadow-sm shrink-0 border-border/50 bg-muted/5 hover:bg-muted/10 transition-colors"
                            >
                                <Download class="h-4 w-4" />
                                <span class="hidden sm:inline"
                                    >Download Report</span
                                >
                            </Button>
                        </Popover.Trigger>
                        <Popover.Content class="w-48 p-2" align="end">
                            <div class="space-y-1">
                                <button
                                    class="flex items-center gap-3 w-full p-2.5 text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors text-left"
                                    onclick={handleDownloadCSV}
                                >
                                    <div
                                        class="p-1.5 bg-blue-500/10 rounded-md"
                                    >
                                        <FileSpreadsheet
                                            class="h-4 w-4 text-blue-500"
                                        />
                                    </div>
                                    CSV Format
                                </button>
                                <button
                                    class="flex items-center gap-3 w-full p-2.5 text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors text-left"
                                    onclick={handleDownloadPDF}
                                >
                                    <div class="p-1.5 bg-red-500/10 rounded-md">
                                        <FileText
                                            class="h-4 w-4 text-red-500"
                                        />
                                    </div>
                                    PDF Document
                                </button>
                            </div>
                        </Popover.Content>
                    </Popover.Root>

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

                <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <!-- Type Selector -->
                    <div class="flex-1 min-w-[120px] lg:w-36 shrink-0">
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

                    <!-- Sort by Amount -->
                    <div class="flex-1 min-w-[140px] lg:w-36 shrink-0">
                        <Select.Root type="single" bind:value={amountOrder}>
                            <Select.Trigger
                                class="w-full h-11 lg:h-10 bg-muted/5 border-border/50"
                            >
                                <span class="truncate">
                                    {amountOrder === "desc"
                                        ? "Highest First"
                                        : amountOrder === "asc"
                                          ? "Lowest First"
                                          : "Sort by Amount"}
                                </span>
                            </Select.Trigger>
                            <Select.Content>
                                <Select.Item value="date"
                                    >Default (Date)</Select.Item
                                >
                                <Select.Item value="desc"
                                    >Highest First</Select.Item
                                >
                                <Select.Item value="asc"
                                    >Lowest First</Select.Item
                                >
                            </Select.Content>
                        </Select.Root>
                    </div>

                    <!-- Date Range -->
                    <div
                        class="flex items-center gap-1.5 flex-1 min-w-[260px] lg:flex-none"
                    >
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
                    {#if searchTerm || typeFilter !== "all" || dateFrom || dateTo || amountOrder !== "date"}
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
