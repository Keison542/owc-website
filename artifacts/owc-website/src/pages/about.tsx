import { Link } from "wouter";
import { Shield, Target, Eye, Award, Users, Scale, ChevronRight } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col w-full">
      {/* Page Header */}
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">About OWC</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">About OWC</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            The Office of Workers Compensation is a statutory body under the Department of Labour & Industrial Relations, established to administer workers compensation legislation in Papua New Guinea.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-card border border-border p-8 rounded-sm shadow-sm">
              <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-serif font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To administer the Workers Compensation Act 1978 fairly and efficiently, ensuring injured workers receive appropriate compensation while supporting employers in maintaining compliant, safe workplaces.
              </p>
            </div>
            <div className="bg-card border border-border p-8 rounded-sm shadow-sm">
              <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-serif font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Papua New Guinea where every worker is protected, every employer is compliant, and the workers compensation system operates with transparency, efficiency, and fairness.
              </p>
            </div>
            <div className="bg-card border border-border p-8 rounded-sm shadow-sm">
              <div className="w-14 h-14 bg-primary/10 rounded-sm flex items-center justify-center text-primary mb-6">
                <Award className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-serif font-bold mb-4">Our Values</h2>
              <ul className="text-muted-foreground leading-relaxed space-y-2">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>Integrity & Transparency</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>Fairness & Impartiality</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>Accountability</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>Service Excellence</li>
              </ul>
            </div>
          </div>

          {/* History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl font-serif font-bold text-secondary mb-6">Our History</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Office of Workers Compensation was established under the Workers Compensation Act 1978, which came into force to provide a structured, statutory framework for compensating workers injured in the course of their employment in Papua New Guinea.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Since its establishment, OWC has grown to administer one of PNG's most important social protection mechanisms, serving thousands of workers and employers across all provinces of the country.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The office operates under the supervision of the Department of Labour and Industrial Relations and works closely with employers, insurers, medical practitioners, and legal professionals to ensure the timely and fair resolution of claims.
              </p>
            </div>
            <div className="bg-secondary rounded-sm p-8 text-white">
              <h3 className="text-xl font-serif font-bold mb-6 text-accent">Key Milestones</h3>
              <div className="space-y-4">
                {[
                  { year: "1978", desc: "Workers Compensation Act 1978 enacted" },
                  { year: "1980", desc: "Office formally established in Port Moresby" },
                  { year: "1995", desc: "Provincial offices opened in major centers" },
                  { year: "2010", desc: "Digital record-keeping system introduced" },
                  { year: "2020", desc: "Online claim submission launched" },
                  { year: "2024", desc: "New digital services portal launched" },
                ].map((item) => (
                  <div key={item.year} className="flex gap-4">
                    <span className="text-accent font-serif font-bold text-sm w-12 flex-shrink-0 pt-0.5">{item.year}</span>
                    <span className="text-gray-300 text-sm leading-relaxed border-l border-white/20 pl-4">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Structure */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-secondary mb-8 text-center">Organizational Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Office of the Commissioner", icon: Shield, desc: "Oversees overall administration and policy direction of the OWC." },
                { title: "Claims Management", icon: Scale, desc: "Processes and adjudicates workers compensation claims." },
                { title: "Compliance & Enforcement", icon: Award, desc: "Ensures employer and insurer compliance with legislation." },
                { title: "Legal & Appeals", icon: Users, desc: "Handles disputes, appeals, and legal interpretations." },
              ].map((dept) => (
                <div key={dept.title} className="bg-card border border-border p-6 rounded-sm">
                  <dept.icon className="w-6 h-6 text-primary mb-4" />
                  <h3 className="font-serif font-bold text-lg mb-2">{dept.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{dept.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-lg font-medium">Have questions about workers compensation in PNG?</p>
          <Link href="/contact" className="bg-white text-primary px-6 py-3 rounded-sm font-semibold hover:bg-white/90 transition-colors flex items-center gap-2">
            Contact Us <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
