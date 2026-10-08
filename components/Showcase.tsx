"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Container, H2, Lede } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;
const DURATION = 7000;

/* ---------------------------------------------------------------- screens */

function Pill({ tone, children }: { tone: "ok" | "wait" | "hold" | "done"; children: React.ReactNode }) {
  const t = { ok: "bg-ok-bg text-ok", wait: "bg-[#f0f0f0] text-body", hold: "bg-hold-bg text-hold", done: "bg-carbon text-white" }[tone];
  return <span className={`inline-flex px-1.5 py-0.5 rounded-[4px] text-[11px] font-semibold whitespace-nowrap ${t}`}>{children}</span>;
}

function AdminScreen() {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setFlipped(true), 1600);
    return () => clearTimeout(id);
  }, []);
  const rows = [
    { job: "1043", who: "Kaya Building", tone: "wait" as const, status: "Quote sent", owner: "SN" },
    { job: "1042", who: "Ridge Farms", tone: "ok" as const, status: "Ready to invoice", owner: "TM" },
    { job: "1041", who: "Northline Supply", tone: flipped ? ("ok" as const) : ("wait" as const), status: flipped ? "Ready to invoice" : "Waiting on signature", owner: "LK" },
    { job: "1040", who: "Harbour Foods", tone: "done" as const, status: "Invoiced", owner: "TM" },
    { job: "1039", who: "Oakline Joinery", tone: "hold" as const, status: "Needs a look", owner: "SN" },
    { job: "1038", who: "Kaya Building", tone: "done" as const, status: "Invoiced", owner: "LK" },
  ];
  return (
    <div className="h-full flex text-[12px]">
      <aside className="hidden sm:flex w-[150px] flex-col gap-1 border-r border-line bg-soft p-3">
        {["Jobs", "Customers", "Invoices", "Reports", "Settings"].map((n, i) => (
          <span key={n} className={`px-2.5 py-1.5 rounded-[6px] ${i === 0 ? "bg-paper border border-line font-semibold text-heading" : "text-muted"}`}>{n}</span>
        ))}
      </aside>
      <div className="flex-1 min-w-0 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[15px] font-semibold text-heading">Jobs</p>
          <span className="rounded-[6px] bg-carbon text-white px-2.5 py-1 text-[11px] font-semibold">New job</span>
        </div>
        <div className="flex gap-1.5 mb-3">
          {["All 24", "Needs a look 1", "Ready to invoice 3"].map((f, i) => (
            <span key={f} className={`px-2 py-1 rounded-[6px] border text-[11px] ${i === 0 ? "border-heading text-heading" : "border-line text-muted"}`}>{f}</span>
          ))}
        </div>
        <div className="rounded-lg border border-line overflow-hidden bg-paper">
          <div className="grid grid-cols-[56px_1fr_auto] gap-3 px-3 py-2 bg-soft border-b border-line text-[11px] text-muted">
            <span>Job</span><span>Customer</span><span>Status</span>
          </div>
          {rows.map((r, i) => (
            <motion.div
              key={r.job}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, backgroundColor: r.job === "1041" && flipped ? ["#EAF8E6", "#FFFFFF"] : "#FFFFFF" }}
              transition={{ delay: i * 0.06, duration: 0.4, backgroundColor: { duration: 1.4 } }}
              className="grid grid-cols-[56px_1fr_auto] gap-3 items-center px-3 py-2.5 border-b border-line last:border-0"
            >
              <span className="text-heading font-medium tabular-nums">{r.job}</span>
              <span className="text-body truncate">{r.who}</span>
              <Pill tone={r.tone}>{r.status}</Pill>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FieldScreen() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const ids = [700, 1400, 2100, 3000, 4200].map((ms, i) => setTimeout(() => setStep(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, []);
  const items = ["Photo of delivery note", "Odometer reading", "Customer signature"];
  return (
    <div className="h-full flex items-center justify-center gap-6 sm:gap-10 p-5 bg-[linear-gradient(180deg,#FAFAFA,#F3F4F6)]">
      <div className="w-[210px] rounded-[26px] bg-carbon p-2 shadow-[0_24px_48px_-20px_rgba(16,24,40,0.5)]">
        <div className="rounded-[20px] bg-[#141414] px-4 pt-4 pb-4 min-h-[330px] flex flex-col">
          <div className="flex justify-between text-[10px] text-white/50 mb-4"><span>09:41</span><span>{step >= 4 ? "Signal" : "No signal"}</span></div>
          <p className="text-[15px] font-semibold text-white">Drop-off</p>
          <p className="text-[11px] text-white/50 mb-4">Stop 3 of 5 · Ridge Farms</p>
          <div className="flex flex-col gap-3">
            {items.map((it, i) => {
              const done = step > i;
              return (
                <div key={it} className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-[5px] flex items-center justify-center transition-colors duration-200 ${done ? "bg-green text-[#0C1A0D]" : "border border-white/30"}`}>
                    {done && <Check className="w-3 h-3" />}
                  </span>
                  <span className={`text-[12px] ${done ? "text-white" : "text-white/55"}`}>{it}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-auto pt-4">
            <AnimatePresence mode="wait">
              {step >= 3 && step < 4 && (
                <motion.p key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[8px] bg-white/10 text-[10px] text-white/70 px-2.5 py-2 mb-2">
                  No signal. Saved on this phone, it’ll send itself.
                </motion.p>
              )}
            </AnimatePresence>
            <div className={`h-9 rounded-[10px] flex items-center justify-center gap-1.5 text-[12px] font-bold transition-colors duration-200 ${step >= 4 ? "bg-white/10 text-[#99E58C]" : "bg-green text-[#0C1A0D]"}`}>
              {step >= 4 ? <><Check className="w-3.5 h-3.5" /> Sent</> : "Submit"}
            </div>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={step >= 5 ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
        transition={{ duration: 0.45, ease }}
        className="hidden sm:block w-[220px] rounded-lg bg-paper border border-line shadow-[0_12px_32px_-12px_rgba(16,24,40,0.25)] p-4 text-[12px]"
      >
        <p className="text-muted mb-1">Office</p>
        <p className="font-semibold text-heading mb-3">Drop-off received</p>
        {["3 items complete", "Signature attached", "Added to Ridge Farms"].map((t) => (
          <p key={t} className="flex items-center gap-2 py-1.5 border-t border-line text-body"><Check className="w-3.5 h-3.5 text-ok" />{t}</p>
        ))}
      </motion.div>
    </div>
  );
}

function ReportScreen() {
  const weeks = [62, 70, 66, 78, 74, 81, 69, 76];
  const billed = weeks.map((w, i) => (i === 5 ? w - 9 : w));
  return (
    <div className="h-full p-4 sm:p-6 text-[12px] flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { k: "Delivered", v: "576" },
          { k: "Invoiced", v: "574" },
          { k: "Not invoiced", v: "2", hold: true },
        ].map((s, i) => (
          <motion.div key={s.k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`rounded-lg border p-3 ${s.hold ? "border-hold/30 bg-hold-bg" : "border-line bg-paper"}`}>
            <p className={s.hold ? "text-hold" : "text-muted"}>{s.k}</p>
            <p className={`font-display text-[24px] sm:text-[28px] leading-none mt-2 tabular-nums ${s.hold ? "text-hold" : "text-heading"}`}>{s.v}</p>
          </motion.div>
        ))}
      </div>
      <div className="flex-1 rounded-lg border border-line bg-paper p-4 flex flex-col">
        <div className="flex justify-between mb-3">
          <p className="font-semibold text-heading">Delivered vs billed · last 8 weeks</p>
          <span className="hidden sm:flex gap-3 text-[11px] text-muted">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-[2px] bg-heading" />Delivered</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-[2px] bg-line-strong" />Billed</span>
          </span>
        </div>
        <div className="flex-1 flex items-end gap-2 sm:gap-4 border-b border-line min-h-[120px]">
          {weeks.map((w, i) => (
            <div key={i} className="flex-1 h-full flex items-end justify-center gap-1">
              <motion.span initial={{ height: 0 }} animate={{ height: `${w}%` }} transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease }} className="w-2.5 sm:w-3.5 rounded-t-[2px] bg-heading" />
              <motion.span initial={{ height: 0 }} animate={{ height: `${billed[i]}%` }} transition={{ delay: 0.25 + i * 0.05, duration: 0.6, ease }} className={`w-2.5 sm:w-3.5 rounded-t-[2px] ${i === 5 ? "bg-hold/70" : "bg-line-strong"}`} />
            </div>
          ))}
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-3 rounded-[6px] bg-hold-bg text-hold font-semibold px-2.5 py-1.5 w-fit">
          Week 6: two deliveries were never invoiced
        </motion.p>
      </div>
    </div>
  );
}

/* Smooth line through points (Catmull-Rom → Bézier) for the example site's chart. */
function smooth(pts: [number, number][]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const CHART: [number, number][] = [62, 58, 66, 61, 70, 68, 74, 72, 80, 78, 86, 92].map((v, i) => [i * (300 / 11), 110 - v]);
const LINE = smooth(CHART);
const AREA = `${LINE} L 300 110 L 0 110 Z`;

function WebScreen() {
  const msg = "Weekly collections from two depots, starting next month.";
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= msg.length + 30) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, []);
  const sent = typed > msg.length + 8;

  return (
    <div className="relative h-full p-4 sm:p-5 bg-[linear-gradient(180deg,#FAFAFA,#F3F4F6)] text-[11px]">
      {/* Example client website */}
      <div className="absolute left-4 sm:left-5 top-4 sm:top-5 right-4 sm:right-[204px] bottom-4 sm:bottom-5 rounded-lg border border-line bg-paper overflow-hidden shadow-[0_20px_40px_-24px_rgba(16,24,40,0.35)] flex flex-col">
        <div className="h-7 flex items-center px-3 border-b border-line bg-soft flex-shrink-0">
          <span className="mx-auto w-[46%] h-4 rounded-[4px] bg-paper border border-line text-[9px] text-faint flex items-center justify-center">kestrelhaulage.com</span>
        </div>
        <div className="flex items-center justify-between px-5 h-11 border-b border-line flex-shrink-0">
          <span className="font-display uppercase text-[13px] tracking-[-0.01em] text-heading">Kestrel</span>
          <span className="hidden md:flex gap-5 text-muted">
            <span>Services</span><span>Fleet</span><span>Track a load</span><span>Contact</span>
          </span>
          <span className="rounded-[5px] bg-heading text-white px-2.5 py-1 font-semibold">Get a quote</span>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr] gap-5 px-5 pt-4">
          <div className="flex flex-col">
            <p className="font-display uppercase text-[20px] sm:text-[22px] leading-[0.98] tracking-[-0.02em] text-heading">Freight that turns up on time.</p>
            <p className="text-muted mt-2.5 leading-[1.5] max-w-[240px]">Timber, bulk and general freight, tracked from pickup to drop-off.</p>
            <div className="flex gap-1.5 mt-4">
              <span className="rounded-[5px] bg-heading text-white px-3 py-1.5 font-semibold">Get a quote</span>
              <span className="rounded-[5px] border border-line px-3 py-1.5 font-semibold text-heading">Track a load</span>
            </div>
            <div className="mt-auto mb-3 grid grid-cols-3 border-t border-line pt-2.5">
              {[["48", "trucks"], ["24/7", "tracking"], ["2009", "founded"]].map(([v, k]) => (
                <div key={k}>
                  <p className="font-display text-[15px] text-heading leading-none">{v}</p>
                  <p className="text-[9px] text-muted mt-1">{k}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Live performance module instead of a stock photo */}
          <div className="hidden md:flex flex-col gap-2.5 mb-3">
            <div className="flex-1 rounded-[8px] border border-line bg-[linear-gradient(180deg,#FFFFFF,#F7FAF7)] p-3 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] text-muted">On-time deliveries</p>
                  <p className="font-display text-[22px] leading-none text-heading mt-1 tabular-nums">97.2%</p>
                </div>
                <p className="text-[9px] font-semibold text-ok bg-ok-bg rounded-[4px] px-1.5 py-0.5">+4.1 this year</p>
              </div>
              <svg viewBox="0 0 300 110" preserveAspectRatio="none" className="w-full flex-1 mt-2 overflow-visible" aria-hidden>
                <defs>
                  <linearGradient id="webArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1D6B2B" stopOpacity="0.18" />
                    <stop offset="1" stopColor="#1D6B2B" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[27, 55, 83].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#EEF0F2" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
                <motion.path d={AREA} fill="url(#webArea)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }} />
                <motion.path d={LINE} fill="none" stroke="#1D6B2B" strokeWidth="2" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease }} />
              </svg>
              <div className="flex justify-between text-[8px] text-faint mt-1"><span>Nov</span><span>Feb</span><span>May</span><span>Aug</span><span>Oct</span></div>
            </div>
            <div className="rounded-[8px] border border-line bg-paper p-3">
              <div className="flex justify-between mb-2">
                <p className="text-heading font-semibold">Load 2417 <span className="font-normal text-muted">· Depot 3 → Northline</span></p>
                <p className="text-muted">ETA 14:20</p>
              </div>
              <div className="h-[5px] rounded-[3px] bg-[#EEF0F2] overflow-hidden">
                <motion.div className="h-full bg-heading rounded-[3px]" initial={{ width: "8%" }} animate={{ width: "72%" }} transition={{ duration: 2.4, ease }} />
              </div>
            </div>
          </div>
        </div>

        {/* quote form strip */}
        <div className="border-t border-line bg-soft px-5 py-3 flex items-end gap-2 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-muted mb-1">Tell us what you need moved</p>
            <div className="h-7 rounded-[5px] border border-line bg-paper px-2 flex items-center text-heading truncate">
              {msg.slice(0, typed)}
              {typed < msg.length && <span className="inline-block w-px h-3 bg-heading ml-px animate-pulse" />}
            </div>
          </div>
          <span className={`h-7 inline-flex items-center px-3 rounded-[5px] font-bold transition-colors duration-200 ${sent ? "bg-ok-bg text-ok" : "bg-heading text-white"}`}>
            {sent ? "Sent" : "Request quote"}
          </span>
        </div>
      </div>

      {/* The enquiry lands in the business's own system */}
      <div className="hidden sm:flex absolute right-5 top-5 bottom-5 w-[172px] flex-col rounded-lg border border-line bg-paper shadow-[0_20px_40px_-24px_rgba(16,24,40,0.35)] overflow-hidden">
        <div className="px-3 py-2.5 border-b border-line">
          <p className="font-semibold text-heading">Your system</p>
          <p className="text-[10px] text-muted">Enquiries</p>
        </div>
        <div className="p-2 flex flex-col gap-1.5">
          <AnimatePresence>
            {sent && (
              <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} transition={{ duration: 0.4, ease }} className="overflow-hidden">
                <div className="rounded-[6px] border border-[#1D6B2B]/30 bg-ok-bg p-2">
                  <p className="flex items-center justify-between font-semibold text-ok">New <span className="text-[9px] font-normal">just now</span></p>
                  <p className="text-heading mt-0.5 leading-snug">Weekly collections · 2 depots</p>
                  <p className="text-[9px] text-body mt-1">Assigned to Thabo · reply drafted</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {[
            ["Ridge Farms", "Quote sent", "wait"],
            ["Kaya Building", "Booked", "ok"],
            ["Harbour Foods", "Booked", "ok"],
          ].map(([who, st, tone]) => (
            <div key={who} className="rounded-[6px] border border-line p-2">
              <p className="text-heading font-medium mb-1">{who}</p>
              <Pill tone={tone as "ok" | "wait"}>{st}</Pill>
            </div>
          ))}
        </div>
        <p className="mt-auto px-3 py-2 border-t border-line text-[9px] text-muted">No inbox to check. Nothing retyped.</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- section */

const tabs = [
  { title: "Admin systems", desc: "One place where every job, order or booking lives, from the first call to the paid invoice.", path: "Jobs", screen: AdminScreen },
  { title: "Driver & field apps", desc: "Your people send the job in from their phone. It works without signal and sends itself later.", path: "Field app", screen: FieldScreen },
  { title: "Reporting", desc: "What you delivered next to what you billed, without anyone building the report.", path: "Reports", screen: ReportScreen },
  { title: "Websites", desc: "Sites that look as good as your work, with enquiries that land straight in your system.", path: "Website", screen: WebScreen },
];

export function Showcase() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const running = auto && !paused && inView && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % tabs.length), DURATION);
    return () => clearTimeout(id);
  }, [running, active]);

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
          <div role="tablist" aria-label="What we build" className="min-w-0 flex lg:flex-col gap-2 overflow-x-auto -mx-5 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [scrollbar-width:none]">
            {tabs.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.title}
                  role="tab"
                  aria-selected={on}
                  onClick={() => { setActive(i); setAuto(false); }}
                  className={`relative text-left rounded-lg border px-4 py-3.5 lg:px-5 lg:py-4 transition-colors duration-150 cursor-pointer flex-shrink-0 overflow-hidden ${
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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease }}
                    className="h-full"
                  >
                    <Screen />
                  </motion.div>
                </AnimatePresence>
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
