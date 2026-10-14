import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CHANGELOG } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "What's new | Flowrate",
  description: "Small changes to the Flowrate site and its demos, as they ship.",
  alternates: { canonical: "/changelog" },
  openGraph: { title: "What's new | Flowrate", url: "/changelog" },
};

const fmt = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default function ChangelogPage() {
  return (
    <>
      <Navbar />
      <main className="bg-paper min-h-screen px-5 sm:px-8 pt-36 md:pt-44 pb-24">
        <article className="max-w-[720px] mx-auto">
          <h1 className="font-display text-heading uppercase text-[36px] sm:text-[48px] leading-[1] tracking-[-0.02em] mb-5">What&apos;s new</h1>
          <p className="text-body text-[17px] leading-[1.7] mb-12 max-w-[560px]">
            Small changes to this site and its demos, as they ship. The work we do for clients stays private, so it
            isn&apos;t listed here.
          </p>
          <ol>
            {CHANGELOG.map((day) => (
              <li key={day.date} className="grid sm:grid-cols-[160px_1fr] gap-x-8 gap-y-2 py-7 border-t border-line">
                <time dateTime={day.date} className="text-[14px] font-semibold text-heading tabular-nums pt-[2px]">
                  {fmt(day.date)}
                </time>
                <ul className="space-y-2.5">
                  {day.items.map((it) => (
                    <li key={it} className="text-body text-[16px] leading-[1.6]">
                      {it}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </article>
      </main>
      <Footer />
    </>
  );
}
