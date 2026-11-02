import type { Metadata } from "next";
import { OG_IMAGES } from "@/lib/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Sketch } from "@/components/Sketch";

export const metadata: Metadata = {
  title: "Sketch my app | Flowrate",
  description:
    "Tell us what eats your week in a sentence and see a first sketch of the app that would take it over: what your team fills in, what the office sees, and what your customer gets.",
  alternates: { canonical: "/sketch" },
  openGraph: { title: "Sketch my app | Flowrate", url: "/sketch", images: OG_IMAGES },
};

export default function SketchPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper">
        <Sketch />
      </main>
      <Footer />
    </>
  );
}
