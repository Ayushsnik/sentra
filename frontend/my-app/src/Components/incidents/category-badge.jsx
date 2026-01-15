import { IncidentCategory } from "@/lib/incidents-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Users,
  Building2,
  Package,
  HelpCircle,
} from "lucide-react";

const categoryConfig = {
  safety: {
    label: "Safety",
    className: "bg-destructive/10 text-destructive",
    icon: AlertTriangle,
  },
  harassment: {
    label: "Harassment",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    icon: Users,
  },
  facilities: {
    label: "Facilities",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    icon: Building2,
  },
  theft: {
    label: "Theft",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: Package,
  },
  other: {
    label: "Other",
    className: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    icon: HelpCircle,
  },
};

export function CategoryBadge({ category, showIcon = true }) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={cn("gap-1.5", config.className)}
      data-testid={`category-badge-${category}`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
}
