import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreHorizontal,
  Mail,
  Shield,
  User,
  Users as UsersIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const mockUsers = [
  { id: "1", name: "Alex Johnson", email: "alex.j@university.edu", role: "student", status: "active", reportsCount: 3, joinedDate: "2024-09-01" },
  { id: "2", name: "Dr. Maria Chen", email: "m.chen@university.edu", role: "staff", status: "active", reportsCount: 5, joinedDate: "2022-08-15" },
  { id: "3", name: "Jamie Rivera", email: "j.rivera@university.edu", role: "student", status: "active", reportsCount: 1, joinedDate: "2024-09-01" },
  { id: "4", name: "Sam Wilson", email: "s.wilson@university.edu", role: "student", status: "inactive", reportsCount: 0, joinedDate: "2023-09-01" },
  { id: "5", name: "Dr. Robert Brown", email: "r.brown@university.edu", role: "staff", status: "active", reportsCount: 2, joinedDate: "2020-01-10" },
  { id: "6", name: "Admin User", email: "admin@university.edu", role: "admin", status: "active", reportsCount: 0, joinedDate: "2019-06-01" },
  { id: "7", name: "Taylor Kim", email: "t.kim@university.edu", role: "student", status: "active", reportsCount: 2, joinedDate: "2024-01-15" },
  { id: "8", name: "Prof. Lisa Park", email: "l.park@university.edu", role: "staff", status: "active", reportsCount: 4, joinedDate: "2021-03-20" },
];

const roleColors = {
  student: "bg-blue-500/10 text-blue-600",
  staff: "bg-purple-500/10 text-purple-600",
  admin: "bg-amber-500/10 text-amber-600",
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    all: mockUsers.length,
    student: mockUsers.filter((u) => u.role === "student").length,
    staff: mockUsers.filter((u) => u.role === "staff").length,
    admin: mockUsers.filter((u) => u.role === "admin").length,
  };

  return (
    <DashboardLayout title="User Management" subtitle="Manage users and their roles">
      <div className="space-y-6">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-users"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={roleFilter} onValueChange={(v) => setRoleFilter(v)}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">All ({roleCounts.all})</TabsTrigger>
            <TabsTrigger value="student">Students ({roleCounts.student})</TabsTrigger>
            <TabsTrigger value="staff">Staff ({roleCounts.staff})</TabsTrigger>
            <TabsTrigger value="admin">Admins ({roleCounts.admin})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Users */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{user.name}</h4>

                        <Badge className={roleColors[user.role]}>
                          {user.role === "admin" ? (
                            <Shield className="w-3 h-3 mr-1" />
                          ) : user.role === "staff" ? (
                            <UsersIcon className="w-3 h-3 mr-1" />
                          ) : (
                            <User className="w-3 h-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>

                        {user.status === "inactive" && (
                          <Badge variant="outline" className="text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>

                    <div className="hidden md:block text-right">
                      <p className="text-sm font-medium">
                        {user.reportsCount} reports
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {new Date(user.joinedDate).toLocaleDateString()}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Reports</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl border">
            <UsersIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
