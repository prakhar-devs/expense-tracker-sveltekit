import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, addWeeks, addMonths, addYears } from "date-fns";
import { CalendarIcon, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, Transaction, TransactionType } from "@/lib/constants";
import { useAddTransaction, useUpdateTransaction, useCategories, useAddRecurring } from "@/hooks/useData";
import { toast } from "sonner";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  date: z.date({ required_error: "Date is required" }),
  note: z.string().optional(),
  isRecurring: z.boolean().default(false),
  frequency: z.enum(["daily", "weekly", "monthly", "yearly"]).optional(),
  endCondition: z.enum(["never", "date", "occurrences"]).optional(),
  endDate: z.date().optional(),
  maxOccurrences: z.coerce.number().int().min(1).optional(),
});

type FormValues = z.infer<typeof schema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onClose?: () => void;
  trigger?: React.ReactNode;
}

function getNextRunDate(startDate: Date, frequency: "daily" | "weekly" | "monthly" | "yearly"): string {
  switch (frequency) {
    case "daily": return format(addDays(startDate, 1), "yyyy-MM-dd");
    case "weekly": return format(addWeeks(startDate, 1), "yyyy-MM-dd");
    case "monthly": return format(addMonths(startDate, 1), "yyyy-MM-dd");
    case "yearly": return format(addYears(startDate, 1), "yyyy-MM-dd");
  }
}

const TransactionForm = ({ transaction, onClose, trigger }: TransactionFormProps) => {
  const [open, setOpen] = useState(false);
  const addTx = useAddTransaction();
  const updateTx = useUpdateTransaction();
  const addRecurring = useAddRecurring();
  const { data: customCategories } = useCategories();

  const isEdit = !!transaction;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: transaction?.type ?? "expense",
      amount: transaction?.amount ?? undefined,
      category: transaction?.category ?? "",
      date: transaction ? new Date(transaction.date) : new Date(),
      note: transaction?.note ?? "",
      isRecurring: false,
      frequency: "monthly",
      endCondition: "never",
    },
  });

  const watchedType = form.watch("type");
  const isRecurring = form.watch("isRecurring");
  const endCondition = form.watch("endCondition");

  const getCategories = (type: TransactionType) => {
    const preset = type === "income" ? [...INCOME_CATEGORIES] : [...EXPENSE_CATEGORIES];
    const custom = customCategories?.filter((c) => c.type === type).map((c) => c.name) ?? [];
    return [...new Set([...preset, ...custom])];
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        type: values.type,
        amount: values.amount,
        category: values.category,
        date: format(values.date, "yyyy-MM-dd"),
        note: values.note || null,
      };

      if (isEdit) {
        await updateTx.mutateAsync({ id: transaction.id, ...payload });
        toast.success("Transaction updated");
      } else if (values.isRecurring && values.frequency) {
        // Create recurring rule
        const freq = values.frequency;
        await addRecurring.mutateAsync({
          type: values.type,
          amount: values.amount,
          category: values.category,
          note: values.note || null,
          frequency: freq,
          start_date: format(values.date, "yyyy-MM-dd"),
          end_date: values.endCondition === "date" && values.endDate ? format(values.endDate, "yyyy-MM-dd") : null,
          max_occurrences: values.endCondition === "occurrences" && values.maxOccurrences ? values.maxOccurrences : null,
          next_run_date: format(values.date, "yyyy-MM-dd"),
          is_active: true,
        });
        // Also create the first transaction immediately
        await addTx.mutateAsync(payload);
        toast.success("Recurring transaction created!", { description: `Will repeat ${freq} starting today.` });
      } else {
        await addTx.mutateAsync(payload);
        toast.success("Transaction added");
      }
      form.reset();
      setOpen(false);
      onClose?.();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) onClose?.();
  };

  const isPending = addTx.isPending || updateTx.isPending || addRecurring.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Transaction" : "New Transaction"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={field.value === "expense" ? "default" : "outline"}
                      className={cn("flex-1", field.value === "expense" && "bg-expense text-expense-foreground hover:bg-expense/90")}
                      onClick={() => { field.onChange("expense"); form.setValue("category", ""); }}
                    >
                      Expense
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "income" ? "default" : "outline"}
                      className={cn("flex-1", field.value === "income" && "bg-income text-income-foreground hover:bg-income/90")}
                      onClick={() => { field.onChange("income"); form.setValue("category", ""); }}
                    >
                      Income
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getCategories(watchedType).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add a note..." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Recurring Toggle - only for new transactions */}
            {!isEdit && (
              <>
                <Separator />
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-primary" />
                        <div>
                          <FormLabel className="cursor-pointer">Make this recurring</FormLabel>
                          <p className="text-xs text-muted-foreground">Automatically repeats on a schedule</p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {isRecurring && (
                  <div className="space-y-3 pl-2 border-l-2 border-primary/30">
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End condition</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="never">Never ends</SelectItem>
                              <SelectItem value="date">End on specific date</SelectItem>
                              <SelectItem value="occurrences">End after X occurrences</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {endCondition === "date" && (
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : "Pick end date"}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {endCondition === "occurrences" && (
                      <FormField
                        control={form.control}
                        name="maxOccurrences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of occurrences</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" placeholder="e.g. 12" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Update" : isRecurring ? "Create Recurring" : "Add Transaction"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
