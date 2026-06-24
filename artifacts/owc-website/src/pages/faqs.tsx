import { Link } from "wouter";
import { ChevronRight, ChevronDown, Loader2, AlertCircle, Search } from "lucide-react";
import { useListFaqs } from "@workspace/api-client-react";
import { useState } from "react";

const DEFAULT_FAQS = [
  { id: 1, question: "Who is covered by the Workers Compensation Act 1978?", answer: "All workers employed in Papua New Guinea are covered, except for domestic servants in private households, workers employed outside PNG, and certain categories of self-employed persons. Both citizens and foreign workers are covered during the course of their employment in PNG.", category: "Coverage" },
  { id: 2, question: "How do I make a workers compensation claim?", answer: "To make a claim: (1) Report your injury to your employer immediately. (2) Seek medical treatment from an approved medical practitioner. (3) Complete the WC1 Claim Form (available from OWC offices or this website). (4) Have your employer complete their section of the form. (5) Lodge the completed form with the nearest OWC office within 12 months of the injury.", category: "Claims" },
  { id: 3, question: "What types of injuries are covered?", answer: "The Act covers personal injuries arising out of and in the course of employment, including: physical injuries sustained at the workplace, occupational diseases, and injuries during work-related travel. Psychological injuries may also be covered in certain circumstances under the 2024 amendments.", category: "Coverage" },
  { id: 4, question: "How long do I have to lodge a claim?", answer: "A claim must generally be lodged within 12 months of the date of injury or, in the case of an occupational disease, within 12 months of becoming aware of the disease. Extensions may be granted in exceptional circumstances at the discretion of the Commissioner.", category: "Claims" },
  { id: 5, question: "What compensation can I receive?", answer: "Compensation may include: weekly payments for incapacity to work, lump sum payments for permanent impairment, medical expenses, rehabilitation costs, and death benefits for dependants. The amount depends on your pre-injury earnings and the nature of your injury.", category: "Compensation" },
  { id: 6, question: "Are all employers required to have workers compensation insurance?", answer: "Yes. Under the Workers Compensation Act 1978, all employers in Papua New Guinea must maintain a valid workers compensation insurance policy with a licensed insurer. Failure to comply is a criminal offence and may result in significant penalties.", category: "Employers" },
  { id: 7, question: "How do I appeal a decision?", answer: "If you disagree with a decision made by OWC, you may lodge a formal appeal within 60 days of receiving the decision. Download the Notice of Appeal form (WC-APP) from our Forms page, complete it, and submit it to our office. An independent panel will review your case.", category: "Appeals" },
  { id: 8, question: "What should employers do when an employee is injured?", answer: "Employers must: (1) Provide immediate first aid and arrange medical treatment. (2) Report the injury to their insurer within 7 days. (3) Complete the employer's section of the WC2 form. (4) Cooperate with OWC during the investigation. (5) Maintain the injured worker's employment where possible during rehabilitation.", category: "Employers" },
];

export default function FAQs() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data: faqs, isLoading } = useListFaqs({ status: "published" });

  const displayFaqs = faqs?.length ? faqs : (!isLoading ? DEFAULT_FAQS : []);
  const categories = ["All", ...Array.from(new Set(displayFaqs.map((f) => f.category).filter(Boolean) as string[]))];

  const filtered = displayFaqs.filter((f) => {
    const matchCat = selectedCategory === "All" || f.category === selectedCategory;
    const matchSearch = !searchQuery ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col w-full">
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">FAQs</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Find answers to common questions about workers compensation in Papua New Guinea.
          </p>
          {/* Search */}
          <div className="mt-8 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-sm text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 md:px-8 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-sm rounded-sm font-medium transition-colors ${
                selectedCategory === cat ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg">No questions found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-3" id="faq-list">
              {filtered.map((faq) => (
                <div key={faq.id} id={`faq-${faq.id}`} className="bg-card border border-border rounded-sm overflow-hidden">
                  <button
                    className="w-full flex items-start justify-between gap-4 p-6 text-left hover:bg-muted/30 transition-colors"
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  >
                    <div className="flex-1">
                      {faq.category && (
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">{faq.category}</span>
                      )}
                      <span className="font-serif font-semibold text-lg text-foreground">{faq.question}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-primary flex-shrink-0 mt-1 transition-transform ${openId === faq.id ? "rotate-180" : ""}`} />
                  </button>
                  {openId === faq.id && (
                    <div className="px-6 pb-6 pt-0 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-secondary/5 border border-border rounded-sm p-6">
            <h3 className="font-serif font-bold text-lg mb-2">Didn't find your answer?</h3>
            <p className="text-muted-foreground text-sm mb-4">Contact our team directly and we'll be happy to assist you.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors">
              Contact Us <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
