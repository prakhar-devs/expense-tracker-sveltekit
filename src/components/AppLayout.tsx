import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, ArrowLeftRight, User, Settings as SettingsIcon, LogOut, DollarSign, Menu, X, ChevronLeft, ChevronRight, RefreshCw, Target, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useRecurringEngine } from "@/hooks/useRecurringEngine";
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Transactions", to: "/transactions", icon: ArrowLeftRight },
  { label: "Recurring", to: "/recurring", icon: RefreshCw },
  { label: "Budgets", to: "/budgets", icon: Target },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Settings", to: "/settings", icon: SettingsIcon },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const { signOut, user } = useAuth();
  const { preferences, updatePreferences } = usePreferences();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(preferences.sidebarCollapsed);

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
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside
        className={cn(
          "hidden bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out lg:flex flex-col border-r border-sidebar-border relative shrink-0",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("flex h-16 shrink-0 items-center gap-3 px-6", sidebarCollapsed && "px-0 justify-center")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent shadow-inner">
            <DollarSign className="h-5 w-5 text-sidebar-accent-foreground" />
          </div>
          {!sidebarCollapsed && <span className="font-display text-lg font-bold text-sidebar-primary truncate">SpendWise</span>}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
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
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </Button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md transition-transform hover:scale-110 active:scale-95 z-20"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">SpendWise</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="border-b border-border bg-card p-3 lg:hidden animate-fade-in">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.to
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
