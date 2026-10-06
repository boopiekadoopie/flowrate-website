import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { Problem } from "@/components/Problem";
import { Services } from "@/components/Services";
import { CaseStudy } from "@/components/CaseStudy";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { FAQ } from "@/components/FAQ";
import { LeadCapture } from "@/components/LeadCapture";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <Services />
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
