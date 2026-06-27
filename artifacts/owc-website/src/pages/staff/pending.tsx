import { useListPendingContent, useApproveContent } from "@workspace/api-client-react";
import { CheckCircle, XCircle, Loader2, ClipboardList, Lock, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "approver" | "viewer";
  isActive: boolean;
}

export default function StaffPending() {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // ─── CHECK USER ROLE ───
  useEffect(() => {
    const storedUser = localStorage.getItem("owc_staff_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as StaffUser;
        setUser(parsedUser);
        // Only admin and approver can access pending approvals
        const canApprove = parsedUser.role === "admin" || parsedUser.role === "approver";
        setIsAuthorized(canApprove);
      } catch (e) {
        setIsAuthorized(false);
      }
    } else {
      setIsAuthorized(false);
    }
    setIsLoadingAuth(false);
  }, []);

  const { data, isLoading, refetch } = useListPendingContent();
  const { mutate: approve } = useApproveContent({ 
    mutation: { 
      onSuccess: () => refetch(),
      onError: (error: any) => {
        console.error("Approval failed:", error);
        // Handle 403/401 errors
        if (error?.response?.status === 403) {
          alert("You don't have permission to perform this action.");
        } else if (error?.response?.status === 401) {
          alert("Your session has expired. Please login again.");
          window.location.href = "/staff/login";
        }
      }
    } 
  });

  const handleAction = (contentType: string, contentId: number, action: "approve" | "reject") => {
    if (!user) return;
    
    // Double-check authorization on the frontend
    if (user.role !== "admin" && user.role !== "approver") {
      alert("You don't have permission to approve or reject content.");
      return;
    }

    const confirmMessage = action === "approve" 
      ? "Are you sure you want to approve this content? It will be published."
      : "Are you sure you want to reject this content?";
    
    if (confirm(confirmMessage)) {
      approve({ data: { contentType, contentId, action } });
    }
  };

  // ─── LOADING STATE ───
  if (isLoadingAuth) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // ─── UNAUTHORIZED ───
  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-sm p-8 max-w-md">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600 text-sm">
            You don't have permission to access this page.
            {user && (
              <span className="block mt-2 text-xs text-red-500">
                Your role: <span className="font-semibold uppercase">{user.role}</span> 
                (Requires: Admin or Approver)
              </span>
            )}
          </p>
          {!user && (
            <p className="text-red-600 text-sm mt-2">
              Please log in with an account that has approval permissions.
            </p>
          )}
          <button 
            onClick={() => window.location.href = "/staff/dashboard"}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-sm text-sm hover:bg-red-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ─── AUTHORIZED VIEW ───
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold">Pending Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and approve or reject content awaiting publication.
          {user && (
            <span className="block text-xs text-primary mt-1">
              Logged in as: <span className="font-semibold">{user.name}</span> ({user.role})
            </span>
          )}
        </p>
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
                <div className="text-xs text-muted-foreground mt-1">
                  Submitted: {new Date(item.createdAt).toLocaleDateString()}
                  {item.submittedBy && (
                    <span className="ml-2">by: <span className="font-medium">{item.submittedBy}</span></span>
                  )}
                </div>
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