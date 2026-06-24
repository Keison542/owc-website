import { useState } from "react";
import { useListContactSubmissions, useUpdateContactSubmission } from "@workspace/api-client-react";
import { Loader2, Mail, CheckCircle, Clock } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-800",
    read: "bg-gray-100 text-gray-700",
    responded: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-500",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

export default function StaffContact() {
  const [selected, setSelected] = useState<number | null>(null);
  const { data, isLoading, refetch } = useListContactSubmissions({ limit: 50 });
  const { mutate: update } = useUpdateContactSubmission({ mutation: { onSuccess: () => refetch() } });

  const items = data?.items ?? [];
  const selectedItem = items.find((i) => i.id === selected);

  const markAs = (id: number, status: string) => {
    update({ id, data: { status } });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold">Contact Submissions</h1>
        <p className="text-muted-foreground text-sm mt-1">Messages submitted through the public contact form.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>
          ) : !items.length ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No submissions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item.id)}
                  className={`w-full text-left p-4 hover:bg-muted/40 transition-colors ${selected === item.id ? "bg-primary/5 border-l-2 border-primary" : ""}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-medium text-sm ${item.status === "new" ? "text-foreground" : "text-muted-foreground"}`}>{item.name}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{item.subject}</div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(item.createdAt).toLocaleDateString()}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 bg-card border border-border rounded-sm p-6">
          {!selectedItem ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
              <Mail className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Select a submission to view details</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-serif font-bold text-xl mb-1">{selectedItem.subject}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{new Date(selectedItem.createdAt).toLocaleString()}</span>
                    <StatusBadge status={selectedItem.status} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">From:</span> <span className="text-muted-foreground">{selectedItem.name}</span></div>
                  <div><span className="font-medium">Email:</span> <a href={`mailto:${selectedItem.email}`} className="text-primary hover:underline">{selectedItem.email}</a></div>
                  {selectedItem.phone && <div><span className="font-medium">Phone:</span> <span className="text-muted-foreground">{selectedItem.phone}</span></div>}
                </div>
                <div className="bg-muted/30 border border-border rounded-sm p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedItem.message}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`mailto:${selectedItem.email}?subject=Re: ${selectedItem.subject}`} className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Reply
                </a>
                {selectedItem.status !== "responded" && (
                  <button onClick={() => markAs(selectedItem.id, "responded")} className="flex items-center gap-1.5 border border-border px-4 py-2 rounded-sm text-sm font-medium hover:bg-muted transition-colors">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" /> Mark Responded
                  </button>
                )}
                {selectedItem.status === "new" && (
                  <button onClick={() => markAs(selectedItem.id, "read")} className="flex items-center gap-1.5 border border-border px-4 py-2 rounded-sm text-sm font-medium hover:bg-muted transition-colors">
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
