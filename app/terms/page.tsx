import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Flowrate Agency",
  description: "The terms that apply when you work with Flowrate Agency.",
};

const sections = [
  {
    h: "Who we are",
    p: "Flowrate Agency designs and builds websites and runs marketing for irrigation, landscaping, and home service companies. These terms apply to this website and to work we deliver for clients.",
  },
  {
    h: "Quotes and payment",
    p: "Website builds are custom-quoted on a call and confirmed in writing. A 50% deposit is due once the price is agreed and the design direction is approved; the remaining 50% is due at launch. We accept PayPal and Payoneer. The monthly retainer is optional, billed month to month, and can be cancelled at any time.",
  },
  {
    h: "Design approval",
    p: "We show you the design direction before any build work begins. If you do not like it, we revise it or you walk away at no cost. Nothing is invoiced until you approve the direction.",
  },
  {
    h: "Delivery and support",
    p: "Builds typically take 3 to 4 weeks depending on complexity. After launch, minor edits (typos, small content tweaks, small bug fixes) are free for 30 days. Larger changes or new pages are scoped separately or covered by an active retainer.",
  },
  {
    h: "Content and ownership",
    p: "Once the final invoice is paid, you own your website and its content. You are responsible for the accuracy of business information you provide (licensing claims, service areas, pricing).",
  },
  {
    h: "Our media",
    p: "The imitation or duplication of our media, designs, or content as a representation of your own work is prohibited.",
  },
  {
    h: "No guarantees of results",
    p: "We build sites and campaigns designed to convert and rank, and we report results honestly. Marketing outcomes depend on your market and competition, so we do not guarantee specific rankings, traffic, or revenue figures.",
  },
  {
    h: "Contact",
    p: "Questions about these terms? Email andrew@flowrate.agency.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#050505] min-h-screen px-6 pt-36 pb-24">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-white uppercase text-4xl md:text-5xl tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
          >
            Terms of <span className="text-green italic">Service</span>
          </h1>
          <p className="text-white/40 text-sm mb-12">Last updated: July 2026</p>
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="text-white font-bold text-xl mb-3">{s.h}</h2>
                <p className="text-white/55 leading-relaxed">{s.p}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
