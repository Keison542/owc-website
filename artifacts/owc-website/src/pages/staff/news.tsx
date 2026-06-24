import { useState } from "react";
import { Link } from "wouter";
import { useListNews, useDeleteNews, useCreateNews, useUpdateNews } from "@workspace/api-client-react";
import { Plus, Pencil, Trash2, Loader2, Eye, Star } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-green-100 text-green-800",
    draft: "bg-amber-100 text-amber-800",
    archived: "bg-gray-100 text-gray-600",
    rejected: "bg-red-100 text-red-800",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

function NewsForm({ initial, onSave, onCancel }: {
  initial?: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: (initial?.title as string) ?? "",
    summary: (initial?.summary as string) ?? "",
    content: (initial?.content as string) ?? "",
    category: (initial?.category as string) ?? "",
    status: (initial?.status as string) ?? "draft",
    featured: (initial?.featured as boolean) ?? false,
    imageUrl: (initial?.imageUrl as string) ?? "",
  });

  return (
    <div className="bg-card border border-border rounded-sm p-6 mb-6">
      <h3 className="font-serif font-bold text-lg mb-4">{initial ? "Edit Article" : "New Article"}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Article title" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <textarea rows={2} className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Short summary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <textarea rows={6} className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Article content..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Announcements" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-primary" />
          <label htmlFor="featured" className="text-sm font-medium">Feature on homepage</label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} className="bg-primary text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors">Save</button>
        <button onClick={onCancel} className="border border-border px-5 py-2 rounded-sm text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function StaffNews() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const { data, isLoading, refetch } = useListNews({ limit: 50 });
  const { mutate: deleteNews } = useDeleteNews({ mutation: { onSuccess: () => refetch() } });
  const { mutate: createNews } = useCreateNews({ mutation: { onSuccess: () => { refetch(); setShowForm(false); } } });
  const { mutate: updateNews } = useUpdateNews({ mutation: { onSuccess: () => { refetch(); setEditing(null); } } });

  const handleDelete = (id: number) => {
    if (confirm("Delete this article?")) deleteNews({ id });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold">News Articles</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {showForm && (
        <NewsForm
          onSave={(data) => createNews({ data: data as unknown as Parameters<typeof createNews>[0]["data"] })}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editing && (
        <NewsForm
          initial={editing}
          onSave={(data) => updateNews({ id: editing.id as number, data: data as unknown as Parameters<typeof updateNews>[0]["data"] })}
          onCancel={() => setEditing(null)}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Title</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data?.items?.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                      <span className="font-medium line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{item.category ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/news/${item.id}`}>
                        <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                      </Link>
                      <button onClick={() => setEditing(item as unknown as Record<string, unknown>)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!data?.items?.length && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No articles yet. Create your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
