import { Link, useLocation } from "wouter";
import { ChevronRight, Search as SearchIcon, Loader2, AlertCircle, FileText, Newspaper, Scale, Briefcase, HelpCircle, FileDown, Settings } from "lucide-react";
import { useSearch } from "@workspace/api-client-react";
import { useState, useEffect } from "react";

const TYPE_ICONS: Record<string, React.ElementType> = {
  news: Newspaper,
  publications: FileDown,
  legislation: Scale,
  tenders: Briefcase,
  faqs: HelpCircle,
  forms: FileText,
  services: Settings,
};

const TYPE_LABELS: Record<string, string> = {
  news: "News",
  publications: "Publication",
  legislation: "Legislation",
  tenders: "Tender",
  faqs: "FAQ",
  forms: "Form",
  services: "Service",
};

export default function SearchPage() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialQuery = urlParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);

  const { data, isLoading } = useSearch({ q: query, limit: 20 }, { query: { enabled: query.length > 1, queryKey: ["search", query] } });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
    const url = new URL(window.location.href);
    url.searchParams.set("q", searchInput);
    window.history.pushState({}, "", url.toString());
  };

  return (
    <div className="flex flex-col w-full">
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Search</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Search</h1>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search news, forms, legislation, tenders..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-colors text-base"
              />
            </div>
            <button type="submit" className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-sm font-semibold transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {!query ? (
            <div className="text-center py-16 text-muted-foreground">
              <SearchIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Enter a search term above to find information across the OWC website.</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : !data?.results?.length ? (
            <div className="text-center py-16 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <h3 className="text-xl font-serif font-bold mb-2 text-foreground">No results for "{query}"</h3>
              <p className="mb-6">Try different keywords or browse our sections below.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/news" className="text-primary hover:underline text-sm">News</Link>
                <Link href="/forms" className="text-primary hover:underline text-sm">Forms</Link>
                <Link href="/legislation" className="text-primary hover:underline text-sm">Legislation</Link>
                <Link href="/faqs" className="text-primary hover:underline text-sm">FAQs</Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 text-muted-foreground text-sm">
                Found <strong className="text-foreground">{data.total}</strong> results for <strong className="text-foreground">"{data.query}"</strong>
              </div>
              <div className="space-y-4">
                {data.results.map((result, idx) => {
                  const Icon = TYPE_ICONS[result.type] ?? FileText;
                  const label = TYPE_LABELS[result.type] ?? result.type;
                  return (
                    <Link key={`${result.type}-${result.id}-${idx}`} href={result.url ?? "#"}>
                      <div className="bg-card border border-border rounded-sm p-6 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer">
                        <div className="flex items-center gap-2 text-xs text-primary font-semibold uppercase tracking-wider mb-2">
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </div>
                        <h3 className="font-serif font-bold text-lg mb-2 hover:text-primary transition-colors">{result.title}</h3>
                        {result.excerpt && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{result.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
