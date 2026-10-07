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

export default function Home() {
  return (
    <>
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
