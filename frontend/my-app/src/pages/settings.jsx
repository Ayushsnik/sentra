import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Bell,
  Mail,
  Shield,
  Palette,
  Save,
  Building,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage application settings and preferences"
    >
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" data-testid="tab-general">
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" data-testid="tab-security">
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" data-testid="tab-appearance">
              Appearance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Institution Settings
                  </CardTitle>
                  <CardDescription>
                    Configure your institution's information and branding
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="institution-name">Institution Name</Label>
                      <Input
                        id="institution-name"
                        defaultValue="State University"
                        data-testid="input-institution-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        defaultValue="admin@university.edu"
                        data-testid="input-admin-email"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Incident Categories</h4>
                    <div className="grid gap-2">
                      {["Safety", "Harassment", "Facilities", "Theft", "Other"].map(
                        (cat) => (
                          <div
                            key={cat}
                            className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg"
                          >
                            <span className="text-sm">{cat}</span>
                            <Switch
                              defaultChecked
                              data-testid={`switch-category-${cat.toLowerCase()}`}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <Button className="gap-2" data-testid="button-save-general">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Configure how and when notifications are sent
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Send email alerts for new incidents
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-email-notifications" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Status Change Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Notify reporters when their incident status changes
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-status-alerts" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Daily Digest</p>
                        <p className="text-sm text-muted-foreground">
                          Send a daily summary of all pending incidents
                        </p>
                      </div>
                      <Switch data-testid="switch-daily-digest" />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Urgent Incident Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Immediate notifications for high-priority incidents
                        </p>
                      </div>
                      <Switch defaultChecked data-testid="switch-urgent-alerts" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Notification Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="notification-email"
                        type="email"
                        defaultValue="alerts@university.edu"
                        className="flex-1"
                        data-testid="input-notification-email"
                      />
                      <Button variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button className="gap-2" data-testid="button-save-notifications">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure security and privacy options
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button className="gap-2" data-testid="button-save-security">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button className="gap-2" data-testid="button-save-appearance">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
