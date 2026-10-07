"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Container } from "./ui";
import { WordReveal } from "./WordReveal";

/*
 * One number, followed hop by hop. It is retyped by hand at each step; at the accounts step two
 * digits swap, and the mistake rides all the way onto the customer's invoice.
 * One clock (ms since the diagram came into view) drives every cell.
 */

const ease = [0.22, 1, 0.36, 1] as const;
const LOOP_MS = 13000;
const FINAL_MS = 9000;
const T = { photo: 300, sheet: 1400, accounts: 3600, swap: 5300, invoice: 6200, cost: 7600 };

function Typed({ text, start, now, speed = 95 }: { text: string; start: number; now: number; speed?: number }) {
  const n = Math.max(0, Math.min(text.length, Math.floor((now - start) / speed)));
  const typing = now >= start && n < text.length;
  if (now < start) return <span className="text-faint">&nbsp;</span>;
  return (
    <span className="tabular-nums">
      {text.slice(0, n)}
      {typing && <span className="inline-block w-px h-[1em] bg-heading align-[-2px] ml-px" />}
    </span>
  );
}

function Cell({ i, active, place, by, children }: { i: number; active: boolean; place: string; by: string; children: React.ReactNode }) {
  // Phones: 2×2 grid so the whole story fits one screen. Desktop: one row of four.
  const edges = `${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""} lg:border-b-0 ${i < 3 ? "lg:border-r" : "lg:border-r-0"}`;
  return (
    <div className={`relative flex flex-col p-3 sm:p-6 border-line ${edges} transition-colors duration-500 ${active ? "bg-paper" : ""}`}>
      <p className="text-heading text-[13px] sm:text-[15px] font-semibold leading-tight">
        <span className="text-faint tabular-nums mr-1.5 sm:mr-2">{i + 1}</span>
        {place}
      </p>
      <p className="text-[11px] sm:text-[13px] text-muted mt-0.5 mb-3 sm:mb-5 leading-snug">{by}</p>
      <div className="flex-1 flex items-start">{children}</div>
    </div>
  );
}

export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const reduce = useReducedMotion();
  const [now, setNow] = useState(-1);

  useEffect(() => {
    if (reduce || !inView) return;
    const t0 = performance.now();
    const id = setInterval(() => setNow((performance.now() - t0) % LOOP_MS), 50);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const t = reduce ? FINAL_MS : now;
  const stage = t >= T.invoice ? 3 : t >= T.accounts ? 2 : t >= T.sheet ? 1 : t >= T.photo ? 0 : -1;
  const swapped = t >= T.swap;
  const rail = stage < 0 ? 0 : (stage + 1) / 4;

  return (
    <section id="problem" className="bg-paper py-20 md:py-28">
      <Container>
        <WordReveal
          text="Most of your admin isn't work. It's [retyping.] A job lands on WhatsApp, gets typed into a spreadsheet, typed again into the accounts, and chased at month-end. Every hop is a chance to get it wrong."
          className="max-w-[1000px] text-heading font-semibold text-[28px] sm:text-[38px] xl:text-[46px] leading-[1.18] tracking-[-0.025em] mb-14 md:mb-20"
        />

        <div ref={ref} className="relative rounded-lg border border-line bg-[#fafafa] overflow-hidden">
          {/* progress rail: how far the number has travelled */}
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-line">
            <motion.div className="h-full bg-heading origin-left" animate={{ scaleX: rail }} transition={{ duration: 0.6, ease }} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4">
            <Cell i={0} active={stage === 0} place="WhatsApp group" by="The driver sends a photo">
              <AnimatePresence>
                {t >= T.photo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease }}
                    className="w-full max-w-[230px] rounded-[10px] rounded-tl-[3px] bg-paper border border-line p-1.5 sm:p-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  >
                    <div className="rounded-[6px] bg-[#F4F4F2] p-2 sm:p-3 flex flex-col gap-1.5">
                      <span className="h-1.5 w-12 bg-heading/60 rounded-[2px]" />
                      <span className="h-1 w-full bg-heading/15 rounded-[2px]" />
                      <span className="h-1 w-4/5 bg-heading/15 rounded-[2px]" />
                      <span className="mt-1 sm:mt-1.5 text-[12px] sm:text-[13px] font-semibold text-heading tabular-nums">Net 28,460 kg</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted mt-1.5 px-1 flex justify-between">
                      <span>From driver</span>
                      <span className="tabular-nums">17:42</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Cell>

            <Cell i={1} active={stage === 1} place="Spreadsheet" by="Someone types it in">
              <div className="w-full max-w-[240px] rounded-[6px] border border-line bg-paper overflow-hidden text-[11.5px] sm:text-[13px] tabular-nums">
                {[["2415", "27,900"], ["2416", "29,120"]].map(([load, kg]) => (
                  <div key={load} className="grid grid-cols-[1fr_1.2fr] border-b border-line">
                    <span className="px-2 sm:px-2.5 py-1.5 border-r border-line text-muted">{load}</span>
                    <span className="px-2 sm:px-2.5 py-1.5 text-body">{kg}</span>
                  </div>
                ))}
                <div className="grid grid-cols-[1fr_1.2fr]">
                  <span className="px-2 sm:px-2.5 py-1.5 border-r border-line text-muted">2417</span>
                  <span className={`px-2 sm:px-2.5 py-1.5 font-semibold text-heading transition-[outline-color] duration-200 outline outline-[1.5px] -outline-offset-[1.5px] ${stage === 1 ? "outline-heading" : "outline-transparent"}`}>
                    <Typed text="28,460" start={T.sheet + 300} now={t} />
                  </span>
                </div>
              </div>
            </Cell>

            <Cell i={2} active={stage === 2} place="Accounts" by="Someone types it in again">
              <div className="w-full max-w-[240px]">
                <div className="rounded-[6px] border border-line bg-paper px-2 sm:px-3 py-2 sm:py-2.5 text-[11.5px] sm:text-[13px]">
                  <div className="flex justify-between text-muted mb-1">
                    <span>Line item</span>
                    <span>Qty</span>
                  </div>
                  <div className="flex justify-between text-heading font-semibold">
                    <span>Load 2417</span>
                    <span className={`rounded-[4px] px-1 -mx-1 transition-colors duration-300 ${swapped ? "bg-hold-bg text-hold" : ""}`}>
                      <Typed text="28,640 kg" start={T.accounts + 300} now={t} />
                    </span>
                  </div>
                </div>
                <AnimatePresence>
                  {swapped && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="mt-2 ml-auto w-fit rounded-[5px] bg-hold-bg text-hold text-[11px] sm:text-[12px] font-semibold px-2 py-1"
                    >
                      4 and 6 swapped
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </Cell>

            <Cell i={3} active={stage === 3} place="Invoice" by="Built from the accounts">
              <div className="w-full max-w-[240px]">
                <div className="rounded-[6px] border border-line bg-paper px-2 sm:px-3 py-2 sm:py-2.5 text-[11.5px] sm:text-[13px]">
                  <p className="text-heading font-semibold mb-1 flex justify-between">
                    Sent to customer
                    {t >= T.invoice && <span className="hidden sm:inline text-[11px] font-normal text-muted">just now</span>}
                  </p>
                  <p className="text-body tabular-nums">
                    Billed on{" "}
                    <span className={`rounded-[4px] px-1 ${t >= T.invoice ? "bg-hold-bg text-hold font-semibold" : ""}`}>
                      <Typed text="28,640 kg" start={T.invoice} now={t} speed={60} />
                    </span>
                  </p>
                </div>
                <AnimatePresence>
                  {t >= T.cost && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="mt-2 text-[11.5px] sm:text-[13px] leading-snug text-hold"
                    >
                      180 kg billed that never moved. It surfaces when the customer queries it.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </Cell>
          </div>
        </div>

        <p className="mt-5 text-[15px] text-muted [text-wrap:pretty]">
          Same number, four places, typed by hand every time. It only takes one slip.
        </p>
      </Container>
    </section>
  );
}
