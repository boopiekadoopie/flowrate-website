"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Pointer } from "./Device";

/*
 * "Monday numbers": the one screen from carousel 43 (all five numbers, each ticked). Same labels, figures and
 * colours as the carousel, drawn as a real web app. The four jobs behind "Done, not invoiced" are the
 * Showcase's own: job 0418 for Greenway Café (1,633.00) is one of them, so the number the Problem section
 * watches being retyped arrives here untouched again.
 */

const PETROL = "#0E4D5C";
const AMBER = "#F2B33D";
const INK = "#101828";
const ease = [0.22, 1, 0.36, 1] as const;

type Tone = "red" | "grey" | "green" | "amber";
const TONES: Record<Tone, string> = {
  red: "bg-[#FEE4E2] text-[#B42318]",
  grey: "bg-[#F2F4F7] text-[#475467]",
  green: "bg-[#E3F6DF] text-[#1D6B2B]",
  amber: "bg-[#FEF0C7] text-[#93370D]",
};

export const DRAFTS = [
  ["INV-0193", "Greenway Café", "Job 0418", 1633],
  ["INV-0194", "Mara’s Bakery", "Job 0416", 1180],
  ["INV-0195", "Kaya Building", "Job 0420", 3540],
  ["INV-0196", "Northgate Gym", "Job 0417", 2587],
] as const;

const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* Counts up from zero once `run` turns on; still shows the final figure when motion is off. */
function Count({ to, run, reduce, delay = 0 }: { to: number; run: boolean; reduce: boolean; delay?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (reduce || !run) return;
    const c = animate(0, to, { duration: 0.9, delay, ease, onUpdate: setV });
    return () => c.stop();
  }, [run, reduce, to, delay]);
  return <>{money(reduce ? to : v)}</>;
}

function Chip({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`inline-flex items-center h-[19px] px-1.5 rounded-[5px] text-[9.5px] sm:text-[10.5px] font-semibold whitespace-nowrap ${TONES[tone]}`}>{children}</span>;
}

function Btn({ children, pressed = false }: { children: ReactNode; pressed?: boolean }) {
  return (
    <span className={`inline-flex items-center h-[19px] px-2 rounded-[5px] text-[9.5px] sm:text-[10.5px] font-semibold whitespace-nowrap text-white transition-transform duration-150 ${pressed ? "scale-95" : ""}`} style={{ background: INK }}>
      {children}
    </span>
  );
}

function TickBadge({ show, i, reduce }: { show: boolean; i: number; reduce: boolean }) {
  return (
    <motion.span
      aria-hidden
      initial={false}
      animate={show ? { scale: 1, opacity: 1 } : { scale: 0.4, opacity: 0 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 22, delay: i * 0.02 }}
      className="absolute -top-[7px] -right-[7px] z-10 w-[18px] h-[18px] rounded-full bg-[#99E58C] flex items-center justify-center shadow-[0_1px_2px_rgba(16,24,40,0.18),0_0_0_2px_#F6F7F9]"
    >
      <svg viewBox="0 0 24 24" className="w-[11px] h-[11px]" fill="none" stroke={INK} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    </motion.span>
  );
}

function Tile({ label, children, aside, tick, i, reduce, className = "" }: { label: string; children: ReactNode; aside?: ReactNode; tick: boolean; i: number; reduce: boolean; className?: string }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease, delay: reduce ? 0 : 0.05 + i * 0.07 }}
      className={`relative rounded-[10px] bg-white border border-[#E5E7EB] px-3 sm:px-4 py-2.5 sm:py-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] ${aside ? "sm:flex sm:items-end sm:gap-8" : ""} ${className}`}
    >
      <TickBadge show={tick} i={i} reduce={reduce} />
      <div className="shrink-0">
        <p className="text-[10.5px] sm:text-[11.5px] font-semibold text-[#101828]/70 leading-tight">{label}</p>
        {children}
      </div>
      {aside}
    </motion.div>
  );
}

const fig = "font-sans text-[19px] sm:text-[28px] font-extrabold tracking-[-0.035em] tabular-nums leading-[1.15] mt-1 text-[#101828] whitespace-nowrap";

export function MondayBoard({
  reduce,
  run,
  ticks,
  pointer,
  pressed,
  drafted,
  sheet,
  rows,
  onInvoice,
}: {
  reduce: boolean;
  run: boolean;
  ticks: number;
  pointer: boolean;
  pressed: boolean;
  drafted: boolean;
  sheet: boolean;
  rows: number;
  onInvoice: () => void;
}) {
  const total = DRAFTS.reduce((s, d) => s + d[3], 0);
  return (
    <div className="relative h-full flex flex-col text-[#101828]" style={{ background: "#F6F7F9" }}>
      <div className="h-[38px] sm:h-[42px] shrink-0 flex items-center justify-between px-3.5 sm:px-5" style={{ background: `linear-gradient(180deg, #11586A, ${PETROL})` }}>
        <span className="text-[12.5px] sm:text-[14px] font-bold tracking-[-0.01em] text-white">Monday <span style={{ color: AMBER }}>numbers</span></span>
        <span className="text-[10px] sm:text-[11px] font-medium text-white/70 tabular-nums">Mon 9 Nov · 08:00</span>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-2 gap-2.5 sm:gap-3.5 p-3 sm:p-5 content-start">
        <Tile label="Cash after this week’s bills" tick={ticks > 0} i={0} reduce={reduce}>
          <p className={fig}><Count to={6150} run={run} reduce={reduce} /></p>
          <div className="mt-1.5"><Chip tone="grey"><span className="sm:hidden">after wages and tax</span><span className="hidden sm:inline">after wages, suppliers and tax</span></Chip></div>
        </Tile>
        <Tile label="Owed to you" tick={ticks > 1} i={1} reduce={reduce}>
          <p className={fig}><Count to={31400} run={run} reduce={reduce} delay={0.05} /></p>
          <div className="mt-1.5 flex flex-wrap gap-1"><Chip tone="red">16,500.00 over 30 days</Chip><Btn>Chase 3</Btn></div>
        </Tile>
        <Tile label="Done, not invoiced" tick={ticks > 2} i={2} reduce={reduce}>
          <p className={fig}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={drafted ? "d" : "n"} className="inline-block" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease }}>
                {drafted ? "0.00" : <Count to={total} run={run} reduce={reduce} delay={0.1} />}
              </motion.span>
            </AnimatePresence>
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
            {drafted ? <Chip tone="green">4 invoices drafted</Chip> : <Chip tone="amber">4 jobs</Chip>}
            <button
              type="button"
              onClick={onInvoice}
              aria-label="Draft the 4 invoices"
              className="relative inline-flex cursor-pointer rounded-[5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101828]"
            >
              <Btn pressed={pressed}>{drafted ? "Review 4" : "Invoice 4"}</Btn>
              <span className="absolute left-[60%] top-[62%]"><Pointer show={pointer} down={pressed} /></span>
            </button>
          </div>
        </Tile>
        <Tile label="Quotes waiting" tick={ticks > 3} i={3} reduce={reduce}>
          <p className={fig}><Count to={64300} run={run} reduce={reduce} delay={0.15} /></p>
          <div className="mt-1.5 flex flex-wrap gap-1"><Chip tone="red">3 older than 7 days</Chip><Btn>Follow up 3</Btn></div>
        </Tile>
        <Tile
          label="Booked, next 2 weeks"
          tick={ticks > 4}
          i={4}
          reduce={reduce}
          className="col-span-2"
          aside={
          <div className="hidden sm:flex flex-1 gap-4 pb-0.5">
            {([["This week", [1, 1, 1, 1, 1]], ["Next week", [1, 1, 0, 0, 0]]] as const).map(([wk, days]) => (
              <div key={wk} className="flex-1">
                <p className="text-[10px] font-semibold text-[#101828]/45 mb-1">{wk}</p>
                <div className="flex gap-1">
                  {days.map((b, i) => (
                    <span key={i} className={`flex-1 h-[20px] rounded-[4px] ${b ? "" : "border border-dashed border-[#D92D20]/70 bg-[#FEF3F2]"}`} style={b ? { background: PETROL } : undefined} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          }
        >
          <p className={fig}>7 of 10 <span className="text-[11px] sm:text-[12px] font-semibold tracking-normal text-[#101828]/60">days</span></p>
          <div className="mt-1.5"><Chip tone="red">next week: 3 free</Chip></div>
        </Tile>
      </div>

      {/* the drafts: built from the four jobs marked done, nothing retyped */}
      <AnimatePresence>
        {sheet && (
          <motion.div
            key="drafts"
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease }}
            className="absolute z-30 right-2.5 sm:right-5 top-[48px] sm:top-[58px] left-2.5 sm:left-auto sm:w-[320px] rounded-[12px] bg-white border border-[#E5E7EB] shadow-[0_24px_48px_-16px_rgba(16,24,40,0.3),0_6px_12px_-6px_rgba(16,24,40,0.12)] flex flex-col overflow-hidden"
          >
            <div className="px-3.5 pt-3 pb-2.5 border-b border-[#E5E7EB]">
              <p className="text-[13px] font-bold">4 invoices drafted</p>
              <p className="text-[10.5px] text-[#101828]/55 mt-0.5">From the jobs marked done. Nothing retyped.</p>
            </div>
            <div className="px-3.5 py-1 flex-1 min-h-0">
              {DRAFTS.map(([inv, who, job, amt], i) => (
                <motion.div
                  key={inv}
                  initial={false}
                  animate={i < rows ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.3, ease }}
                  className="flex items-center gap-2.5 py-2 border-b border-[#F2F4F7] last:border-0"
                >
                  <span className="w-[26px] h-[30px] shrink-0 rounded-[4px] border border-[#E5E7EB] bg-[#F9FAFB] flex flex-col gap-[3px] justify-center px-[5px]">
                    <span className="h-[2px] rounded bg-[#D0D5DD]" /><span className="h-[2px] w-2/3 rounded bg-[#D0D5DD]" /><span className="h-[2px] rounded" style={{ background: PETROL }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold leading-tight truncate">{who}</span>
                    <span className="block text-[9.5px] text-[#101828]/50 tabular-nums">{inv} · {job}</span>
                  </span>
                  <span className="text-[11px] font-semibold tabular-nums">{money(amt)}</span>
                </motion.div>
              ))}
            </div>
            <motion.div initial={false} animate={{ opacity: rows >= 4 ? 1 : 0 }} transition={{ duration: 0.3 }} className="px-3.5 py-2.5 bg-[#F9FAFB] border-t border-[#E5E7EB] flex items-center justify-between">
              <span className="text-[11px] font-bold tabular-nums">Total {money(total)}</span>
              <span className="inline-flex items-center h-[24px] px-2.5 rounded-[6px] text-[10.5px] font-semibold text-white" style={{ background: INK }}>Review and send</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
