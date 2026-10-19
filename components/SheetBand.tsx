"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Arrow, Container, H2, Lede } from "./ui";
import { WinkMascot } from "./WinkMascot";

/*
 * The spreadsheet-to-app tool, right where the page has just shown what spreadsheets cost: paste the column
 * names here and land on /spreadsheet with the answer already on its way. The text goes across in
 * sessionStorage (never in the URL), so "nothing is stored" stays true. Ink button: green stays for booking.
 */
export const SHEET_KEY = "fr-sheet";
const EXAMPLE = "Date, Job no, Customer, Address, Tech, Parts used, Hours, Photos?, Signed?, Invoiced?, Paid?, Notes";

export function SheetBand() {
  const router = useRouter();
  const [headers, setHeaders] = useState("");
  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const h = headers.trim();
    if (h.length < 3) {
      document.getElementById("sheet-headers")?.focus();
      return;
    }
    try {
      sessionStorage.setItem(SHEET_KEY, h);
    } catch {}
    router.push("/spreadsheet?run=1");
  };
  return (
    <section className="bg-canvas py-16 md:py-24">
      <Container>
        <div className="relative rounded-2xl bg-paper border border-line shadow-[0_24px_60px_-30px_rgba(16,24,40,0.25)] p-6 sm:p-10 lg:p-12 grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-center">
          <div>
            <H2 className="mb-4">Got a spreadsheet like that?</H2>
            <Lede className="max-w-[520px]">
              Paste the column names from its top row. You&apos;ll see the simple app it would become: what goes in on
              the phone, what the office sees, and what adds itself up.
            </Lede>
          </div>
          <form onSubmit={go} className="relative">
            <div className="hidden sm:block absolute -top-[86px] right-2 w-[78px] pointer-events-none" aria-hidden>
              <WinkMascot sizes="78px" className="w-full" imgClassName="block w-full h-auto" />
            </div>
            <label htmlFor="sheet-headers" className="block text-[14px] font-medium text-heading mb-2">
              Your column names
            </label>
            <textarea
              id="sheet-headers"
              rows={3}
              maxLength={600}
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder={EXAMPLE}
              className="relative w-full bg-paper border border-line-strong rounded-lg px-4 py-3 text-heading text-[16px] leading-[1.5] placeholder:text-faint outline-none focus:border-heading focus-visible:ring-2 focus-visible:ring-heading/25 resize-none"
            />
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-carbon text-white dark:bg-white dark:text-[#101828] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-3.5 rounded-lg hover:bg-black dark:hover:bg-white/90 transition-colors cursor-pointer"
              >
                Show me the app
                <Arrow className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setHeaders(EXAMPLE)} className="fr-ul whitespace-nowrap text-[14px] font-semibold text-body hover:text-heading w-fit cursor-pointer py-3 -my-3 sm:py-0 sm:my-0">
                Try an example
              </button>
            </div>
            <p className="mt-3 text-[13px] text-muted">Only the column names are sent. Nothing is stored.</p>
          </form>
        </div>
      </Container>
    </section>
  );
}
