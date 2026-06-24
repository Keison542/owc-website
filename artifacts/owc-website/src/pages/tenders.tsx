import { Link } from "wouter";
import { ChevronRight, Clock, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { useListTenders } from "@workspace/api-client-react";
import { useState } from "react";

const STATUS_OPTIONS = ["All", "open", "closed", "awarded"];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
    awarded: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${styles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function Tenders() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useListTenders({ page, limit: 10, status: statusFilter });

  const defaultTenders = [
    { id: 1, title: "Provision of ICT Support Services 2024-2026", description: "OWC seeks proposals from qualified ICT firms to provide ongoing IT support, maintenance, and helpdesk services.", referenceNumber: "OWC/ICT/2024/001", status: "open", category: "ICT", closingDate: "2024-08-30T00:00:00Z", publishedDate: "2024-06-01T00:00:00Z", contactEmail: "procurement@owc.gov.pg" },
    { id: 2, title: "Office Building Cleaning Services", description: "Expression of interest for provision of commercial cleaning services for OWC's Port Moresby head office and Lae regional office.", referenceNumber: "OWC/CLEAN/2024/002", status: "open", category: "Facilities", closingDate: "2024-07-31T00:00:00Z", publishedDate: "2024-06-10T00:00:00Z", contactEmail: "procurement@owc.gov.pg" },
    { id: 3, title: "Document Scanning and Digitisation Services", description: "Supply of document scanning, indexing, and digitisation services for historical case files.", referenceNumber: "OWC/SCAN/2024/003", status: "closed", category: "Administration", closingDate: "2024-05-15T00:00:00Z", publishedDate: "2024-04-01T00:00:00Z", contactEmail: "procurement@owc.gov.pg" },
  ];

  const items = data?.items?.length ? data.items : (page === 1 && !isLoading ? defaultTenders : []);
  const total = data?.total ?? defaultTenders.length;

  return (
    <div className="flex flex-col w-full">
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Tenders</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Tenders & Procurement</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            View current and past tenders issued by the Office of Workers Compensation. All procurement is conducted in accordance with the PNG Public Finances (Management) Act.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-8 flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s === "All" ? undefined : s); setPage(1); }}
              className={`px-4 py-2 text-sm rounded-sm font-medium transition-colors capitalize ${
                (s === "All" && !statusFilter) || statusFilter === s
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-muted/70"
              }`}
            >
              {s}
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
              <p className="text-lg">No tenders found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((tender) => (
                <div key={tender.id} className="bg-card border border-border rounded-sm p-6 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-mono text-muted-foreground">{tender.referenceNumber}</span>
                        <StatusBadge status={tender.status} />
                        {tender.category && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{tender.category}</span>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-xl">{tender.title}</h3>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{tender.description}</p>
                  <div className="flex items-center flex-wrap gap-6 text-sm">
                    {tender.publishedDate && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span className="font-medium">Published:</span>
                        {new Date(tender.publishedDate).toLocaleDateString("en-PG", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    )}
                    {tender.closingDate && (
                      <div className={`flex items-center gap-1 font-medium ${new Date(tender.closingDate) > new Date() ? "text-primary" : "text-red-600"}`}>
                        <Clock className="w-4 h-4" />
                        Closes: {new Date(tender.closingDate).toLocaleDateString("en-PG", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    )}
                    {tender.contactEmail && (
                      <a href={`mailto:${tender.contactEmail}`} className="flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="w-3 h-3" />
                        {tender.contactEmail}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {total > 10 && (
            <div className="flex justify-center gap-2 mt-12">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border border-border rounded-sm text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors">Previous</button>
              <span className="px-4 py-2 text-sm text-muted-foreground">Page {page} of {Math.ceil(total / 10)}</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 10)} className="px-4 py-2 border border-border rounded-sm text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
            </div>
          )}
        </div>
      </section>

      {/* Note */}
      <section className="py-8 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-start gap-4 bg-card border border-border rounded-sm p-6">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Procurement Notice</h4>
              <p className="text-muted-foreground text-sm">All OWC procurement is conducted in accordance with the Public Finances (Management) Act 1995. For enquiries about current tenders, email <a href="mailto:procurement@owc.gov.pg" className="text-primary hover:underline">procurement@owc.gov.pg</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
