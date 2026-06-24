import { useListLegislation, useCreateLegislation, useUpdateLegislation, useDeleteLegislation } from "@workspace/api-client-react";
import GenericContentPage, { ContentItem, StatusBadge } from "./generic-content";

export default function StaffLegislation() {
  const { data, isLoading, refetch } = useListLegislation({ limit: 100 });
  const { mutate: create, isPending } = useCreateLegislation({ mutation: { onSuccess: () => refetch() } });
  const { mutate: update } = useUpdateLegislation({ mutation: { onSuccess: () => refetch() } });
  const { mutate: del } = useDeleteLegislation({ mutation: { onSuccess: () => refetch() } });

  return (
    <GenericContentPage
      title="Legislation"
      items={(data?.items ?? []) as unknown as ContentItem[]}
      isLoading={isLoading}
      createPending={isPending}
      columns={[
        { label: "Title", key: "title", render: (item) => <span className="font-medium line-clamp-1">{item.title as string}</span> },
        { label: "Type", key: "type" },
        { label: "Year", key: "year" },
        { label: "Status", key: "status", render: (item) => <StatusBadge status={item.status as string} /> },
      ]}
      formFields={[
        { key: "title", label: "Title", placeholder: "e.g. Workers Compensation Act 1978", required: true },
        { key: "type", label: "Type", type: "select", options: ["Act", "Amendment", "Regulation", "Order", "Other"] },
        { key: "year", label: "Year", type: "number", placeholder: String(new Date().getFullYear()) },
        { key: "description", label: "Description", type: "textarea", rows: 3, placeholder: "Brief description" },
        { key: "fileUrl", label: "File URL", type: "url", placeholder: "https://..." },
        { key: "status", label: "Status", type: "select", options: ["active", "repealed", "amended"] },
      ]}
      defaultValues={{ title: "", type: "Act", year: new Date().getFullYear(), description: "", fileUrl: "", status: "active" }}
      onCreate={(data) => create({ data: data as unknown as Parameters<typeof create>[0]["data"] })}
      onUpdate={(id, data) => update({ id, data: data as unknown as Parameters<typeof update>[0]["data"] })}
      onDelete={(id) => del({ id })}
    />
  );
}
