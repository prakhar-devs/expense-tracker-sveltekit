<script lang="ts">
  import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-svelte";
  import { cn } from "$lib/utils";
  import type { Transaction } from "$lib/constants";
  import { Button } from "$lib/components/ui/button";
  import { createDeleteTransactionMutation } from "$lib/data";
  import { formatCurrency, formatDate } from "$lib/formatters";
  import { preferencesStore } from "$lib/stores/preferences";
  import TransactionForm from "./TransactionForm.svelte";
  import { toast } from "svelte-sonner";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";

  let { transaction, showActions = true } = $props<{
    transaction: Transaction;
    showActions?: boolean;
  }>();

  const deleteTx = createDeleteTransactionMutation();
  let isIncome = $derived(transaction.type === "income");

  async function handleDelete() {
    try {
      await deleteTx.mutateAsync(transaction.id);
      toast.success("Transaction deleted");
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  let isAlertOpen = $state(false);
  let isFormOpen = $state(false);
</script>

<div
  class="group flex items-center gap-4 rounded-lg border border-border/50 bg-card p-[var(--card-padding)] transition-all hover:shadow-md animate-fade-in"
>
  <div
    class={cn(
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:scale-105",
      isIncome
        ? "bg-income-muted text-income"
        : "bg-expense-muted text-expense",
    )}
  >
    {#if isIncome}
      <ArrowDownLeft class="h-5 w-5" />
    {:else}
      <ArrowUpRight class="h-5 w-5" />
    {/if}
  </div>

  <div class="min-w-0 flex-1">
    <div class="flex items-center gap-1.5 min-w-0">
      <p class="truncate font-medium text-foreground">{transaction.category}</p>
      {#if transaction.recurring_id}
        <span
          class="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary/70"
          title="Created by recurring rule">🔁</span
        >
      {/if}
    </div>
    <p class="truncate text-sm text-muted-foreground">
      {transaction.note || formatDate(transaction.date)}
    </p>
  </div>

  <div class="text-right">
    <p
      class={cn(
        "font-display font-semibold",
        isIncome ? "text-income" : "text-expense",
      )}
    >
      {isIncome ? "+" : "-"}{formatCurrency(
        Number(transaction.amount),
        $preferencesStore,
      )}
    </p>
    <p class="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
  </div>

  {#if showActions}
    <div
      class="flex shrink-0 gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <TransactionForm bind:open={isFormOpen} {transaction}>
        <Button
          variant="ghost"
          size="icon"
          class="h-8 w-8"
          onclick={() => (isFormOpen = true)}
        >
          <Pencil class="h-4 w-4" />
        </Button>
      </TransactionForm>

      <AlertDialog.Root bind:open={isAlertOpen}>
        <AlertDialog.Trigger>
          {#snippet child({ props })}
            <Button
              {...props}
              variant="ghost"
              size="icon"
              class="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          {/snippet}
        </AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete transaction?</AlertDialog.Title>
            <AlertDialog.Description>
              This will permanently remove this {transaction.type} of {formatCurrency(
                Number(transaction.amount),
                $preferencesStore,
              )}.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
              class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onclick={handleDelete}
            >
              Delete
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  {/if}
</div>
