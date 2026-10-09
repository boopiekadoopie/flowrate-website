"use client";
import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";

/*
 * The three "how a build works" artefacts. Not illustrations: each one is a small piece of the
 * product itself, drawn in the same chrome as the Showcase screens (paper tile on vellum, hairline
 * borders, 8px radius, status pills, tabular figures). Every colour is a token, so the tiles step
 * correctly in dark mode. Visibility is measured on the HTML frame (reliable on mobile Safari) and
 * shared with the pieces; reduced motion renders the finished state straight away.
 */
const Shown = createContext(false);
const ease = [0.22, 1, 0.36, 1] as const;

export function ArtFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReduceAfterMount();
  return (
    <div ref={ref} className={`relative overflow-hidden rounded-lg border border-line bg-canvas ${className}`} aria-hidden>
      <Shown.Provider value={inView || !!reduce}>{children}</Shown.Provider>
    </div>
  );
}

/* Step timers: stage advances through `times` (ms) once shown; reduced motion jumps to the end. */
function useStage(times: readonly number[]) {
  const shown = useContext(Shown);
  const reduce = useReduceAfterMount();
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!shown || reduce) return;
    const ids = times.map((t, i) => setTimeout(() => setStage(i + 1), t));
    return () => ids.forEach(clearTimeout);
  }, [shown, reduce, times]);
  return reduce ? times.length : shown ? stage : 0;
}

function Rise({ children, delay = 0, className = "", y = 6 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const shown = useContext(Shown);
  const reduce = useReduceAfterMount();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ delay, duration: 0.45, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* The product tile: a paper card that starts inside the frame and runs off its bottom edge. */
const tile =
  "absolute left-4 right-4 top-4 sm:left-5 sm:right-5 sm:top-5 rounded-[8px] border border-line bg-paper shadow-[0_12px_32px_-18px_rgba(28,40,64,0.22)] text-[11px] leading-none text-heading";

function Chip({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "ok" | "hold" | "dark" }) {
  const t = {
    plain: "bg-canvas border border-line text-body",
    ok: "bg-ok-bg text-ok",
    hold: "bg-hold-bg text-hold dark:bg-hold/25 dark:text-[#F3C96B]",
    dark: "bg-carbon text-white dark:bg-white dark:text-[#101828]",
  }[tone];
  return <span className={`inline-flex items-center rounded-[4px] px-1.5 h-[16px] text-[10px] font-semibold whitespace-nowrap ${t}`}>{children}</span>;
}

function Tick({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ 1 · the map of the job today */
const MAP_ROWS = [
  { n: "01", step: "Call comes in", where: "Phone" },
  { n: "02", step: "Quote", where: "Sheets", amount: "1,840.00" },
  { n: "03", step: "Job booked", where: "WhatsApp" },
  { n: "04", step: "Done on site", where: "Paper card" },
  { n: "05", step: "Invoice", where: "Xero", amount: "1,840.00", flag: true },
  { n: "06", step: "Payment chased", where: "Memory" },
];
const MAP_T = [900, 1500] as const;

export function MapArt() {
  const stage = useStage(MAP_T);
  const dup = stage >= 1;
  return (
    <div className={tile}>
      <div className="flex items-center justify-between px-3 h-[28px] border-b border-line">
        <span className="font-semibold">The job today</span>
        <span className="text-[10px] text-muted">Mapped on the first call</span>
      </div>
      <div className="relative">
        {/* the same figure typed in two places: one amber bracket joins them */}
        <motion.span
          className="absolute left-[9px] top-[33px] w-[2px] bg-hold dark:bg-[#F3C96B] rounded-full origin-top"
          style={{ height: 3 * 22 }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: dup ? 1 : 0 }}
          transition={{ duration: 0.5, ease }}
        />
        {MAP_ROWS.map((r, i) => {
          const hit = dup && !!r.amount;
          return (
            <Rise key={r.n} delay={0.08 + i * 0.07}>
              <div className={`grid grid-cols-[26px_1fr_auto] items-center h-[22px] pl-[18px] pr-3 border-b border-line transition-colors duration-500 ${hit ? "bg-hold-bg/60 dark:bg-hold/15" : ""}`}>
                <span className="text-[10px] text-faint tabular-nums">{r.n}</span>
                <span className={`truncate ${hit ? "text-hold dark:text-[#F3C96B] font-semibold" : ""}`}>{r.step}</span>
                <span className="flex items-center gap-1.5">
                  {r.amount && (
                    <span className={`tabular-nums text-[10px] transition-colors duration-500 ${hit ? "text-hold dark:text-[#F3C96B]" : "text-muted"}`}>{r.amount}</span>
                  )}
                  {r.flag && stage >= 2 ? (
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease }}>
                      <Chip tone="hold">Typed twice</Chip>
                    </motion.span>
                  ) : (
                    <Chip>{r.where}</Chip>
                  )}
                </span>
              </div>
            </Rise>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ 2 · the prototype, with a comment on it */
const PROTO_ROWS = [
  { no: "1041", name: "Hill & Co", status: "Done", tone: "dark" as const },
  { no: "1042", name: "Greenway Café", status: "Booked", tone: "plain" as const },
  { no: "1043", name: "Mara’s Bakery", status: "Quoted", tone: "plain" as const },
  { no: "1044", name: "Corner Supply", status: "Booked", tone: "plain" as const },
  { no: "1045", name: "Northside Dental", status: "Quoted", tone: "plain" as const },
];
const PROTO_T = [700, 1500, 2300] as const;

export function PrototypeArt() {
  const reduce = useReduceAfterMount();
  const stage = useStage(PROTO_T);
  const commented = stage >= 1;
  const replied = stage >= 2;
  const added = stage >= 3;
  return (
    <div className={tile}>
      <div className="flex items-center justify-between px-3 h-[28px] border-b border-line">
        <span className="flex items-center gap-2">
          <span className="font-semibold">Jobs</span>
          <span className="text-[10px] text-muted">Screen 3 of 9</span>
        </span>
        <Chip>{added ? "Prototype v4" : "Prototype v3"}</Chip>
      </div>
      <div className="flex">
        <div className="hidden sm:flex w-[64px] shrink-0 flex-col gap-[3px] border-r border-line bg-soft p-1.5 text-[10px] text-muted">
          {["Jobs", "Quotes", "Invoices", "Customers"].map((n, i) => (
            <span key={n} className={`px-1.5 py-[3px] rounded-[4px] ${i === 0 ? "bg-paper border border-line text-heading font-semibold" : ""}`}>{n}</span>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center h-[20px] px-3 bg-soft border-b border-line text-[10px] text-muted">
            <motion.span className="overflow-hidden whitespace-nowrap" initial={reduce ? false : { width: 0 }} animate={{ width: added ? 36 : 0 }} transition={{ duration: 0.45, ease }}>No.</motion.span>
            <span className="flex-1">Customer</span>
            <span>Status</span>
          </div>
          {PROTO_ROWS.map((r, i) => (
            <Rise key={r.no} delay={0.1 + i * 0.07}>
              <div className="flex items-center h-[22px] px-3 border-b border-line">
                <motion.span
                  className="overflow-hidden whitespace-nowrap tabular-nums text-[10px] text-body"
                  initial={reduce ? false : { width: 0, opacity: 0 }}
                  animate={{ width: added ? 36 : 0, opacity: added ? 1 : 0 }}
                  transition={{ duration: 0.45, ease, delay: i * 0.04 }}
                >
                  {r.no}
                </motion.span>
                <span className="flex-1 truncate">{r.name}</span>
                <Chip tone={r.tone}>{r.status}</Chip>
              </div>
            </Rise>
          ))}
        </div>
      </div>

      {/* the comment thread, pinned to the Customer column */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 6, scale: 0.97 }}
        animate={commented ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.97 }}
        transition={{ duration: 0.4, ease }}
        className="absolute right-2.5 top-[32px] w-[172px] rounded-[8px] border border-line bg-paper shadow-[0_16px_32px_-14px_rgba(28,40,64,0.35)] p-2.5"
      >
        <div className="flex items-start gap-2">
          <span className="shrink-0 w-[18px] h-[18px] rounded-[5px] bg-carbon dark:bg-white text-white dark:text-[#101828] text-[9px] font-bold flex items-center justify-center">J</span>
          <div className="min-w-0">
            <p className="text-[10px] text-muted leading-none mb-1">Jo · Office</p>
            <p className="text-[11px] leading-[1.35]">Can we add the job number here?</p>
          </div>
        </div>
        <motion.div
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={replied ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease }}
          className="overflow-hidden"
        >
          <div className="flex items-start gap-2 mt-2 pt-2 border-t border-line">
            <span className="shrink-0 w-[18px] h-[18px] rounded-[5px] overflow-hidden border border-line bg-canvas">
              <Image src="/andrew.jpg" alt="" width={36} height={36} sizes="18px" className="w-full h-full object-cover object-top" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-muted leading-none mb-1">Andrew</p>
              <p className="text-[11px] leading-[1.35] flex items-center justify-between gap-2">
                Added.
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: added ? 1 : 0 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-1 text-ok text-[10px] font-semibold">
                  <Tick className="w-3 h-3" />Resolved
                </motion.span>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------- 3 · live: phone to office */
const LIVE_ITEMS = ["Photo of finished work", "Parts used", "Customer signature"];
const LIVE_T = [400, 750, 1100, 1600, 2300, 2900] as const;

export function LiveArt() {
  const reduce = useReduceAfterMount();
  const stage = useStage(LIVE_T);
  const sent = stage >= 4;
  const landed = stage >= 5;
  const drafted = stage >= 6;
  const rows = [
    { no: "1041", name: "Hill & Co", status: "Done", tone: "dark" as const },
    { no: "1042", name: "Greenway Café", status: landed ? "Done" : "On site", tone: landed ? ("dark" as const) : ("ok" as const), live: true },
    { no: "1043", name: "Mara’s Bakery", status: "Booked", tone: "plain" as const },
    { no: "1044", name: "Corner Supply", status: "Quoted", tone: "plain" as const },
    { no: "1045", name: "Northside Dental", status: "Booked", tone: "plain" as const },
  ];
  return (
    <>
      {/* office screen */}
      <div className={`${tile} left-[92px] sm:left-[104px]`}>
        <div className="flex items-center justify-between px-3 h-[28px] border-b border-line">
          <span className="flex items-center gap-2">
            <span className="font-semibold">Jobs</span>
            <span className="text-[10px] text-muted">Office</span>
          </span>
          <Chip tone="ok">Live</Chip>
        </div>
        {rows.map((r, i) => (
          <Rise key={r.no} delay={0.1 + i * 0.07}>
            <div className={`flex items-center h-[22px] px-3 border-b border-line transition-colors duration-700 ${r.live && landed && !drafted ? "bg-ok-bg/70 dark:bg-ok/20" : ""}`}>
              <span className="w-[34px] tabular-nums text-[10px] text-body">{r.no}</span>
              <span className="flex-1 truncate">{r.name}</span>
              <Chip tone={r.tone}>{r.status}</Chip>
            </div>
            {r.live && (
              <motion.div
                initial={reduce ? false : { height: 0, opacity: 0 }}
                animate={drafted ? { height: 20, opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                className="overflow-hidden flex items-center gap-1.5 px-3 pl-[46px] border-b border-line bg-ok-bg/40 text-[10px] text-ok dark:bg-ok/15 dark:text-[#6CCB7B]"
              >
                <Tick className="w-3 h-3" />
                <span className="font-semibold">Draft invoice ready</span>
                <span className="text-muted">for approval</span>
              </motion.div>
            )}
          </Rise>
        ))}
      </div>

      {/* the phone on site, overlapping the office screen */}
      <Rise delay={0.05} y={10} className="absolute left-4 sm:left-5 top-5 sm:top-7 w-[92px] z-10">
        <div className="rounded-[16px] bg-carbon p-[5px] shadow-[0_18px_36px_-16px_rgba(16,24,40,0.55)] ring-1 ring-black/10 dark:ring-white/15">
          <div className="rounded-[12px] bg-[#141414] px-2 pt-2 pb-2 h-[132px] flex flex-col text-white">
            <div className="flex justify-between text-[7px] text-white/45 mb-2"><span>09:41</span><span>On site</span></div>
            <p className="text-[10px] font-semibold leading-none">Job 1042</p>
            <p className="text-[8px] text-white/50 mt-[3px] mb-2 truncate">Greenway Café</p>
            <div className="flex flex-col gap-[5px]">
              {LIVE_ITEMS.map((it, i) => {
                const done = stage > i;
                return (
                  <div key={it} className="flex items-center gap-1.5">
                    <span className={`w-[10px] h-[10px] rounded-[3px] flex items-center justify-center transition-colors duration-200 ${done ? "bg-green text-[#0C1A0D]" : "border border-white/30"}`}>
                      {done && <Tick className="w-[7px] h-[7px]" />}
                    </span>
                    <span className={`text-[7.5px] leading-none truncate ${done ? "text-white" : "text-white/55"}`}>{it}</span>
                  </div>
                );
              })}
            </div>
            <div className={`mt-auto h-[20px] rounded-[6px] flex items-center justify-center gap-1 text-[8px] font-bold transition-colors duration-300 ${sent ? "bg-white/10 text-[#99E58C]" : "bg-green text-[#0C1A0D]"}`}>
              {sent ? <><Tick className="w-[9px] h-[9px]" />Sent</> : "Submit"}
            </div>
          </div>
        </div>
      </Rise>
    </>
  );
}
