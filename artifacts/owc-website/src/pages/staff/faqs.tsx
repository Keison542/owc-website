import { useListFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq } from "@workspace/api-client-react";
import GenericContentPage, { ContentItem, StatusBadge } from "./generic-content";

export default function StaffFaqs() {
  const { data, isLoading, refetch } = useListFaqs({});
  const { mutate: create, isPending } = useCreateFaq({ mutation: { onSuccess: () => refetch() } });
  const { mutate: update } = useUpdateFaq({ mutation: { onSuccess: () => refetch() } });
  const { mutate: del } = useDeleteFaq({ mutation: { onSuccess: () => refetch() } });

  return (
    <GenericContentPage
      title="FAQs"
      items={(data ?? []) as unknown as ContentItem[]}
      isLoading={isLoading}
      createPending={isPending}
      columns={[
        { label: "Question", key: "question", render: (item) => <span className="font-medium line-clamp-1">{item.question as string}</span> },
        { label: "Category", key: "category" },
        { label: "Order", key: "order" },
        { label: "Status", key: "status", render: (item) => <StatusBadge status={item.status as string} /> },
      ]}
      formFields={[
        { key: "question", label: "Question", placeholder: "Frequently asked question", required: true },
        { key: "answer", label: "Answer", type: "textarea", rows: 4, placeholder: "Detailed answer...", required: true },
        { key: "category", label: "Category", placeholder: "e.g. Claims, Employers, Coverage" },
        { key: "order", label: "Sort Order", type: "number", placeholder: "0" },
        { key: "status", label: "Status", type: "select", options: ["published", "draft", "archived"] },
      ]}
      defaultValues={{ question: "", answer: "", category: "", order: 0, status: "published" }}
      onCreate={(data) => create({ data: data as unknown as Parameters<typeof create>[0]["data"] })}
      onUpdate={(id, data) => update({ id, data: data as unknown as Parameters<typeof update>[0]["data"] })}
      onDelete={(id) => del({ id })}
    />
  );
}
