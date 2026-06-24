import { ReactNode } from "react";
import { Link } from "wouter";
import { Shield, ChevronRight } from "lucide-react";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Top Gov Bar */}
      <div className="bg-secondary text-secondary-foreground text-xs py-2 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>Official website of the Government of Papua New Guinea</span>
        </div>
        <div className="hidden md:flex gap-4">
          <Link href="/staff/login" className="hover:text-white transition-colors">Staff Portal</Link>
          <a href="https://png.gov.pg" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">PNG.GOV.PG</a>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-primary rounded flex items-center justify-center text-primary-foreground font-serif font-bold text-xl shadow-inner group-hover:bg-primary/90 transition-colors">
              OWC
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-none tracking-tight text-foreground">Office of Workers Compensation</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Papua New Guinea</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">About</Link>
            <Link href="/services" className="text-foreground hover:text-primary transition-colors">Services</Link>
            <Link href="/forms" className="text-foreground hover:text-primary transition-colors">Forms</Link>
            <Link href="/legislation" className="text-foreground hover:text-primary transition-colors">Legislation</Link>
            <Link href="/news" className="text-foreground hover:text-primary transition-colors">News</Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t-4 border-primary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-primary-foreground font-serif font-bold text-lg shadow-inner">
                  OWC
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-lg leading-none tracking-tight text-white">Office of Workers Compensation</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Papua New Guinea</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Administering the Workers Compensation Act 1978. Ensuring fair compensation, medical care, and rehabilitation for injured workers while supporting employers in maintaining safe workplaces.
              </p>
            </div>
            
            <div>
              <h3 className="font-serif font-semibold text-white mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/forms" className="hover:text-accent transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Download Forms</Link></li>
                <li><Link href="/services" className="hover:text-accent transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Our Services</Link></li>
                <li><Link href="/tenders" className="hover:text-accent transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Tenders & Procurement</Link></li>
                <li><Link href="/faqs" className="hover:text-accent transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" /> Frequently Asked Questions</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif font-semibold text-white mb-4 text-lg">Contact Us</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Level 3, Defens Haus</li>
                <li>Hunter Street, Port Moresby</li>
                <li>Papua New Guinea</li>
                <li className="pt-2">PO Box 5824, Boroko, NCD</li>
                <li className="pt-2"><a href="mailto:info@owc.gov.pg" className="hover:text-accent transition-colors">info@owc.gov.pg</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Office of Workers Compensation, Papua New Guinea. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link href="/staff/login" className="hover:text-white transition-colors">Staff Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
