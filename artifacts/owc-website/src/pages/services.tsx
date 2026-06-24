import { Link } from "wouter";
import { ChevronRight, FileText, Users, Briefcase, Scale, Heart, BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { useListServices } from "@workspace/api-client-react";

const iconMap: Record<string, React.ElementType> = {
  FileText, Users, Briefcase, Scale, Heart, BookOpen,
};

export default function Services() {
  const { data: services, isLoading } = useListServices({ status: "active" });

  const defaultServices = [
    { id: 1, title: "Claim Filing & Processing", description: "Submit and track workers compensation claims. Our team guides workers through every step of the process, from initial injury reporting to final settlement.", iconName: "FileText", targetAudience: "Workers" },
    { id: 2, title: "Employer Registration", description: "Register your business and employees with the OWC to ensure compliance with the Workers Compensation Act 1978 and protect your workforce.", iconName: "Briefcase", targetAudience: "Employers" },
    { id: 3, title: "Insurer Licensing & Oversight", description: "OWC licenses and supervises insurance companies providing workers compensation coverage in PNG, ensuring financial stability and fair claims handling.", iconName: "Scale", targetAudience: "Insurers" },
    { id: 4, title: "Medical & Rehabilitation Services", description: "Coordination of medical treatment, rehabilitation programs, and return-to-work planning for injured workers under approved treatment plans.", iconName: "Heart", targetAudience: "Workers" },
    { id: 5, title: "Dispute Resolution & Appeals", description: "Independent dispute resolution services for contested claims. Impartial panels review appeals and ensure equitable outcomes for all parties.", iconName: "BookOpen", targetAudience: "All Parties" },
    { id: 6, title: "Compliance Monitoring", description: "Regular audits and inspections to ensure employers maintain proper insurance coverage and comply with all reporting requirements.", iconName: "Users", targetAudience: "Employers" },
  ];

  const displayServices = services?.length ? services : defaultServices;

  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Services</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Services</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            The Office of Workers Compensation provides a comprehensive range of services to support workers, employers, and insurers in Papua New Guinea.
          </p>
        </div>
      </section>

      {/* Audience Tabs */}
      <section className="bg-card border-b border-border py-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            {["Workers", "Employers", "Insurers"].map((audience) => (
              <div key={audience} className="text-center p-4 bg-muted rounded-sm cursor-pointer hover:bg-primary hover:text-white transition-colors group">
                <p className="font-semibold text-foreground group-hover:text-white">{audience}</p>
                <p className="text-xs text-muted-foreground group-hover:text-white/80 mt-1">View services</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayServices.map((service) => {
                const Icon = iconMap[service.iconName ?? "FileText"] ?? FileText;
                return (
                  <div key={service.id} className="bg-card border border-border p-8 rounded-sm shadow-sm hover:shadow-md hover:border-primary/40 transition-all group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="w-7 h-7" />
                      </div>
                      {service.targetAudience && (
                        <span className="text-xs font-semibold bg-accent/20 text-accent-foreground px-2 py-1 rounded-sm">
                          {service.targetAudience}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-serif font-bold text-secondary text-center mb-12">How to File a Claim</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Report the Injury", desc: "Notify your employer immediately after a workplace injury occurs. This must be done within 24 hours." },
              { step: "02", title: "Seek Medical Attention", desc: "Get treated by an approved medical practitioner. Retain all medical reports and receipts." },
              { step: "03", title: "Complete Forms", desc: "Download and complete the WC1 claim form. Your employer also completes their section." },
              { step: "04", title: "Lodge Your Claim", desc: "Submit your completed forms to the nearest OWC office. We will acknowledge receipt within 5 business days." },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="text-5xl font-serif font-bold text-primary/20 mb-4 leading-none">{step.step}</div>
                <h3 className="text-lg font-serif font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-serif font-bold mb-1">Need help with a service?</h3>
            <p className="text-white/80">Our team is available Monday – Friday, 8am – 4pm.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/forms" className="bg-white text-primary px-6 py-3 rounded-sm font-semibold hover:bg-white/90 transition-colors">
              Download Forms
            </Link>
            <Link href="/contact" className="border border-white/40 px-6 py-3 rounded-sm font-semibold hover:bg-white/10 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
