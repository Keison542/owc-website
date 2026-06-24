import { useListTenders, useCreateTender, useUpdateTender, useDeleteTender } from "@workspace/api-client-react";
import GenericContentPage, { ContentItem, StatusBadge } from "./generic-content";

export default function StaffTenders() {
  const { data, isLoading, refetch } = useListTenders({ limit: 50 });
  const { mutate: create, isPending } = useCreateTender({ mutation: { onSuccess: () => refetch() } });
  const { mutate: update } = useUpdateTender({ mutation: { onSuccess: () => refetch() } });
  const { mutate: del } = useDeleteTender({ mutation: { onSuccess: () => refetch() } });

  return (
    <GenericContentPage
      title="Tenders"
      items={(data?.items ?? []) as unknown as ContentItem[]}
      isLoading={isLoading}
      createPending={isPending}
      columns={[
        { label: "Title", key: "title", render: (item) => <span className="font-medium line-clamp-1">{item.title as string}</span> },
        { label: "Reference", key: "referenceNumber" },
        { label: "Status", key: "status", render: (item) => <StatusBadge status={item.status as string} /> },
        { label: "Closes", key: "closingDate", render: (item) => <span>{item.closingDate ? new Date(item.closingDate as string).toLocaleDateString() : "—"}</span> },
      ]}
      formFields={[
        { key: "title", label: "Tender Title", placeholder: "e.g. Provision of ICT Services", required: true },
        { key: "referenceNumber", label: "Reference Number", placeholder: "OWC/XXX/YYYY/NNN", required: true },
        { key: "description", label: "Description", type: "textarea", rows: 3, placeholder: "Tender description..." },
        { key: "category", label: "Category", placeholder: "e.g. ICT, Facilities, Consulting" },
        { key: "closingDate", label: "Closing Date", type: "date" },
        { key: "publishedDate", label: "Published Date", type: "date" },
        { key: "contactEmail", label: "Contact Email", placeholder: "procurement@owc.gov.pg" },
        { key: "status", label: "Status", type: "select", options: ["open", "closed", "awarded", "cancelled"] },
      ]}
      defaultValues={{ title: "", referenceNumber: "", description: "", category: "", closingDate: "", publishedDate: "", contactEmail: "procurement@owc.gov.pg", status: "open" }}
      onCreate={(data) => create({ data: data as unknown as Parameters<typeof create>[0]["data"] })}
      onUpdate={(id, data) => update({ id, data: data as unknown as Parameters<typeof update>[0]["data"] })}
      onDelete={(id) => del({ id })}
    />
  );
}
