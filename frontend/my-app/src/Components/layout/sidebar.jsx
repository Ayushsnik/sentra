import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import {
  Shield,
  LayoutDashboard,
  FileText,
  PlusCircle,
  BookOpen,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { useState } from "react";

const navItems = {
  student: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Reports", href: "/my-reports", icon: FileText },
    { label: "New Report", href: "/report", icon: PlusCircle },
    { label: "Awareness Hub", href: "/awareness", icon: BookOpen },
  ],
  staff: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Reports", href: "/my-reports", icon: FileText },
    { label: "New Report", href: "/report", icon: PlusCircle },
    { label: "Awareness Hub", href: "/awareness", icon: BookOpen },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "All Incidents", href: "/incidents", icon: FileText },
    { label: "Users", href: "/users", icon: Users },
    { label: "Awareness Hub", href: "/awareness", icon: BookOpen },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const items = navItems[user.role];

  const handleLogout = () => {
    logout();
    onNavigate && onNavigate();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-sidebar-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={onNavigate}
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              Sentra
            </h1>
            <p className="text-xs text-muted-foreground">Campus Safety</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                )}
                data-testid={`nav-${item.label
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user.role}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          data-testid="button-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="p-0 w-72 bg-sidebar">
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex-col"
    >
      <SidebarContent />
    </motion.aside>
  );
}
