"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useInView } from "framer-motion";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import { Check, Container, H2, Lede } from "./ui";
import { Fingertip, HdLaptop, HdPhone, HdTablet, HomeBar, StatusBar, SYS } from "./kit/Device";
import { DropBanner, LockScreen, TeamApp, TrackerPage } from "./kit/Torvik";
import { MondayBoard } from "./kit/Monday";
import { play } from "@/lib/sound";

/*
 * Five example product screens, one per tab. Every screen is pinned to the light palette so it reads
 * as a device on the dark page. The same made-up everyday job (Greenway Café, job 0418, 1,633.00)
 * runs through the jobs list, the field app and the Monday numbers, so the number the Problem section
 * watches being mistyped is seen here flowing through untouched. The tracking page and the Monday
 * numbers are the same screens as the reels and carousels (components/kit), shown as real devices.
 */

const ease = [0.22, 1, 0.36, 1] as const;
const DURATION = 7000;
const lift = "shadow-[0_12px_30px_-12px_rgba(28,40,64,0.22),0_2px_4px_-2px_rgba(28,40,64,0.08)]";
const PHOTO = "/images/greenway-cafe-counter.jpg";

type ScreenProps = { reduce: boolean };

/* ---------------------------------------------------------------- bits */

const glyph = {
  jobs: "M4 7h16M4 12h16M4 17h10",
  customers: "M15.5 10.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM5 20a7 7 0 0 1 14 0",
  invoices: "M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h4",
  reports: "M5 20v-7M11 20V5M17 20v-10M3 20h18",
  settings: "M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 12l1.6-.4.5-1.2-.9-1.4 1.4-1.4 1.4.9 1.2-.5L10.1 6h2.8l.4 1.6 1.2.5 1.4-.9 1.4 1.4-.9 1.4.5 1.2 1.6.4v2.8l-1.6.4-.5 1.2.9 1.4-1.4 1.4-1.4-.9-1.2.5-.4 1.6h-2.8l-.4-1.6-1.2-.5-1.4.9-1.4-1.4.9-1.4-.5-1.2-1.6-.4z",
  search: "M15.5 15.5 20 20M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z",
  camera: "M4 8h3.5l1.5-2.5h6L16.5 8H20v11H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  box: "M12 3 4 7.5v9L12 21l8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
  pen: "M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17z",
  clock: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 8v4l2.5 1.5",
  bell: "M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 21h4",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  download: "M12 4v11m-4-4 4 4 4-4M5 20h14",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  pin: "M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10zM12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  coffee: "M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 9h1.5a2 2 0 1 1 0 4H16M7 4v2M11 4v2",
  people: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.5M21 19a6 6 0 0 0-4-5.7",
  leaf: "M5 19C5 10 10 5 19 5c0 9-5 14-14 14zM5 19l8-8",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
  chevron: "M9 6l6 6-6 6",
  back: "M15 6l-6 6 6 6",
  signal: "M5 18v-3M9 18v-6M13 18v-9M17 18V6",
  wifi: "M2.5 9.5a14 14 0 0 1 19 0M5.5 12.5a10 10 0 0 1 13 0M8.5 15.5a5.5 5.5 0 0 1 7 0M12 19h.01",
};

function I({ d, className = "w-3.5 h-3.5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}

/* Initials in a square (Orderful's square headshots), never a circle. */
function Avatar({ n, dark = false, className = "" }: { n: string; dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-[5px] text-[8.5px] font-bold tracking-[0.02em] ${dark ? "bg-carbon text-white" : "bg-canvas border border-line text-heading"} ${className}`}>
      {n}
    </span>
  );
}

function Pill({ tone, children }: { tone: "ok" | "wait" | "hold" | "done"; children: React.ReactNode }) {
  const t = { ok: "bg-ok-bg text-ok", wait: "bg-canvas text-body", hold: "bg-hold-bg text-hold", done: "bg-carbon text-white" }[tone];
  return <span className={`inline-flex px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-semibold whitespace-nowrap ${t}`}>{children}</span>;
}

function Signature({ className = "w-[52px] h-[12px]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 14" className={className} aria-hidden>
      <path d="M2 10 C 8 2, 12 2, 16 9 S 24 12, 28 6 S 36 3, 40 9 S 50 12, 56 5 S 66 4, 78 8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------------------------------------------- loops, light and fitting */

/*
 * Every screen loops like a product film: play the moment, hold the payoff, fade the whole scene, start again
 * from a clean frame. With motion off it's the finished frame, still. Holds run past the 7 s auto-advance, so
 * on its own the showcase moves on before a replay; a picked tab keeps looping for as long as it's watched.
 */
const FADE_MS = 450;
function useLoop(times: readonly number[], reduce: boolean, hold = 4000) {
  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const end = times[times.length - 1] + hold;
    const ids = times.map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    ids.push(setTimeout(() => setFading(true), end));
    ids.push(setTimeout(() => {
      setStep(0);
      setFading(false);
      setCycle((c) => c + 1);
    }, end + FADE_MS));
    return () => ids.forEach(clearTimeout);
  }, [times, reduce, hold, cycle]);
  return { step: reduce ? times.length : step, fading: !reduce && fading, cycle };
}

function Fade({ out, children, className = "h-full" }: { out: boolean; children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} initial={false} animate={{ opacity: out ? 0 : 1 }} transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}>
      {children}
    </motion.div>
  );
}

/* The soft studio light the devices stand in. */
function Studio({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative h-full bg-canvas overflow-hidden ${className}`}>
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(70% 80% at 50% 42%, #FFFFFF 0%, rgba(255,255,255,0) 72%)" }} />
      {children}
    </div>
  );
}

/* Wide compositions are drawn for the 796 px panel and step down with it (zoom on an inner box only). */
const FIT = "sm:max-md:[zoom:0.74] md:max-lg:[zoom:0.9] lg:max-[1139px]:[zoom:0.74] min-[1140px]:max-[1239px]:[zoom:0.9]";

/* Fits a `design`-px-wide app into HdLaptop(w)'s screen: the zoom, and the design height that fills it exactly. */
function laptopFit(w: number, design: number) {
  const k = w / 620;
  const sw = w - 26 * k;
  const zoom = sw / design;
  return { zoom, width: design, height: Math.round(Math.round((sw * 10) / 16) / zoom) };
}

/* ---------------------------------------------------------------- 1. Jobs */

const JOBS_T = [900, 1500] as const; // 1 Sam's phone sends, 2 the office list flips and says so

function JobsApp({ flipped, reduce }: { flipped: boolean; reduce: boolean }) {
  const rows = [
    { job: "0419", who: "Hill & Co", what: "Office lighting, three floors", owner: "LK", tone: "wait" as const, status: "Quote sent", amt: "4,120.00" },
    { job: "0418", who: "Greenway Café", what: "Fridge not cooling — door seal", owner: "SR", tone: flipped ? ("ok" as const) : ("wait" as const), status: flipped ? "Ready to invoice" : "Waiting on signature", amt: "1,633.00" },
    { job: "0416", who: "Mara’s Bakery", what: "Annual service", owner: "TM", tone: "ok" as const, status: "Ready to invoice", amt: "1,180.00" },
    { job: "0415", who: "Harbour Foods", what: "Cold room alarm", owner: "LK", tone: "done" as const, status: "Invoiced", amt: "960.00" },
    { job: "0414", who: "Oakline Joinery", what: "Dust extraction, site visit", owner: "SR", tone: "hold" as const, status: "Needs a look", amt: "—" },
  ];
  const nav = [
    ["Jobs", glyph.jobs, "24"],
    ["Customers", glyph.customers, ""],
    ["Invoices", glyph.invoices, "3"],
    ["Reports", glyph.reports, ""],
    ["Settings", glyph.settings, ""],
  ];
  return (
    <div className="relative h-full flex text-[12px] bg-paper">
      <aside className="hidden sm:flex w-[168px] flex-col border-r border-line bg-soft p-3">
        <div className="flex items-center gap-2 px-1.5 mb-3">
          <Avatar n="YB" dark />
          <span className="font-semibold text-heading">Your business</span>
        </div>
        <div className="flex flex-col gap-0.5">
          {nav.map(([n, d, c], i) => (
            <span key={n} className={`flex items-center gap-2 px-2 py-1.5 rounded-[6px] ${i === 0 ? "bg-paper border border-line font-semibold text-heading" : "text-muted"}`}>
              <I d={d} className="w-3.5 h-3.5 shrink-0" />
              <span className="flex-1">{n}</span>
              {c && <span className={`text-[10px] tabular-nums ${i === 0 ? "text-heading" : "text-faint"}`}>{c}</span>}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-2 px-1.5 pt-3 border-t border-line">
          <Avatar n="NO" />
          <span className="min-w-0">
            <span className="block text-heading font-medium leading-tight">Nia Okafor</span>
            <span className="block text-[10px] text-muted leading-tight">Office</span>
          </span>
        </div>
      </aside>

      <div className="flex-1 min-w-0 p-3.5 sm:p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <p className="text-[15px] font-semibold text-heading mr-auto">Jobs</p>
          <span className="hidden sm:flex items-center gap-1.5 h-7 w-[170px] rounded-[6px] border border-line bg-paper px-2 text-muted">
            <I d={glyph.search} className="w-3.5 h-3.5" />
            <span className="text-[11px] whitespace-nowrap truncate">Search jobs, customers…</span>
          </span>
          <span className="h-7 inline-flex items-center rounded-[6px] bg-carbon text-white px-2.5 text-[11px] font-semibold">New job</span>
        </div>
        <div className="flex gap-1.5 mb-3 shrink-0 overflow-hidden">
          {["All 24", "Needs a look 1", "Ready to invoice 3", "This week"].map((f, i) => (
            <span key={f} className={`px-2 py-1 rounded-[6px] border text-[11px] whitespace-nowrap ${i === 0 ? "border-heading text-heading" : "border-line text-muted"} ${i >= 2 ? "hidden sm:inline" : ""}`}>{f}</span>
          ))}
        </div>

        <div className="rounded-lg border border-line overflow-hidden bg-paper shrink-0">
          <div className="grid grid-cols-[38px_1fr_auto] sm:grid-cols-[44px_1fr_28px_72px_auto] gap-2.5 sm:gap-3 px-3 py-1.5 bg-soft border-b border-line text-[10.5px] text-muted">
            <span>Job</span><span>Customer</span><span className="hidden sm:block" /><span className="hidden sm:block text-right">Amount</span><span>Status</span>
          </div>
          {rows.map((r, i) => (
            <motion.div
              key={r.job}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, backgroundColor: r.job === "0418" && flipped ? ["#EAF8E6", "#FFFFFF"] : "#FFFFFF" }}
              transition={{ delay: reduce ? 0 : i * 0.06, duration: 0.4, backgroundColor: { duration: 1.4 } }}
              className="grid grid-cols-[38px_1fr_auto] sm:grid-cols-[44px_1fr_28px_72px_auto] gap-2.5 sm:gap-3 items-center px-3 py-1.5 border-b border-line last:border-0"
            >
              <span className="text-heading font-medium tabular-nums">{r.job}</span>
              <span className="min-w-0">
                <span className="block text-heading font-medium truncate">{r.who}</span>
                <span className="block text-[10.5px] text-muted truncate">{r.what}</span>
              </span>
              <span className="hidden sm:block"><Avatar n={r.owner} /></span>
              <span className="hidden sm:block text-right tabular-nums text-body">{r.amt}</span>
              <Pill tone={r.tone}>{r.status}</Pill>
            </motion.div>
          ))}
        </div>
        <p className="mt-2 text-[10.5px] text-faint">5 of 24 jobs · updated just now</p>
      </div>

      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className={`absolute left-3 right-3 bottom-3 sm:left-auto sm:right-5 sm:bottom-5 flex items-center gap-2 rounded-lg bg-carbon text-white pl-2.5 pr-3 py-2 ${lift}`}
          >
            <span className="w-5 h-5 shrink-0 rounded-[5px] bg-white/10 flex items-center justify-center"><Check className="w-3 h-3 text-[#99E58C]" /></span>
            <span className="text-[11px] leading-tight min-w-0">
              <span className="block font-semibold">Greenway Café signed off job 0418</span>
              <span className="block text-white/60">From Sam’s phone · ready to invoice</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminScreen({ reduce }: ScreenProps) {
  const { step, fading, cycle } = useLoop(JOBS_T, reduce);
  const fit = laptopFit(600, 760);
  return (
    <Studio>
      <Fade out={fading}>
        <div key={cycle} className="h-full">
          {/* wide: the office laptop, and Sam's phone that just sent the job */}
          <div className="hidden sm:flex h-full items-center justify-center">
            <div className={`relative ${FIT}`} style={{ width: 760, height: 430 }}>
              <div className="absolute right-0 bottom-[6px]">
                <HdLaptop w={600}>
                  <div style={{ zoom: fit.zoom, width: fit.width, height: fit.height }}>
                    <JobsApp flipped={step >= 2} reduce={reduce} />
                  </div>
                </HdLaptop>
              </div>
              <motion.div
                className="absolute left-[6px] bottom-0"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.15 }}
              >
                <div style={{ zoom: 0.8 }}>
                  <HdPhone w={188}>
                    <FieldApp step={step >= 1 ? 6 : 4} />
                  </HdPhone>
                </div>
              </motion.div>
            </div>
          </div>
          {/* phones: the same system on the office tablet */}
          <div className="sm:hidden h-full flex items-center justify-center">
            <div className="max-[369px]:[zoom:0.92]">
              <HdTablet w={316} h={416}>
                <JobsApp flipped={step >= 2} reduce={reduce} />
              </HdTablet>
            </div>
          </div>
        </div>
      </Fade>
    </Studio>
  );
}

/* ---------------------------------------------------------------- 2. Field app */

// 1–4 checklist ticks, 5 no signal (saved on the phone), 6 sent, 7 the office has it, 8 the invoice drafts itself
const FIELD_T = [500, 1000, 1500, 2000, 2550, 3350, 3850, 4450] as const;

function FieldApp({ step }: { step: number }) {
  const items = [
    { label: "Photo of finished work", d: glyph.camera, done: <span className="relative block w-[22px] h-[22px] rounded-[5px] overflow-hidden ring-1 ring-white/15"><Image src={PHOTO} alt="" fill sizes="22px" className="object-cover" /></span> },
    { label: "Parts used", d: glyph.box, done: <span className="text-[10px] text-white/80">Door seal × 1</span> },
    { label: "Customer signature", d: glyph.pen, done: <Signature className="w-[38px] h-[11px] text-[#99E58C]" /> },
    { label: "Time on site", d: glyph.clock, done: <span className="text-[10px] text-white/80 tabular-nums">1.5 h</span> },
  ];
  const sent = step >= 6;
  return (
    <div className="absolute inset-0 flex flex-col text-white" style={{ background: "#111214" }}>
      <StatusBar time="09:41" light offline={step === 5} />
      <div className="px-3.5">
        <div className="flex items-center gap-1.5 text-white/55 text-[10px]">
          <I d={glyph.back} className="w-3 h-3" />
          <span>Today · 2 of 3</span>
          <span className="ml-auto rounded-[5px] bg-white/[0.08] px-1.5 py-[3px] text-[9px] text-white/80">Job 0418</span>
        </div>
        <p className="text-[15px] font-semibold mt-2 leading-tight">Greenway Café</p>
        <p className="text-[10.5px] text-white/55 leading-snug">Fridge not cooling — door seal</p>
        <p className="flex items-center gap-1 text-[9.5px] text-white/40 mt-1"><I d={glyph.pin} className="w-3 h-3" />14 Mill Lane · 08:30</p>
      </div>
      <div className="flex flex-col gap-1.5 mt-3 px-3">
        {items.map((it, i) => {
          const done = step > i;
          return (
            <div key={it.label} className={`flex items-center gap-2 rounded-[10px] px-2 h-[32px] border transition-colors duration-200 ${done ? "bg-white/[0.05] border-white/[0.08]" : "border-white/[0.07]"}`}>
              <span className={`w-5 h-5 shrink-0 rounded-[6px] flex items-center justify-center transition-colors duration-200 ${done ? "bg-[#99E58C] text-[#0C1A0D]" : "bg-white/[0.06] text-white/45"}`}>
                {done ? <Check className="w-3 h-3" /> : <I d={it.d} className="w-3 h-3" />}
              </span>
              <span className={`text-[10.5px] leading-tight flex-1 ${done ? "text-white" : "text-white/55"}`}>{it.label}</span>
              <AnimatePresence>{done && <motion.span initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center">{it.done}</motion.span>}</AnimatePresence>
            </div>
          );
        })}
      </div>
      <div className="mt-auto px-3 pb-[22px]">
        {/* the notice has its own slot, so nothing on the screen moves when it appears */}
        <div className="h-[36px] mb-1.5 flex items-end">
          <AnimatePresence mode="wait">
            {step === 5 && (
              <motion.p key="off" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full rounded-[9px] bg-white/[0.08] text-[9.5px] text-white/75 px-2.5 py-1.5 leading-snug">
                No signal. Saved on this phone, it’ll send itself.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className={`h-9 rounded-[11px] flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-colors duration-200 ${sent ? "bg-white/[0.08] text-[#99E58C]" : "bg-[#99E58C] text-[#0C1A0D]"}`}>
          {sent ? <><Check className="w-3.5 h-3.5" /> Sent to the office</> : "Finish job"}
        </div>
      </div>
      <HomeBar light />
    </div>
  );
}

const INVOICE: [string, string][] = [["Door seal × 1", "640.00"], ["Labour · 1.5 h", "780.00"], ["Tax", "213.00"]];
const CAPTURED = ["Photo attached", "Door seal × 1 from stock", "Signed by the customer", "1.5 h on site"];

/* The office side of job 0418, as the business's own web app (drawn 640 × 400, fitted into the laptop). */
function OfficeApp({ step }: { step: number }) {
  const arrived = step >= 7;
  const drafted = step >= 8;
  const jobs: [string, string, string, "ok" | "wait" | "done"][] = [
    ["0419", "Hill & Co", "Quote sent", "wait"],
    ["0418", "Greenway Café", arrived ? "Ready to invoice" : "On site", arrived ? "ok" : "wait"],
    ["0416", "Mara’s Bakery", "Ready to invoice", "ok"],
    ["0415", "Harbour Foods", "Invoiced", "done"],
  ];
  return (
    <div className="h-full flex flex-col bg-paper text-[12px] text-heading">
      <div className="h-10 shrink-0 flex items-center gap-2 px-4 border-b border-line">
        <Avatar n="YB" dark />
        <span className="font-semibold">Your business</span>
        <span className="text-faint">/</span>
        <span className="text-muted">Jobs</span>
        <span className="text-faint">/</span>
        <span className="text-heading tabular-nums">0418</span>
        <span className="relative ml-auto text-muted">
          <I d={glyph.bell} className="w-4 h-4" />
          {arrived && <span className="absolute -top-1 -right-1.5 min-w-[13px] h-[13px] px-0.5 rounded-[3px] bg-heading text-white text-[8px] font-bold flex items-center justify-center">1</span>}
        </span>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-[190px_1fr]">
        <aside className="border-r border-line bg-soft p-2.5 flex flex-col gap-1.5">
          <p className="px-1 pb-0.5 text-[10.5px] text-muted">Today</p>
          {jobs.map(([no, who, st, tone]) => (
            <motion.div
              key={no}
              initial={false}
              animate={{ backgroundColor: no === "0418" && arrived ? ["#EAF8E6", "#FFFFFF"] : "#FFFFFF" }}
              transition={{ duration: 1.4 }}
              className={`rounded-[8px] border px-2.5 py-2 ${no === "0418" ? "border-heading/40" : "border-line"}`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-semibold tabular-nums">{no}</span>
                <Pill tone={tone}>{st}</Pill>
              </span>
              <span className="block text-[11px] text-muted mt-0.5 truncate">{who}</span>
            </motion.div>
          ))}
        </aside>
        <div className="p-4 flex gap-3 min-w-0">
          <div className="flex-1 min-w-0 rounded-lg border border-line overflow-hidden flex flex-col">
            <div className="px-3.5 py-3 border-b border-line">
              <p className="font-semibold text-[13px] leading-tight">Greenway Café</p>
              <p className="text-[11px] text-muted mt-0.5">Fridge not cooling — door seal · 14 Mill Lane</p>
              <p className={`mt-2 inline-flex items-center gap-1.5 text-[11px] ${arrived ? "text-ok" : "text-muted"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${arrived ? "bg-ok" : "bg-line-strong"}`} />
                {arrived ? "Arrived from Sam’s phone · just now" : "Sam is on site"}
              </p>
            </div>
            <div className="px-3.5 py-1.5">
              {CAPTURED.map((t, i) => (
                <motion.p
                  key={t}
                  initial={false}
                  animate={{ opacity: arrived ? 1 : 0.45 }}
                  transition={{ duration: 0.3, delay: arrived ? i * 0.08 : 0 }}
                  className="flex items-center gap-2 py-[7px] border-b border-line last:border-0 text-body text-[11.5px]"
                >
                  <Check className={`w-3.5 h-3.5 shrink-0 ${arrived ? "text-ok" : "text-faint"}`} />
                  {t}
                  {i === 0 && arrived && (
                    <span className="ml-auto relative w-[38px] h-[26px] rounded-[4px] overflow-hidden ring-1 ring-line">
                      <Image src={PHOTO} alt="" fill sizes="38px" className="object-cover" />
                    </span>
                  )}
                  {i === 2 && arrived && <Signature className="ml-auto w-[46px] h-[12px] text-heading" />}
                </motion.p>
              ))}
            </div>
          </div>
          <motion.div
            initial={false}
            animate={drafted ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.45, ease }}
            className={`w-[196px] shrink-0 self-start rounded-lg bg-paper border border-line ${lift} text-[11px] overflow-hidden`}
          >
            <div className="px-3 py-2.5 border-b border-line flex items-center justify-between">
              <span className="font-semibold">Invoice draft</span>
              <span className="text-[10px] text-muted tabular-nums">INV-0193</span>
            </div>
            <div className="px-3 py-2 tabular-nums">
              {INVOICE.map(([k, v]) => (
                <p key={k} className="flex justify-between py-1 text-body"><span>{k}</span><span>{v}</span></p>
              ))}
              <p className="flex justify-between pt-1.5 mt-0.5 border-t border-line font-semibold"><span>Total</span><span>1,633.00</span></p>
            </div>
            <p className="px-3 py-2 bg-soft border-t border-line text-[10px] text-muted">Built from the job. Nothing retyped.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* The same office view on the owner's phone, for small screens. */
function OfficePhoneApp({ step }: { step: number }) {
  const arrived = step >= 7;
  const drafted = step >= 8;
  return (
    <div className="absolute inset-0 flex flex-col bg-[#F6F7F9] text-heading">
      <div className="bg-paper border-b border-line">
        <StatusBar time="09:41" />
        <div className="flex items-center gap-2 px-3.5 pb-2.5">
          <span className="text-[13px] font-semibold">Your business</span>
          <span className="relative ml-auto text-muted">
            <I d={glyph.bell} className="w-3.5 h-3.5" />
            {arrived && <span className="absolute -top-1 -right-1.5 min-w-[12px] h-[12px] px-0.5 rounded-[3px] bg-heading text-white text-[7.5px] font-bold flex items-center justify-center">1</span>}
          </span>
        </div>
      </div>
      <div className="p-2.5 flex flex-col gap-2">
        <motion.div initial={false} animate={{ backgroundColor: arrived ? ["#EAF8E6", "#FFFFFF"] : "#FFFFFF" }} transition={{ duration: 1.4 }} className="rounded-[12px] border border-line p-2.5">
          <span className="flex items-center justify-between gap-1">
            <span className="text-[11.5px] font-semibold leading-tight">Greenway Café</span>
            <span className="text-[9px] text-muted tabular-nums">0418</span>
          </span>
          <span className="block text-[9.5px] text-muted mt-0.5">{arrived ? "From Sam’s phone · just now" : "Sam is on site"}</span>
          <span className="mt-1.5 flex flex-wrap gap-1">
            {["Photo", "Parts", "Signed", "1.5 h"].map((t) => (
              <span key={t} className={`inline-flex items-center gap-0.5 rounded-[5px] px-1.5 py-[2px] text-[8.5px] font-semibold ${arrived ? "bg-ok-bg text-ok" : "bg-canvas text-faint"}`}>
                <Check className="w-2.5 h-2.5" />{t}
              </span>
            ))}
          </span>
          <span className="mt-1.5 block"><Pill tone={arrived ? "ok" : "wait"}>{arrived ? "Ready to invoice" : "On site"}</Pill></span>
        </motion.div>
        <motion.div initial={false} animate={drafted ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }} transition={{ duration: 0.45, ease }} className="rounded-[12px] border border-line bg-paper overflow-hidden text-[10px]">
          <div className="px-2.5 py-2 border-b border-line flex items-center justify-between">
            <span className="font-semibold text-[11px]">Invoice draft</span>
            <span className="text-[9px] text-muted tabular-nums">INV-0193</span>
          </div>
          <div className="px-2.5 py-1.5 tabular-nums">
            {INVOICE.map(([k, v]) => (
              <p key={k} className="flex justify-between py-[3px] text-body"><span>{k}</span><span>{v}</span></p>
            ))}
            <p className="flex justify-between pt-1 mt-0.5 border-t border-line font-semibold"><span>Total</span><span>1,633.00</span></p>
          </div>
        </motion.div>
      </div>
      <HomeBar />
    </div>
  );
}

function FieldScreen({ reduce }: ScreenProps) {
  const { step, fading, cycle } = useLoop(FIELD_T, reduce, 3200);
  const fit = laptopFit(500, 640);
  return (
    <Studio>
      <Fade out={fading}>
        <div key={cycle} className="h-full">
          <div className="hidden sm:flex h-full items-center justify-center">
            <div className={`relative flex items-end gap-7 ${FIT}`}>
              <HdPhone w={200}>
                <FieldApp step={step} />
              </HdPhone>
              <div className="mb-[8px]">
                <HdLaptop w={500}>
                  <div style={{ zoom: fit.zoom, width: fit.width, height: fit.height }}>
                    <OfficeApp step={step} />
                  </div>
                </HdLaptop>
              </div>
            </div>
          </div>
          <div className="sm:hidden h-full flex items-center justify-center gap-2.5">
            <div className="[zoom:0.8] max-[369px]:[zoom:0.74]">
              <HdPhone w={188}>
                <FieldApp step={step} />
              </HdPhone>
            </div>
            <div className="[zoom:0.8] max-[369px]:[zoom:0.74]">
              <HdPhone w={188}>
                <OfficePhoneApp step={step} />
              </HdPhone>
            </div>
          </div>
        </div>
      </Fade>
    </Studio>
  );
}

/* ---------------------------------------------------------------- 3. Tracking page */

/*
 * The "Is it ready yet?" reel as working screens, on real phones: one tap on the team's phone, a line of light
 * carries it to the customer's tracking page, the page ticks over, then the WhatsApp lands on the lock screen.
 * Where the panel is too narrow for three phones, the WhatsApp drops onto the tracking page instead.
 */
type Pt = { x: number; y: number };
const at = (el: Element, box: DOMRect, side: "c" | "l" | "r" = "c"): Pt => {
  const r = el.getBoundingClientRect();
  return { x: (side === "r" ? r.right : side === "l" ? r.left : r.left + r.width / 2) - box.left, y: r.top + r.height / 2 - box.top };
};
const curve = (a: Pt, b: Pt) => {
  const k = (b.x - a.x) * 0.45;
  return `M${a.x} ${a.y} C${a.x + k} ${a.y} ${b.x - k} ${b.y} ${b.x} ${b.y}`;
};
type Leg = { d: string; a: Pt; b: Pt };

function LightLeg({ id, leg, on, reduce }: { id: string; leg: Leg | null; on: boolean; reduce: boolean }) {
  if (!leg) return null;
  const t = reduce ? { duration: 0 } : { pathLength: { duration: 0.75, ease: [0.65, 0, 0.35, 1] as const }, opacity: { duration: 0.15 } };
  const show = { pathLength: on ? 1 : 0, opacity: on ? 1 : 0 };
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={leg.a.x} y1={leg.a.y} x2={leg.b.x} y2={leg.b.y}>
          <stop offset="0" stopColor="#2F8F3E" />
          <stop offset="1" stopColor="#7FD873" />
        </linearGradient>
      </defs>
      <motion.path d={leg.d} fill="none" stroke="#99E58C" strokeWidth={8} strokeLinecap="round" style={{ filter: "blur(4px)" }} initial={false} animate={{ ...show, opacity: on ? 0.55 : 0 }} transition={t} />
      <motion.path d={leg.d} fill="none" stroke={`url(#${id})`} strokeWidth={2} strokeLinecap="round" initial={false} animate={show} transition={t} />
      {on && !reduce && (
        <motion.circle cx={leg.b.x} cy={leg.b.y} r={9} fill="none" stroke="#7FD873" strokeWidth={2} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: [0.4, 2], opacity: [0.9, 0] }} transition={{ duration: 0.7, delay: 0.7, ease }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      )}
    </g>
  );
}

// 1 finger lands, 2 tap: ready, 3 line of light to the tracking page, 4 page ticks over, 5 the WhatsApp lands
const TRACK_T = [450, 1050, 1250, 2000, 2750] as const;

function TrackingScreen({ reduce }: ScreenProps) {
  const { step, fading } = useLoop(TRACK_T, reduce);
  const wrap = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const [leg, setLeg] = useState<Leg | null>(null);
  const measure = useCallback(() => {
    const el = wrap.current;
    if (!el || !mark.current || !dot.current) return;
    const box = el.getBoundingClientRect();
    const a = at(mark.current, box, "r");
    const b = at(dot.current, box);
    setLeg({ d: curve(a, b), a, b });
  }, []);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);
  // fonts and the tab's own entrance can nudge the layout: measure again (after layout) as the story moves on
  useEffect(() => {
    const id = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(id);
  }, [step, measure]);

  return (
    <Studio>
      <Fade out={fading}>
        <div ref={wrap} className="relative h-full flex items-center justify-center gap-3 sm:gap-8 px-2 sm:px-6">
          <div className="relative max-sm:[zoom:0.8] max-[369px]:[zoom:0.74]">
            <HdPhone w={188}>
              <TeamApp ready={step >= 2} ref={mark}>
                <span className="absolute left-[36%] top-1/2"><Fingertip show={step >= 1 && step < 3} down={step === 2} /></span>
              </TeamApp>
            </HdPhone>
          </div>
          <div className="relative max-sm:[zoom:0.8] max-[369px]:[zoom:0.74]">
            <HdPhone w={188}>
              <TrackerPage ready={step >= 4} ref={dot} banner={<div className="md:max-lg:hidden min-[1140px]:hidden"><DropBanner show={step >= 5} /></div>} />
            </HdPhone>
          </div>
          <div className="relative hidden md:max-lg:block min-[1140px]:block">
            <HdPhone w={188} screen="#0B0E14">
              <LockScreen show={step >= 5} />
            </HdPhone>
          </div>
          <motion.svg initial={false} animate={{ opacity: step >= 5 ? 0.45 : 1 }} transition={{ duration: 0.6 }} className="pointer-events-none absolute inset-0 w-full h-full z-50 overflow-visible" aria-hidden>
            <LightLeg id="fr-light" leg={leg} on={step >= 3} reduce={reduce} />
          </motion.svg>
        </div>
      </Fade>
    </Studio>
  );
}

/* ---------------------------------------------------------------- 4. Monday numbers */

/* Carousel 43's one screen, on the office laptop. It counts up, ticks each number, then someone presses
   "Invoice 4" and the four jobs that were done but never invoiced draft themselves. Press it yourself to see it
   again; either way it loops. */
const AUTO: [number, number][] = [[80, 1], [900, 2], [1020, 3], [1140, 4], [1260, 5], [1380, 6], [1500, 7], [2050, 8], [2200, 9], [2400, 10], [2580, 11], [2760, 12], [2940, 13], [4500, 14], [4750, 15]];
const PRESSED: [number, number][] = [[0, 8], [150, 9], [350, 10], [530, 11], [710, 12], [890, 13], [3200, 14], [3450, 15]];
const MONDAY_HOLD = 2800;

function MondayScreen({ reduce }: ScreenProps) {
  const [s, setS] = useState(0);
  const [take, setTake] = useState(0);
  const [fading, setFading] = useState(false);
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const plan = take === 0 ? AUTO : PRESSED;
    const end = plan[plan.length - 1][0] + MONDAY_HOLD;
    const ids = plan.map(([ms, st]) => setTimeout(() => setS(st), ms));
    ids.push(setTimeout(() => setFading(true), end));
    ids.push(setTimeout(() => {
      setS(0);
      setTake(0);
      setFading(false);
      setCycle((c) => c + 1);
    }, end + FADE_MS));
    return () => ids.forEach(clearTimeout);
  }, [reduce, take, cycle]);
  // Motion off: the finished board, or the drafts open after someone presses the button.
  const step = reduce ? (take % 2 ? 13 : 15) : s;
  const board = (
    <MondayBoard
      key={cycle}
      reduce={reduce}
      run={step >= 1}
      ticks={Math.min(5, Math.max(0, step - 1))}
      pointer={step >= 7 && step < 9}
      pressed={step === 8}
      sheet={step >= 9 && step < 14}
      rows={Math.min(4, Math.max(0, step - 9))}
      drafted={step >= 15}
      onInvoice={() => {
        setFading(false);
        setTake((n) => n + 1);
        play("slide", 0.5);
      }}
    />
  );
  const fit = laptopFit(600, 760);
  return (
    <Studio>
      <Fade out={fading}>
        <div className="hidden sm:flex h-full items-center justify-center">
          <div className={FIT}>
            <HdLaptop w={600}>
              <div style={{ zoom: fit.zoom, width: fit.width, height: fit.height }}>{board}</div>
            </HdLaptop>
          </div>
        </div>
        <div className="sm:hidden h-full flex items-center justify-center">
          <div className="max-[369px]:[zoom:0.92]">
            <HdTablet w={316} h={416}>
              {board}
            </HdTablet>
          </div>
        </div>
      </Fade>
    </Studio>
  );
}

/* ---------------------------------------------------------------- 5. Website */

const WEB_T = [2300, 2700] as const; // the visitor has typed and sent; the enquiry lands
const MSG = "Lunch for 24 at our office, next Thursday.";
const EXISTING = [
  ["Hill & Co", "Office lunch, Fri", "Booked", "ok"],
  ["Jordan K.", "Birthday, table of 6", "Booked", "ok"],
  ["Oakline Joinery", "Breakfast meeting", "Quote sent", "wait"],
] as const;

/* Types the enquiry once per scene (the scene remounts on every loop). */
function useTyping(reduce: boolean) {
  const [typedLater, setTyped] = useState(0);
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= MSG.length + 30) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, [reduce]);
  const typed = reduce ? MSG.length + 30 : typedLater;
  return { typed, sent: typed > MSG.length + 8 };
}

/* The café's own site in a desktop browser (drawn 760 × 475, fitted into the laptop). */
function CafeSite({ typed, sent }: { typed: number; sent: boolean }) {
  return (
    <div className="h-full flex flex-col bg-paper text-[11px] text-heading">
      <div className="h-[34px] shrink-0 flex items-center gap-3 px-3 border-b border-line bg-[#F3F3F4]">
        <span className="flex gap-[6px]">{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} className="w-[11px] h-[11px] rounded-full" style={{ background: c, boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)" }} />)}</span>
        <span className="flex gap-2 text-faint"><I d={glyph.back} className="w-3.5 h-3.5" /><I d={glyph.chevron} className="w-3.5 h-3.5" /></span>
        <span className="mx-auto w-[46%] h-[22px] rounded-[7px] bg-paper border border-line text-[10.5px] text-body flex items-center justify-center gap-1.5">
          <I d={glyph.lock} className="w-3 h-3 text-muted" />greenwaycafe.com
        </span>
        <span className="w-[58px]" />
      </div>
      <div className="flex items-center justify-between px-6 h-11 border-b border-line shrink-0">
        <span className="font-display uppercase text-[13px] tracking-[-0.01em]">Greenway Café</span>
        <span className="flex gap-5 text-muted"><span>Menu</span><span>Catering</span><span>Find us</span></span>
        <span className="rounded-[5px] bg-heading text-white px-3 py-1.5 font-semibold">Book a table</span>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-[1fr_1.1fr] gap-6 px-6 pt-5 pb-4">
        <div className="flex flex-col min-h-0">
          <p className="font-display uppercase text-[26px] leading-[0.98] tracking-[-0.02em]">Breakfast, lunch and good coffee. Seven days.</p>
          <p className="text-muted mt-3 leading-[1.5] max-w-[270px]">Everything made in our kitchen from 7am. Catering for offices, events and the odd birthday.</p>
          <div className="flex gap-1.5 mt-4">
            <span className="rounded-[5px] bg-heading text-white px-3 py-1.5 font-semibold">Book a table</span>
            <span className="rounded-[5px] border border-line px-3 py-1.5 font-semibold">See the menu</span>
          </div>
          <div className="mt-auto flex gap-4 border-t border-line pt-3 text-[10px] text-body">
            {[[glyph.clock, "7am daily"], [glyph.people, "Catering"], [glyph.leaf, "Baked here"]].map(([d, t]) => (
              <span key={t} className="flex items-center gap-1.5 whitespace-nowrap"><I d={d} className="w-3.5 h-3.5 text-muted shrink-0" />{t}</span>
            ))}
          </div>
        </div>
        <div className="relative rounded-[8px] overflow-hidden border border-line">
          <Image src={PHOTO} alt="The counter at Greenway Café: pastries, sandwiches and two flat whites" fill sizes="420px" className="object-cover object-[50%_78%]" />
          <span className="absolute left-2 bottom-2 flex items-center gap-1.5 rounded-[5px] bg-paper/95 border border-line px-2 py-1 text-[10px]">
            <I d={glyph.coffee} className="w-3 h-3 text-muted" />Today’s lunch · roast veg &amp; halloumi
          </span>
        </div>
      </div>
      <div className="border-t border-line bg-soft px-6 py-3 flex items-end gap-2 shrink-0">
        <div className="flex-1 min-w-0">
          <p className="text-[9.5px] text-muted mb-1">Catering enquiry · tell us about your event</p>
          <div className="h-7 rounded-[5px] border border-line bg-paper px-2 flex items-center truncate">
            {MSG.slice(0, typed)}
            {typed < MSG.length && <span className="inline-block w-px h-3 bg-heading ml-px animate-pulse" />}
          </div>
        </div>
        <span className={`h-7 inline-flex items-center px-3 rounded-[5px] font-bold transition-colors duration-200 ${sent ? "bg-ok-bg text-ok" : "bg-heading text-white"}`}>{sent ? "Sent" : "Send"}</span>
      </div>
    </div>
  );
}

/* The same site on the customer's phone (small screens). */
function CafeMobile({ typed, sent }: { typed: number; sent: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-paper text-heading text-[10px]">
      <StatusBar time="11:20" />
      <div className="flex items-center justify-between px-3 h-8 border-b border-line">
        <span className="font-display uppercase text-[10.5px] tracking-[-0.01em]">Greenway Café</span>
        <I d={glyph.jobs} className="w-3.5 h-3.5 text-body" />
      </div>
      <div className="relative h-[74px] shrink-0">
        <Image src={PHOTO} alt="" fill sizes="190px" className="object-cover object-[50%_78%]" />
      </div>
      <div className="px-3 pt-2.5">
        <p className="font-display uppercase text-[14px] leading-[0.98] tracking-[-0.02em]">Breakfast, lunch and good coffee.</p>
        <span className="mt-2 inline-flex rounded-[5px] bg-heading text-white px-2.5 py-1 font-semibold text-[9.5px]">Book a table</span>
      </div>
      <div className="mt-2.5 mx-3 rounded-[10px] border border-line bg-soft p-2">
        <p className="text-[8.5px] text-muted mb-1">Catering enquiry</p>
        <div className="min-h-[30px] rounded-[6px] border border-line bg-paper px-1.5 py-1 leading-snug text-[9.5px]">
          {MSG.slice(0, typed)}
          {typed < MSG.length && <span className="inline-block w-px h-2.5 bg-heading ml-px animate-pulse align-middle" />}
        </div>
        <span className={`mt-1.5 flex h-6 items-center justify-center rounded-[6px] font-bold text-[9.5px] transition-colors duration-200 ${sent ? "bg-ok-bg text-ok" : "bg-heading text-white"}`}>{sent ? "Sent" : "Send"}</span>
      </div>
      <div className="mt-auto pt-1.5 pb-[17px] px-2.5 border-t border-black/[0.06] bg-paper/90 backdrop-blur-md" style={{ fontFamily: SYS }}>
        <div className="h-[22px] rounded-[7px] bg-black/[0.06] flex items-center justify-center gap-1 text-[9px] text-[#3A3A40]">
          <I d={glyph.lock} className="w-2.5 h-2.5" />greenwaycafe.com
        </div>
      </div>
      <HomeBar />
    </div>
  );
}

/* …and the enquiry lands in the business's own system, on the owner's phone. */
function SystemPhoneApp({ sent }: { sent: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-[#F6F7F9] text-heading text-[10.5px]">
      <div className="bg-paper border-b border-line">
        <StatusBar time="11:20" />
        <div className="flex items-center gap-2 px-3.5 pb-2.5">
          <span className="min-w-0 mr-auto">
            <span className="block text-[13px] font-semibold leading-tight">Your system</span>
            <span className="block text-[9.5px] text-muted leading-tight">Enquiries</span>
          </span>
          <span className="relative text-muted">
            <I d={glyph.bell} className="w-3.5 h-3.5" />
            {sent && <span className="absolute -top-1 -right-1.5 min-w-[12px] h-[12px] px-0.5 rounded-[3px] bg-heading text-white text-[7.5px] font-bold flex items-center justify-center">1</span>}
          </span>
        </div>
      </div>
      <div className="p-2.5 flex flex-col gap-1.5">
        <AnimatePresence>
          {sent && (
            <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} transition={{ duration: 0.45, ease }} className="overflow-hidden">
              <div className="rounded-[10px] border border-ok/30 bg-ok-bg p-2">
                <p className="flex items-center justify-between font-semibold text-ok">New <span className="text-[8.5px] font-normal">just now</span></p>
                <p className="mt-0.5 leading-snug">Office lunch for 24 · Thu</p>
                <p className="text-[9px] text-body mt-0.5">For Sam · reply drafted</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* two earlier enquiries: the list has to end above the home bar */}
        {EXISTING.slice(0, 2).map(([who, what, st, tone]) => (
          <div key={who} className="rounded-[10px] border border-line bg-paper p-2">
            <p className="font-medium leading-tight truncate">{who}</p>
            <p className="text-[9.5px] text-muted leading-tight mb-1.5 truncate">{what}</p>
            <Pill tone={tone}>{st}</Pill>
          </div>
        ))}
      </div>
      <p className="mt-auto mb-[22px] px-3.5 text-[9px] text-muted">No inbox to check. Nothing retyped.</p>
      <HomeBar />
    </div>
  );
}

function WebScene({ reduce }: ScreenProps) {
  const { typed, sent } = useTyping(reduce);
  const fit = laptopFit(560, 760);
  return (
    <>
      <div className="hidden sm:flex h-full items-center justify-center">
        <div className={`relative ${FIT}`} style={{ width: 770, height: 430 }}>
          <div className="absolute left-0 bottom-[6px]">
            <HdLaptop w={560}>
              <div style={{ zoom: fit.zoom, width: fit.width, height: fit.height }}>
                <CafeSite typed={typed} sent={sent} />
              </div>
            </HdLaptop>
          </div>
          <div className="absolute right-0 bottom-0">
            <div style={{ zoom: 0.86 }}>
              <HdPhone w={188}>
                <SystemPhoneApp sent={sent} />
              </HdPhone>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:hidden h-full flex items-center justify-center gap-2.5">
        <div className="[zoom:0.8] max-[369px]:[zoom:0.74]">
          <HdPhone w={188}>
            <CafeMobile typed={typed} sent={sent} />
          </HdPhone>
        </div>
        <div className="[zoom:0.8] max-[369px]:[zoom:0.74]">
          <HdPhone w={188}>
            <SystemPhoneApp sent={sent} />
          </HdPhone>
        </div>
      </div>
    </>
  );
}

function WebScreen({ reduce }: ScreenProps) {
  const { fading, cycle } = useLoop(WEB_T, reduce);
  return (
    <Studio>
      <Fade out={fading}>
        <div key={cycle} className="h-full">
          <WebScene reduce={reduce} />
        </div>
      </Fade>
    </Studio>
  );
}

/* ---------------------------------------------------------------- section */

const tabs = [
  { title: "Admin systems", desc: "One place where every job, order or booking lives, from the first call to the paid invoice.", path: "Jobs", screen: AdminScreen },
  { title: "Field apps", desc: "Your people finish the job on their phone, photo and signature included. It works without signal and sends itself later.", path: "Field app", screen: FieldScreen },
  { title: "Tracking pages", desc: "Every job gets a page the customer can check, like a parcel. Your team taps once, and a WhatsApp goes out when it’s ready.", path: "Tracking page", screen: TrackingScreen },
  { title: "Reporting", desc: "Your Monday numbers on one screen. Work that was done but never invoiced gets drafted in one click.", path: "Monday numbers", screen: MondayScreen },
  { title: "Websites", desc: "Sites that look as good as your work, with enquiries that land straight in your system.", path: "Website", screen: WebScreen },
];

export function Showcase() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const [stripEnd, setStripEnd] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  // Server and first client render are identical; the reduced-motion / paused shortcut applies after mount.
  const reduce = useReduceAfterMount();
  const running = auto && !paused && inView && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % tabs.length), DURATION);
    return () => clearTimeout(id);
  }, [running, active]);

  // Phones: when the tabs advance on their own, slide the strip so the active tab stays visible
  // (horizontal only, so the page itself never jumps).
  useEffect(() => {
    const el = stripRef.current;
    const btn = el?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[active];
    if (!el || !btn || el.scrollWidth <= el.clientWidth || !inView) return;
    el.scrollTo({ left: Math.max(0, btn.offsetLeft - 20), behavior: reduce ? "auto" : "smooth" });
  }, [active, inView, reduce]);

  // Arrow keys move between tabs, like any tab list.
  const onTabKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    setAuto(false);
    stripRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  // Mobile tab strip: hide the edge fade once the last tab is in view.
  const onStripScroll = () => {
    const el = stripRef.current;
    if (!el) return;
    setStripEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  const Screen = tabs[active].screen;

  return (
    <section id="services" className="bg-paper py-20 md:py-28 border-y border-line">
      <Container>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-16 lg:items-end mb-12 md:mb-16">
          <H2>Whatever the job runs on, we can build it.</H2>
          <Lede>
            Every business has a process held together by WhatsApp, a spreadsheet and somebody&apos;s
            memory. We find it, and build the system that runs it.
          </Lede>
        </div>

        <div ref={ref} className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)] gap-6 lg:gap-10 items-start"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          // Keyboard users: pause while focus is inside, so the panel never changes under them.
          onFocus={() => setPaused(true)}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false); }}
          // Touch: once someone touches the showcase, stop advancing on its own.
          onTouchStart={() => setAuto(false)}
        >
          <div className="relative min-w-0">
            <div
              ref={stripRef}
              onScroll={onStripScroll}
              role="tablist"
              aria-label="What we build"
              onKeyDown={onTabKey}
              className="min-w-0 flex lg:flex-col gap-2 overflow-x-auto snap-x snap-mandatory lg:snap-none -mx-5 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((t, i) => {
                const on = i === active;
                return (
                  <button
                    key={t.title}
                    role="tab"
                    aria-selected={on}
                    tabIndex={on ? 0 : -1}
                    onClick={() => { setActive(i); setAuto(false); }}
                    className={`relative text-left rounded-lg border px-4 py-3.5 lg:px-5 lg:py-4 transition-colors duration-150 cursor-pointer flex-shrink-0 snap-start overflow-hidden ${
                      on ? "bg-paper border-heading" : "bg-canvas border-line hover:border-line-strong"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`text-[12px] tabular-nums ${on ? "text-heading" : "text-faint"}`}>0{i + 1}</span>
                      <span className={`text-[16px] font-bold whitespace-nowrap ${on ? "text-heading" : "text-body"}`}>{t.title}</span>
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.24, ease }}
                          className="hidden lg:block overflow-hidden"
                        >
                          <span className="block pt-2 pl-8 text-[14px] leading-[1.55] text-body">{t.desc}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {on && running && (
                      <motion.span
                        key={`bar-${active}`}
                        aria-hidden
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: DURATION / 1000, ease: "linear" }}
                        className="absolute left-0 right-0 bottom-0 h-[2px] bg-heading origin-left"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {/* edge fade: there are more tabs to the right */}
            <span
              aria-hidden
              className={`lg:hidden pointer-events-none absolute top-0 bottom-0 -right-5 sm:-right-8 w-14 bg-gradient-to-l from-paper via-paper/80 to-transparent transition-opacity duration-200 ${stripEnd ? "opacity-0" : "opacity-100"}`}
            />
          </div>

          <div>
            <p className="lg:hidden text-[15px] leading-[1.55] text-body mb-4">{tabs[active].desc}</p>
            <div data-theme="light" className="relative rounded-xl border border-line bg-paper text-heading shadow-[0_30px_60px_-30px_rgba(16,24,40,0.3)]">
              <div className="h-10 flex items-center justify-between px-4 border-b border-line">
                <span className="text-[12px] text-muted">
                  <span className="text-heading font-semibold">Your system</span> / {tabs[active].path}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.025em] text-body">
                  Live
                </span>
              </div>
              <div className="h-[440px] sm:h-[460px] overflow-hidden rounded-b-xl" role="tabpanel">
                <MotionConfig reducedMotion="user">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.28, ease }}
                      className="h-full"
                    >
                      <Screen reduce={reduce} />
                    </motion.div>
                  </AnimatePresence>
                </MotionConfig>
              </div>
            </div>
            <p className="mt-4 text-[13px] text-muted">
              Connects to the tools you already use, like Xero, Google Drive, Excel and email. Screens shown are examples.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
