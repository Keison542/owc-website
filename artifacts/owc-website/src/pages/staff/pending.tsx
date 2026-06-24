import { useListPendingContent, useApproveContent } from "@workspace/api-client-react";
import { CheckCircle, XCircle, Loader2, ClipboardList } from "lucide-react";

export default function StaffPending() {
  const { data, isLoading, refetch } = useListPendingContent();
  const { mutate: approve } = useApproveContent({ mutation: { onSuccess: () => refetch() } });

  const handleAction = (contentType: string, contentId: number, action: "approve" | "reject") => {
    approve({ data: { contentType, contentId, action } });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold">Pending Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve or reject content awaiting publication.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : !data?.items?.length ? (
        <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-sm">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No pending items</p>
          <p className="text-sm mt-1">All content has been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.items.map((item) => (
            <div key={`${item.type}-${item.id}`} className="bg-card border border-border rounded-sm p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{item.type}</div>
                <div className="font-medium truncate">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(item.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleAction(item.type, item.id, "approve")}
                  className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => handleAction(item.type, item.id, "reject")}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
