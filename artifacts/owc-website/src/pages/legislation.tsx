import { Link } from "wouter";
import { ChevronRight, FileDown, Scale, Loader2, AlertCircle } from "lucide-react";
import { useListLegislation } from "@workspace/api-client-react";

export default function Legislation() {
  const { data, isLoading } = useListLegislation({ limit: 50 });

  const defaultLegislation = [
    { id: 1, title: "Workers Compensation Act 1978", description: "The principal legislation governing workers compensation in Papua New Guinea. Establishes the legal framework for compensation, rehabilitation, and dispute resolution.", type: "Act", fileUrl: "#", year: 1978, status: "active" },
    { id: 2, title: "Workers Compensation (Amendment) Act 2015", description: "Amendments to the principal Act extending coverage and updating compensation schedules.", type: "Amendment", fileUrl: "#", year: 2015, status: "active" },
    { id: 3, title: "Workers Compensation (Amendment) Act 2024", description: "Recent amendments expanding coverage for mental health injuries and updating premium calculation methods.", type: "Amendment", fileUrl: "#", year: 2024, status: "active" },
    { id: 4, title: "Workers Compensation Regulations 1980", description: "Subsidiary legislation providing operational details for the administration of the Workers Compensation Act.", type: "Regulation", fileUrl: "#", year: 1980, status: "active" },
    { id: 5, title: "Workers Compensation (Medical Fees) Order 2022", description: "Gazettal order setting the approved schedule of medical fees for workers compensation treatment.", type: "Order", fileUrl: "#", year: 2022, status: "active" },
    { id: 6, title: "Workers Compensation (Prescribed Conditions) Regulation 2019", description: "Regulation prescribing occupational diseases and conditions covered under the Act.", type: "Regulation", fileUrl: "#", year: 2019, status: "active" },
  ];

  type LegItem = typeof defaultLegislation[0];
  const items: LegItem[] = (data?.items?.length ? data.items : (!isLoading ? defaultLegislation : [])) as unknown as LegItem[];

  const grouped = items.reduce<Record<string, LegItem[]>>((acc, item) => {
    const type = item.type ?? "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-full">
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Legislation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Legislation</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Access the legislation, regulations, and subsidiary instruments governing workers compensation in Papua New Guinea.
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-12 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-card border border-border rounded-sm p-6 flex gap-4">
            <Scale className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif font-bold text-lg mb-2">Legal Framework</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Workers compensation in Papua New Guinea is primarily governed by the Workers Compensation Act 1978. The Act establishes entitlements, procedures for claiming compensation, the role of insurers, and the authority of the Office of Workers Compensation. All employers in PNG are required to carry workers compensation insurance under this framework.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legislation List */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No legislation found.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(grouped).map(([type, legItems]) => (
                <div key={type}>
                  <h2 className="text-2xl font-serif font-bold text-secondary mb-6 pb-2 border-b-2 border-accent">{type}s</h2>
                  <div className="space-y-4">
                    {legItems.map((item) => (
                      <div key={item.id} className="bg-card border border-border rounded-sm p-6 flex items-start gap-4 hover:border-primary/40 transition-colors">
                        <div className="text-center bg-primary/10 rounded-sm p-3 min-w-[60px]">
                          <div className="text-primary font-serif font-bold text-lg leading-none">{item.year}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-serif font-bold text-lg mb-2">{item.title}</h3>
                              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                            </div>
                            {item.fileUrl && (
                              <a
                                href={item.fileUrl}
                                download
                                className="flex items-center gap-2 text-primary hover:bg-primary hover:text-white border border-primary/30 px-3 py-2 rounded-sm text-sm font-medium transition-colors flex-shrink-0"
                              >
                                <FileDown className="w-4 h-4" />
                                PDF
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
