"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Container, H2, Lede } from "./ui";

/*
 * Four example product screens, one per tab. Every screen is pinned to the light palette so it reads
 * as a device on the dark page. The same made-up everyday job (Greenway Café, job 0418, 1,633.00)
 * runs through all four, so the number the Problem section watches being mistyped is seen here
 * flowing through untouched.
 */

const subscribeNoop = () => () => {};
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

/* ---------------------------------------------------------------- 1. Jobs */

function AdminScreen({ reduce }: ScreenProps) {
  const [flippedLater, setFlipped] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setFlipped(true), 1800);
    return () => clearTimeout(id);
  }, [reduce]);
  const flipped = reduce || flippedLater;

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
    <div className="relative h-full flex text-[12px]">
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

      <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-3 shrink-0">
          <p className="text-[15px] font-semibold text-heading mr-auto">Jobs</p>
          <span className="hidden sm:flex items-center gap-1.5 h-7 w-[170px] rounded-[6px] border border-line bg-paper px-2 text-muted">
            <I d={glyph.search} className="w-3.5 h-3.5" />
            <span className="text-[11px]">Search jobs, customers…</span>
          </span>
          <span className="h-7 inline-flex items-center rounded-[6px] bg-carbon text-white px-2.5 text-[11px] font-semibold">New job</span>
        </div>
        <div className="flex gap-1.5 mb-3 shrink-0 overflow-hidden">
          {["All 24", "Needs a look 1", "Ready to invoice 3", "This week"].map((f, i) => (
            <span key={f} className={`px-2 py-1 rounded-[6px] border text-[11px] whitespace-nowrap ${i === 0 ? "border-heading text-heading" : "border-line text-muted"} ${i === 3 ? "hidden md:inline" : ""}`}>{f}</span>
          ))}
        </div>

        <div className="rounded-lg border border-line overflow-hidden bg-paper shrink-0">
          <div className="grid grid-cols-[44px_1fr_auto] sm:grid-cols-[44px_1fr_28px_72px_auto] gap-3 px-3 py-1.5 bg-soft border-b border-line text-[10.5px] text-muted">
            <span>Job</span><span>Customer</span><span className="hidden sm:block" /><span className="hidden sm:block text-right">Amount</span><span>Status</span>
          </div>
          {rows.map((r, i) => (
            <motion.div
              key={r.job}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, backgroundColor: r.job === "0418" && flipped ? ["#EAF8E6", "#FFFFFF"] : "#FFFFFF" }}
              transition={{ delay: reduce ? 0 : i * 0.06, duration: 0.4, backgroundColor: { duration: 1.4 } }}
              className="grid grid-cols-[44px_1fr_auto] sm:grid-cols-[44px_1fr_28px_72px_auto] gap-3 items-center px-3 py-1.5 border-b border-line last:border-0"
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className={`absolute right-3 bottom-3 sm:right-5 sm:bottom-5 max-w-[calc(100%-24px)] flex items-center gap-2 rounded-lg bg-carbon text-white pl-2.5 pr-3 py-2 ${lift}`}
          >
            <span className="w-5 h-5 rounded-[5px] bg-white/10 flex items-center justify-center"><Check className="w-3 h-3 text-[#99E58C]" /></span>
            <span className="text-[11px] leading-tight">
              <span className="block font-semibold">Greenway Café signed off job 0418</span>
              <span className="block text-white/60">From Sam’s phone · ready to invoice</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------------------------- 2. Field app */

function FieldScreen({ reduce }: ScreenProps) {
  // 1–4 checklist ticks, 5 offline notice, 6 sent, 7 office card, 8 invoice draft
  const [stepLater, setStep] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const ids = [600, 1300, 2000, 2700, 3400, 4600, 5300, 6000].map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, [reduce]);
  const step = reduce ? 8 : stepLater;

  const items = [
    { label: "Photo of finished work", d: glyph.camera, done: <span className="relative block w-7 h-7 rounded-[5px] overflow-hidden border border-white/20"><Image src={PHOTO} alt="" fill sizes="28px" className="object-cover" /></span> },
    { label: "Parts used", d: glyph.box, done: <span className="text-[10.5px] text-white/80">Door seal × 1</span> },
    { label: "Customer signature", d: glyph.pen, done: <Signature className="w-[34px] sm:w-[46px] h-[11px] text-[#99E58C]" /> },
    { label: "Time on site", d: glyph.clock, done: <span className="text-[10.5px] text-white/80 tabular-nums">1.5 h</span> },
  ];
  const sent = step >= 6;

  return (
    <div className="h-full flex items-center justify-center gap-2.5 sm:gap-5 md:gap-6 p-3 sm:p-6 bg-canvas">
      {/* phone */}
      <div className="w-[194px] sm:w-[216px] shrink-0 rounded-[26px] bg-carbon p-2 shadow-[0_24px_48px_-20px_rgba(16,24,40,0.5)]">
        <div className="rounded-[20px] bg-[#141414] px-3 sm:px-3.5 pt-3 pb-3.5 min-h-[372px] sm:min-h-[388px] flex flex-col">
          <div className="flex justify-between items-center text-[10px] text-white/50 mb-3">
            <span className="tabular-nums">09:41</span>
            <span className="flex items-center gap-1">{sent ? <I d={glyph.signal} className="w-3 h-3" /> : <span className="text-[9px]">No signal</span>}<I d={glyph.wifi} className="w-3 h-3" /></span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60 text-[10.5px]">
            <I d={glyph.back} className="w-3 h-3" />
            <span>Today<span className="hidden sm:inline"> · 2 of 3</span></span>
            <span className="ml-auto rounded-[4px] bg-white/10 px-1.5 py-0.5 text-[9.5px] text-white/80">Job 0418</span>
          </div>
          <p className="text-[15px] font-semibold text-white mt-2 leading-tight">Greenway Café</p>
          <p className="text-[11px] text-white/55 leading-snug">Fridge not cooling — door seal</p>
          <p className="flex items-center gap-1 text-[10px] text-white/40 mt-1"><I d={glyph.pin} className="w-3 h-3" />14 Mill Lane · 08:30</p>

          <div className="flex flex-col gap-1.5 mt-3.5">
            {items.map((it, i) => {
              const done = step > i;
              return (
                <div key={it.label} className={`flex items-center gap-2 rounded-[8px] px-2 py-1.5 border transition-colors duration-200 ${done ? "bg-white/[0.06] border-white/10" : "border-white/10"}`}>
                  <span className={`w-5 h-5 shrink-0 rounded-[5px] flex items-center justify-center transition-colors duration-200 ${done ? "bg-[#99E58C] text-[#0C1A0D]" : "text-white/45 border border-white/20"}`}>
                    {done ? <Check className="w-3 h-3" /> : <I d={it.d} className="w-3 h-3" />}
                  </span>
                  <span className={`text-[11px] leading-tight flex-1 ${done ? "text-white" : "text-white/55"}`}>{it.label}</span>
                  <AnimatePresence>{done && <motion.span initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} className="flex items-center">{it.done}</motion.span>}</AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-3">
            <AnimatePresence mode="wait">
              {step === 5 && (
                <motion.p key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[8px] bg-white/10 text-[10px] text-white/70 px-2.5 py-2 mb-2 leading-snug">
                  No signal. Saved on this phone, it’ll send itself.
                </motion.p>
              )}
            </AnimatePresence>
            <div className={`h-9 rounded-[10px] flex items-center justify-center gap-1.5 text-[12px] font-bold transition-colors duration-200 ${sent ? "bg-white/10 text-[#99E58C]" : "bg-[#99E58C] text-[#0C1A0D]"}`}>
              {sent ? <><Check className="w-3.5 h-3.5" /> Sent</> : "Finish job"}
            </div>
          </div>
        </div>
      </div>

      <I d={glyph.arrow} className={`hidden sm:block w-4 h-4 shrink-0 transition-colors duration-300 ${step >= 7 ? "text-heading" : "text-line-strong"}`} />

      {/* office */}
      <motion.div
        initial={false}
        animate={{ opacity: step >= 7 ? 1 : 0.4 }}
        transition={{ duration: 0.45, ease }}
        className={`w-[142px] sm:w-[196px] shrink-0 rounded-lg bg-paper border border-line ${lift} text-[12px] overflow-hidden`}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-line">
          <Avatar n="NO" />
          <span className="min-w-0">
            <span className="block font-semibold text-heading leading-tight">Office</span>
            <span className="block text-[10px] text-muted leading-tight">{step >= 7 ? "Job 0418 arrived · just now" : "Waiting for job 0418"}</span>
          </span>
        </div>
        <div className="px-3 py-1">
          {["Photo attached", "Door seal × 1 from stock", "Signed by the customer", "1.5 h on site"].map((t) => (
            <p key={t} className="flex items-center gap-2 py-1.5 border-b border-line last:border-0 text-body text-[11px]">
              <Check className={`w-3.5 h-3.5 shrink-0 ${step >= 7 ? "text-ok" : "text-faint"}`} />{t}
            </p>
          ))}
        </div>
        <div className="px-3 py-2.5 bg-soft border-t border-line flex items-center justify-between">
          <span className="text-[10px] text-muted">Status</span>
          <Pill tone={step >= 7 ? "ok" : "wait"}>{step >= 7 ? "Ready to invoice" : "On site"}</Pill>
        </div>
      </motion.div>

      <I d={glyph.arrow} className={`hidden md:block w-4 h-4 shrink-0 transition-colors duration-300 ${step >= 8 ? "text-heading" : "text-line-strong"}`} />

      {/* invoice draft */}
      <motion.div
        initial={false}
        animate={step >= 8 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.45, ease }}
        className={`hidden md:block w-[184px] shrink-0 rounded-lg bg-paper border border-line ${lift} text-[11px] overflow-hidden`}
      >
        <div className="px-3 py-2.5 border-b border-line flex items-center justify-between">
          <span className="font-semibold text-heading">Invoice draft</span>
          <span className="text-[10px] text-muted tabular-nums">INV-0193</span>
        </div>
        <div className="px-3 py-2 tabular-nums">
          {[["Door seal × 1", "640.00"], ["Labour · 1.5 h", "780.00"], ["Tax", "213.00"]].map(([k, v]) => (
            <p key={k} className="flex justify-between py-1 text-body"><span>{k}</span><span>{v}</span></p>
          ))}
          <p className="flex justify-between pt-1.5 mt-0.5 border-t border-line font-semibold text-heading"><span>Total</span><span>1,633.00</span></p>
        </div>
        <p className="px-3 py-2 bg-soft border-t border-line text-[10px] text-muted">Built from the job. Nothing retyped.</p>
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------- 3. Reports */

function ReportScreen({ reduce }: ScreenProps) {
  const done = [6, 8, 7, 9, 8, 10, 7, 9];
  const invoiced = done.map((w, i) => (i === 5 ? w - 2 : w));
  const max = 10;
  const owed = [
    ["Kaya Building", "7,300.00", 100],
    ["Hill & Co", "4,120.00", 56],
    ["Greenway Café", "1,633.00", 22],
    ["Mara’s Bakery", "1,180.00", 16],
  ] as const;
  const d = (i: number) => (reduce ? 0 : i);

  return (
    <div className="h-full p-4 sm:p-5 text-[12px] flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <p className="text-[15px] font-semibold text-heading mr-auto">Reports</p>
        <span className="inline-flex items-center gap-1.5 h-7 rounded-[6px] border border-line bg-paper px-2 text-[11px] text-heading"><I d={glyph.calendar} className="w-3.5 h-3.5 text-muted" />Last 8 weeks</span>
        <span className="hidden sm:inline-flex items-center gap-1.5 h-7 rounded-[6px] border border-line bg-paper px-2 text-[11px] text-heading"><I d={glyph.download} className="w-3.5 h-3.5 text-muted" />Export</span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { k: "Jobs done", v: "64" },
          { k: "Invoiced", v: "62" },
          { k: "Not yet invoiced", v: "2", hold: true },
        ].map((s, i) => (
          <motion.div key={s.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: d(i * 0.08) }} className={`rounded-lg border px-3 py-2.5 ${s.hold ? "border-hold/30 bg-hold-bg" : "border-line bg-paper"}`}>
            <p className={`text-[10.5px] sm:text-[11px] leading-tight ${s.hold ? "text-hold" : "text-muted"}`}>{s.k}</p>
            <p className={`font-display text-[22px] sm:text-[26px] leading-none mt-1.5 tabular-nums ${s.hold ? "text-hold" : "text-heading"}`}>{s.v}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[1.55fr_1fr] gap-3">
        <div className="rounded-lg border border-line bg-paper p-3.5 flex flex-col min-h-0">
          <div className="flex items-start justify-between mb-2">
            <p className="font-semibold text-heading">Done vs invoiced, by week</p>
            <span className="flex gap-3 text-[10.5px] text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-[2px] bg-heading" />Done</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-[2px] bg-line-strong" />Invoiced</span>
            </span>
          </div>
          <div className="flex-1 relative min-h-[112px]">
            {[0, 1, 2, 3].map((g) => <span key={g} className="absolute left-0 right-0 border-t border-line" style={{ top: `${g * 33.33}%` }} />)}
            <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-3 border-b border-line-strong">
              {done.map((w, i) => (
                <div key={i} className="flex-1 h-full flex items-end justify-center gap-[3px]">
                  <motion.span initial={{ height: 0 }} animate={{ height: `${(w / max) * 100}%` }} transition={{ delay: d(0.15 + i * 0.05), duration: 0.6, ease }} className="w-2.5 sm:w-3.5 rounded-t-[2px] bg-heading" />
                  <motion.span initial={{ height: 0 }} animate={{ height: `${(invoiced[i] / max) * 100}%` }} transition={{ delay: d(0.2 + i * 0.05), duration: 0.6, ease }} className={`w-2.5 sm:w-3.5 rounded-t-[2px] ${i === 5 ? "bg-hold/70" : "bg-line-strong"}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-1.5 sm:gap-3 text-[9.5px] text-faint mt-1 tabular-nums">
            {done.map((_, i) => <span key={i} className="flex-1 text-center">W{i + 1}</span>)}
          </div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: d(1) }} className="mt-2 rounded-[6px] bg-hold-bg text-hold font-semibold text-[11px] px-2.5 py-1.5 w-fit">
            Week 6: two jobs were done but never invoiced
          </motion.p>
        </div>

        <div className="hidden md:flex rounded-lg border border-line bg-paper p-3.5 flex-col">
          <p className="font-semibold text-heading">Waiting to be paid</p>
          <p className="text-[10.5px] text-muted mb-2">By customer</p>
          <div className="flex flex-col gap-2.5">
            {owed.map(([who, amt, pct], i) => (
              <div key={who}>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-heading">{who}</span><span className="tabular-nums text-body">{amt}</span></div>
                <div className="h-[5px] rounded-[3px] bg-canvas overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: d(0.3 + i * 0.08), duration: 0.7, ease }} className="h-full rounded-[3px] bg-heading" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-auto pt-3 border-t border-line flex justify-between text-[11px] font-semibold text-heading tabular-nums"><span>Total owed</span><span>14,233.00</span></p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 4. Website */

function WebScreen({ reduce }: ScreenProps) {
  const msg = "Lunch for 24 at our office, next Thursday.";
  const [typedLater, setTyped] = useState(0);
  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= msg.length + 30) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, [reduce, msg.length]);
  const typed = reduce ? msg.length + 30 : typedLater;
  const sent = typed > msg.length + 8;

  const existing = [
    ["Hill & Co", "Office lunch, Fri", "Booked", "ok"],
    ["Jordan K.", "Birthday, table of 6", "Booked", "ok"],
    ["Oakline Joinery", "Breakfast meeting", "Quote sent", "wait"],
  ] as const;

  return (
    <div className="relative h-full flex flex-col p-3 sm:p-5 bg-canvas text-[11px]">
      {/* The business's own website */}
      <div className={`relative flex-1 min-h-0 sm:absolute sm:left-5 sm:top-5 sm:bottom-5 sm:right-[216px] rounded-lg border border-line bg-paper overflow-hidden ${lift} flex flex-col`}>
        <div className="h-7 flex items-center gap-2 px-2.5 border-b border-line bg-soft shrink-0 text-faint">
          <I d={glyph.back} className="w-3 h-3" />
          <I d={glyph.chevron} className="w-3 h-3" />
          <span className="mx-auto w-[52%] h-[18px] rounded-[4px] bg-paper border border-line text-[9px] text-muted flex items-center justify-center gap-1"><I d={glyph.lock} className="w-2.5 h-2.5" />greenwaycafe.com</span>
          <span className="w-6" />
        </div>
        <div className="flex items-center justify-between px-4 sm:px-5 h-9 sm:h-10 border-b border-line shrink-0">
          <span className="font-display uppercase text-[12px] tracking-[-0.01em] text-heading">Greenway Café</span>
          <span className="hidden md:flex gap-4 text-muted"><span>Menu</span><span>Catering</span><span>Find us</span></span>
          <span className="rounded-[5px] bg-heading text-white px-2.5 py-1 font-semibold">Book a table</span>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 grid-rows-[auto_minmax(0,1fr)] md:grid-rows-1 md:grid-cols-[1fr_1.1fr] gap-2.5 md:gap-5 px-4 sm:px-5 pt-2.5 sm:pt-4 pb-2.5 sm:pb-3 overflow-hidden">
          <div className="flex flex-col min-h-0">
            <p className="font-display uppercase text-[18px] sm:text-[22px] leading-[0.98] tracking-[-0.02em] text-heading">Breakfast, lunch and good coffee.<span className="hidden sm:inline"> Seven days.</span></p>
            <p className="text-muted mt-2 leading-[1.5] max-w-[250px] hidden sm:block">Everything made in our kitchen from 7am. Catering for offices, events and the odd birthday.</p>
            <div className="flex gap-1.5 mt-2.5 sm:mt-3">
              <span className="rounded-[5px] bg-heading text-white px-3 py-1.5 font-semibold">Book a table</span>
              <span className="rounded-[5px] border border-line px-3 py-1.5 font-semibold text-heading">See the menu</span>
            </div>
            <div className="hidden md:flex mt-auto gap-3 border-t border-line pt-3 text-[10px] text-body">
              {[[glyph.clock, "7am daily"], [glyph.people, "Catering"], [glyph.leaf, "Baked here"]].map(([d, t]) => (
                <span key={t} className="flex items-center gap-1.5 whitespace-nowrap"><I d={d} className="w-3.5 h-3.5 text-muted shrink-0" />{t}</span>
              ))}
            </div>
          </div>
          <div className="relative rounded-[8px] overflow-hidden min-h-[48px] border border-line">
            <Image src={PHOTO} alt="The counter at Greenway Café: pastries, sandwiches and two flat whites" fill sizes="(max-width: 768px) 320px, 360px" className="object-cover object-[50%_78%]" />
            <span className="absolute left-2 bottom-2 hidden sm:flex items-center gap-1.5 rounded-[5px] bg-paper/95 border border-line px-2 py-1 text-[10px] text-heading">
              <I d={glyph.coffee} className="w-3 h-3 text-muted" />Today’s lunch · roast veg &amp; halloumi
            </span>
          </div>
        </div>

        {/* enquiry strip */}
        <div className="border-t border-line bg-soft px-4 sm:px-5 py-2 sm:py-3 flex items-end gap-2 shrink-0">
          <div className="flex-1 min-w-0">
            <p className="hidden sm:block text-[9.5px] text-muted mb-1">Catering enquiry · tell us about your event</p>
            <div className="h-7 rounded-[5px] border border-line bg-paper px-2 flex items-center text-heading truncate">
              {msg.slice(0, typed)}
              {typed < msg.length && <span className="inline-block w-px h-3 bg-heading ml-px animate-pulse" />}
            </div>
          </div>
          <span className={`h-7 inline-flex items-center px-3 rounded-[5px] font-bold transition-colors duration-200 ${sent ? "bg-ok-bg text-ok" : "bg-heading text-white"}`}>
            {sent ? "Sent" : "Send"}
          </span>
        </div>
      </div>

      {/* …and the enquiry lands in the business's own system */}
      <div className={`mt-3 sm:mt-0 shrink-0 sm:absolute sm:right-5 sm:top-5 sm:bottom-5 sm:w-[184px] flex flex-col rounded-lg border border-line bg-paper ${lift} overflow-hidden`}>
        <div className="px-3 py-2 sm:py-2.5 border-b border-line flex items-center gap-2">
          <span className="min-w-0 mr-auto">
            <span className="block font-semibold text-heading leading-tight">Your system</span>
            <span className="block text-[10px] text-muted leading-tight">Enquiries</span>
          </span>
          <span className="relative text-muted">
            <I d={glyph.bell} className="w-3.5 h-3.5" />
            {sent && <span className="absolute -top-1 -right-1.5 min-w-[13px] h-[13px] px-0.5 rounded-[3px] bg-heading text-white text-[8px] font-bold flex items-center justify-center">1</span>}
          </span>
        </div>
        <div className="p-2 flex sm:flex-col gap-1.5 overflow-hidden">
          <AnimatePresence>
            {sent && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="shrink-0 w-[168px] sm:w-auto">
                <div className="rounded-[6px] border border-ok/30 bg-ok-bg p-2">
                  <p className="flex items-center justify-between font-semibold text-ok">New <span className="text-[9px] font-normal">just now</span></p>
                  <p className="text-heading mt-0.5 leading-snug">Office lunch for 24 · Thu</p>
                  <p className="hidden sm:block text-[9.5px] text-body mt-1">For Sam · reply drafted</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {existing.map(([who, what, st, tone], i) => (
            <div key={who} className={`shrink-0 w-[150px] sm:w-auto rounded-[6px] border border-line p-2 ${i > 0 ? "hidden sm:block" : ""}`}>
              <p className="text-heading font-medium leading-tight truncate">{who}</p>
              <p className="text-[10px] text-muted leading-tight mb-1.5 truncate">{what}</p>
              <Pill tone={tone}>{st}</Pill>
            </div>
          ))}
        </div>
        <p className="hidden sm:block mt-auto px-3 py-2 border-t border-line text-[9.5px] text-muted">No inbox to check. Nothing retyped.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- section */

const tabs = [
  { title: "Admin systems", desc: "One place where every job, order or booking lives, from the first call to the paid invoice.", path: "Jobs", screen: AdminScreen },
  { title: "Field apps", desc: "Your people finish the job on their phone, photo and signature included. It works without signal and sends itself later.", path: "Field app", screen: FieldScreen },
  { title: "Reporting", desc: "What you did next to what you billed, without anyone building the report.", path: "Reports", screen: ReportScreen },
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
  const prefersReduce = useReducedMotion();
  // Server and first client render are identical; the reduced-motion shortcut applies only after mount.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const reduce = !!prefersReduce && mounted;
  const running = auto && !paused && inView && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % tabs.length), DURATION);
    return () => clearTimeout(id);
  }, [running, active]);

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

        <div ref={ref} className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[340px_minmax(0,1fr)] gap-6 lg:gap-10 items-start" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="relative min-w-0">
            <div
              ref={stripRef}
              onScroll={onStripScroll}
              role="tablist"
              aria-label="What we build"
              className="min-w-0 flex lg:flex-col gap-2 overflow-x-auto snap-x snap-mandatory lg:snap-none -mx-5 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {tabs.map((t, i) => {
                const on = i === active;
                return (
                  <button
                    key={t.title}
                    role="tab"
                    aria-selected={on}
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
