import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useDeleteTransaction } from "@/hooks/useData";
import TransactionForm from "./TransactionForm";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { usePreferences } from "@/contexts/PreferencesContext";
import { formatCurrency, formatDate } from "@/lib/formatters";

interface TransactionItemProps {
  transaction: Transaction;
  showActions?: boolean;
}

const TransactionItem = ({ transaction, showActions = true }: TransactionItemProps) => {
  const { preferences } = usePreferences();
  const deleteTx = useDeleteTransaction();
  const isIncome = transaction.type === "income";

  const handleDelete = async () => {
    try {
      await deleteTx.mutateAsync(transaction.id);
      toast.success("Transaction deleted");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border/50 bg-card p-[var(--card-padding)] transition-all hover:shadow-md animate-fade-in group">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:scale-105",
          isIncome ? "bg-income-muted text-income" : "bg-expense-muted text-expense"
        )}
      >
        {isIncome ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="truncate font-medium text-foreground">{transaction.category}</p>
          {(transaction as any).recurring_id && (
            <span className="shrink-0 text-xs text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded font-medium" title="Created by recurring rule">🔁</span>
          )}
        </div>
        <p className="truncate text-sm text-muted-foreground">
          {transaction.note || formatDate(transaction.date)}
        </p>
      </div>

      <div className="text-right">
        <p className={cn("font-display font-semibold", isIncome ? "text-income" : "text-expense")}>
          {isIncome ? "+" : "-"}{formatCurrency(Number(transaction.amount), preferences)}
        </p>
        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
      </div>

      {showActions && (
        <div className="flex shrink-0 gap-1">
          <TransactionForm
            transaction={transaction}
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit2 className="h-4 w-4" />
              </Button>
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this {transaction.type} of ${Number(transaction.amount).toFixed(2)}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default TransactionItem;
