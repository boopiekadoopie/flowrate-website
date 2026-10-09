import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CALENDLY_URL } from "@/lib/site";

export const metadata = { title: "Page not found | Flowrate", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-paper pt-40 pb-24 md:pt-48 md:pb-32">
        <div className="max-w-[640px] mx-auto px-5 text-center">
          <Image src="/mascot.png" alt="" width={1002} height={1530} sizes="96px" className="w-24 h-auto mx-auto mb-8" />
          <h1 className="font-display text-heading uppercase text-[34px] sm:text-[48px] leading-[1] tracking-[-0.02em] mb-5">
            This page doesn&apos;t exist.
          </h1>
          <p className="text-body text-[17px] leading-relaxed mb-9">
            The link may be old or mistyped. Everything we do is on the home page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-carbon text-white dark:bg-white dark:text-[#101828] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-4 rounded-lg"
            >
              Go to the home page
            </Link>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-4 rounded-lg hover:bg-green-light transition-colors"
            >
              Book a free call
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
