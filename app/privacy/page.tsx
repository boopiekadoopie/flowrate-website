import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Flowrate Agency",
  description: "How Flowrate Agency collects, uses, and protects your information.",
};

const sections = [
  {
    h: "What we collect",
    p: "When you contact us through the site, book a call, or use the chat, we collect the information you give us: your name, email address, phone number, business name, and the content of your messages. We also collect basic, anonymous usage data (pages visited, device type) to understand how the site is used.",
  },
  {
    h: "How we use it",
    p: "We use your information to respond to your enquiries, prepare for strategy calls, deliver our services, and send you information you asked for. We do not sell your information to anyone, and we do not add you to mailing lists you did not ask for.",
  },
  {
    h: "The chat assistant",
    p: "The chat on this site is powered by an AI assistant. Messages you send in the chat are processed by our AI provider to generate replies. Do not share sensitive personal information in the chat; use email if you prefer.",
  },
  {
    h: "Third-party services",
    p: "We use trusted third-party services to run this site and our business, such as hosting (Vercel), scheduling (Calendly), and analytics. These services process data under their own privacy policies.",
  },
  {
    h: "Your choices",
    p: "You can ask us at any time to see, correct, or delete the information we hold about you. Email andrew@flowrate.agency and we will handle it promptly.",
  },
  {
    h: "Contact",
    p: "Questions about this policy? Email andrew@flowrate.agency.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#050505] min-h-screen px-6 pt-36 pb-24">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-white uppercase text-4xl md:text-5xl tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
          >
            Privacy <span className="text-green italic">Policy</span>
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
