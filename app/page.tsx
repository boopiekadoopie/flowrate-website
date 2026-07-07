import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { Problem } from "@/components/Problem";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";
import { About } from "@/components/About";
import { Pricing } from "@/components/Pricing";
import { LeadCapture } from "@/components/LeadCapture";
import { Guarantee } from "@/components/Guarantee";
import { FAQ } from "@/components/FAQ";
import { CtaBanner } from "@/components/CtaBanner";
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
        <HowItWorks />
        <About />
        <Pricing />
        <LeadCapture />
        <Guarantee />
        <FAQ />
        <CtaBanner />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
