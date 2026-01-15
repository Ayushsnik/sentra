import { useAuth } from "@/lib/auth-context";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MobileSidebar } from "./sidebar";

export function Header({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="h-14 lg:h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <MobileSidebar />
        <div>
          <h1 className="text-lg lg:text-xl font-semibold text-foreground line-clamp-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs lg:text-sm text-muted-foreground hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search incidents..."
            className="w-48 lg:w-64 pl-9 bg-muted/50 border-transparent focus:border-primary focus:bg-background"
            data-testid="input-search"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
            3
          </Badge>
        </Button>

        {user && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground capitalize">
              {user.role}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
