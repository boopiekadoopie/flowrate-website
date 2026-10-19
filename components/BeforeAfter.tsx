"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import { play } from "@/lib/sound";
import { Container, H2, Lede } from "./ui";

/*
 * Same jobs, two ways to run them. One frame holds the spreadsheet most teams live in and, stacked exactly on
 * top, the same jobs in a simple app. Dragging the line reveals one or the other, row for row, so the visitor
 * sees the difference instead of being told it. Both are screens, so both stay white in either theme.
 * The line sweeps once by itself when the frame first comes into view, to show it can be moved.
 */

const INK = "#101828";

type Row = { n: number; date: string; job: string; who: string; hrs: string; inv: string; paid: string; note: string; hl?: "yellow" | "red" | "dup" };
// Row for row, the same jobs as the app below, so wherever the line sits each row lines up with its other self.
const SHEET: Row[] = [
  { n: 2, date: "14/10", job: "0414", who: "Fernlea Dental", hrs: "2", inv: "Y", paid: "yes", note: "" },
  { n: 3, date: "Oct 15", job: "0416", who: "Mara's Bakery", hrs: "1.5", inv: "✓", paid: "??", note: "chase!!", hl: "red" },
  { n: 4, date: "15-10", job: "0417", who: "Hill and Co", hrs: "3", inv: "y", paid: "", note: "ASK DAVE re parts", hl: "yellow" },
  { n: 5, date: "16/10", job: "0418", who: "Greenway Cafe", hrs: "", inv: "", paid: "", note: "photo in whatsapp" },
  { n: 6, date: "", job: "419?", who: "Oakridge Vet", hrs: "", inv: "", paid: "", note: "booked? check w/ Ana" },
  { n: 7, date: "Oct 15", job: "0416", who: "Maras Bakery", hrs: "1.5", inv: "", paid: "", note: "", hl: "dup" },
];

type Tone = "idle" | "ok" | "hold" | "done";
const CHIP: Record<Tone, string> = {
  idle: "bg-[#F2F3F5] text-[#4A5565]",
  ok: "bg-[#EAF8E6] text-[#1D6B2B]",
  hold: "bg-[#FEF3C7] text-[#92400E]",
  done: "bg-[#1F1F1F] text-white",
};
const APP: { job: string; who: string; by: string; tone: Tone; s: string; amt: string }[] = [
  { job: "0414", who: "Fernlea Dental", by: "Lee Moyo", tone: "ok", s: "Paid", amt: "1,240.00" },
  { job: "0416", who: "Mara's Bakery", by: "Ana Pires", tone: "done", s: "Invoiced", amt: "2,310.00" },
  { job: "0417", who: "Hill & Co", by: "Lee Moyo", tone: "hold", s: "Parts to confirm", amt: "1,980.00" },
  { job: "0418", who: "Greenway Café", by: "Sam Reed", tone: "ok", s: "Ready to invoice", amt: "1,633.00" },
  { job: "0419", who: "Oakridge Vet", by: "Ana Pires", tone: "idle", s: "Booked Thu", amt: "" },
];

/* Shared row heights so the two screens line up exactly. */
const BAR = "h-9", TOOL = "h-9", HEAD = "h-7", ROW = "h-10";
const COLS = "grid-cols-[22px_44px_minmax(0,1.2fr)_minmax(0,1.4fr)_40px] sm:grid-cols-[26px_58px_minmax(0,1.2fr)_minmax(0,1.5fr)_52px_70px] md:grid-cols-[26px_58px_minmax(0,1.2fr)_minmax(0,1.5fr)_52px_70px_64px_44px]";
const cell = "px-1.5 flex items-center border-r border-[#E5E7EB] min-w-0 whitespace-nowrap overflow-hidden";

function Spreadsheet() {
  return (
    <div className="h-full bg-white text-[#1F2937] font-[Arial,Helvetica,sans-serif] flex flex-col text-[11px] sm:text-[12px]">
      <div className={`flex items-center gap-2 px-3 ${BAR} border-b border-[#E5E7EB] bg-[#F7F7F7]`}>
        <span className="flex gap-1.5" aria-hidden>
          <i className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" /><i className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" /><i className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]" />
        </span>
        <span className="text-[#4B5563] truncate">Jobs_FINAL_v3 (USE THIS).xlsx</span>
      </div>
      <div className={`flex items-center gap-2 px-3 ${TOOL} border-b border-[#E5E7EB] text-[#6B7280]`}>
        <span className="italic font-serif">fx</span><span className="text-[#B91C1C]">=SUM(G2:G40)</span><span className="text-[#B91C1C] font-semibold">#REF!</span>
      </div>
      <div className={`grid ${COLS} ${HEAD} border-b border-[#E5E7EB] bg-[#F3F4F6] text-[#4B5563] font-semibold`}>
        <span className={cell} /><span className={cell}>Job no</span><span className={cell}>Customer</span><span className={cell}>Notes</span>
        <span className={cell}>Paid?</span><span className={`${cell} hidden sm:flex`}>Invoiced?</span><span className={`${cell} hidden md:flex`}>Date</span><span className={`${cell} hidden md:flex`}>Hrs</span>
      </div>
      {SHEET.map((r) => (
        <div key={r.n} className={`grid ${COLS} ${ROW} border-b border-[#E5E7EB] ${r.hl === "dup" ? "bg-[#FEFCE8] text-[#6B7280]" : ""}`}>
          <span className={`${cell} justify-center bg-[#F3F4F6] text-[#6B7280]`}>{r.n}</span>
          <span className={cell}>{r.job}</span>
          <span className={cell}>{r.who}</span>
          <span className={`${cell} ${r.hl === "red" ? "text-[#B91C1C] font-bold" : ""} ${r.hl === "yellow" ? "bg-[#FDE68A]" : ""}`}>{r.note}</span>
          <span className={`${cell} ${r.paid === "??" ? "text-[#B91C1C] font-bold" : ""}`}>{r.paid}</span>
          <span className={`${cell} hidden sm:flex`}>{r.inv}</span>
          <span className={`${cell} hidden md:flex`}>{r.date}</span>
          <span className={`${cell} hidden md:flex`}>{r.hrs}</span>
        </div>
      ))}
      <div className="flex-1 min-h-6" />
      <div className="flex items-end gap-1 px-2 pt-2 border-t border-[#E5E7EB] bg-[#F7F7F7] text-[11px]">
        <span className="px-2.5 py-1 bg-white border border-b-0 border-[#E5E7EB] rounded-t text-[#1F2937]">Jobs</span>
        <span className="px-2.5 py-1 text-[#6B7280]">Jobs (2)</span>
        <span className="px-2.5 py-1 text-[#6B7280] truncate">Copy of Jobs OLD</span>
      </div>
    </div>
  );
}

function AppScreen() {
  return (
    <div className="h-full bg-white text-[#101828] flex flex-col text-[11px] sm:text-[12px]">
      <div className={`flex items-center gap-2 px-3 ${BAR} border-b border-[#EEF0F3]`}>
        <span className="grid place-items-center w-5 h-5 rounded-[5px] bg-[#101828] text-white text-[10px] font-bold">N</span>
        <span className="font-semibold">Office</span><span className="text-[#99A1AF]">/</span><span className="text-[#4A5565]">Jobs</span>
        <span className="ml-auto inline-flex items-center gap-1 text-[#6A7282]">
          <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M13 8a5 5 0 1 1-1.5-3.5M13 3v2.5h-2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Up to date
        </span>
      </div>
      <div className={`flex items-center gap-1.5 px-3 ${TOOL} border-b border-[#EEF0F3]`}>
        <span className="px-2 py-[3px] rounded-[6px] bg-[#101828] text-white font-semibold whitespace-nowrap">This week · 5</span>
        <span className="px-2 py-[3px] rounded-[6px] text-[#4A5565] whitespace-nowrap">Needs a look · 1</span>
        <span className="hidden sm:inline px-2 py-[3px] rounded-[6px] text-[#4A5565] whitespace-nowrap">Ready to invoice · 1</span>
      </div>
      <div className={`flex items-center gap-2 sm:gap-3 px-3 ${HEAD} border-b border-[#EEF0F3] text-[#6A7282] text-[10.5px] sm:text-[11px]`}>
        <span className="w-9 shrink-0">Job</span><span className="flex-1">Customer</span><span className="shrink-0">Status</span><span className="hidden md:block w-20 text-right">Amount</span>
      </div>
      {APP.map((r) => (
        <div key={r.job} className={`flex items-center gap-2 sm:gap-3 px-3 ${ROW} border-b border-[#EEF0F3]`}>
          <span className="tabular-nums text-[#6A7282] w-9 shrink-0">{r.job}</span>
          <span className="min-w-0 flex-1 truncate">
            <span className="font-semibold">{r.who}</span>
            <span className="hidden lg:inline text-[#6A7282]"> · {r.by}</span>
          </span>
          <span className={`shrink-0 rounded-[5px] px-1.5 py-[2px] text-[10.5px] font-semibold whitespace-nowrap ${CHIP[r.tone]}`}>{r.s}</span>
          <span className="hidden md:block w-20 shrink-0 text-right tabular-nums text-[#364153]">{r.amt}</span>
        </div>
      ))}
      <div className="flex-1 min-h-6" />
      <div className="flex items-center justify-between gap-2 px-3 py-[7px] border-t border-[#EEF0F3] bg-[#FAFAFB] text-[#4A5565]">
        <span className="truncate">Every job once. Nothing to chase by hand.</span>
        <span className="hidden sm:inline tabular-nums font-semibold text-[#101828] whitespace-nowrap">To invoice 1,633.00</span>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const frame = useRef<HTMLDivElement>(null);
  const reduce = useReduceAfterMount();
  const inView = useInView(frame, { once: true, amount: 0.6 });
  const pos = useMotionValue(50); // percent from the left where the line sits
  const [now, setNow] = useState(50);
  const touched = useRef(false);
  const dragging = useRef(false);
  useMotionValueEvent(pos, "change", (v) => setNow(Math.round(v)));
  const clip = useMotionTemplate`inset(0 0 0 ${pos}%)`;
  const left = useMotionTemplate`${pos}%`;

  // One sweep to show the line moves, unless the visitor got there first.
  useEffect(() => {
    if (!inView || reduce || touched.current) return;
    const c = animate(pos, [50, 72, 30, 50], { duration: 2.4, times: [0, 0.35, 0.75, 1], ease: "easeInOut", delay: 0.3 });
    return () => c.stop();
  }, [inView, reduce, pos]);

  const setFrom = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  const take = () => {
    touched.current = true;
    pos.stop();
  };

  return (
    <section id="before-after" className="bg-paper py-20 md:py-28 border-t border-line">
      <Container>
        <div className="max-w-[760px] mb-10 md:mb-14">
          <H2 className="mb-4">Same jobs. Two ways to run them.</H2>
          <Lede>
            Drag the line. On the left, the spreadsheet most teams run on: copies, gaps, and notes only one person
            understands. On the right, the same jobs in an app built around how you already work.
          </Lede>
        </div>

        <div
          ref={frame}
          className="relative grid max-w-[1000px] rounded-xl border border-line overflow-hidden shadow-[0_24px_60px_-30px_rgba(16,24,40,0.3)] dark:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] select-none cursor-ew-resize touch-pan-y [&>.layer]:[grid-area:1/1]"
          onPointerDown={(e) => {
            take();
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setFrom(e.clientX);
            play("tick", 0.3);
          }}
          onPointerMove={(e) => dragging.current && setFrom(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <div className="layer min-h-[340px]" aria-label="Before: a shared spreadsheet with copies, gaps and unclear notes" role="img">
            <Spreadsheet />
          </div>
          <motion.div className="layer min-h-[340px]" style={{ clipPath: clip }} aria-label="After: the same jobs in a simple app, each with one clear status" role="img">
            <AppScreen />
          </motion.div>

          {/* the line and its handle */}
          <motion.div className="absolute inset-y-0 w-0 pointer-events-none" style={{ left }}>
            <span className="absolute inset-y-0 -left-px w-[2px] bg-[#101828] shadow-[0_0_0_1px_rgba(255,255,255,0.9)]" />
            <span
              role="slider"
              tabIndex={0}
              aria-label="Compare the spreadsheet and the app"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={now}
              aria-valuetext={now < 50 ? "Showing mostly the app" : "Showing mostly the spreadsheet"}
              onKeyDown={(e) => {
                const step = e.shiftKey ? 20 : 5;
                const to = e.key === "ArrowLeft" ? now - step : e.key === "ArrowRight" ? now + step : e.key === "Home" ? 0 : e.key === "End" ? 100 : null;
                if (to === null) return;
                e.preventDefault();
                take();
                animate(pos, Math.min(100, Math.max(0, to)), { duration: 0.2, ease: [0.22, 1, 0.36, 1] });
              }}
              className="pointer-events-auto absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-white border-2 shadow-[0_6px_18px_-6px_rgba(16,24,40,0.45)] cursor-grab active:cursor-grabbing outline-none focus-visible:ring-4 focus-visible:ring-[#101828]/25"
              style={{ borderColor: INK }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
              </svg>
            </span>
          </motion.div>
        </div>
        <div className="max-w-[1000px] mt-3 flex justify-between text-[13px] text-muted" aria-hidden>
          <span>← The spreadsheet</span>
          <span>The app →</span>
        </div>
      </Container>
    </section>
  );
}
