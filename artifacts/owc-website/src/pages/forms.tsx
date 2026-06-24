import { Link } from "wouter";
import { ChevronRight, FileDown, Search, AlertCircle, Loader2, Filter } from "lucide-react";
import { useListForms } from "@workspace/api-client-react";
import { useState } from "react";

const CATEGORIES = ["All", "Claims", "Employer", "Medical", "Appeals", "General"];

export default function Forms() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: forms, isLoading } = useListForms({ status: "active" });

  const defaultForms = [
    { id: 1, title: "Workers Compensation Claim Form (WC1)", description: "Primary claim form to be completed by the injured worker.", category: "Claims", fileUrl: "#", fileSize: "245 KB", version: "2024-01" },
    { id: 2, title: "Employer's Report of Injury (WC2)", description: "To be completed by the employer within 7 days of a workplace injury.", category: "Employer", fileUrl: "#", fileSize: "198 KB", version: "2024-01" },
    { id: 3, title: "Medical Certificate Form (WC3)", description: "Medical practitioner's certificate supporting a compensation claim.", category: "Medical", fileUrl: "#", fileSize: "156 KB", version: "2023-06" },
    { id: 4, title: "Rehabilitation Plan Form (WC4)", description: "Outlines the rehabilitation program for an injured worker's return to work.", category: "Medical", fileUrl: "#", fileSize: "220 KB", version: "2024-01" },
    { id: 5, title: "Employer Registration Form (ER1)", description: "New employer registration with the Office of Workers Compensation.", category: "Employer", fileUrl: "#", fileSize: "180 KB", version: "2023-09" },
    { id: 6, title: "Notice of Appeal (WC-APP)", description: "File a formal appeal against a compensation determination.", category: "Appeals", fileUrl: "#", fileSize: "165 KB", version: "2022-12" },
    { id: 7, title: "Insurer Quarterly Return Form", description: "Required quarterly submission for licensed workers compensation insurers.", category: "Employer", fileUrl: "#", fileSize: "210 KB", version: "2024-01" },
    { id: 8, title: "Change of Circumstances Form", description: "Notify OWC of any change in your medical or employment circumstances.", category: "General", fileUrl: "#", fileSize: "142 KB", version: "2023-03" },
  ];

  const displayForms = forms?.length ? forms : defaultForms;

  const filtered = displayForms.filter((f) => {
    const matchCat = selectedCategory === "All" || f.category === selectedCategory;
    const matchSearch = !searchQuery || f.title.toLowerCase().includes(searchQuery.toLowerCase()) || (f.description ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Forms & Downloads</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Forms & Downloads</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Download official forms, guides, and templates for workers compensation claims, employer registration, and more.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-card border-b border-border py-6 sticky top-20 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border rounded-sm bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-sm rounded-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground hover:bg-muted/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Forms Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">No forms found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((form) => (
                <div key={form.id} className="bg-card border border-border rounded-sm p-6 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{form.category}</span>
                    {"version" in form && form.version && (
                      <span className="text-xs text-muted-foreground">v{form.version}</span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-3 leading-snug">{form.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">{form.description}</p>
                  <a
                    href={form.fileUrl ?? "#"}
                    download
                    className="flex items-center justify-between bg-primary/10 hover:bg-primary hover:text-white text-primary px-4 py-3 rounded-sm transition-colors font-medium text-sm group"
                  >
                    <span className="flex items-center gap-2">
                      <FileDown className="w-4 h-4" />
                      Download PDF
                    </span>
                    {"fileSize" in form && form.fileSize && (
                      <span className="text-xs opacity-70">{form.fileSize}</span>
                    )}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Help note */}
      <section className="py-8 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-start gap-4 bg-card border border-border rounded-sm p-6">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Need help completing a form?</h4>
              <p className="text-muted-foreground text-sm">
                Contact our office at <a href="mailto:info@owc.gov.pg" className="text-primary hover:underline">info@owc.gov.pg</a> or visit Level 3, Defens Haus, Hunter Street, Port Moresby. Our staff are available Monday – Friday, 8:00am – 4:00pm.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
