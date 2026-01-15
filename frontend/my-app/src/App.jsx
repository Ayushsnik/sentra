import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider, useAuth } from "@/lib/auth-context";
import { IncidentsProvider } from "@/lib/incidents-context";

import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import MyReports from "@/pages/my-reports";
import Incidents from "@/pages/incidents";
import Report from "@/pages/report";
import IncidentDetail from "@/pages/incident-detail";
import Awareness from "@/pages/awareness";
import UsersPage from "@/pages/users";
import Settings from "@/pages/settings";

/* -------------------- ROUTE HELPERS -------------------- */

function ProtectedRoute({ Component }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return <Component />;
}

function PublicRoute({ Component }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  return <Component />;
}

/* -------------------- ROUTER -------------------- */

function Router() {
  const [, setLocation] = useLocation();

  return (
    <Switch>
      <Route path="/">
        {() => {
          setLocation("/login");
          return null;
        }}
      </Route>

      <Route path="/login">
        <PublicRoute Component={Login} />
      </Route>

      <Route path="/register">
        <PublicRoute Component={Register} />
      </Route>

      <Route path="/dashboard">
        <ProtectedRoute Component={Dashboard} />
      </Route>

      <Route path="/my-reports">
        <ProtectedRoute Component={MyReports} />
      </Route>

      <Route path="/incidents">
        <ProtectedRoute Component={Incidents} />
      </Route>

      <Route path="/report">
        <ProtectedRoute Component={Report} />
      </Route>

      <Route path="/incident/:id">
        <ProtectedRoute Component={IncidentDetail} />
      </Route>

      <Route path="/awareness">
        <ProtectedRoute Component={Awareness} />
      </Route>

      <Route path="/users">
        <ProtectedRoute Component={UsersPage} />
      </Route>

      <Route path="/settings">
        <ProtectedRoute Component={Settings} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

/* -------------------- APP -------------------- */

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <IncidentsProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </IncidentsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
