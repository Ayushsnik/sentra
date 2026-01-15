import { useAuth } from "@/lib/auth-context"
import { useIncidents } from "@/lib/incidents-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { IncidentCard } from "@/components/incidents/incident-card"
import { Button } from "@/components/ui/button"
import { Link } from "wouter"
import { FileText, PlusCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function MyReports() {
  const { user } = useAuth()
  const { getUserIncidents } = useIncidents()

  const myIncidents = user ? getUserIncidents(user.id) : []

  return (
    <DashboardLayout
      title="My Reports"
      subtitle="Track the status of incidents you've reported"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            You have{" "}
            <span className="font-semibold text-foreground">
              {myIncidents.length}
            </span>{" "}
            reports
          </p>
          <Link href="/report">
            <Button className="gap-2" data-testid="button-new-report">
              <PlusCircle className="w-4 h-4" />
              New Report
            </Button>
          </Link>
        </div>

        {myIncidents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {myIncidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <IncidentCard incident={incident} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-card rounded-xl border"
          >
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No reports yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              You haven't submitted any incident reports. If you see something
              concerning, let us know.
            </p>
            <Link href="/report">
              <Button className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Submit a Report
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
