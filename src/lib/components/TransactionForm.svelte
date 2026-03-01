<script lang="ts">
    import { onMount } from "svelte";
    import { format } from "date-fns";
    import { CalendarDate } from "@internationalized/date";
    import { CalendarIcon, Plus, RefreshCw } from "lucide-svelte";
    import { cn } from "$lib/utils";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Calendar } from "$lib/components/ui/calendar";
    import * as Popover from "$lib/components/ui/popover";
    import * as Select from "$lib/components/ui/select";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Drawer from "$lib/components/ui/drawer";
    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch";
    import { Separator } from "$lib/components/ui/separator";
    import {
        EXPENSE_CATEGORIES,
        INCOME_CATEGORIES,
        type Transaction,
        type TransactionType,
    } from "$lib/constants";
    import {
        createAddTransactionMutation,
        createUpdateTransactionMutation,
        createCategoriesQuery,
        createAddRecurringMutation,
    } from "$lib/data";
    import { toast } from "svelte-sonner";
    import { auth } from "$lib/stores/auth";

    let {
        transaction = undefined,
        open = $bindable(false),
        initialType = "expense",
        children,
    } = $props<{
        transaction?: Transaction;
        open?: boolean;
        initialType?: TransactionType;
        children?: import("svelte").Snippet<[any]>;
    }>();

    const addTx = createAddTransactionMutation();
    const updateTx = createUpdateTransactionMutation();
    const addRecurring = createAddRecurringMutation();
    const categoriesQuery = createCategoriesQuery(() => $auth.user?.id);

    let isMobile = $state(false);
    onMount(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        isMobile = mq.matches;
        const handler = (e: MediaQueryListEvent) => {
            isMobile = e.matches;
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    });

    let isEdit = $derived(!!transaction);

    let type = $state<TransactionType>(transaction?.type ?? "expense");
    let amount = $state<number | undefined>(
        transaction ? Number(transaction.amount) : undefined,
    );
    let category = $state(transaction?.category ?? "");
    let date = $state(transaction ? new Date(transaction.date) : new Date());
    let note = $state(transaction?.note ?? "");

    // Track changes if transaction updates or form opens for new tx
    $effect(() => {
        if (open) {
            if (transaction) {
                type = transaction.type;
                amount = Number(transaction.amount);
                category = transaction.category;
                date = new Date(transaction.date);
                note = transaction.note ?? "";
            } else {
                // Reset for new transaction
                type = "expense";
                amount = undefined;
                category = "";
                date = new Date();
                note = "";
                isRecurring = false;
            }
        }
    });

    let isRecurring = $state(false);
    let frequency = $state("monthly");
    let endCondition = $state("never");
    let endDate = $state<Date | undefined>(undefined);
    let maxOccurrences = $state<number | undefined>(undefined);

    let customCategories = $derived(categoriesQuery.data ?? []);
    let presetCategories = $derived(
        type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES,
    );
    let availableCategories = $derived([
        ...new Set([
            ...presetCategories,
            ...customCategories
                .filter((c) => c.type === type)
                .map((c) => c.name),
        ]),
    ]);

    let selectedCategoryObj = $derived(
        category ? { value: category, label: category } : undefined,
    );
    let selectedFreqObj = $derived(
        frequency
            ? {
                  value: frequency,
                  label: frequency.charAt(0).toUpperCase() + frequency.slice(1),
              }
            : { value: "monthly", label: "Monthly" },
    );

    let selectedEndConditionObj = $derived(
        endCondition
            ? {
                  value: endCondition,
                  label:
                      endCondition === "never"
                          ? "Never ends"
                          : endCondition === "date"
                            ? "End on specific date"
                            : "End after X occurrences",
              }
            : undefined,
    );

    async function handleSubmit(e: Event) {
        e.preventDefault();
        if (!amount || amount <= 0)
            return toast.error("Amount must be greater than 0");
        if (!category) return toast.error("Category is required");
        if (!date) return toast.error("Date is required");

        try {
            const payload = {
                type,
                amount,
                category,
                date: format(date, "yyyy-MM-dd"),
                note: note || null,
            };

            if (isEdit && transaction) {
                await updateTx.mutateAsync({ id: transaction.id, ...payload });
                toast.success("Transaction updated");
            } else if (isRecurring && frequency) {
                await addRecurring.mutateAsync({
                    type,
                    amount,
                    category,
                    note: note || null,
                    frequency: frequency as any,
                    start_date: format(date, "yyyy-MM-dd"),
                    end_date:
                        endCondition === "date" && endDate
                            ? format(endDate, "yyyy-MM-dd")
                            : null,
                    max_occurrences:
                        endCondition === "occurrences" && maxOccurrences
                            ? maxOccurrences
                            : null,
                    next_run_date: format(date, "yyyy-MM-dd"),
                    is_active: true,
                });
                await addTx.mutateAsync(payload);
                toast.success("Recurring transaction created!", {
                    description: `Will repeat ${frequency} starting today.`,
                });
            } else {
                await addTx.mutateAsync(payload);
                toast.success("Transaction added");
            }
            open = false;
            // Reset form if it wasn't an edit
            if (!isEdit) {
                amount = undefined;
                category = "";
                note = "";
                isRecurring = false;
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    let isPending = $derived(
        addTx.isPending || updateTx.isPending || addRecurring.isPending,
    );
    let titleText = $derived(isEdit ? "Edit Transaction" : "New Transaction");
</script>

{#if !isMobile}
    <Dialog.Root bind:open>
        {#if children}
            {@render children()}
        {/if}
        <Dialog.Content class="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <Dialog.Header>
                <Dialog.Title class="font-display">{titleText}</Dialog.Title>
            </Dialog.Header>

            <form onsubmit={handleSubmit} class="space-y-4">
                <div class="space-y-2">
                    <Label>Type</Label>
                    <div class="flex gap-2">
                        <Button
                            type="button"
                            variant={type === "expense" ? "default" : "outline"}
                            class={cn(
                                "flex-1",
                                type === "expense" &&
                                    "bg-expense text-expense-foreground hover:bg-expense/90",
                            )}
                            onclick={() => {
                                type = "expense";
                                category = "";
                            }}
                        >
                            Expense
                        </Button>
                        <Button
                            type="button"
                            variant={type === "income" ? "default" : "outline"}
                            class={cn(
                                "flex-1",
                                type === "income" &&
                                    "bg-income text-income-foreground hover:bg-income/90",
                            )}
                            onclick={() => {
                                type = "income";
                                category = "";
                            }}
                        >
                            Income
                        </Button>
                    </div>
                </div>

                <div class="space-y-2">
                    <Label>Amount</Label>
                    <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.00"
                        bind:value={amount}
                        required
                    />
                </div>

                <div class="space-y-2">
                    <Label>Category</Label>
                    <Select.Root type="single" bind:value={category}>
                        <Select.Trigger>
                            {category || "Select category"}
                        </Select.Trigger>
                        <Select.Content>
                            {#each availableCategories as cat}
                                <Select.Item value={cat}>{cat}</Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                </div>

                <div class="space-y-2 flex flex-col">
                    <Label>Date</Label>
                    <Popover.Root>
                        <Popover.Trigger>
                            {#snippet child({ props })}
                                <Button
                                    {...props}
                                    variant="outline"
                                    class={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !date && "text-muted-foreground",
                                    )}
                                >
                                    {date ? format(date, "PPP") : "Pick a date"}
                                    <CalendarIcon
                                        class="ml-auto h-4 w-4 opacity-50"
                                    />
                                </Button>
                            {/snippet}
                        </Popover.Trigger>
                        <Popover.Content class="w-auto p-0" align="start">
                            <Calendar
                                type="single"
                                value={date
                                    ? new CalendarDate(
                                          date.getFullYear(),
                                          date.getMonth() + 1,
                                          date.getDate(),
                                      )
                                    : (undefined as any)}
                                onValueChange={(v: any) =>
                                    (date = v
                                        ? new Date(v.year, v.month - 1, v.day)
                                        : new Date())}
                                class="p-3 pointer-events-auto"
                            />
                        </Popover.Content>
                    </Popover.Root>
                </div>

                <div class="space-y-2">
                    <Label>Note (optional)</Label>
                    <Textarea
                        placeholder="Add a note..."
                        class="resize-none"
                        bind:value={note}
                    />
                </div>

                {#if !isEdit}
                    <div class="pt-2">
                        <Separator />
                    </div>
                    <div
                        class="flex items-center justify-between rounded-lg border border-border/50 p-3 mt-4"
                    >
                        <div class="flex items-center gap-2">
                            <RefreshCw class="h-4 w-4 text-primary" />
                            <div>
                                <Label class="cursor-pointer"
                                    >Make this recurring</Label
                                >
                                <p class="text-xs text-muted-foreground">
                                    Automatically repeats on a schedule
                                </p>
                            </div>
                        </div>
                        <Switch bind:checked={isRecurring} />
                    </div>

                    {#if isRecurring}
                        <div
                            class="space-y-3 pl-2 border-l-2 border-primary/30 mt-4"
                        >
                            <div class="space-y-2">
                                <Label>Frequency</Label>
                                <Select.Root
                                    type="single"
                                    bind:value={frequency}
                                >
                                    <Select.Trigger>{frequency}</Select.Trigger>
                                    <Select.Content>
                                        <Select.Item value="daily"
                                            >Daily</Select.Item
                                        >
                                        <Select.Item value="weekly"
                                            >Weekly</Select.Item
                                        >
                                        <Select.Item value="monthly"
                                            >Monthly</Select.Item
                                        >
                                        <Select.Item value="yearly"
                                            >Yearly</Select.Item
                                        >
                                    </Select.Content>
                                </Select.Root>
                            </div>

                            <div class="space-y-2">
                                <Label>End condition</Label>
                                <Select.Root
                                    type="single"
                                    bind:value={endCondition}
                                >
                                    <Select.Trigger
                                        >{endCondition}</Select.Trigger
                                    >
                                    <Select.Content>
                                        <Select.Item value="never"
                                            >Never ends</Select.Item
                                        >
                                        <Select.Item value="date"
                                            >End on specific date</Select.Item
                                        >
                                        <Select.Item value="occurrences"
                                            >End after X occurrences</Select.Item
                                        >
                                    </Select.Content>
                                </Select.Root>
                            </div>

                            {#if endCondition === "date"}
                                <div class="space-y-2 flex flex-col">
                                    <Label>End date</Label>
                                    <Popover.Root>
                                        <Popover.Trigger>
                                            {#snippet child({ props })}
                                                <Button
                                                    {...props}
                                                    variant="outline"
                                                    class={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !endDate &&
                                                            "text-muted-foreground",
                                                    )}
                                                >
                                                    {endDate
                                                        ? format(endDate, "PPP")
                                                        : "Pick end date"}
                                                    <CalendarIcon
                                                        class="ml-auto h-4 w-4 opacity-50"
                                                    />
                                                </Button>
                                            {/snippet}
                                        </Popover.Trigger>
                                        <Popover.Content
                                            class="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                type="single"
                                                value={endDate as any}
                                                onValueChange={(v: any) =>
                                                    (endDate = v as any)}
                                                minValue={new Date() as any}
                                                class="p-3 pointer-events-auto"
                                            />
                                        </Popover.Content>
                                    </Popover.Root>
                                </div>
                            {/if}

                            {#if endCondition === "occurrences"}
                                <div class="space-y-2">
                                    <Label>Number of occurrences</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 12"
                                        bind:value={maxOccurrences}
                                    />
                                </div>
                            {/if}
                        </div>
                    {/if}
                {/if}

                <Button type="submit" class="w-full mt-4" disabled={isPending}>
                    {isPending
                        ? "Saving..."
                        : isEdit
                          ? "Update"
                          : isRecurring
                            ? "Create Recurring"
                            : "Add Transaction"}
                </Button>
            </form>
        </Dialog.Content>
    </Dialog.Root>
{:else}
    <Drawer.Root bind:open>
        {#if children}
            {@render children()}
        {/if}
        <Drawer.Content class="max-h-[90vh]">
            <Drawer.Header class="text-left">
                <Drawer.Title class="font-display">{titleText}</Drawer.Title>
            </Drawer.Header>
            <div class="overflow-y-auto w-full px-4 pb-8">
                <form onsubmit={handleSubmit} class="space-y-4">
                    <!-- Same form content as above -->
                    <div class="space-y-2">
                        <Label>Type</Label>
                        <div class="flex gap-2">
                            <Button
                                type="button"
                                variant={type === "expense"
                                    ? "default"
                                    : "outline"}
                                class={cn(
                                    "flex-1",
                                    type === "expense" &&
                                        "bg-expense text-expense-foreground hover:bg-expense/90",
                                )}
                                onclick={() => {
                                    type = "expense";
                                    category = "";
                                }}>Expense</Button
                            >
                            <Button
                                type="button"
                                variant={type === "income"
                                    ? "default"
                                    : "outline"}
                                class={cn(
                                    "flex-1",
                                    type === "income" &&
                                        "bg-income text-income-foreground hover:bg-income/90",
                                )}
                                onclick={() => {
                                    type = "income";
                                    category = "";
                                }}>Income</Button
                            >
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label>Amount</Label><Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            bind:value={amount}
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <Label>Category</Label><Select.Root
                            type="single"
                            bind:value={category}
                        >
                            <Select.Trigger
                                >{category || "Select category"}</Select.Trigger
                            ><Select.Content
                                >{#each availableCategories as cat}<Select.Item
                                        value={cat}>{cat}</Select.Item
                                    >{/each}</Select.Content
                            ></Select.Root
                        >
                    </div>
                    <div class="space-y-2 flex flex-col">
                        <Label>Date</Label><Popover.Root
                            ><Popover.Trigger>
                                {#snippet child({ props })}
                                    <Button
                                        {...props}
                                        variant="outline"
                                        class={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !date && "text-muted-foreground",
                                        )}
                                        >{date
                                            ? format(date, "PPP")
                                            : "Pick a date"}<CalendarIcon
                                            class="ml-auto h-4 w-4 opacity-50"
                                        /></Button
                                    >
                                {/snippet}
                            </Popover.Trigger><Popover.Content
                                class="w-auto p-0"
                                align="start"
                                ><Calendar
                                    type="single"
                                    value={date as any}
                                    onValueChange={(v: any) =>
                                        (date = v as any)}
                                    class="p-3 pointer-events-auto"
                                /></Popover.Content
                            ></Popover.Root
                        >
                    </div>
                    <div class="space-y-2">
                        <Label>Note (optional)</Label><Textarea
                            placeholder="Add a note..."
                            class="resize-none"
                            bind:value={note}
                        />
                    </div>
                    {#if !isEdit}<div class="pt-2"><Separator /></div>
                        <div
                            class="flex items-center justify-between rounded-lg border border-border/50 p-3 mt-4"
                        >
                            <div class="flex items-center gap-2">
                                <RefreshCw class="h-4 w-4 text-primary" />
                                <div>
                                    <Label class="cursor-pointer"
                                        >Make this recurring</Label
                                    >
                                    <p class="text-xs text-muted-foreground">
                                        Automatically repeats on a schedule
                                    </p>
                                </div>
                            </div>
                            <Switch bind:checked={isRecurring} />
                        </div>
                        {#if isRecurring}<div
                                class="space-y-3 pl-2 border-l-2 border-primary/30 mt-4"
                            >
                                <div class="space-y-2">
                                    <Label>Frequency</Label><Select.Root
                                        type="single"
                                        bind:value={frequency}
                                    >
                                        <Select.Trigger
                                            >{frequency}</Select.Trigger
                                        ><Select.Content
                                            ><Select.Item value="daily"
                                                >Daily</Select.Item
                                            ><Select.Item value="weekly"
                                                >Weekly</Select.Item
                                            ><Select.Item value="monthly"
                                                >Monthly</Select.Item
                                            ><Select.Item value="yearly"
                                                >Yearly</Select.Item
                                            ></Select.Content
                                        ></Select.Root
                                    >
                                </div>
                                <div class="space-y-2">
                                    <Label>End condition</Label><Select.Root
                                        type="single"
                                        bind:value={endCondition}
                                    >
                                        <Select.Trigger
                                            >{endCondition}</Select.Trigger
                                        ><Select.Content
                                            ><Select.Item value="never"
                                                >Never ends</Select.Item
                                            ><Select.Item value="date"
                                                >End on specific date</Select.Item
                                            ><Select.Item value="occurrences"
                                                >End after X occurrences</Select.Item
                                            ></Select.Content
                                        ></Select.Root
                                    >
                                </div>
                                {#if endCondition === "date"}<div
                                        class="space-y-2 flex flex-col"
                                    >
                                        <Label>End date</Label><Popover.Root
                                            ><Popover.Trigger>
                                                {#snippet child({ props })}
                                                    <Button
                                                        {...props}
                                                        variant="outline"
                                                        class={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !endDate &&
                                                                "text-muted-foreground",
                                                        )}
                                                        >{endDate
                                                            ? format(
                                                                  endDate,
                                                                  "PPP",
                                                              )
                                                            : "Pick end date"}<CalendarIcon
                                                            class="ml-auto h-4 w-4 opacity-50"
                                                        /></Button
                                                    >
                                                {/snippet}
                                            </Popover.Trigger><Popover.Content
                                                class="w-auto p-0"
                                                align="start"
                                                ><Calendar
                                                    type="single"
                                                    value={endDate as any}
                                                    onValueChange={(v: any) =>
                                                        (endDate = v as any)}
                                                    minValue={new Date() as any}
                                                    class="p-3 pointer-events-auto"
                                                /></Popover.Content
                                            ></Popover.Root
                                        >
                                    </div>{/if}{#if endCondition === "occurrences"}<div
                                        class="space-y-2"
                                    >
                                        <Label>Number of occurrences</Label
                                        ><Input
                                            type="number"
                                            min="1"
                                            placeholder="e.g. 12"
                                            bind:value={maxOccurrences}
                                        />
                                    </div>{/if}
                            </div>{/if}{/if}
                    <Button
                        type="submit"
                        class="w-full mt-4"
                        disabled={isPending}
                        >{isPending
                            ? "Saving..."
                            : isEdit
                              ? "Update"
                              : isRecurring
                                ? "Create Recurring"
                                : "Add Transaction"}</Button
                    >
                </form>
            </div>
        </Drawer.Content>
    </Drawer.Root>
{/if}
