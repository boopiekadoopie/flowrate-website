"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Container } from "./ui";
import { WordReveal } from "./WordReveal";
import { JobCard } from "./Paperwork";

/*
 * One number, followed hop by hop. A finished job card is photographed into the group chat, typed
 * into a spreadsheet, typed again into the accounts (where two digits swap), and the mistake rides
 * onto the customer's invoice until the customer spots it.
 * One clock (ms since the diagram came into view) drives every cell.
 */

const subscribeNoop = () => () => {};
const ease = [0.22, 1, 0.36, 1] as const;
const LOOP_MS = 14000;
const FINAL_MS = 10000;
const T = { photo: 300, sheet: 1500, accounts: 3700, swap: 5400, invoice: 6300, cost: 7600, query: 8800 };

const RIGHT = "1,633.00";
const WRONG = "1,363.00";
const SWAP = [2, 3]; // the two digits that trade places

function typedCount(text: string, start: number, now: number, speed: number) {
  return Math.max(0, Math.min(text.length, Math.floor((now - start) / speed)));
}

function Typed({ text, start, now, speed = 95 }: { text: string; start: number; now: number; speed?: number }) {
  const n = typedCount(text, start, now, speed);
  const typing = now >= start && n < text.length;
  if (now < start) return <span className="text-faint">&nbsp;</span>;
  return (
    <span className="tabular-nums">
      {text.slice(0, n)}
      {typing && <span className="inline-block w-px h-[1em] bg-heading align-[-2px] ml-px" />}
    </span>
  );
}

/* Typed amount whose two swapped digits light up (and hop) once the slip is pointed out. */
function TypedDigits({ text, start, now, mark, speed = 95 }: { text: string; start: number; now: number; mark: boolean; speed?: number }) {
  const n = typedCount(text, start, now, speed);
  const typing = now >= start && n < text.length;
  if (now < start) return <span className="text-faint">&nbsp;</span>;
  return (
    <span className="tabular-nums inline-flex items-baseline">
      {text.slice(0, n).split("").map((ch, i) => {
        const hot = mark && SWAP.includes(i);
        return (
          <motion.span
            key={i}
            animate={hot ? { y: [0, -3, 0] } : { y: 0 }}
            transition={{ duration: 0.4, delay: i === SWAP[1] ? 0.08 : 0, ease }}
            className={`inline-block transition-colors duration-300 ${hot ? "bg-hold-bg text-hold rounded-[3px] px-[1px] -mx-[1px] font-bold" : ""}`}
          >
            {ch}
          </motion.span>
        );
      })}
      {typing && <span className="inline-block w-px h-[1em] bg-heading align-[-2px] ml-px" />}
    </span>
  );
}

/* WhatsApp-style delivered ticks */
function Ticks() {
  return (
    <svg viewBox="0 0 20 12" className="w-3.5 h-2.5 text-ok" aria-hidden>
      <path d="M1 6.5l3 3L10 3M7 9.5l2 2L18 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cell({ i, active, place, by, children }: { i: number; active: boolean; place: string; by: string; children: React.ReactNode }) {
  // Phones: 2×2 grid so the whole story fits one screen. Desktop: one row of four.
  const edges = `${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b" : ""} lg:border-b-0 ${i < 3 ? "lg:border-r" : "lg:border-r-0"}`;
  return (
    <div className={`relative flex flex-col p-3 sm:p-6 border-line ${edges} transition-colors duration-500 ${active ? "bg-paper dark:bg-carbon" : ""}`}>
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
  const prefersReduce = useReducedMotion();
  // Server and first client render show the empty diagram; reduced-motion visitors jump to the
  // finished state only after mount, so hydration never mismatches.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const reduce = !!prefersReduce && mounted;
  const [now, setNow] = useState(-1);

  useEffect(() => {
    if (prefersReduce || !inView) return;
    const t0 = performance.now();
    const id = setInterval(() => setNow((performance.now() - t0) % LOOP_MS), 50);
    return () => clearInterval(id);
  }, [inView, prefersReduce]);

  const t = reduce ? FINAL_MS : now;
  const stage = t >= T.invoice ? 3 : t >= T.accounts ? 2 : t >= T.sheet ? 1 : t >= T.photo ? 0 : -1;
  const swapped = t >= T.swap;
  const rail = stage < 0 ? 0 : (stage + 1) / 4;
  const sheetRows = [["2", "0416", "Mara’s Bakery", "2,310.00"], ["3", "0417", "Hill & Co", "1,980.00"]];

  return (
    <section id="problem" className="bg-paper py-20 md:py-28">
      <Container>
        <WordReveal
          text="Most of your admin isn't work. It's [retyping.] A job lands on WhatsApp, gets typed into a spreadsheet, typed again into the accounts, and chased at month-end. Every hop is a chance to get it wrong."
          className="max-w-[1000px] text-heading font-semibold text-[28px] sm:text-[38px] xl:text-[46px] leading-[1.18] tracking-[-0.025em] mb-14 md:mb-20"
        />

        <div ref={ref} className="relative rounded-lg border border-line bg-soft overflow-hidden">
          {/* progress rail: how far the number has travelled */}
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-line">
            <motion.div className="h-full bg-heading origin-left" animate={{ scaleX: rail }} transition={{ duration: 0.6, ease }} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4">
            {/* 1 — the photo in the group chat */}
            <Cell i={0} active={stage === 0} place="WhatsApp group" by="Someone on site sends a photo">
              <AnimatePresence>
                {t >= T.photo && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.45, ease }}
                    className="w-full max-w-[236px] rounded-[10px] rounded-tl-[3px] bg-paper border border-line p-1.5 sm:p-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  >
                    <p className="text-[10px] sm:text-[11px] font-semibold text-ok dark:text-[#6CCB5F] px-1 mb-1">Sam</p>
                    {/* the "photo": the signed job card on the counter */}
                    <div className="rounded-[6px] border border-line bg-canvas px-2 py-2.5 sm:px-3 sm:py-3 flex justify-center overflow-hidden">
                      <div className="[zoom:0.84] max-[359px]:[zoom:0.7] sm:[zoom:1] rotate-[-2deg] max-[359px]:rotate-0">
                        <JobCard width={150} total={RIGHT} />
                      </div>
                    </div>
                    <p className="text-[11px] sm:text-[12px] text-heading mt-1.5 px-1 leading-snug">Greenway done, card attached</p>
                    <p className="text-[10px] sm:text-[11px] text-muted mt-0.5 px-1 flex items-center justify-end gap-1">
                      <span className="tabular-nums">17:42</span>
                      <Ticks />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Cell>

            {/* 2 — typed into the sheet */}
            <Cell i={1} active={stage === 1} place="Spreadsheet" by="Someone types it in">
              <div className="w-full min-w-0 max-w-[250px] rounded-[6px] border border-line bg-paper overflow-hidden text-[11px] max-[359px]:text-[10px] sm:text-[12.5px] tabular-nums">
                <div className="flex items-center border-b border-line text-[10px] sm:text-[11px]">
                  <span className="px-2 py-1 border-r border-line text-muted w-9 shrink-0">C4</span>
                  <span className="px-2 py-1 text-heading truncate"><Typed text={RIGHT} start={T.sheet + 300} now={t} /></span>
                </div>
                <div className="grid grid-cols-[18px_44px_1fr] sm:grid-cols-[22px_42px_1fr_1.1fr] bg-soft border-b border-line text-[9.5px] sm:text-[10px] text-muted">
                  <span className="px-1 py-1 border-r border-line" />
                  <span className="px-1.5 py-1 border-r border-line">A</span>
                  <span className="hidden sm:block px-1.5 py-1 border-r border-line">B</span>
                  <span className="px-1.5 py-1">C</span>
                </div>
                <div className="grid grid-cols-[18px_44px_1fr] sm:grid-cols-[22px_42px_1fr_1.1fr] border-b border-line text-[9.5px] sm:text-[10.5px] text-muted">
                  <span className="px-1 py-1 border-r border-line text-center text-faint">1</span>
                  <span className="px-1.5 py-1 border-r border-line">Job</span>
                  <span className="hidden sm:block px-1.5 py-1 border-r border-line">Customer</span>
                  <span className="px-1.5 py-1">Total</span>
                </div>
                {sheetRows.map(([r, job, who, amt]) => (
                  <div key={job} className="grid grid-cols-[18px_44px_1fr] sm:grid-cols-[22px_42px_1fr_1.1fr] border-b border-line">
                    <span className="px-1 py-1.5 border-r border-line text-center text-[9.5px] text-faint">{r}</span>
                    <span className="px-1.5 py-1.5 border-r border-line text-muted">{job}</span>
                    <span className="hidden sm:block px-1.5 py-1.5 border-r border-line text-body truncate">{who}</span>
                    <span className="px-1.5 py-1.5 text-body">{amt}</span>
                  </div>
                ))}
                <div className="grid grid-cols-[18px_44px_1fr] sm:grid-cols-[22px_42px_1fr_1.1fr]">
                  <span className="px-1 py-1.5 border-r border-line text-center text-[9.5px] text-faint">4</span>
                  <span className="px-1.5 py-1.5 border-r border-line text-muted">0418</span>
                  <span className="hidden sm:block px-1.5 py-1.5 border-r border-line text-body truncate">Greenway</span>
                  <span className={`px-1.5 py-1.5 font-semibold text-heading transition-[outline-color] duration-200 outline outline-[1.5px] -outline-offset-[1.5px] ${stage === 1 ? "outline-heading" : "outline-transparent"}`}>
                    <Typed text={RIGHT} start={T.sheet + 300} now={t} />
                  </span>
                </div>
              </div>
            </Cell>

            {/* 3 — typed again into the accounts, two digits swap */}
            <Cell i={2} active={stage === 2} place="Accounts" by="Typed in again, by hand">
              <div className="w-full max-w-[250px]">
                <div className="rounded-[6px] border border-line bg-paper overflow-hidden text-[11px] sm:text-[12.5px]">
                  <div className="px-2.5 py-1.5 border-b border-line flex items-center justify-between text-[10px] sm:text-[11px]">
                    <span className="font-semibold text-heading">New invoice</span>
                    <span className="text-muted tabular-nums">INV-0193</span>
                  </div>
                  <div className="px-2.5 py-2">
                    <p className="text-[9.5px] sm:text-[10.5px] text-muted">Customer</p>
                    <p className="text-heading font-medium leading-tight">Greenway Café</p>
                    <div className="mt-2 flex justify-between text-[9.5px] sm:text-[10.5px] text-muted">
                      <span>Line item</span>
                      <span>Amount</span>
                    </div>
                    <div className="flex justify-between items-baseline text-heading font-semibold">
                      <span>Job 0418</span>
                      <TypedDigits text={WRONG} start={T.accounts + 300} now={t} mark={swapped} />
                    </div>
                  </div>
                </div>
                <AnimatePresence>
                  {swapped && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="mt-2 rounded-[6px] border border-hold/30 bg-hold-bg text-hold px-2 py-1.5 text-[10.5px] sm:text-[12px] leading-snug"
                    >
                      <p className="font-semibold">6 and 3 swapped</p>
                      <p className="tabular-nums text-hold/80">On the card: {RIGHT}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Cell>

            {/* 4 — the invoice goes out wrong */}
            <Cell i={3} active={stage === 3} place="Invoice" by="Sent to the customer">
              <div className="w-full max-w-[250px]">
                <div className="rounded-[6px] border border-line bg-paper px-2.5 py-2 text-[11px] sm:text-[12.5px]">
                  <p className="flex items-center justify-between">
                    <span className="font-semibold text-heading">INV-0193</span>
                    {t >= T.invoice && <span className="text-[10px] font-semibold text-ok dark:text-[#6CCB5F]">Sent</span>}
                  </p>
                  <p className="text-[9.5px] sm:text-[10.5px] text-muted">To Greenway Café</p>
                  <div className="mt-2 pt-1.5 border-t border-line flex justify-between text-body tabular-nums">
                    <span>Job 0418</span>
                    <span className={`rounded-[4px] px-1 -mx-1 ${t >= T.invoice ? "bg-hold-bg text-hold font-semibold" : ""}`}>
                      <Typed text={WRONG} start={T.invoice} now={t} speed={60} />
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between font-semibold text-heading tabular-nums">
                    <span>Total</span>
                    <span className={t >= T.invoice + 500 ? "text-hold dark:text-[#E9A23B]" : ""}>{t >= T.invoice + 500 ? WRONG : ""}</span>
                  </div>
                </div>
                <AnimatePresence>
                  {t >= T.cost && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="mt-2 text-[11px] sm:text-[12.5px] leading-snug text-hold dark:text-[#E9A23B] font-semibold"
                    >
                      270.00 never billed, and nobody knows.
                    </motion.p>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {t >= T.query && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="mt-2 rounded-[10px] rounded-tl-[3px] bg-paper border border-line px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                    >
                      <p className="text-[11px] sm:text-[12px] text-heading leading-snug">Greenway Café won&apos;t point it out. Why would they?</p>
                    </motion.div>
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
