import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, ArrowLeftRight, User, Settings as SettingsIcon, LogOut, DollarSign, ChevronLeft, ChevronRight, RefreshCw, Target, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useRecurringEngine } from "@/hooks/useRecurringEngine";
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts";
import { useIsMobile } from "@/hooks/use-media-query";
import TransactionForm from "@/components/TransactionForm";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Transactions", to: "/transactions", icon: ArrowLeftRight },
  { label: "Recurring", to: "/recurring", icon: RefreshCw },
  { label: "Budgets", to: "/budgets", icon: Target },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Settings", to: "/settings", icon: SettingsIcon },
];

const mobileNavItems = [
  { label: "Home", to: "/", icon: LayoutDashboard },
  { label: "History", to: "/transactions", icon: ArrowLeftRight },
  // Placeholder for the center FAB
  { label: "Add", to: "#", icon: Plus, isFab: true },
  { label: "Budgets", to: "/budgets", icon: Target },
  { label: "Profile", to: "/profile", icon: User },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { signOut, user } = useAuth();
  const { preferences, updatePreferences } = usePreferences();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(preferences.sidebarCollapsed);
  const isMobile = useIsMobile();

  useRecurringEngine();
  useBudgetAlerts();

  useEffect(() => {
    setSidebarCollapsed(preferences.sidebarCollapsed);
  }, [preferences.sidebarCollapsed]);

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    updatePreferences({ sidebarCollapsed: newState });
  };

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <aside
          className={cn(
            "hidden bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out md:flex flex-col border-r border-sidebar-border relative shrink-0 z-20",
            sidebarCollapsed ? "w-20" : "w-64"
          )}
        >
          <div className={cn("flex h-16 shrink-0 items-center gap-3 px-6", sidebarCollapsed && "px-0 justify-center")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent shadow-inner">
              <DollarSign className="h-5 w-5 text-sidebar-accent-foreground" />
            </div>
            {!sidebarCollapsed && <span className="font-display text-lg font-bold text-sidebar-primary truncate">SpendWise</span>}
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  pathname === item.to
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  sidebarCollapsed && "justify-center px-0"
                )}
                title={sidebarCollapsed ? item.label : ""}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className={cn("border-t border-sidebar-border p-4", sidebarCollapsed && "p-2")}>
            {!sidebarCollapsed && <p className="mb-2 truncate text-xs text-sidebar-foreground/60">{user?.email}</p>}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                sidebarCollapsed && "justify-center p-0"
              )}
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </Button>
          </div>

          {/* Collapse toggle */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md transition-transform hover:scale-110 active:scale-95 z-30"
          >
            {sidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col relative w-full h-full">
        {/* Mobile top header (Minimal) */}
        {isMobile && (
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 z-10 sticky top-0">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold">SpendWise</span>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                  <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                </Button>
              </Link>
            </div>
          </header>
        )}

        {/* Scrollable Main Area (with bottom padding on mobile for nav bar) */}
        <main className={cn(
          "flex-1 overflow-auto bg-background",
          isMobile ? "pb-[84px] pt-2 px-4" : "p-6 lg:p-8"
        )}>
          {children}
        </main>

        {/* FAB (Floating Action Button) - Desktop */}
        {!isMobile && (
          <div className="absolute bottom-8 right-8 z-40 hidden md:block lg:hidden">
            <TransactionForm trigger={
              <Button size="icon" className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-6 w-6" />
              </Button>
            } />
          </div>
        )}

        {/* Bottom Navigation - Mobile */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[72px] items-center justify-around border-t border-border/50 bg-card/80 backdrop-blur-md pb-safe-area shadow-[0_-4px_12px_-6px_rgba(0,0,0,0.1)] px-2">
            {mobileNavItems.map((item, i) => {
              if (item.isFab) {
                return (
                  <div key="fab" className="relative -top-5">
                    <TransactionForm trigger={
                      <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <Plus className="h-7 w-7" />
                      </button>
                    } />
                  </div>
                );
              }

              const isActive = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 min-w-[64px] rounded-lg p-2 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                  <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};

export default AppLayout;
