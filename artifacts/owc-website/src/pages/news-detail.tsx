import { Link } from "wouter";
import { ChevronRight, CalendarDays, Tag, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { useGetNewsById } from "@workspace/api-client-react";

export default function NewsDetail({ id }: { id: string }) {
  const { data: article, isLoading, isError } = useGetNewsById(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-24 text-center text-muted-foreground">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
        <h2 className="text-2xl font-serif font-bold mb-2">Article Not Found</h2>
        <p className="mb-6">The news article you are looking for does not exist or has been removed.</p>
        <Link href="/news" className="text-primary font-semibold hover:underline flex items-center gap-1 justify-center">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <section className="bg-secondary text-white py-12 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/news" className="hover:text-white transition-colors">News</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white line-clamp-1">{article.title}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            {article.category && (
              <span className="flex items-center gap-1 text-accent font-semibold uppercase tracking-wider">
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
          <h1 className="text-3xl md:text-4xl font-serif font-bold max-w-4xl">{article.title}</h1>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.title} className="w-full h-72 object-cover rounded-sm mb-8 border border-border" />
          )}
          {article.summary && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-medium border-l-4 border-primary pl-6">{article.summary}</p>
          )}
          <div
            className="prose prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, "<br />") }}
          />
          <div className="mt-12 pt-8 border-t border-border">
            <Link href="/news" className="text-primary font-semibold hover:underline flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to all news
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
