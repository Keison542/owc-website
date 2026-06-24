import { Link } from "wouter";
import { ChevronRight, CalendarDays, Tag, Loader2, AlertCircle } from "lucide-react";
import { useListNews } from "@workspace/api-client-react";
import { useState } from "react";

const CATEGORIES = ["All", "Announcements", "Policy Updates", "Events", "Media Releases"];

export default function News() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { data, isLoading } = useListNews({
    page,
    limit: 9,
    status: "published",
    category: selectedCategory,
  });

  const defaultNews = [
    { id: 1, title: "OWC Launches New Digital Claims Portal", summary: "Workers across Papua New Guinea can now lodge compensation claims online, reducing processing times significantly.", category: "Announcements", publishedAt: "2024-06-01T00:00:00Z", imageUrl: null },
    { id: 2, title: "Workers Compensation Act Amendment 2024", summary: "The National Parliament has passed amendments to the Workers Compensation Act, expanding coverage for mental health injuries.", category: "Policy Updates", publishedAt: "2024-05-15T00:00:00Z", imageUrl: null },
    { id: 3, title: "Annual Workers Safety Conference 2024", summary: "OWC will co-host the annual PNG Workers Safety Conference in Port Moresby this September.", category: "Events", publishedAt: "2024-05-01T00:00:00Z", imageUrl: null },
    { id: 4, title: "Q1 2024 Claims Statistics Released", summary: "The office has published its first quarter claims statistics showing a 12% improvement in claim processing times.", category: "Media Releases", publishedAt: "2024-04-15T00:00:00Z", imageUrl: null },
    { id: 5, title: "New Provincial Office Opens in Lae", summary: "OWC has opened a new regional office in Lae to better serve workers and employers in the Morobe Province.", category: "Announcements", publishedAt: "2024-04-01T00:00:00Z", imageUrl: null },
    { id: 6, title: "Employer Compliance Audit Results 2024", summary: "Results from the annual employer compliance audit show 87% of registered employers are fully compliant with compensation requirements.", category: "Media Releases", publishedAt: "2024-03-20T00:00:00Z", imageUrl: null },
  ];

  const items = data?.items?.length ? data.items : (page === 1 && !isLoading ? defaultNews : []);
  const total = data?.total ?? defaultNews.length;

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">News & Announcements</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">News & Announcements</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Stay informed with the latest news, policy updates, events, and announcements from the Office of Workers Compensation.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-8 flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat === "All" ? undefined : cat);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm rounded-sm font-medium transition-colors ${
                (cat === "All" && !selectedCategory) || selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-muted text-foreground hover:bg-muted/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">No news articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((article) => (
                <Link key={article.id} href={`/news/${article.id}`} className="group">
                  <article className="bg-card border border-border rounded-sm overflow-hidden shadow-sm hover:shadow-md hover:border-primary/40 transition-all h-full flex flex-col">
                    <div className="h-48 bg-secondary/10 flex items-center justify-center border-b border-border">
                      {article.imageUrl ? (
                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-primary/20 rounded-sm flex items-center justify-center">
                          <span className="text-primary font-serif font-bold text-2xl">OWC</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        {article.category && (
                          <span className="flex items-center gap-1 text-primary font-semibold uppercase tracking-wider">
                            <Tag className="w-3 h-3" />{article.category}
                          </span>
                        )}
                        {article.publishedAt && (
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" />
                            {new Date(article.publishedAt).toLocaleDateString("en-PG", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">{article.summary}</p>
                      <span className="text-primary text-sm font-semibold flex items-center gap-1">
                        Read more <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 9 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-border rounded-sm text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {page} of {Math.ceil(total / 9)}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil(total / 9)}
                className="px-4 py-2 border border-border rounded-sm text-sm font-medium disabled:opacity-40 hover:bg-muted transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
