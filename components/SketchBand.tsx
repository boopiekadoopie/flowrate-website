"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Arrow, Container, H2, Lede } from "./ui";
import { WinkMascot } from "./WinkMascot";

/*
 * Sketch my app, right after the page has shown what the paperwork costs: say what eats your week here and
 * land on /sketch with the sketch already on its way. The text goes across in sessionStorage (never in the
 * URL), so "nothing is stored" stays true. Ink button: green stays for booking.
 */
export const SKETCH_KEY = "fr-sketch";
const EXAMPLE = "Customers keep phoning to ask if their car is ready, and someone has to stop and check.";

export function SketchBand() {
  const router = useRouter();
  const [text, setText] = useState("");
  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (t.length < 12) {
      document.getElementById("band-sketch")?.focus();
      return;
    }
    try {
      sessionStorage.setItem(SKETCH_KEY, t);
    } catch {}
    router.push("/sketch?run=1");
  };
  return (
    <section className="bg-canvas py-16 md:py-24">
      <Container>
        <div className="relative rounded-2xl bg-paper border border-line shadow-[0_24px_60px_-30px_rgba(16,24,40,0.25)] p-6 sm:p-10 lg:p-12 grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-14 items-center">
          <div>
            <H2 className="mb-4">Got a job that eats your week?</H2>
            <Lede className="max-w-[520px]">
              Tell us in a sentence. You&apos;ll see a first <span className="kw">sketch</span> of the app that would take it
              over: what your team fills in, what the office sees, and what your customer gets.
            </Lede>
          </div>
          <form onSubmit={go} className="relative">
            <div className="hidden sm:block absolute -top-[86px] right-2 w-[78px] pointer-events-none" aria-hidden>
              <WinkMascot sizes="78px" className="w-full" imgClassName="block w-full h-auto" />
            </div>
            <label htmlFor="band-sketch" className="block text-[14px] font-medium text-heading mb-2">
              What eats your week?
            </label>
            <textarea
              id="band-sketch"
              rows={3}
              maxLength={500}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={EXAMPLE}
              className="relative w-full bg-paper border border-line-strong rounded-lg px-4 py-3 text-heading text-[16px] leading-[1.5] placeholder:text-faint outline-none focus:border-heading focus-visible:ring-2 focus-visible:ring-heading/15 resize-y"
            />
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-carbon text-white dark:bg-white dark:text-[#101828] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-3.5 rounded-lg hover:bg-black dark:hover:bg-white/90 transition-colors cursor-pointer"
              >
                Sketch my app
                <Arrow className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setText(EXAMPLE)} className="fr-ul whitespace-nowrap text-[14px] font-semibold text-body hover:text-heading w-fit cursor-pointer py-3 -my-3 sm:py-0 sm:my-0">
                Try an example
              </button>
            </div>
            <p className="mt-3 text-[13px] text-muted">Only what you type is sent, to draw the sketch. Nothing is stored.</p>
          </form>
        </div>
      </Container>
    </section>
  );
}
