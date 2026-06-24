import { Link } from "wouter";
import { ChevronRight, Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useSubmitContact } from "@workspace/api-client-react";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: submitContact, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setSubmitted(true);
        setError(null);
      },
      onError: () => {
        setError("Failed to submit your message. Please try again or contact us by phone.");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    submitContact({ data: form });
  };

  return (
    <div className="flex flex-col w-full">
      <section className="bg-secondary text-white py-16 border-b-4 border-accent">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg max-w-3xl">
            Get in touch with the Office of Workers Compensation. Our team is here to assist workers, employers, and insurers with any enquiries.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-secondary mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Head Office</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Level 3, Defens Haus<br />
                        Hunter Street<br />
                        Port Moresby, NCD<br />
                        Papua New Guinea
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">PO Box 5824, Boroko, NCD</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center text-primary flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Telephone</h4>
                      <a href="tel:+67531212345" className="text-primary hover:underline text-sm">+675 321 2345</a>
                      <p className="text-muted-foreground text-xs mt-0.5">Main switchboard</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center text-primary flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <a href="mailto:info@owc.gov.pg" className="text-primary hover:underline text-sm">info@owc.gov.pg</a>
                      <p className="text-muted-foreground text-xs mt-0.5">General enquiries</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center text-primary flex-shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Office Hours</h4>
                      <p className="text-muted-foreground text-sm">Monday – Friday</p>
                      <p className="text-muted-foreground text-sm">8:00 AM – 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Offices */}
              <div>
                <h3 className="font-serif font-bold text-lg mb-4">Regional Offices</h3>
                <div className="space-y-3">
                  {[
                    { city: "Lae", province: "Morobe Province", email: "lae@owc.gov.pg" },
                    { city: "Mt. Hagen", province: "Western Highlands", email: "hagen@owc.gov.pg" },
                    { city: "Kokopo", province: "East New Britain", email: "kokopo@owc.gov.pg" },
                  ].map((office) => (
                    <div key={office.city} className="bg-card border border-border rounded-sm p-4">
                      <div className="font-semibold text-sm">{office.city}</div>
                      <div className="text-xs text-muted-foreground">{office.province}</div>
                      <a href={`mailto:${office.email}`} className="text-xs text-primary hover:underline">{office.email}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-sm p-8">
                <h2 className="text-2xl font-serif font-bold mb-6">Send Us a Message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold mb-2">Message Received!</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Thank you for contacting the Office of Workers Compensation. We will respond to your enquiry within 2–3 business days.
                    </p>
                    <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }} className="mt-6 text-primary text-sm font-semibold hover:underline">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name *</label>
                        <input
                          required
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address *</label>
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your.email@example.com"
                          className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+675 XXXX XXXX"
                          className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Subject *</label>
                        <select
                          required
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        >
                          <option value="">Select a subject</option>
                          <option>Claim Enquiry</option>
                          <option>Employer Registration</option>
                          <option>Appeal / Dispute</option>
                          <option>Form Assistance</option>
                          <option>General Enquiry</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Please describe your enquiry in detail..."
                        className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background resize-none"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-sm p-3">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {isPending ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
