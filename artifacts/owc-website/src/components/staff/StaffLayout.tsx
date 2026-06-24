import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Newspaper, BookOpen, FileText, Scale, HelpCircle,
  Settings, Users, ClipboardList, LogOut, Briefcase, Mail, ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/staff/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/staff/news", icon: Newspaper, label: "News" },
  { href: "/staff/publications", icon: BookOpen, label: "Publications" },
  { href: "/staff/forms", icon: FileText, label: "Forms" },
  { href: "/staff/legislation", icon: Scale, label: "Legislation" },
  { href: "/staff/tenders", icon: Briefcase, label: "Tenders" },
  { href: "/staff/services", icon: Settings, label: "Services" },
  { href: "/staff/faqs", icon: HelpCircle, label: "FAQs" },
  { href: "/staff/contact", icon: Mail, label: "Contact Submissions" },
  { href: "/staff/pending", icon: ClipboardList, label: "Pending Approvals" },
  { href: "/staff/users", icon: Users, label: "User Management" },
];

export function StaffLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("owc_staff_token");
    if (!token) {
      navigate("/staff/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("owc_staff_token");
    localStorage.removeItem("owc_staff_user");
    navigate("/staff/login");
  };

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("owc_staff_user") ?? "{}");
    } catch {
      return {};
    }
  })();

  return (
    <div className="min-h-[100dvh] flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-secondary-foreground flex flex-col border-r border-white/10 flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/staff/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded flex items-center justify-center text-white font-serif font-bold text-sm">OWC</div>
            <div>
              <div className="font-serif font-bold text-sm text-white leading-tight">OWC Staff</div>
              <div className="text-xs text-muted-foreground">Content Management</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = location === href || location.startsWith(href + "/");
            return (
              <Link key={href} href={href}>
                <div className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                }`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-3 py-2">
            <div className="w-8 h-8 bg-primary/30 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.[0]?.toUpperCase() ?? "S"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name ?? "Staff User"}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.role ?? "staff"}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/10 rounded-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Staff Portal</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">
              {NAV_ITEMS.find((n) => location === n.href || location.startsWith(n.href + "/"))?.label ?? "Dashboard"}
            </span>
          </div>
          <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Back to website
          </Link>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
