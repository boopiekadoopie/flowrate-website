import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { SketchBand } from "@/components/SketchBand";
import { Showcase } from "@/components/Showcase";
import { OurWork } from "@/components/OurWork";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { FAQ } from "@/components/FAQ";
import { LeadCapture } from "@/components/LeadCapture";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { homeFaqs } from "@/lib/faqs";

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
      /* Our own profiles, so search engines tie the name "Flowrate" to this business and not to flow-rate tools. */
      sameAs: [
        "https://www.instagram.com/flowrate.agency",
        "https://www.tiktok.com/@flowrate.agency",
        "https://www.linkedin.com/company/flowrate-agency/",
        "https://www.youtube.com/@flowrateagency",
      ],
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
      mainEntity: homeFaqs.map((f) => ({
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
        <Showcase />
        <SketchBand />
        <OurWork />
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
