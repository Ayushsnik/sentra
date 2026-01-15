import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Search,
  PhoneCall,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

const resources = [
  {
    id: 1,
    title: "How to Report an Incident Properly",
    category: "Reporting",
    risk: "general",
    content:
      "Include exact location, time, a clear description, and supporting proof (if available). Avoid false reporting.",
  },
  {
    id: 2,
    title: "Ragging Safety Guide",
    category: "Campus Safety",
    risk: "high",
    content:
      "Ragging is illegal. If you feel unsafe or threatened, report immediately and contact the designated helplines.",
  },
  {
    id: 3,
    title: "Cyberbullying & Online Harassment",
    category: "Cyber Safety",
    risk: "medium",
    content:
      "Save evidence (screenshots), avoid engaging, report the account, and inform authorities if threats are involved.",
  },
  {
    id: 4,
    title: "Theft & Lost Items",
    category: "Security",
    risk: "low",
    content:
      "Report missing items quickly with details. Mention last seen location and any identifying information.",
  },
];

const emergencyContacts = [
  { label: "Campus Security", number: "+91 99999 11111" },
  { label: "Anti-Ragging Helpline", number: "1800-180-5522" },
  { label: "Women Helpline", number: "1091" },
  { label: "Police Emergency", number: "112" },
];

function RiskTag({ risk }) {
  if (risk === "high") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
        <AlertTriangle className="w-4 h-4" />
        High Priority
      </span>
    );
  }
  if (risk === "medium") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600">
        <ShieldCheck className="w-4 h-4" />
        Medium Priority
      </span>
    );
  }
  if (risk === "low") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
        <ShieldCheck className="w-4 h-4" />
        Low Priority
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
      <ShieldCheck className="w-4 h-4" />
      General
    </span>
  );
}

export default function AwarenessHub() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const text = `${r.title} ${r.category} ${r.content}`.toLowerCase();
      return text.includes(q.toLowerCase());
    });
  }, [q]);

  return (
    <DashboardLayout
      title="Awareness Hub"
      subtitle="Safety resources, reporting guidance, and emergency contacts"
    >
      <div className="space-y-4 lg:space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="p-4 lg:p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search safety tips, reporting guidance..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts (Professional look) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <PhoneCall className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {emergencyContacts.map((c) => (
              <div
                key={c.label}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="text-xs text-muted-foreground">
                    Available 24×7 (as per institution policy)
                  </p>
                </div>

                {/* Not highlighted - clean professional */}
                <p className="text-sm font-medium text-foreground">
                  {c.number}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <Card key={r.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    {r.title}
                  </span>

                  <Badge variant="outline">{r.category}</Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.content}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <RiskTag risk={r.risk} />

                  <Link href="/report">
                    <Button size="sm" variant="outline" className="gap-1">
                      Report <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">
            No resources found. Try searching a different keyword.
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
