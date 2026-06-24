import { Link } from "wouter";
import { ChevronRight, FileDown, CalendarDays, Loader2, AlertCircle, Filter } from "lucide-react";
import { useListPublications } from "@workspace/api-client-react";
import { useState } from "react";

const TYPES = ["All", "Annual Report", "Research", "Statistical Bulletin", "Guidelines", "Brochure"];

export default function Publications() {
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListPublications({ page, limit: 12, status: "published", type: selectedType });

  const defaultPubs = [
    { id: 1, title: "OWC Annual Report 2023", description: "Comprehensive annual report covering claims statistics, financial performance, and key achievements for 2023.", type: "Annual Report", year: 2023, fileUrl: "#", publishedAt: "2024-03-01T00:00:00Z" },
    { id: 2, title: "OWC Annual Report 2022", description: "Annual report for the 2022 financial year including operational review and audited financial statements.", type: "Annual Report", year: 2022, fileUrl: "#", publishedAt: "2023-04-01T00:00:00Z" },
    { id: 3, title: "Claims Statistics Bulletin Q1 2024", description: "Quarterly statistical bulletin on claims lodgement, processing, and resolution for January to March 2024.", type: "Statistical Bulletin", year: 2024, fileUrl: "#", publishedAt: "2024-05-01T00:00:00Z" },
    { id: 4, title: "Employer Compliance Guidelines 2024", description: "Updated guidelines for employers on their obligations under the Workers Compensation Act 1978.", type: "Guidelines", year: 2024, fileUrl: "#", publishedAt: "2024-01-15T00:00:00Z" },
    { id: 5, title: "Workers Rights Brochure", description: "Plain-language guide to workers rights and entitlements under PNG workers compensation legislation.", type: "Brochure", year: 2023, fileUrl: "#", publishedAt: "2023-07-01T00:00:00Z" },
    { id: 6, title: "Workplace Injury Prevention Research 2023", description: "Research report on workplace injury trends and prevention strategies in Papua New Guinea.", type: "Research", year: 2023, fileUrl: "#", publishedAt: "2023-11-01T00:00:00Z" },
  ];

  const items = data?.items?.length ? data.items : (page === 1 && !isLoading ? defaultPubs : []);
  const total = data?.total ?? defaultPubs.length;

  return (
    <div className="flex flex-col w-full">
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Publications</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Publications</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Access official OWC publications including annual reports, statistical bulletins, research papers, and guidelines.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-8 flex gap-2 flex-wrap items-center">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => { setSelectedType(type === "All" ? undefined : type); setPage(1); }}
              className={`px-3 py-1.5 text-sm rounded-sm font-medium transition-colors ${
                (type === "All" && !selectedType) || selectedType === type
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-muted/70"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">No publications found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((pub) => (
                <div key={pub.id} className="bg-card border border-border rounded-sm p-6 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{pub.type}</span>
                    {pub.year && <span className="text-xs text-muted-foreground font-medium">{pub.year}</span>}
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-3 leading-snug flex-1">{pub.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{pub.description}</p>
                  {pub.publishedAt && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(pub.publishedAt).toLocaleDateString("en-PG", { month: "long", year: "numeric" })}
                    </div>
                  )}
                  {pub.fileUrl && (
                    <a
                      href={pub.fileUrl}
                      download
                      className="flex items-center gap-2 bg-primary/10 hover:bg-primary hover:text-white text-primary px-4 py-2.5 rounded-sm transition-colors text-sm font-medium"
                    >
                      <FileDown className="w-4 h-4" />
                      Download PDF
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {total > 12 && (
            <div className="flex justify-center gap-2 mt-12">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-border rounded-sm text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors">Previous</button>
              <span className="px-4 py-2 text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 12)}</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 12)} className="px-4 py-2 border border-border rounded-sm text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
