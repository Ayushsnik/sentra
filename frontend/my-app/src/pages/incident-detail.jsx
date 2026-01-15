import { useParams, useLocation, Link } from "wouter"
import { useAuth } from "@/lib/auth-context"
import { useIncidents } from "@/lib/incidents-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { StatusBadge } from "@/components/incidents/status-badge"
import { CategoryBadge } from "@/components/incidents/category-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Clock,
  FileText,
  MessageSquare,
  CheckCircle,
} from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { motion } from "framer-motion"

export default function IncidentDetail() {
  const params = useParams()
  const [, setLocation] = useLocation()
  const { user } = useAuth()
  const { getIncidentById, updateIncidentStatus } = useIncidents()

  const incident = getIncidentById(params.id || "")
  const [newStatus, setNewStatus] = useState(incident?.status || "")
  const [notes, setNotes] = useState("")

  if (!incident) {
    return (
      <DashboardLayout title="Incident Not Found">
        <div className="text-center py-16">
          <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Incident not found</h3>
          <p className="text-muted-foreground mb-6">
            The incident you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => setLocation("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const isAdmin = user?.role === "admin"

  const handleUpdateStatus = () => {
    if (newStatus && newStatus !== incident.status) {
      updateIncidentStatus(incident.id, newStatus, notes)
      setNotes("")
    }
  }

  return (
    <DashboardLayout
      title={incident.referenceId}
      subtitle="Incident Details"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={incident.status} />
              <CategoryBadge category={incident.category} />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {incident.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </p>
                  <p className="font-medium">{incident.location}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date Occurred
                  </p>
                  <p className="font-medium">
                    {format(incident.dateOccurred, "PPP")}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Reported
                  </p>
                  <p className="font-medium">
                    {format(incident.dateReported, "PPP")}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Reporter
                  </p>
                  <p className="font-medium">
                    {incident.isAnonymous
                      ? "Anonymous"
                      : incident.reporterName || "Unknown"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {incident.description}
                </p>
              </div>

              {incident.adminNotes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Admin Notes
                    </h4>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {incident.adminNotes}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {incident.assignedTo && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Assigned to:
                  </span>
                  <span className="font-medium">
                    {incident.assignedTo}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Update Status
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Select
                  value={newStatus}
                  onValueChange={(v) => setNewStatus(v)}
                >
                  <SelectTrigger
                    className="w-48"
                    data-testid="select-status"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Add Note (Optional)
                  </label>
                  <Textarea
                    placeholder="Add internal notes about this status change..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    data-testid="input-admin-notes"
                  />
                </div>

                <Button
                  onClick={handleUpdateStatus}
                  disabled={!newStatus || newStatus === incident.status}
                  className="gap-2"
                  data-testid="button-update-status"
                >
                  <CheckCircle className="w-4 h-4" />
                  Update Status
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="flex gap-3">
          <Link href={isAdmin ? "/incidents" : "/my-reports"}>
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
