import { IncidentStatus } from "@/lib/incidents-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Eye, CheckCircle, XCircle } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-warning/15 text-warning border-warning/30",
    icon: Clock,
  },
  in_review: {
    label: "In Review",
    className: "bg-primary/15 text-primary border-primary/30",
    icon: Eye,
  },
  resolved: {
    label: "Resolved",
    className: "bg-success/15 text-success border-success/30",
    icon: CheckCircle,
  },
  dismissed: {
    label: "Dismissed",
    className: "bg-muted text-muted-foreground border-muted-foreground/30",
    icon: XCircle,
  },
};

export function StatusBadge({ status, showIcon = true }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", config.className)}
      data-testid={`status-badge-${status}`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
}
