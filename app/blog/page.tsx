import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | Flowrate",
  description: "Practical writing on removing retyping and manual admin from how a business runs.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog | Flowrate", url: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-canvas min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-2xl text-center py-24">
          <h1 className="font-display text-heading uppercase text-4xl md:text-6xl leading-[1.04] tracking-[-0.02em] mb-6">
            First posts are on the way.
          </h1>
          <p className="text-body text-lg leading-relaxed mb-10">
            We&apos;re writing practical guides on getting the retyping, chasing and
            manual admin out of how a business runs.
          </p>
          <Link
            href="/"
            className="inline-block bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-4 rounded-lg hover:bg-green-light transition-colors"
          >
            Back to the homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
