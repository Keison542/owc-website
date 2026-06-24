import { useListForms, useCreateForm, useUpdateForm, useDeleteForm } from "@workspace/api-client-react";
import GenericContentPage, { ContentItem, StatusBadge } from "./generic-content";

export default function StaffForms() {
  const { data, isLoading, refetch } = useListForms({});
  const { mutate: create, isPending } = useCreateForm({ mutation: { onSuccess: () => refetch() } });
  const { mutate: update } = useUpdateForm({ mutation: { onSuccess: () => refetch() } });
  const { mutate: del } = useDeleteForm({ mutation: { onSuccess: () => refetch() } });

  return (
    <GenericContentPage
      title="Forms & Downloads"
      items={(data ?? []) as unknown as ContentItem[]}
      isLoading={isLoading}
      createPending={isPending}
      columns={[
        { label: "Title", key: "title", render: (item) => <span className="font-medium line-clamp-1">{item.title as string}</span> },
        { label: "Category", key: "category" },
        { label: "Status", key: "status", render: (item) => <StatusBadge status={item.status as string} /> },
      ]}
      formFields={[
        { key: "title", label: "Form Title", placeholder: "e.g. Workers Compensation Claim Form (WC1)", required: true },
        { key: "category", label: "Category", type: "select", options: ["Claims", "Employer", "Medical", "Appeals", "General"] },
        { key: "description", label: "Description", type: "textarea", rows: 2, placeholder: "Brief description of the form" },
        { key: "fileUrl", label: "File URL", type: "url", placeholder: "https://..." },
        { key: "version", label: "Version", placeholder: "e.g. 2024-01" },
        { key: "status", label: "Status", type: "select", options: ["active", "inactive", "archived"] },
      ]}
      defaultValues={{ title: "", category: "General", description: "", fileUrl: "", version: "", status: "active" }}
      onCreate={(data) => create({ data: data as unknown as Parameters<typeof create>[0]["data"] })}
      onUpdate={(id, data) => update({ id, data: data as unknown as Parameters<typeof update>[0]["data"] })}
      onDelete={(id) => del({ id })}
    />
  );
}
