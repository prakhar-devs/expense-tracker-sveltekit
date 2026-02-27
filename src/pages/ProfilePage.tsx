import { useState, useMemo } from "react";
import { User, Tag, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useProfile, useUpdateProfile, useTransactions, useCategories, useAddCategory, useDeleteCategory } from "@/hooks/useData";
import { formatCurrency } from "@/lib/formatters";
import { toast } from "sonner";
import { TransactionType } from "@/lib/constants";

const ProfilePage = () => {
  const { user } = useAuth();
  const { preferences } = usePreferences();
  const { data: profile } = useProfile();
  const { data: transactions } = useTransactions();
  const { data: customCategories } = useCategories();
  const updateProfile = useUpdateProfile();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();

  const [fullName, setFullName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<TransactionType>("expense");
  const [nameLoaded, setNameLoaded] = useState(false);

  if (profile && !nameLoaded) {
    setFullName(profile.full_name || "");
    setNameLoaded(true);
  }

  const stats = useMemo(() => {
    if (!transactions) return { total: 0, income: 0, expense: 0, balance: 0 };
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return { total: transactions.length, income, expense, balance: income - expense };
  }, [transactions]);

  const handleUpdateName = async () => {
    try {
      await updateProfile.mutateAsync({ full_name: fullName });
      toast.success("Profile updated");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await addCategory.mutateAsync({ name: newCatName.trim(), type: newCatType });
      setNewCatName("");
      toast.success("Category added");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-[var(--section-gap)] animate-fade-in">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account and categories</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Card */}
        <Card className="border-border/50 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <User className="h-5 w-5" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-[var(--card-padding)] pt-0 space-y-4">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="flex gap-2">
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
                <Button onClick={handleUpdateName} disabled={updateProfile.isPending}>
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-border/50 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="font-display">Statistics</CardTitle>
          </CardHeader>
          <CardContent className="p-[var(--card-padding)] pt-0">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="font-display text-2xl font-bold">{stats.total}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="font-display text-2xl font-bold">{formatCurrency(stats.balance, preferences)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="font-display text-2xl font-bold text-income">{formatCurrency(stats.income, preferences)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="font-display text-2xl font-bold text-expense">{formatCurrency(stats.expense, preferences)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Categories */}
      <Card className="border-border/50 transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <Tag className="h-5 w-5" /> Custom Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-[var(--card-padding)] pt-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="Category name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="flex-1"
            />
            <Select value={newCatType} onValueChange={(v) => setNewCatType(v as TransactionType)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddCategory} disabled={addCategory.isPending} className="gap-2">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          {customCategories && customCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {customCategories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant="secondary"
                  className="gap-1 py-1.5 pl-3 pr-1.5"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-muted-foreground">({cat.type})</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-5 w-5 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCategory(cat.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No custom categories yet. Add one above!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
