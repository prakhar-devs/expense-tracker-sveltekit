import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Search, CalendarIcon, Download, TrendingUp, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, TransactionType } from "@/lib/constants";
import { useTransactionsPaged, useTransactions, useCategories, TransactionFilters } from "@/hooks/useData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { formatCurrency } from "@/lib/formatters";
import TransactionForm from "@/components/TransactionForm";
import TransactionItem from "@/components/TransactionItem";
import * as XLSX from "xlsx";
import { useMemo } from "react";

const Transactions = () => {
  const { preferences } = usePreferences();
  const { data: customCategories } = useCategories();

  // Filter state
  const [typeFilter, setTypeFilter] = useState<"all" | TransactionType>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [page, setPage] = useState(1);

  // Debounced search — reset page on any filter change
  const filters: TransactionFilters = {
    type: typeFilter as TransactionFilters["type"],
    category: categoryFilter,
    search,
    dateFrom: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
    dateTo: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
  };

  // Server-side paginated query for the list
  const { data: pagedResult, isLoading, isFetching } = useTransactionsPaged(page, filters);

  // For the Download Report we fetch all matching records (unbounded)
  // but only when user explicitly clicks — we use the full transactions data (last 12mo) for the export
  const { data: allTransactions } = useTransactions();

  const categories = useMemo(() => {
    if (typeFilter === "all") return [];
    const preset = typeFilter === "income" ? [...INCOME_CATEGORIES] : [...EXPENSE_CATEGORIES];
    const custom = customCategories?.filter((c) => c.type === typeFilter).map((c) => c.name) ?? [];
    return [...new Set([...preset, ...custom])];
  }, [typeFilter, customCategories]);

  const resetPage = () => setPage(1);

  const clearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("all");
    setSearch("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
  };

  const hasFilters = typeFilter !== "all" || categoryFilter !== "all" || search || dateFrom || dateTo;

  const downloadReport = useCallback(() => {
    // Export only records matching current filters from the analytics set
    const source = allTransactions ?? [];
    const filtered = source.filter((tx) => {
      if (filters.type && filters.type !== "all" && tx.type !== filters.type) return false;
      if (filters.category && filters.category !== "all" && tx.category !== filters.category) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!tx.category.toLowerCase().includes(q) && !(tx.note?.toLowerCase().includes(q))) return false;
      }
      if (filters.dateFrom && tx.date < filters.dateFrom) return false;
      if (filters.dateTo && tx.date > filters.dateTo) return false;
      return true;
    });

    const rows = filtered.map((tx) => ({
      Date: format(new Date(tx.date), "yyyy-MM-dd"),
      Type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      Category: tx.category,
      Amount: Number(tx.amount),
      Note: tx.note ?? "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 12 }, { wch: 10 }, { wch: 16 }, { wch: 14 }, { wch: 30 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `transactions-report-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  }, [allTransactions, filters]);

  const transactions = pagedResult?.data ?? [];
  const total = pagedResult?.total ?? 0;
  const totalPages = pagedResult?.totalPages ?? 1;

  return (
    <div className="flex flex-col h-full animate-fade-in overflow-hidden">
      {/* Fixed Header + Filters */}
      <div className="shrink-0 bg-background pb-4 pt-2 border-b border-border/40 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Transactions</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">
                {isFetching && !isLoading ? (
                  <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Loading…</span>
                ) : (
                  <>{total} transaction{total !== 1 ? "s" : ""}</>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadReport} disabled={!allTransactions?.length}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <TransactionForm />
          </div>
        </div>

        {/* Filters */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardContent className="p-[var(--card-padding)]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search category or note..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                  className="pl-9"
                />
              </div>

              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as "all" | TransactionType); setCategoryFilter("all"); resetPage(); }}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              {typeFilter !== "all" && (
                <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); resetPage(); }}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal text-sm", !dateFrom && "text-muted-foreground")}>
                      <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                      {dateFrom ? format(dateFrom, "MM/dd") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateFrom} onSelect={(d) => { setDateFrom(d); resetPage(); }} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("flex-1 justify-start text-left font-normal text-sm", !dateTo && "text-muted-foreground")}>
                      <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                      {dateTo ? format(dateTo, "MM/dd") : "To"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateTo} onSelect={(d) => { setDateTo(d); resetPage(); }} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-3 text-muted-foreground">
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto pt-4 pb-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <Card className="border-dashed border-border overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-[var(--card-padding)] text-center">
              <TrendingUp className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="font-medium text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground/70">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className={cn("space-y-3", isFetching && "opacity-70 transition-opacity")}>
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        )}

        {/* Server-side Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Button variant="outline" size="sm" disabled={page === 1 || isFetching} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              Page {page} of {totalPages}
              <span className="ml-2 text-xs text-muted-foreground/60">({total} total)</span>
            </span>
            <Button variant="outline" size="sm" disabled={page === totalPages || isFetching} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
