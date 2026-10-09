import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export type LegalSection = { h: string; body: ReactNode[] };

/* Shared layout for the Terms and Privacy pages: plain, readable, same tokens as the rest of the site. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}) {
  return (
    <>
      <Navbar />
      <main className="bg-paper min-h-screen px-5 sm:px-8 pt-36 md:pt-44 pb-24">
        <article className="max-w-[720px] mx-auto">
          <h1 className="font-display text-heading uppercase text-[36px] sm:text-[48px] leading-[1] tracking-[-0.02em] mb-4">
            {title}
          </h1>
          <p className="text-muted text-[14px] mb-8">Last updated: {updated}</p>
          <div className="text-body text-[17px] leading-[1.7] mb-12 pb-10 border-b border-line">{intro}</div>
          <ol className="space-y-10">
            {sections.map((s, i) => (
              <li key={s.h} id={s.h.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="scroll-mt-28">
                <h2 className="text-heading font-bold text-[20px] mb-3">
                  <span className="text-muted tabular-nums mr-2">{i + 1}.</span>
                  {s.h}
                </h2>
                <div className="space-y-3 text-body text-[16px] leading-[1.7]">
                  {s.body.map((b, j) => (
                    <div key={j}>{b}</div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </article>
      </main>
      <Footer />
    </>
  );
}
