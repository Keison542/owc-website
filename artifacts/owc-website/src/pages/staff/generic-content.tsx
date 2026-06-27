import { useState, ReactNode } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export type ContentItem = Record<string, unknown> & { id: number };

interface Column {
  label: string;
  key: string;
  render?: (item: ContentItem) => ReactNode;
}

interface FormField {
  key: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "url" | "date";
  options?: string[];
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

interface GenericContentPageProps {
  title: string;
  description?: string;
  items: ContentItem[];
  isLoading: boolean;
  columns: Column[];
  formFields: FormField[];
  defaultValues: Record<string, unknown>;
  onCreate: (data: Record<string, unknown>) => void;
  onUpdate: (id: number, data: Record<string, unknown>) => void;
  onDelete: (id: number) => void;
  createPending?: boolean;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800",
    draft: "bg-amber-100 text-amber-800",
    archived: "bg-gray-100 text-gray-600",
    open: "bg-blue-100 text-blue-800",
    closed: "bg-red-100 text-red-700",
    awarded: "bg-purple-100 text-purple-700",
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${map[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

export { StatusBadge };

// ─── EXTRACTED FORM PANEL COMPONENT ───
interface FormPanelProps {
  formFields: FormField[];
  form: Record<string, unknown>;
  setForm: (form: Record<string, unknown>) => void;
  isEditing: boolean;
  title: string;
  createPending?: boolean;
  onSave: () => void;
  onCancel: () => void;
}

function FormPanel({
  formFields,
  form,
  setForm,
  isEditing,
  title,
  createPending,
  onSave,
  onCancel,
}: FormPanelProps) {
  const renderFormField = (field: FormField) => {
    const value = (form[field.key] ?? "") as string;
    const cls = "w-full border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background";

    if (field.type === "textarea") {
      return (
        <textarea
          rows={field.rows ?? 4}
          className={`${cls} resize-none`}
          value={value}
          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
          placeholder={field.placeholder}
        />
      );
    }
    if (field.type === "select" && field.options) {
      return (
        <select className={cls} value={value} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}>
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={field.type ?? "text"}
        className={cls}
        value={value}
        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <div className="bg-card border border-border rounded-sm p-6 mb-6">
      <h3 className="font-serif font-bold text-lg mb-4">
        {isEditing ? `Edit ${title.replace(/s$/, "")}` : `New ${title.replace(/s$/, "")}`}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formFields.map((field) => (
          <div
            key={field.key}
            className={
              field.type === "textarea" ||
              field.key === "content" ||
              field.key === "description" ||
              field.key === "answer"
                ? "md:col-span-2"
                : ""
            }
          >
            <label className="block text-sm font-medium mb-1">
              {field.label}
              {field.required !== false ? " *" : ""}
            </label>
            {renderFormField(field)}
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-5">
        <button
          onClick={onSave}
          disabled={createPending}
          className="bg-primary text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {createPending ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="border border-border px-5 py-2 rounded-sm text-sm font-medium hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function GenericContentPage({
  title,
  description,
  items,
  isLoading,
  columns,
  formFields,
  defaultValues,
  onCreate,
  onUpdate,
  onDelete,
  createPending,
}: GenericContentPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(defaultValues);

  const resetForm = () => {
    setForm(defaultValues);
  };

  const handleCreate = () => {
    onCreate(form);
    resetForm();
    setShowForm(false);
  };

  const handleUpdate = () => {
    if (editing) {
      onUpdate(editing.id, form);
      setEditing(null);
      resetForm();
    }
  };

  const startEdit = (item: ContentItem) => {
    setEditing(item);
    const formData: Record<string, unknown> = {};
    formFields.forEach((f) => {
      formData[f.key] = item[f.key] ?? "";
    });
    setForm(formData);
    setShowForm(false);
  };

  const handleCancel = () => {
    if (editing) {
      setEditing(null);
    } else {
      setShowForm(false);
    }
    resetForm();
  };

  return (
    <div>
      {/* ─── HEADER ─── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold">{title}</h1>
          {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditing(null);
            resetForm();
          }}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {/* ─── FORM PANELS ─── */}
      {showForm && (
        <FormPanel
          formFields={formFields}
          form={form}
          setForm={setForm}
          isEditing={false}
          title={title}
          createPending={createPending}
          onSave={handleCreate}
          onCancel={handleCancel}
        />
      )}

      {editing && (
        <FormPanel
          formFields={formFields}
          form={form}
          setForm={setForm}
          isEditing={true}
          title={title}
          createPending={createPending}
          onSave={handleUpdate}
          onCancel={handleCancel}
        />
      )}

      {/* ─── TABLE ─── */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-4 py-3 font-semibold">
                    {col.label}
                  </th>
                ))}
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? (
                        col.render(item)
                      ) : col.key === "status" ? (
                        <StatusBadge status={item[col.key] as string} />
                      ) : (
                        <span className="line-clamp-1 text-muted-foreground">
                          {String(item[col.key] ?? "—")}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete this item?`)) onDelete(item.id);
                        }}
                        className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                    No items yet. Add your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}