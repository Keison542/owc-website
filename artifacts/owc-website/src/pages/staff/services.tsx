import { useListServices, useCreateService, useUpdateService, useDeleteService } from "@workspace/api-client-react";
import GenericContentPage, { ContentItem, StatusBadge } from "./generic-content";

export default function StaffServices() {
  const { data, isLoading, refetch } = useListServices({});
  const { mutate: create, isPending } = useCreateService({ mutation: { onSuccess: () => refetch() } });
  const { mutate: update } = useUpdateService({ mutation: { onSuccess: () => refetch() } });
  const { mutate: del } = useDeleteService({ mutation: { onSuccess: () => refetch() } });

  return (
    <GenericContentPage
      title="Services"
      items={(data ?? []) as unknown as ContentItem[]}
      isLoading={isLoading}
      createPending={isPending}
      columns={[
        { label: "Title", key: "title", render: (item) => <span className="font-medium line-clamp-1">{item.title as string}</span> },
        { label: "Audience", key: "targetAudience" },
        { label: "Order", key: "order" },
        { label: "Status", key: "status", render: (item) => <StatusBadge status={item.status as string} /> },
      ]}
      formFields={[
        { key: "title", label: "Service Title", placeholder: "e.g. Claim Filing & Processing", required: true },
        { key: "description", label: "Description", type: "textarea", rows: 3, placeholder: "What this service provides..." },
        { key: "content", label: "Full Content", type: "textarea", rows: 4, placeholder: "Detailed service information..." },
        { key: "targetAudience", label: "Target Audience", placeholder: "e.g. Workers, Employers, Insurers, All Parties" },
        { key: "iconName", label: "Icon Name", placeholder: "e.g. FileText, Users, Scale" },
        { key: "order", label: "Sort Order", type: "number", placeholder: "0" },
        { key: "status", label: "Status", type: "select", options: ["active", "inactive", "archived"] },
      ]}
      defaultValues={{ title: "", description: "", content: "", targetAudience: "", iconName: "FileText", order: 0, status: "active" }}
      onCreate={(data) => create({ data: data as unknown as Parameters<typeof create>[0]["data"] })}
      onUpdate={(id, data) => update({ id, data: data as unknown as Parameters<typeof update>[0]["data"] })}
      onDelete={(id) => del({ id })}
    />
  );
}
