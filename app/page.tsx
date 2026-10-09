import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Convergence } from "@/components/Convergence";
import { Showcase } from "@/components/Showcase";
import { CaseStudy } from "@/components/CaseStudy";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { FAQ } from "@/components/FAQ";
import { LeadCapture } from "@/components/LeadCapture";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { faqs } from "@/lib/faqs";

/* Structured data for search engines, built only from what the page already says. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://flowrate.agency/#org",
      name: "Flowrate",
      url: "https://flowrate.agency",
      logo: "https://flowrate.agency/icon.png",
      email: "andrew@flowrate.agency",
      founder: { "@type": "Person", name: "Andrew Murray" },
      description:
        "Custom apps, business systems, dashboards and websites built around how your business already works.",
    },
    {
      "@type": "WebSite",
      "@id": "https://flowrate.agency/#website",
      url: "https://flowrate.agency",
      name: "Flowrate",
      publisher: { "@id": "https://flowrate.agency/#org" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Convergence />
        <Showcase />
        <CaseStudy />
        <HowItWorks />
        <About />
        <FAQ />
        <LeadCapture />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
