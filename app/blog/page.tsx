import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog | Flowrate Agency",
  description:
    "Guides on websites, local SEO, and lead generation for irrigation, landscaping, and home service companies.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#050505] min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-2xl text-center py-24">
          <p className="text-green font-semibold text-xs tracking-widest uppercase mb-6">Blog</p>
          <h1
            className="text-white uppercase text-4xl md:text-6xl tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
          >
            First posts are <span className="text-green italic">on the way</span>
          </h1>
          <p className="text-white/55 text-lg leading-relaxed mb-10">
            We are writing practical guides on websites, local SEO, and lead
            generation for irrigation, landscaping, and home service companies.
            No fluff, just what works.
          </p>
          <a
            href="https://www.youtube.com/@FlowrateAgency"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green text-[#060C07] font-bold px-8 py-4 rounded-xl hover:bg-green-light transition-colors"
          >
            Watch how we build on YouTube
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
