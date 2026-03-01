<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { cn } from "$lib/utils";
  import { auth } from "$lib/stores/auth";
  import { preferencesStore } from "$lib/stores/preferences";
  import {
    LayoutDashboard,
    ArrowLeftRight,
    User,
    Settings as SettingsIcon,
    LogOut,
    DollarSign,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Target,
    Bell,
    Plus,
  } from "lucide-svelte";
  import TransactionForm from "./TransactionForm.svelte";
  import { onMount } from "svelte";

  let { children } = $props();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { label: "Recurring", href: "/recurring", icon: RefreshCw },
    { label: "Budgets", href: "/budgets", icon: Target },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: SettingsIcon },
  ];

  const mobileNavItems = [
    { label: "Home", href: "/", icon: LayoutDashboard },
    { label: "History", href: "/transactions", icon: ArrowLeftRight },
    { label: "Add", href: "#", icon: Plus, isFab: true },
    { label: "Budgets", href: "/budgets", icon: Target },
    { label: "Profile", href: "/profile", icon: User },
  ];

  let isMobile = $state(false);
  let txFormOpen = $state(false);
  let sidebarCollapsed = $state($preferencesStore.sidebarCollapsed);

  onMount(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    isMobile = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      isMobile = e.matches;
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  });

  let pathname = $derived($page.url.pathname);

  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    preferencesStore.mergePreferences({ sidebarCollapsed });
  }

  async function handleSignOut() {
    await auth.signOut();
    goto("/auth");
  }

  // Notification count logic
  import {
    createBudgetsQuery,
    createTransactionsQuery,
    createRecurringTransactionsQuery,
  } from "$lib/data";
  import { addDays, isAfter, isBefore, parseISO, startOfDay } from "date-fns";

  const budgetsQuery = createBudgetsQuery(() => $auth.user?.id);
  const transactionsQuery = createTransactionsQuery(() => $auth.user?.id);
  const recurringQuery = createRecurringTransactionsQuery(() => $auth.user?.id);

  let notificationsCount = $derived.by(() => {
    const userId = $auth.user?.id;
    if (!userId) return 0;

    const budgets = budgetsQuery.data || [];
    const transactions = transactionsQuery.data || [];
    const recurring = recurringQuery.data || [];

    let count = 0;
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);

    // 1. Budget Alerts
    budgets.forEach((budget) => {
      const spent = transactions
        .filter((t) => t.category === budget.category && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      const progress =
        budget.budget_amount > 0 ? (spent / budget.budget_amount) * 100 : 0;
      const threshold = budget.alert_threshold || 80;

      if (spent >= budget.budget_amount || progress >= threshold) {
        count++;
      }
    });

    // 2. Upcoming Recurring Reminders
    recurring.forEach((rec) => {
      if (!rec.is_active || !rec.next_run_date) return;
      const nextDate = parseISO(rec.next_run_date);
      if (
        isBefore(nextDate, threeDaysFromNow) &&
        isAfter(nextDate, startOfDay(now))
      ) {
        count++;
      }
    });

    return count;
  });
</script>

<div class="flex h-[100dvh] w-full overflow-hidden bg-background">
  <!-- Sidebar - Desktop -->
  {#if !isMobile}
    <aside
      class={cn(
        "hidden bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out md:flex flex-col border-r border-sidebar-border relative shrink-0 z-20",
        sidebarCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        class={cn(
          "flex h-16 shrink-0 items-center gap-3 px-6",
          sidebarCollapsed && "px-0 justify-center",
        )}
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent shadow-inner"
        >
          <DollarSign class="h-5 w-5 text-sidebar-accent-foreground" />
        </div>
        {#if !sidebarCollapsed}
          <span
            class="font-display text-lg font-bold text-sidebar-primary truncate"
            >SpendWise</span
          >
        {/if}
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {#each navItems as item}
          {@const Icon = item.icon}
          <a
            href={item.href}
            class={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              pathname === item.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              sidebarCollapsed && "justify-center px-0",
            )}
            title={sidebarCollapsed ? item.label : ""}
          >
            <Icon class="h-5 w-5 shrink-0" />
            {#if !sidebarCollapsed}
              <span class="flex-1">{item.label}</span>
              {#if item.label === "Notifications" && notificationsCount > 0}
                <span
                  class="bg-expense text-expense-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                >
                  {notificationsCount}
                </span>
              {/if}
            {:else if item.label === "Notifications" && notificationsCount > 0}
              <span class="absolute top-1 right-1 flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-expense opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-expense"
                ></span>
              </span>
            {/if}
          </a>
        {/each}
      </nav>

      <div
        class={cn(
          "border-t border-sidebar-border p-4",
          sidebarCollapsed && "p-2",
        )}
      >
        {#if !sidebarCollapsed}
          <p class="mb-2 truncate text-xs text-sidebar-foreground/60">
            {$auth.user?.email}
          </p>
        {/if}
        <button
          class={cn(
            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
            sidebarCollapsed && "justify-center px-0",
          )}
          onclick={handleSignOut}
        >
          <LogOut class="h-4 w-4 shrink-0" />
          {#if !sidebarCollapsed}<span>Sign Out</span>{/if}
        </button>
      </div>

      <!-- Collapse toggle -->
      <button
        onclick={toggleSidebar}
        class="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md transition-transform hover:scale-110 active:scale-95 z-30"
      >
        {#if sidebarCollapsed}
          <ChevronRight class="h-3.5 w-3.5" />
        {:else}
          <ChevronLeft class="h-3.5 w-3.5" />
        {/if}
      </button>
    </aside>
  {/if}

  <!-- Main Content -->
  <div class="flex flex-1 flex-col relative w-full h-full">
    <!-- Mobile top header -->
    {#if isMobile}
      <header
        class="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 z-10 sticky top-0"
      >
        <div class="flex items-center gap-2">
          <DollarSign class="h-6 w-6 text-primary" />
          <span class="font-display text-lg font-bold">SpendWise</span>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <a
            href="/recurring"
            class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"
            title="Recurring Payments"
          >
            <RefreshCw class="h-5 w-5 text-muted-foreground" />
          </a>
          <a
            href="/notifications"
            class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary relative"
            title="Notifications"
          >
            <Bell class="h-5 w-5 text-muted-foreground" />
            {#if notificationsCount > 0}
              <span class="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-expense opacity-75"
                ></span>
                <span
                  class="relative inline-flex rounded-full h-2 w-2 bg-expense"
                ></span>
              </span>
            {/if}
          </a>
          <a
            href="/settings"
            class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-secondary"
            title="Settings"
          >
            <SettingsIcon class="h-5 w-5 text-muted-foreground" />
          </a>
        </div>
      </header>
    {/if}

    <!-- Scrollable main content -->
    <main
      class={cn(
        "flex-1 overflow-auto bg-background",
        isMobile ? "pb-[84px] pt-2 px-4" : "p-6 lg:p-8",
      )}
    >
      {@render children()}
    </main>

    <!-- Bottom Navigation - Mobile -->
    {#if isMobile}
      <nav
        class="fixed bottom-0 left-0 right-0 z-50 flex h-[72px] items-center justify-around border-t border-border/50 bg-card/80 backdrop-blur-md px-2"
      >
        {#each mobileNavItems as item}
          {#if item.isFab}
            <div class="relative -top-5">
              <button
                onclick={() => (txFormOpen = true)}
                class="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95"
              >
                <Plus class="h-7 w-7" />
              </button>
            </div>
          {:else}
            {@const isActive = pathname === item.href}
            {@const Icon = item.icon}
            <a
              href={item.href}
              class={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[64px] rounded-lg p-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon class={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
              <span
                class={cn("text-[10px] font-medium", isActive && "font-bold")}
                >{item.label}</span
              >
            </a>
          {/if}
        {/each}
      </nav>
    {/if}
  </div>
</div>

<!-- Transaction Form Modal (for mobile FAB and wherever needed) -->
<TransactionForm bind:open={txFormOpen} />
