import { Link } from "wouter";
import { ArrowRight, FileText, Scale, Briefcase, ChevronRight, Activity, Users, FileDown } from "lucide-react";
import { useGetSiteStats } from "@workspace/api-client-react";

export default function Home() {
  const { data: stats } = useGetSiteStats();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-secondary overflow-hidden border-b-8 border-accent">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-transparent"></div>
        
        <div className="container mx-auto px-4 md:px-8 py-24 md:py-32 relative z-10 flex flex-col items-start">
          <div className="inline-block bg-primary/20 text-primary-foreground border border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6">
            Papua New Guinea
          </div>
          {/* <h1 className="text-4xl md:text-6xl font-serif font-bold text-white max-w-3xl leading-tight mb-6">
            Supporting safe workplaces and protecting injured workers.
          </h1> */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
            The Office of Workers Compensation administers the Workers Compensation Act 1978, ensuring fair compensation and rehabilitation for all workers in PNG.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/forms" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-sm font-semibold flex items-center justify-center gap-2 transition-all">
              Download Claim Forms <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/services" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-sm font-semibold flex items-center justify-center gap-2 transition-all">
              Explore Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/20">
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-serif font-bold mb-2">{stats?.totalForms || "40"}+</span>
              <span className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wider">Official Forms</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-serif font-bold mb-2">{stats?.totalLegislation || "12"}</span>
              <span className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wider">Legislative Acts</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-serif font-bold mb-2">{stats?.totalServices || "8"}</span>
              <span className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wider">Core Services</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl font-serif font-bold mb-2">{stats?.activeTenders || "2"}</span>
              <span className="text-sm text-primary-foreground/80 font-medium uppercase tracking-wider">Active Tenders</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-secondary mb-4">Quick Access</h2>
            <p className="text-muted-foreground text-lg">Find the information and services you need quickly through our dedicated portals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">For Workers</h3>
              <p className="text-muted-foreground mb-6 line-clamp-3">
                Information on how to file a claim, your rights under the Workers Compensation Act, and guidance on the rehabilitation process.
              </p>
              <Link href="/services/workers" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Worker Services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-card border border-border p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">For Employers</h3>
              <p className="text-muted-foreground mb-6 line-clamp-3">
                Guidelines on employer obligations, premium calculations, reporting workplace injuries, and fostering safe environments.
              </p>
              <Link href="/services/employers" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Employer Services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-card border border-border p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">For Insurers</h3>
              <p className="text-muted-foreground mb-6 line-clamp-3">
                Resources for licensed insurers, policy frameworks, dispute resolution guidelines, and statutory compliance documentation.
              </p>
              <Link href="/services/insurers" className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Insurer Services <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-serif font-bold text-secondary mb-4">Essential Resources</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Access our most requested documents, legislation, and forms.</p>
            </div>
            <Link href="/forms" className="text-primary font-semibold flex items-center gap-2 hover:underline">
              View all resources <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Workers Compensation Act 1978", type: "Legislation", icon: Scale },
              { title: "Claim Form (WC1)", type: "Form", icon: FileText },
              { title: "Employer Registration Guide", type: "Publication", icon: FileDown },
              { title: "Medical Certificate Template", type: "Form", icon: Activity },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-sm flex flex-col hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">{item.type}</div>
                <h3 className="font-serif font-bold text-lg mb-6 group-hover:text-primary transition-colors line-clamp-2">{item.title}</h3>
                <div className="mt-auto flex items-center justify-between text-muted-foreground">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">Download</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary text-secondary-foreground py-20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/10 skew-x-12 transform origin-top-right"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">Need assistance with a claim?</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-0">
              Our dedicated staff are ready to help you navigate the compensation process. Contact our support team for guidance on your specific situation.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/contact" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-sm font-bold text-lg inline-flex items-center gap-2 transition-transform hover:scale-105">
              Contact Support <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
