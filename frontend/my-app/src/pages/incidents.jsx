import { useState } from "react"
import { useIncidents } from "@/lib/incidents-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { IncidentCard } from "@/components/incidents/incident-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, FileText } from "lucide-react"
import { motion } from "framer-motion"

export default function Incidents() {
  const { incidents } = useIncidents()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter

    const matchesCategory =
      categoryFilter === "all" || incident.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const statusCounts = {
    all: incidents.length,
    pending: incidents.filter((i) => i.status === "pending").length,
    in_review: incidents.filter((i) => i.status === "in_review").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  }

  return (
    <DashboardLayout
      title="All Incidents"
      subtitle="Manage and review incident reports"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title, ID, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-incidents"
            />
          </div>

          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v)}
          >
            <SelectTrigger
              className="w-40"
              data-testid="select-category-filter"
            >
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="harassment">Harassment</SelectItem>
              <SelectItem value="facilities">Facilities</SelectItem>
              <SelectItem value="theft">Theft</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all" data-testid="tab-all">
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="in_review" data-testid="tab-in-review">
              In Review ({statusCounts.in_review})
            </TabsTrigger>
            <TabsTrigger value="resolved" data-testid="tab-resolved">
              Resolved ({statusCounts.resolved})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredIncidents.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {filteredIncidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <IncidentCard incident={incident} showReporter />
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
              No incidents found
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {searchQuery ||
              statusFilter !== "all" ||
              categoryFilter !== "all"
                ? "Try adjusting your filters or search query"
                : "No incidents have been reported yet"}
            </p>

            {(searchQuery ||
              statusFilter !== "all" ||
              categoryFilter !== "all") && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setCategoryFilter("all")
                }}
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
