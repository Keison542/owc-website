import { useListPublications, useCreatePublication, useUpdatePublication, useDeletePublication } from "@workspace/api-client-react";
import GenericContentPage, { ContentItem, StatusBadge } from "./generic-content";

export default function StaffPublications() {
  const { data, isLoading, refetch } = useListPublications({ limit: 50 });
  const { mutate: create, isPending } = useCreatePublication({ mutation: { onSuccess: () => refetch() } });
  const { mutate: update } = useUpdatePublication({ mutation: { onSuccess: () => refetch() } });
  const { mutate: del } = useDeletePublication({ mutation: { onSuccess: () => refetch() } });

  return (
    <GenericContentPage
      title="Publications"
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
        { key: "title", label: "Title", placeholder: "Publication title", required: true },
        { key: "type", label: "Type", type: "select", options: ["Annual Report", "Statistical Bulletin", "Research", "Guidelines", "Brochure", "Other"] },
        { key: "year", label: "Year", type: "number", placeholder: String(new Date().getFullYear()) },
        { key: "description", label: "Description", type: "textarea", rows: 3, placeholder: "Brief description" },
        { key: "fileUrl", label: "File URL", type: "url", placeholder: "https://..." },
        { key: "coverImageUrl", label: "Cover Image URL", type: "url", placeholder: "https://..." },
        { key: "status", label: "Status", type: "select", options: ["draft", "published", "archived"] },
      ]}
      defaultValues={{ title: "", type: "Annual Report", year: new Date().getFullYear(), description: "", fileUrl: "", coverImageUrl: "", status: "draft" }}
      onCreate={(data) => create({ data: data as unknown as Parameters<typeof create>[0]["data"] })}
      onUpdate={(id, data) => update({ id, data: data as unknown as Parameters<typeof update>[0]["data"] })}
      onDelete={(id) => del({ id })}
    />
  );
}
