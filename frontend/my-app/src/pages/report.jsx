import { useState } from "react"
import { useLocation } from "wouter"
import { useAuth } from "@/lib/auth-context"
import { useIncidents } from "@/lib/incidents-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  AlertTriangle,
  MapPin,
  Calendar as CalendarIcon,
  Upload,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Report() {
  const [, setLocation] = useLocation()
  const { user } = useAuth()
  const { addIncident } = useIncidents()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("safety")
  const [locationValue, setLocationValue] = useState("")
  const [dateOccurred, setDateOccurred] = useState(new Date())
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) return

    const refId = addIncident({
      title,
      description,
      category,
      location: locationValue,
      dateOccurred,
      isAnonymous,
      reporterId: isAnonymous ? "usr_anon" : user.id,
      reporterName: isAnonymous ? undefined : user.name,
    })

    setReferenceId(refId)
    setSubmitted(true)
  }

  return (
    <DashboardLayout title="Report an Incident" subtitle="Help keep campus safe">
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg lg:text-xl">
                    Incident Details
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Please provide as much detail as possible. All fields marked
                    with * are required.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5 lg:space-y-6"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Brief description of the incident"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        data-testid="input-title"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={category}
                          onValueChange={(v) => setCategory(v)}
                        >
                          <SelectTrigger data-testid="select-category">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safety">
                              <span className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                                Safety Concern
                              </span>
                            </SelectItem>
                            <SelectItem value="harassment">
                              Harassment
                            </SelectItem>
                            <SelectItem value="facilities">
                              Facilities Issue
                            </SelectItem>
                            <SelectItem value="theft">
                              Theft/Loss
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Date of Incident *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !dateOccurred && "text-muted-foreground"
                              )}
                              data-testid="button-date-picker"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateOccurred
                                ? format(dateOccurred, "PPP")
                                : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={dateOccurred}
                              onSelect={(date) =>
                                date && setDateOccurred(date)
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="Building, room, or area"
                          value={locationValue}
                          onChange={(e) =>
                            setLocationValue(e.target.value)
                          }
                          className="pl-10"
                          required
                          data-testid="input-location"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a detailed account of what happened..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                        data-testid="input-description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Attachments (Optional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 lg:p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 lg:w-8 lg:h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-xs lg:text-sm text-muted-foreground">
                          Tap to upload files
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 lg:p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 lg:gap-3">
                        <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">
                            Report Anonymously
                          </p>
                          <p className="text-xs text-muted-foreground hidden sm:block">
                            Your identity will not be stored
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isAnonymous}
                        onCheckedChange={setIsAnonymous}
                        data-testid="switch-anonymous"
                      />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2"
                        onClick={() => setLocation("/dashboard")}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        data-testid="button-submit-report"
                      >
                        Submit Report
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="text-center">
                <CardContent className="pt-10 lg:pt-12 pb-6 lg:pb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4 lg:mb-6"
                  >
                    <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-success" />
                  </motion.div>

                  <h2 className="text-xl lg:text-2xl font-bold mb-2">
                    Report Submitted
                  </h2>
                  <p className="text-sm lg:text-base text-muted-foreground mb-4 lg:mb-6">
                    Your incident report has been received.
                  </p>

                  <div className="bg-muted/50 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 inline-block">
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      Reference ID
                    </p>
                    <p className="text-lg lg:text-xl font-mono font-bold text-primary">
                      {referenceId}
                    </p>
                  </div>

                  <p className="text-xs lg:text-sm text-muted-foreground mb-4 lg:mb-6">
                    Save this ID to track your report status.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setLocation("/my-reports")}
                    >
                      View My Reports
                    </Button>
                    <Button onClick={() => setLocation("/dashboard")}>
                      Back to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
