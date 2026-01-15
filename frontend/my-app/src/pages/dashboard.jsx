import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useIncidents } from "@/lib/incidents-context";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { IncidentCard } from "@/components/incidents/incident-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "wouter";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  Search,
  ShieldAlert,
  UserCheck,
  Timer,
  ArrowUpRight,
  ClipboardList,
  MessageSquareText,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";

function getAgingHours(createdAt) {
  if (!createdAt) return null;
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return Math.floor((now - created) / (1000 * 60 * 60));
}

function severityBadge(sev) {
  const map = {
    low: { label: "Low", className: "bg-green-500/10 text-green-700" },
    medium: { label: "Medium", className: "bg-yellow-500/10 text-yellow-700" },
    high: { label: "High", className: "bg-red-500/10 text-red-700" },
  };
  return map[sev] || { label: sev, className: "bg-muted text-foreground" };
}

export default function Dashboard() {
  const { user } = useAuth();
  const { incidents } = useIncidents();

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const isStudent = user?.role === "student";

  // --------------------------
  // Admin UI states
  // --------------------------
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const [newStatus, setNewStatus] = useState("pending");
  const [assignedTo, setAssignedTo] = useState("");
  const [adminSeverity, setAdminSeverity] = useState("medium");
  const [adminRemarks, setAdminRemarks] = useState("");
  const [escalationReason, setEscalationReason] = useState("");

  // --------------------------
  // Staff UI states (unique)
  // --------------------------
  const [staffNoteOpen, setStaffNoteOpen] = useState(false);
  const [staffSelected, setStaffSelected] = useState(null);
  const [followUpNote, setFollowUpNote] = useState("");

  const stats = {
    total: incidents.length,
    pending: incidents.filter((i) => i.status === "pending").length,
    inReview: incidents.filter((i) => i.status === "in_review").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  const recentIncidents = useMemo(() => {
    // Sort newest first if createdAt exists
    return [...incidents].sort((a, b) => {
      const ta = new Date(a.createdAt || 0).getTime();
      const tb = new Date(b.createdAt || 0).getTime();
      return tb - ta;
    });
  }, [incidents]);

  // Admin Queue (Pending/Unresolved)
  const adminQueue = useMemo(() => {
    return recentIncidents
      .filter((i) => i.status !== "resolved")
      .filter((i) => {
        const text = `${i.referenceId || ""} ${i.title || ""} ${i.category || ""}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
      .slice(0, 6);
  }, [recentIncidents, query]);

  // Staff view: Assigned cases / handled cases (UI-only logic)
  // NOTE: backend me later assignedTo = userId match karna
  const staffAssignedQueue = useMemo(() => {
    return recentIncidents
      .filter((i) => i.status !== "resolved")
      .slice(0, 5);
  }, [recentIncidents]);

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "In Review",
      value: stats.inReview,
      icon: AlertTriangle,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  // --------------------------
  // Admin: open case
  // --------------------------
  const openCase = (incident) => {
    setSelected(incident);
    setOpen(true);

    setNewStatus(incident.status || "pending");
    setAssignedTo(incident.assignedTo || "");
    setAdminSeverity(incident.systemSeverity || incident.userSeverity || "medium");
    setAdminRemarks(incident.adminRemarks || "");
    setEscalationReason("");
  };

  const handleSaveAdminUpdate = () => {
    // UI only (connect backend later)
    console.log("ADMIN UPDATE", {
      incidentId: selected?.id,
      status: newStatus,
      assignedTo,
      systemSeverity: adminSeverity,
      adminRemarks,
      escalationReason,
    });

    setOpen(false);
  };

  // --------------------------
  // Staff: follow-up note modal
  // --------------------------
  const openStaffFollowUp = (incident) => {
    setStaffSelected(incident);
    setFollowUpNote("");
    setStaffNoteOpen(true);
  };

  const saveStaffFollowUp = () => {
    // UI only (connect backend later)
    console.log("STAFF FOLLOW-UP NOTE", {
      incidentId: staffSelected?.id,
      note: followUpNote,
      createdByRole: "staff",
    });

    setStaffNoteOpen(false);
  };

  return (
    <DashboardLayout
      title={`Welcome, ${user ? user.name.split(" ")[0] : ""}`}
      subtitle={
        isAdmin
          ? "Admin Control Center"
          : isStaff
          ? "Staff Support Panel"
          : "Your reports"
      }
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Common Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </p>
                      <p className="text-2xl lg:text-3xl font-bold mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
                    >
                      <stat.icon
                        className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left: Recent Incidents (common) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base lg:text-lg">
                  Recent Incidents
                </CardTitle>

                <Link href={isAdmin ? "/incidents" : "/my-reports"}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs lg:text-sm"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>

              <CardContent className="space-y-3">
                {recentIncidents.length > 0 ? (
                  recentIncidents.slice(0, 3).map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      incident={incident}
                      showReporter={isAdmin}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 lg:py-12">
                    <FileText className="w-10 h-10 lg:w-12 lg:h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No incidents reported yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel (ROLE BASED BLOCKS) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="space-y-4 lg:space-y-6"
          >
            {/* =========================
                STUDENT BLOCK
            ========================== */}
            {isStudent && (
              <Card className="bg-gradient-to-br from-primary to-blue-700 text-white border-0">
                <CardContent className="p-5 lg:p-6">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <PlusCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <h3 className="font-semibold text-base lg:text-lg mb-2">
                    Report an Incident
                  </h3>
                  <p className="text-sm text-white/80 mb-4">
                    See something concerning? Report it securely.
                  </p>
                  <Link href="/report">
                    <Button variant="secondary" className="w-full">
                      New Report
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* =========================
                STAFF BLOCK (DIFFERENT)
            ========================== */}
            {isStaff && (
              <>
                <Card className="border-0 shadow-md bg-gradient-to-br from-slate-900 to-slate-700 text-white">
                  <CardContent className="p-5 lg:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-white/70 font-medium">
                          Staff Support Tools
                        </p>
                        <h3 className="text-base lg:text-lg font-semibold mt-1">
                          Verified Reporting & Follow-ups
                        </h3>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                        <ClipboardList className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/report">
                        <Button
                          className="w-full bg-white/15 hover:bg-white/25 text-white border-0"
                          data-testid="button-witness-report"
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Witness Report
                        </Button>
                      </Link>

                      <Link href="/my-reports">
                        <Button
                          className="w-full bg-white/15 hover:bg-white/25 text-white border-0"
                          data-testid="button-staff-reports"
                        >
                          <MessageSquareText className="w-4 h-4 mr-2" />
                          My Notes
                        </Button>
                      </Link>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed">
                      Staff can report as witness, add follow-up notes, and support
                      resolution. Status updates remain admin-controlled.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-primary" />
                      Assigned Cases (Preview)
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {staffAssignedQueue.length > 0 ? (
                      staffAssignedQueue.map((i) => {
                        const sev = i.systemSeverity || i.userSeverity || "medium";
                        const aging = getAgingHours(i.createdAt);
                        const agingAlert =
                          i.status !== "resolved" && aging !== null && aging >= 24;

                        return (
                          <div
                            key={i.id}
                            className="rounded-xl border p-3 flex items-start justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-sm">
                                  {i.referenceId || "SENTRA-XXXX"}
                                </span>

                                <span
                                  className={[
                                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                                    severityBadge(sev).className,
                                  ].join(" ")}
                                >
                                  {severityBadge(sev).label}
                                </span>

                                {agingAlert && (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                                    <Timer className="w-3.5 h-3.5" />
                                    {aging}h
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {i.title || "Untitled incident"}
                              </p>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openStaffFollowUp(i)}
                            >
                              Add Note
                            </Button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No assigned cases yet.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {/* =========================
                ADMIN BLOCK
            ========================== */}
            {isAdmin && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                    Admin Operations
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search incidents..."
                      className="pl-10"
                    />
                  </div>

                  <div className="space-y-2">
                    {adminQueue.length > 0 ? (
                      adminQueue.map((i) => {
                        const sev = i.systemSeverity || i.userSeverity || "medium";
                        const aging = getAgingHours(i.createdAt);
                        const agingAlert =
                          i.status !== "resolved" && aging !== null && aging >= 24;

                        return (
                          <button
                            key={i.id}
                            onClick={() => openCase(i)}
                            className="w-full text-left rounded-xl border p-3 hover:bg-muted/40 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-semibold text-sm">
                                    {i.referenceId || "SENTRA-XXXX"}
                                  </span>

                                  <span
                                    className={[
                                      "px-2 py-0.5 rounded-full text-xs font-semibold",
                                      severityBadge(sev).className,
                                    ].join(" ")}
                                  >
                                    {severityBadge(sev).label}
                                  </span>

                                  {agingAlert && (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                                      <Timer className="w-3.5 h-3.5" />
                                      {aging}h
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {i.title || "Untitled incident"}
                                </p>
                              </div>

                              <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No pending incidents found.
                      </div>
                    )}
                  </div>

                  <Link href="/incidents">
                    <Button variant="outline" className="w-full">
                      Open Full Incident Panel
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats (common) */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base lg:text-lg flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-success" />
                  Quick Stats
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs lg:text-sm text-muted-foreground">
                    Resolution Rate
                  </span>
                  <span className="font-semibold text-success">
                    {stats.total > 0
                      ? Math.round((stats.resolved / stats.total) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all"
                    style={{
                      width: `${
                        stats.total > 0
                          ? (stats.resolved / stats.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <div className="pt-2 border-t space-y-2 text-xs lg:text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Response</span>
                    <span className="font-medium">24h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-medium">+12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* =========================
          ADMIN CASE MODAL
      ========================== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Case: {selected?.referenceId || "SENTRA-XXXX"}
            </DialogTitle>
            <DialogDescription>
              Assign ownership, triage severity, update status, and add action notes.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Title</p>
                      <p className="font-semibold">{selected.title || "—"}</p>
                    </div>
                    <Badge variant="outline">{selected.category || "general"}</Badge>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {selected.description || "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    Priority (Override)
                  </p>
                  <Select value={adminSeverity} onValueChange={setAdminSeverity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" />
                    Assign Owner
                  </p>
                  <Input
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g., security_team_1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Status
                </p>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_review">In Review</SelectItem>
                    <SelectItem value="need_info">Need Info</SelectItem>
                    <SelectItem value="escalated">Escalated</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Action Taken / Remarks</p>
                <Textarea
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder="Write action taken notes..."
                  className="min-h-[110px]"
                />
              </div>

              {newStatus === "escalated" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Escalation Reason</p>
                  <Textarea
                    value={escalationReason}
                    onChange={(e) => setEscalationReason(e.target.value)}
                    placeholder="Why escalated?"
                    className="min-h-[80px]"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAdminUpdate}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* =========================
          STAFF FOLLOW-UP NOTE MODAL
      ========================== */}
      <Dialog open={staffNoteOpen} onOpenChange={setStaffNoteOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              Follow-up Note: {staffSelected?.referenceId || "SENTRA-XXXX"}
            </DialogTitle>
            <DialogDescription>
              Add verified observations or support updates (Staff cannot change status).
            </DialogDescription>
          </DialogHeader>

          {staffSelected && (
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4 text-sm space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Incident</p>
                    <p className="font-semibold">{staffSelected.title || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current Status</p>
                    <Badge variant="outline">{staffSelected.status || "pending"}</Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <p className="text-sm font-medium">Follow-up Note</p>
                <Textarea
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  placeholder="Example: Student is safe. Security informed. Witness statement recorded..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStaffNoteOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveStaffFollowUp} disabled={!followUpNote.trim()}>
                  Save Note
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
