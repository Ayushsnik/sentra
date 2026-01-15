import { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Mail, Lock, ArrowRight, UserRound } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const [role, setRole] = useState("student"); // default
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isStudent = role === "student";
  const isStaff = role === "staff";
  const isAdmin = role === "admin";

  const roleTitle = useMemo(() => {
    if (isStudent) return "Student Sign In";
    if (isStaff) return "Staff Sign In";
    return "Admin Sign In";
  }, [isStudent, isStaff]);

  const roleDesc = useMemo(() => {
    if (isStudent) return "Sign in or create a student account";
    return "Sign in using your official credentials";
  }, [isStudent]);

  const handleSubmit = (e) => {
    e.preventDefault();

    login(email, password, role);

    // Redirect based on role
    if (isAdmin) setLocation("/incidents"); // admin dashboard
    else setLocation("/dashboard");
  };

  const RoleTab = ({ value, label }) => {
    const active = role === value;

    return (
      <button
        type="button"
        onClick={() => setRole(value)}
        className={[
          "flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
          "border",
          active
            ? "bg-primary text-white border-primary shadow"
            : "bg-background hover:bg-muted border-border text-muted-foreground",
        ].join(" ")}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex gradient-mesh">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-700" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 text-white max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8">
            <Shield className="w-8 h-8" />
          </div>

          <h1 className="text-4xl font-bold mb-4">Keep Your Campus Safe</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Sentra empowers students, staff, and administrators to report incidents
            securely and track their resolution transparently.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30"
                />
              ))}
            </div>
            <span className="text-sm text-white/70">
              Safe reporting • Transparent action
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center gap-3 mb-6 lg:mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Sentra</span>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl lg:text-2xl">{roleTitle}</CardTitle>
              <CardDescription className="text-sm">{roleDesc}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Role Tabs */}
              <div className="space-y-2">
                <Label>Who are you?</Label>
                <div className="flex gap-2">
                  <RoleTab value="student" label="Student" />
                  <RoleTab value="staff" label="Staff" />
                  <RoleTab value="admin" label="Admin" />
                </div>
              </div>

              {/* Login Form (same for all roles) */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={
                        isStudent ? "you@university.edu" : "official@institution.edu"
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" size="lg">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              {/* Student can Sign Up, Staff/Admin cannot */}
              {isStudent ? (
                <div className="text-center pt-1">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="text-primary hover:underline font-medium"
                    >
                      Create one
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                  <UserRound className="w-4 h-4 mt-0.5" />
                  <p>
                    {isAdmin ? "Admin" : "Staff"} accounts are managed by the
                    institution. Please use your official credentials.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="mt-4 lg:mt-6 text-center text-xs text-muted-foreground px-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
