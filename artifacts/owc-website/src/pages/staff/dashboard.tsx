import { Link } from "wouter";
import { useGetSiteStats } from "@workspace/api-client-react";
import { Loader2, Newspaper, BookOpen, FileText, Scale, Briefcase, ClipboardList, Mail, TrendingUp } from "lucide-react";

export default function StaffDashboard() {
  const { data: stats, isLoading } = useGetSiteStats();

  const statCards = [
    { label: "Published News", value: stats?.totalNews, icon: Newspaper, href: "/staff/news", color: "text-blue-600" },
    { label: "Publications", value: stats?.totalPublications, icon: BookOpen, href: "/staff/publications", color: "text-green-600" },
    { label: "Active Forms", value: stats?.totalForms, icon: FileText, href: "/staff/forms", color: "text-purple-600" },
    { label: "Legislation", value: stats?.totalLegislation, icon: Scale, href: "/staff/legislation", color: "text-orange-600" },
    { label: "Active Tenders", value: stats?.activeTenders, icon: Briefcase, href: "/staff/tenders", color: "text-red-600" },
    { label: "Pending Approvals", value: stats?.pendingApprovals, icon: ClipboardList, href: "/staff/pending", color: "text-amber-600", highlight: (stats?.pendingApprovals ?? 0) > 0 },
    { label: "New Contact Msgs (7d)", value: stats?.recentContactSubmissions, icon: Mail, href: "/staff/contact", color: "text-teal-600" },
    { label: "Active Services", value: stats?.totalServices, icon: TrendingUp, href: "/staff/services", color: "text-indigo-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Overview of OWC website content and activity.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statCards.map((card) => (
            <Link key={card.label} href={card.href}>
              <div className={`bg-card border rounded-sm p-5 hover:shadow-md transition-shadow cursor-pointer ${card.highlight ? "border-amber-400 bg-amber-50" : "border-border"}`}>
                <div className="flex items-start justify-between mb-3">
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                  {card.highlight && (
                    <span className="text-xs bg-amber-400 text-amber-900 font-semibold px-1.5 py-0.5 rounded">Action needed</span>
                  )}
                </div>
                <div className={`text-3xl font-serif font-bold mb-1 ${card.highlight ? "text-amber-700" : "text-foreground"}`}>
                  {card.value ?? "—"}
                </div>
                <div className="text-xs text-muted-foreground font-medium">{card.label}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="font-serif font-bold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Add News Article", href: "/staff/news/new", icon: Newspaper },
            { label: "Add Publication", href: "/staff/publications/new", icon: BookOpen },
            { label: "Add Form", href: "/staff/forms/new", icon: FileText },
            { label: "Add Tender", href: "/staff/tenders/new", icon: Briefcase },
            { label: "Add FAQ", href: "/staff/faqs/new", icon: ClipboardList },
            { label: "Add Legislation", href: "/staff/legislation/new", icon: Scale },
            { label: "View Pending", href: "/staff/pending", icon: ClipboardList },
            { label: "Manage Users", href: "/staff/users", icon: ClipboardList },
          ].map((action) => (
            <Link key={action.label} href={action.href}>
              <div className="flex items-center gap-3 bg-card border border-border rounded-sm px-4 py-3 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer text-sm font-medium">
                <action.icon className="w-4 h-4 text-primary flex-shrink-0" />
                {action.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
