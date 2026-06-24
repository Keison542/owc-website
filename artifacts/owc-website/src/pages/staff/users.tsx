import { useState } from "react";
import { useListStaffUsers, useCreateStaffUser, useDeleteStaffUser } from "@workspace/api-client-react";
import { Plus, Trash2, Loader2, Users, Shield } from "lucide-react";

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    editor: "bg-blue-100 text-blue-800",
    viewer: "bg-gray-100 text-gray-700",
    approver: "bg-purple-100 text-purple-800",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${map[role] ?? "bg-muted text-muted-foreground"}`}>{role}</span>;
}

export default function StaffUsers() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "editor", password: "" });
  const [error, setError] = useState<string | null>(null);

  const { data: users, isLoading, refetch } = useListStaffUsers();
  const { mutate: createUser, isPending } = useCreateStaffUser({ mutation: { onSuccess: () => { refetch(); setShowForm(false); setForm({ name: "", email: "", role: "editor", password: "" }); } } });
  const { mutate: deleteUser } = useDeleteStaffUser({ mutation: { onSuccess: () => refetch() } });

  const handleCreate = () => {
    if (!form.name || !form.email || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }
    setError(null);
    createUser({ data: form });
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this user? This action cannot be undone.")) deleteUser({ id });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage staff portal user accounts.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-sm p-6 mb-6">
          <h3 className="font-serif font-bold text-lg mb-4">New Staff User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Staff member name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="staff@owc.gov.pg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role *</label>
              <select className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="approver">Approver</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Temporary Password *</label>
              <input type="password" className="w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" />
            </div>
          </div>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button onClick={handleCreate} disabled={isPending} className="bg-primary text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60">
              {isPending ? "Creating..." : "Create User"}
            </button>
            <button onClick={() => setShowForm(false)} className="border border-border px-5 py-2 rounded-sm text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Role</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Status</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Last Login</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                        {user.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs font-medium ${user.isActive ? "text-green-600" : "text-red-600"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!users?.length && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No staff users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
