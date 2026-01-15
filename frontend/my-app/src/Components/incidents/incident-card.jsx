import { Link } from "wouter";
import { StatusBadge } from "./status-badge";
import { CategoryBadge } from "./category-badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, User, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export function IncidentCard({ incident, showReporter = false }) {
  return (
    <Link href={`/incident/${incident.id}`}>
      <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}>
        <Card
          className="cursor-pointer hover:shadow-md transition-all border-border/60 hover:border-primary/30 group"
          data-testid={`card-incident-${incident.id}`}
        >
          <CardContent className="p-4 lg:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 space-y-2 lg:space-y-3">
                <div className="flex items-center gap-1.5 lg:gap-2 flex-wrap">
                  <span className="text-[10px] lg:text-xs font-mono text-muted-foreground">
                    {incident.referenceId}
                  </span>
                  <StatusBadge status={incident.status} />
                  <CategoryBadge category={incident.category} />
                </div>

                <h3 className="font-semibold text-sm lg:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {incident.title}
                </h3>

                <p className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                  {incident.description}
                </p>

                <div className="flex items-center gap-3 lg:gap-4 text-[10px] lg:text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    <span className="truncate max-w-[100px] lg:max-w-none">
                      {incident.location}
                    </span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    {format(incident.dateReported, "MMM d")}
                  </span>

                  {showReporter && (
                    <span className="flex items-center gap-1 hidden sm:flex">
                      <User className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                      {incident.isAnonymous
                        ? "Anonymous"
                        : incident.reporterName || "Unknown"}
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
