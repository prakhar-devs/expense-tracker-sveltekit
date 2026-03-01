<script lang="ts">
    import AppLayout from "$lib/components/AppLayout.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Card from "$lib/components/ui/card";
    import * as Tabs from "$lib/components/ui/tabs";
    import { auth } from "$lib/stores/auth";
    import {
        User,
        Mail,
        Calendar,
        Plus,
        Trash2,
        Tag,
        Info,
        Check,
    } from "lucide-svelte";
    import { format } from "date-fns";
    import {
        createCategoriesQuery,
        createAddCategoryMutation,
        createDeleteCategoryMutation,
        createUpdateProfileMutation,
    } from "$lib/data";
    import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "$lib/constants";
    import { toast } from "svelte-sonner";
    import { cn } from "$lib/utils";

    let { data } = $props();

    const categoriesQuery = createCategoriesQuery(() => $auth.user?.id);
    const addCategory = createAddCategoryMutation();
    const deleteCategory = createDeleteCategoryMutation();
    const updateProfile = createUpdateProfileMutation();

    let profile = $derived(data.preloaded?.profile);
    let user = $derived($auth.user);

    let newCategoryName = $state("");
    let fullName = $state(profile?.full_name || "");

    async function handleAddCategory(type: "income" | "expense") {
        if (!newCategoryName.trim())
            return toast.error("Category name is required");

        try {
            await addCategory.mutateAsync({
                name: newCategoryName.trim(),
                type,
            });
            newCategoryName = "";
            toast.success("Category added successfully");
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    async function handleDeleteCategory(id: string) {
        try {
            await deleteCategory.mutateAsync(id);
            toast.success("Category removed");
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    async function handleUpdateProfile() {
        if (!fullName.trim()) return toast.error("Name cannot be empty");
        try {
            await updateProfile.mutateAsync({ full_name: fullName.trim() });
            toast.success("Profile updated");
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    let customCategories = $derived(categoriesQuery.data || []);
</script>

<AppLayout>
    <div class="animate-fade-in space-y-6">
        <div class="bg-background pb-6 pt-2 border-b border-border/40">
            <div>
                <h1 class="font-display text-3xl font-bold text-foreground">
                    Profile
                </h1>
                <p class="text-muted-foreground">
                    Account settings and customization
                </p>
            </div>
        </div>

        <div
            class="w-full max-w-7xl mx-auto pb-10 px-4 sm:px-0 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
            <!-- Account Info -->
            <Card.Root
                class="border-border/50 shadow-sm overflow-hidden lg:col-span-1 h-full"
            >
                <Card.Header class="bg-muted/30 pb-6">
                    <div class="flex items-center gap-4">
                        <div
                            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-inner"
                        >
                            <User class="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <Card.Title class="text-2xl"
                                >{profile?.full_name || "User"}</Card.Title
                            >
                            <Card.Description
                                >Your Account Details</Card.Description
                            >
                        </div>
                    </div>
                </Card.Header>
                <Card.Content class="space-y-6 pt-6">
                    <div class="space-y-4">
                        <div
                            class="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-1"
                        >
                            <div
                                class="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold tracking-wider"
                            >
                                <Mail class="h-3.5 w-3.5" />
                                Email Address
                            </div>
                            <p
                                class="text-sm font-semibold truncate text-foreground"
                            >
                                {user?.email}
                            </p>
                        </div>

                        {#if user?.created_at}
                            <div
                                class="p-4 rounded-xl border border-border/50 bg-muted/10 space-y-1"
                            >
                                <div
                                    class="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold tracking-wider"
                                >
                                    <Calendar class="h-3.5 w-3.5" />
                                    Account Created
                                </div>
                                <p
                                    class="text-sm font-semibold text-foreground"
                                >
                                    {format(
                                        new Date(user.created_at),
                                        "MMMM do, yyyy",
                                    )}
                                </p>
                            </div>
                        {/if}
                    </div>

                    <div class="pt-6 border-t border-border/50 space-y-4">
                        <div class="flex items-center gap-2">
                            <div class="p-1.5 bg-primary/10 rounded-lg">
                                <User class="h-4 w-4 text-primary" />
                            </div>
                            <h3 class="font-display font-bold text-lg">
                                Update Profile
                            </h3>
                        </div>
                        <div class="flex flex-col gap-4">
                            <div class="space-y-2">
                                <Label
                                    for="fullName"
                                    class="text-xs uppercase font-bold text-muted-foreground tracking-wider ml-1"
                                    >Full Name</Label
                                >
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Your full name"
                                    bind:value={fullName}
                                    class="bg-muted/10 border-border/50 focus:ring-primary/20"
                                />
                            </div>
                            <Button
                                onclick={handleUpdateProfile}
                                disabled={updateProfile.isPending}
                                class="w-full shadow-sm"
                            >
                                {#if updateProfile.isPending}
                                    <span
                                        class="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                                    ></span>
                                    Saving...
                                {:else}
                                    <Check class="h-4 w-4 mr-2" />
                                    Save Changes
                                {/if}
                            </Button>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>

            <!-- Category Management -->
            <Card.Root
                class="border-border/50 shadow-sm overflow-hidden lg:col-span-2"
            >
                <Card.Header class="bg-muted/30 border-b border-border/40">
                    <div class="flex items-center gap-3">
                        <div
                            class="p-2.5 bg-primary/10 rounded-xl shadow-inner"
                        >
                            <Tag class="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <Card.Title class="text-xl"
                                >Manage Categories</Card.Title
                            >
                            <Card.Description
                                >Personalize your transaction classification</Card.Description
                            >
                        </div>
                    </div>
                </Card.Header>
                <Card.Content class="p-0">
                    <Tabs.Root value="expense" class="w-full">
                        <div class="px-6 pt-6">
                            <Tabs.List
                                class="grid w-full grid-cols-2 p-1 bg-muted/20 border border-border/50"
                            >
                                <Tabs.Trigger
                                    value="expense"
                                    class="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                    >Expenses</Tabs.Trigger
                                >
                                <Tabs.Trigger
                                    value="income"
                                    class="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                    >Income</Tabs.Trigger
                                >
                            </Tabs.List>
                        </div>

                        {#each ["expense", "income"] as type}
                            <Tabs.Content
                                value={type}
                                class="p-6 pt-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                            >
                                <!-- Add New Category -->
                                <div class="space-y-3">
                                    <Label
                                        class="text-xs text-muted-foreground uppercase font-bold tracking-widest pl-1"
                                    >
                                        Add New {type} Category
                                    </Label>
                                    <div class="flex gap-2">
                                        <Input
                                            placeholder={`e.g. ${type === "expense" ? "Hobbies, Pets, Subscriptions" : "Dividends, Bonus, Side Hustle"}`}
                                            bind:value={newCategoryName}
                                            onkeydown={(e) =>
                                                e.key === "Enter" &&
                                                handleAddCategory(type as any)}
                                            class="bg-muted/10 border-border/50"
                                        />
                                        <Button
                                            variant="secondary"
                                            onclick={() =>
                                                handleAddCategory(type as any)}
                                            disabled={addCategory.isPending}
                                            class="shrink-0 shadow-sm"
                                        >
                                            <Plus class="h-4 w-4 mr-2" />
                                            Add
                                        </Button>
                                    </div>
                                </div>

                                <!-- Categories List -->
                                <div class="space-y-3">
                                    <Label
                                        class="text-xs text-muted-foreground uppercase font-bold tracking-widest pl-1"
                                    >
                                        Current Categories
                                    </Label>

                                    <div
                                        class="grid grid-cols-2 lg:grid-cols-3 gap-3"
                                    >
                                        <!-- Preset Categories -->
                                        {#each type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES as cat}
                                            <div
                                                class="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/40 group hover:border-border transition-colors"
                                            >
                                                <div
                                                    class="flex items-center gap-3"
                                                >
                                                    <div
                                                        class="h-2 w-2 rounded-full bg-muted-foreground/30"
                                                    ></div>
                                                    <span
                                                        class="text-sm font-medium text-muted-foreground"
                                                        >{cat}</span
                                                    >
                                                </div>
                                                <span
                                                    class="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-tighter"
                                                    >Preset</span
                                                >
                                            </div>
                                        {/each}

                                        <!-- Custom Categories -->
                                        {#each customCategories.filter((c) => c.type === type) as cat (cat.id)}
                                            <div
                                                class="flex items-center justify-between p-3.5 rounded-xl bg-primary/5 border border-primary/20 shadow-sm group hover:bg-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <div
                                                    class="flex items-center gap-3"
                                                >
                                                    <div
                                                        class="h-2 w-2 rounded-full bg-primary animate-pulse"
                                                    ></div>
                                                    <span
                                                        class="text-sm font-bold text-primary truncate max-w-[120px]"
                                                        >{cat.name}</span
                                                    >
                                                </div>
                                                <button
                                                    class="text-expense opacity-0 group-hover:opacity-100 transition-all hover:bg-expense/10 p-1.5 rounded-lg"
                                                    onclick={() =>
                                                        handleDeleteCategory(
                                                            cat.id,
                                                        )}
                                                    title="Delete Category"
                                                >
                                                    <Trash2 class="h-4 w-4" />
                                                </button>
                                            </div>
                                        {/each}
                                    </div>

                                    <div
                                        class="flex items-start gap-3 mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20"
                                    >
                                        <Info
                                            class="h-5 w-5 text-blue-500 shrink-0 mt-0.5"
                                        />
                                        <p
                                            class="text-xs text-muted-foreground leading-relaxed"
                                        >
                                            <strong
                                                class="text-blue-600 dark:text-blue-400"
                                                >Pro Tip:</strong
                                            > Preset categories are global defaults.
                                            Custom categories you create are unique
                                            to your account and can be removed anytime
                                            to keep your transaction lists tidy.
                                        </p>
                                    </div>
                                </div>
                            </Tabs.Content>
                        {/each}
                    </Tabs.Root>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</AppLayout>
