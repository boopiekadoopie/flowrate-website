"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { DeliveryNote } from "@/components/HeroStage";
import { Check } from "@/components/ui";

/*
 * Playground 1: the driver app we built for a logistics company, rebuilt as a safe demo.
 * Same flow as the real app (truck type -> truck, driver, date -> load documents + seals -> submit,
 * and it saves on the phone when there is no signal), with a made-up company and made-up data.
 * Nothing here talks to a server: every tap only changes local state, and Reset starts over.
 *
 * Motion (motion-design-system): one curve family (entrances [0.22,1,0.36,1]); the next thing to tap
 * gets a plain outline (no pulsing rings); steps list = focus by dimming; office rows arrive with a
 * short drop and settle; "Watch it run" plays the same flow on its own for people who just scroll.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const TRUCKS = { Tipper: ["TIP 04", "TIP 07", "TIP 11"], Tanker: ["TNK 02", "TNK 05", "TNK 09"] } as const;
const DRIVERS = ["Sam M.", "Lee K.", "Ana P."];
type Kind = keyof typeof TRUCKS;
type Stage = "arrived" | "checked" | "invoiced";
type Load = { id: number; kind: Kind; truck: string; driver: string; docs: number; seals: number; stage: Stage; fresh?: boolean };

const SEED: Load[] = [
  { id: 2416, kind: "Tanker", truck: "TNK 05", driver: "Ana P.", docs: 2, seals: 2, stage: "invoiced" },
  { id: 2415, kind: "Tipper", truck: "TIP 07", driver: "Lee K.", docs: 1, seals: 0, stage: "invoiced" },
];

type Step = "type" | "truck" | "driver" | "docs" | "submit" | "done";
const STEPS: { key: Step; label: string; hint: string }[] = [
  { key: "type", label: "Pick the truck type", hint: "Tap Tipper or Tanker" },
  { key: "truck", label: "Choose the truck", hint: "Pick a truck from the list" },
  { key: "driver", label: "Choose the driver", hint: "Pick who's driving" },
  { key: "docs", label: "Add the load documents", hint: "Tap Load documents to take a photo" },
  { key: "submit", label: "Submit the load", hint: "Tap Submit load" },
];

/* ------------------------------------------------------------------ small pieces */
function Hl({ on, children, className = "" }: { on: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[14px] transition-shadow duration-300 ${on ? "shadow-[0_0_0_2.5px_#101828,0_0_0_6px_rgba(16,24,40,0.12)]" : ""} ${className}`}>
      {children}
    </div>
  );
}

function TruckIcon({ kind, className = "" }: { kind: Kind; className?: string }) {
  return kind === "Tipper" ? (
    <svg viewBox="0 0 40 20" className={className} aria-hidden><path d="M2 6h7v8H2zM10 3h26v11H10z" fill="currentColor" /><circle cx="7" cy="16" r="2.4" fill="currentColor" /><circle cx="27" cy="16" r="2.4" fill="currentColor" /><circle cx="33" cy="16" r="2.4" fill="currentColor" /></svg>
  ) : (
    <svg viewBox="0 0 40 20" className={className} aria-hidden><path d="M2 6h7v8H2z" fill="currentColor" /><rect x="11" y="3" width="26" height="10" rx="5" fill="currentColor" /><path d="M10 14h27" stroke="currentColor" strokeWidth="1.6" /><circle cx="7" cy="16" r="2.4" fill="currentColor" /><circle cx="27" cy="16" r="2.4" fill="currentColor" /><circle cx="33" cy="16" r="2.4" fill="currentColor" /></svg>
  );
}

function Bars({ on }: { on: boolean }) {
  return (
    <span className="flex items-end gap-[2px]" aria-label={on ? "Signal" : "No signal"}>
      {[4, 6, 8, 10].map((h, i) => (
        <span key={h} className={`w-[3px] rounded-[1px] ${on ? "bg-[#101828]" : i === 0 ? "bg-[#101828]/40" : "bg-[#101828]/15"}`} style={{ height: h }} />
      ))}
    </span>
  );
}

function StagePill({ stage }: { stage: Stage }) {
  const map: Record<Stage, [string, string]> = {
    arrived: ["Just arrived", "bg-[#E6EEFB] text-[#1E4FB8]"],
    checked: ["Checked", "bg-[#FEF3C7] text-[#92400E]"],
    invoiced: ["Invoice drafted", "bg-[#EAF8E6] text-[#1D6B2B]"],
  };
  const [t, c] = map[stage];
  return <span className={`inline-flex items-center rounded-full px-2.5 h-[24px] text-[12px] font-semibold whitespace-nowrap ${c}`}>{t}</span>;
}

function Select({ label, value, onChange, disabled, placeholder, options }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean; placeholder: string; options: readonly string[] }) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none w-full h-[40px] rounded-[10px] border border-[#D4D4D4] bg-white pl-3 pr-10 text-[14px] cursor-pointer disabled:opacity-50 disabled:cursor-default ${value ? "text-[#101828]" : "text-[#6A7282]"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <svg viewBox="0 0 16 16" className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5565] ${disabled ? "opacity-50" : ""}`} aria-hidden>
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ the playground */
export function DriverPlayground() {
  const [kind, setKind] = useState<Kind | null>(null);
  const [truck, setTruck] = useState("");
  const [driver, setDriver] = useState("");
  const [docs, setDocs] = useState(0);
  const [seals, setSeals] = useState(0);
  const [signal, setSignal] = useState(true);
  const [screen, setScreen] = useState<"form" | "sending" | "done">("form");
  const [queued, setQueued] = useState<Load[]>([]);
  const [office, setOffice] = useState<Load[]>(SEED);
  const [lastSaved, setLastSaved] = useState<"sent" | "saved">("sent");
  const [auto, setAuto] = useState(false);
  const [arrived, setArrived] = useState<number[] | null>(null);
  const nextId = useRef(2417);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const step: Step = screen === "done" ? "done" : !kind ? "type" : !truck ? "truck" : !driver ? "driver" : docs < 1 ? "docs" : "submit";
  const stepIdx = STEPS.findIndex((s) => s.key === step);

  /* the office side: a load lands, gets checked, then the invoice draft is made */
  const deliver = useCallback(
    (loads: Load[]) => {
      setOffice((o) => [...loads.map((l) => ({ ...l, stage: "arrived" as Stage, fresh: true })), ...o.map((l) => ({ ...l, fresh: false }))]);
      const ids = loads.map((l) => l.id);
      later(250, () => setArrived(ids));
      later(3200, () => setArrived((a) => (a === ids ? null : a)));
      later(1500, () => setOffice((o) => o.map((l) => (ids.includes(l.id) ? { ...l, stage: "checked" } : l))));
      later(3000, () => setOffice((o) => o.map((l) => (ids.includes(l.id) ? { ...l, stage: "invoiced" } : l))));
    },
    [later]
  );

  const submit = useCallback(() => {
    if (!kind || !truck || !driver || docs < 1) return;
    const load: Load = { id: nextId.current++, kind, truck, driver, docs, seals, stage: "arrived" };
    setScreen("sending");
    later(900, () => {
      setScreen("done");
      if (signal) {
        setLastSaved("sent");
        deliver([load]);
      } else {
        setLastSaved("saved");
        setQueued((q) => [...q, load]);
      }
    });
  }, [kind, truck, driver, docs, seals, signal, deliver, later]);

  /* signal comes back: anything saved on the phone goes to the office */
  useEffect(() => {
    if (signal && queued.length) {
      const send = queued;
      later(700, () => {
        setQueued([]);
        deliver(send);
      });
    }
  }, [signal, queued, deliver, later]);

  const newLoad = () => {
    setKind(null); setTruck(""); setDriver(""); setDocs(0); setSeals(0); setScreen("form");
  };
  const reset = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    newLoad(); setSignal(true); setQueued([]); setOffice(SEED); setAuto(false); setArrived(null); nextId.current = 2417;
  };

  /* "Watch it run": the same flow, tapped for you */
  const watch = () => {
    reset();
    setAuto(true);
    const seq: [number, () => void][] = [
      [700, () => setKind("Tanker")],
      [1500, () => setTruck("TNK 09")],
      [2300, () => setDriver("Sam M.")],
      [3200, () => setDocs(1)],
      [3800, () => setDocs(2)],
      [4500, () => setSeals(1)],
    ];
    seq.forEach(([ms, fn]) => later(ms, fn));
    later(5400, () => {
      const load: Load = { id: nextId.current++, kind: "Tanker", truck: "TNK 09", driver: "Sam M.", docs: 2, seals: 1, stage: "arrived" };
      setScreen("sending");
      later(900, () => { setScreen("done"); setLastSaved("sent"); deliver([load]); setAuto(false); });
    });
  };

  const fresh = office.find((l) => l.fresh);

  return (
    <div className="grid gap-10 lg:gap-8 lg:grid-cols-[300px_330px_minmax(0,1fr)] items-start">
      {/* ---------------- steps (focus by dimming) */}
      <div className="lg:pt-6">
        <ol className="space-y-1.5">
          {STEPS.map((s, i) => {
            const done = step === "done" || i < stepIdx;
            const now = s.key === step;
            return (
              <li key={s.key} className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${now ? "bg-paper ring-1 ring-line shadow-[0_1px_2px_rgba(16,24,40,0.05)]" : ""}`}>
                <span className={`mt-0.5 w-6 h-6 shrink-0 rounded-[7px] flex items-center justify-center text-[12px] font-bold ${done ? "bg-[#1D6B2B] text-white" : now ? "bg-heading text-paper" : "bg-line text-muted"}`}>
                  {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span>
                  <span className={`block text-[15px] font-semibold ${now || done ? "text-heading" : "text-muted"}`}>{s.label}</span>
                  {now && <span className="block text-[13px] text-body mt-0.5">{s.hint}</span>}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mt-6 rounded-xl border border-dashed border-line-strong px-4 py-3.5">
          <p className="text-[14px] font-semibold text-heading">Then try it with no signal</p>
          <p className="text-[13px] text-body mt-1 leading-relaxed">Switch the phone&apos;s signal off and submit another load. It waits on the phone, then sends itself when you switch signal back on.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <button type="button" onClick={watch} disabled={auto} className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-carbon text-white dark:bg-white dark:text-[#101828] text-[14px] font-bold disabled:opacity-50 cursor-pointer">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
            Watch it run
          </button>
          <button type="button" onClick={reset} className="h-11 px-5 rounded-lg border border-line-strong text-heading text-[14px] font-semibold cursor-pointer hover:bg-soft">
            Reset
          </button>
        </div>
      </div>

      {/* ---------------- the phone */}
      <div className="justify-self-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="text-[14px] font-semibold text-heading">Phone signal</span>
          <button
            type="button"
            role="switch"
            aria-checked={signal}
            onClick={() => setSignal((v) => !v)}
            className={`relative w-[52px] h-[30px] rounded-full transition-colors cursor-pointer ${signal ? "bg-heading" : "bg-line-strong"}`}
          >
            <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 32 }} className={`absolute top-[3px] w-6 h-6 rounded-full bg-paper shadow ${signal ? "right-[3px]" : "left-[3px]"}`} />
          </button>
          <span className="text-[13px] text-muted w-[30px]">{signal ? "On" : "Off"}</span>
        </div>

        <div className="relative w-[312px] h-[692px] rounded-[52px] p-[3px] [filter:drop-shadow(0_40px_50px_rgba(16,24,40,0.22))_drop-shadow(0_10px_16px_rgba(16,24,40,0.1))]" style={{ background: "linear-gradient(150deg,#4A4A4E 0%,#1C1C1F 28%,#232326 60%,#515156 100%)" }}>
          <div className="relative w-full h-full rounded-[49px] bg-[#070708] p-[8px]">
            <div className="relative w-full h-full rounded-[41px] bg-[#F4F4F2] overflow-hidden text-[#101828]" data-theme="light">
              {/* status bar */}
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[86px] h-[25px] rounded-full bg-black z-30" />
              <div className="relative z-20 h-[46px] flex items-center justify-between px-7 text-[13px] font-semibold">
                <span className="tabular-nums">9:41</span>
                <Bars on={signal} />
              </div>
              {/* app header */}
              <div className="bg-white border-b-[3px] border-[#101828] px-5 pb-3 pt-1 text-center">
                <p className="text-[15px] font-extrabold tracking-tight">Northline Transport</p>
                <p className="text-[10px] font-bold tracking-[0.14em] text-[#4A5565] mt-0.5">SUBMIT LOAD DOCUMENTS</p>
              </div>

              <div className="absolute inset-x-0 top-[104px] bottom-0 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {screen !== "done" ? (
                    <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: EASE }} className="h-full px-3.5 pt-3 pb-[78px] space-y-2.5 overflow-hidden">
                      {/* truck type */}
                      <div className="rounded-[16px] bg-white border border-[#E5E7EB] p-3">
                        <p className="text-[10px] font-bold tracking-[0.12em] text-[#4A5565] mb-2">WHICH TRUCK TYPE?</p>
                        <Hl on={step === "type" && !auto}>
                          <div className="grid grid-cols-2 gap-2">
                            {(Object.keys(TRUCKS) as Kind[]).map((k) => (
                              <button
                                key={k}
                                type="button"
                                onClick={() => { setKind(k); setTruck(""); }}
                                className={`h-[70px] rounded-[12px] border-2 flex flex-col items-center justify-center gap-1 text-[14px] font-bold cursor-pointer transition-colors ${kind === k ? "border-[#101828] bg-[#F3F4F6]" : "border-[#E5E7EB] bg-white"}`}
                              >
                                <TruckIcon kind={k} className={`w-9 h-[18px] ${kind === k ? "text-[#101828]" : "text-[#6A7282]"}`} />
                                {k}
                              </button>
                            ))}
                          </div>
                        </Hl>
                      </div>
                      {/* load details */}
                      <div className="rounded-[16px] bg-white border border-[#E5E7EB] p-3 space-y-2">
                        <p className="text-[10px] font-bold tracking-[0.12em] text-[#4A5565]">LOAD DETAILS</p>
                        <Hl on={step === "truck" && !auto}>
                          <Select label="Truck" value={truck} disabled={!kind} onChange={setTruck} placeholder="Select truck" options={kind ? TRUCKS[kind] : []} />
                        </Hl>
                        <Hl on={step === "driver" && !auto}>
                          <Select label="Driver" value={driver} onChange={setDriver} placeholder="Select driver" options={DRIVERS} />
                        </Hl>
                      </div>
                      {/* documents */}
                      <div className="rounded-[16px] bg-white border border-[#E5E7EB] p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold tracking-[0.12em] text-[#4A5565]">DOCUMENTS</p>
                          <p className="text-[11px] font-semibold text-[#4A5565]">{docs + seals ? `${docs + seals} added` : "Nothing added yet"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Hl on={step === "docs" && !auto}>
                            <button type="button" onClick={() => setDocs((d) => Math.min(3, d + 1))} className="w-full h-[78px] rounded-[12px] border-2 border-dashed border-[#D4D4D4] flex flex-col items-center justify-center gap-1 cursor-pointer">
                              <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#4A5565]" aria-hidden><path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
                              <span className="text-[12px] font-bold">Load documents</span>
                              
                            </button>
                          </Hl>
                          <button type="button" onClick={() => setSeals((s) => Math.min(3, s + 1))} className="w-full h-[78px] rounded-[12px] border-2 border-dashed border-[#D4D4D4] flex flex-col items-center justify-center gap-1 cursor-pointer">
                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#4A5565]" aria-hidden><path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
                            <span className="text-[12px] font-bold">Seals</span>
                            
                          </button>
                        </div>
                        <div className="flex gap-1.5 mt-2 h-[52px]">
                          <AnimatePresence>
                            {Array.from({ length: docs }, (_, i) => (
                              <motion.div key={`d${i}`} initial={{ opacity: 0, scale: 1.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="relative w-[40px] h-[52px] rounded-[6px] overflow-hidden ring-1 ring-[#E5E7EB]">
                                <DeliveryNote t={0} held={false} scanning={false} width={40} />
                                <span className="absolute right-[3px] bottom-[3px] w-[13px] h-[13px] rounded-[4px] bg-[#1D6B2B] text-white flex items-center justify-center"><Check className="w-2.5 h-2.5" /></span>
                              </motion.div>
                            ))}
                            {Array.from({ length: seals }, (_, i) => (
                              <motion.div key={`s${i}`} initial={{ opacity: 0, scale: 1.4 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="w-[40px] h-[52px] rounded-[6px] bg-[#EEF0F3] ring-1 ring-[#E5E7EB] flex flex-col items-center justify-center">
                                <span className="text-[9px] font-bold text-[#4A5565]">SEAL</span>
                                <span className="text-[10px] font-mono text-[#101828]">{["A3817", "A3818", "A3819"][i]}</span>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="done" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.35, ease: EASE }} className="h-full px-5 pt-10 text-center">
                      <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 380, damping: 18 }} className={`mx-auto w-[64px] h-[64px] rounded-[18px] flex items-center justify-center ${lastSaved === "sent" ? "bg-[#1D6B2B]" : "bg-[#92400E]"} text-white`}>
                        {lastSaved === "sent" ? <Check className="w-8 h-8" /> : <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden><path d="M12 4v10m0 0l-4-4m4 4l4-4M5 19h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </motion.span>
                      <p className="mt-5 text-[20px] font-extrabold">{lastSaved === "sent" ? "Load submitted" : "Saved on this phone"}</p>
                      <p className="mt-1.5 text-[13px] text-[#4A5565] leading-relaxed">
                        {lastSaved === "sent" ? "Sent to the office and saved." : "No signal right now. It will send itself as soon as the phone has signal again."}
                      </p>
                      <button type="button" onClick={newLoad} className="mt-6 h-[44px] px-6 rounded-[12px] border border-[#D4D4D4] bg-white text-[14px] font-bold cursor-pointer">Submit another load</button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* the load reached the office */}
                <AnimatePresence>
                  {arrived && (
                    <motion.div
                      key={arrived.join("-")}
                      initial={{ y: -24, opacity: 0, scale: 0.96 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -16, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      role="status"
                      className="absolute top-2 inset-x-3 z-20 rounded-[16px] bg-[#101828] text-white px-3.5 py-2.5 flex items-center gap-3 shadow-[0_12px_28px_rgba(16,24,40,0.35)]"
                    >
                      <span className="w-8 h-8 shrink-0 rounded-[10px] bg-[#1D6B2B] flex items-center justify-center"><Check className="w-4 h-4" /></span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-bold leading-tight">Arrived at the office</span>
                        <span className="block text-[11.5px] text-white/70 leading-tight mt-0.5">
                          {arrived.length === 1 ? `Load #${arrived[0]} is in their list` : `${arrived.length} loads are in their list`}
                        </span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* waiting-on-the-phone bar */}
                <AnimatePresence>
                  {queued.length > 0 && (
                    <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="absolute top-0 inset-x-0 z-10 bg-[#FEF3C7] text-[#92400E] text-[11.5px] font-semibold px-4 py-2 text-center">
                      Saved on this phone: {queued.length} {queued.length === 1 ? "load has" : "loads have"} not reached the office yet.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* submit bar */}
                {screen !== "done" && (
                  <div className="absolute bottom-0 inset-x-0 px-3.5 pb-4 pt-3 bg-[linear-gradient(to_top,#F4F4F2_70%,rgba(244,244,242,0))]">
                    <Hl on={step === "submit" && !auto}>
                      <button
                        type="button"
                        onClick={submit}
                        disabled={step !== "submit" || screen === "sending"}
                        className="relative w-full h-[50px] rounded-[14px] bg-[#101828] text-white text-[15px] font-extrabold overflow-hidden disabled:bg-[#101828]/35 cursor-pointer"
                      >
                        {screen === "sending" && <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, ease: "linear" }} className="absolute inset-0 origin-left bg-white/15" />}
                        <span className="relative">{screen === "sending" ? (signal ? "Sending…" : "Saving…") : "Submit load"}</span>
                      </button>
                    </Hl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- the office */}
      <div className="lg:pt-[46px] min-w-0">
        <div className="rounded-[20px] bg-white border border-[#E5E7EB] overflow-hidden text-[#101828] [filter:drop-shadow(0_30px_40px_rgba(16,24,40,0.12))]" data-theme="light">
          <div className="flex items-center justify-between px-5 h-[58px] border-b border-[#EEF0F2] bg-[#FAFAFA]">
            <div>
              <p className="text-[15px] font-bold">Office · Loads today</p>
            </div>
            <span className="text-[12px] text-[#6A7282]">Example data</span>
          </div>
          <div className="grid grid-cols-[64px_1fr_auto] sm:grid-cols-[58px_78px_minmax(56px,1fr)_auto] gap-x-3 px-5 h-[36px] items-center text-[11px] font-semibold text-[#6A7282] border-b border-[#EEF0F2]">
            <span>Load</span><span className="hidden sm:block">Truck</span><span>Driver</span><span className="text-right">Status</span>
          </div>
          <div className="min-h-[200px]">
            <AnimatePresence initial={false}>
              {office.map((l) => (
                <motion.div
                  key={l.id}
                  layout
                  initial={{ opacity: 0, y: -18, backgroundColor: "#EEF4FF" }}
                  animate={{ opacity: 1, y: 0, backgroundColor: l.fresh && l.stage !== "invoiced" ? "#F5F8FF" : "#FFFFFF" }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="grid grid-cols-[64px_1fr_auto] sm:grid-cols-[58px_78px_minmax(56px,1fr)_auto] gap-x-3 px-5 py-3 items-center border-b border-[#F3F4F6]"
                >
                  <span className="text-[13px] font-semibold tabular-nums">#{l.id}</span>
                  <span className="hidden sm:flex items-center gap-1.5 text-[13px]"><TruckIcon kind={l.kind} className="w-6 h-3 text-[#6A7282]" />{l.truck}</span>
                  <span className="text-[13px] min-w-0 truncate">
                    {l.driver}
                  </span>
                  <span className="justify-self-end"><StagePill stage={l.stage} /></span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* the newest load, opened */}
          <AnimatePresence>
            {fresh && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45, ease: EASE }} className="border-t border-[#EEF0F2] bg-[#FAFAFA] overflow-hidden">
                <div className="px-5 py-4 flex gap-4 items-start">
                  <div className="flex gap-1.5 shrink-0">
                    {Array.from({ length: Math.min(fresh.docs, 2) }, (_, i) => (
                      <div key={i} className="w-[46px] h-[60px] rounded-[6px] overflow-hidden ring-1 ring-[#E5E7EB] bg-white"><DeliveryNote t={0} held={false} scanning={false} width={46} /></div>
                    ))}
                  </div>
                  <div className="min-w-0 text-[13px] leading-relaxed">
                    <p className="font-bold text-[14px]">Load #{fresh.id} · {fresh.truck}</p>
                    <p className="text-[#4A5565]">From {fresh.driver}: {fresh.docs} {fresh.docs === 1 ? "photo" : "photos"}{fresh.seals ? ` and ${fresh.seals} ${fresh.seals === 1 ? "seal" : "seals"}` : ""} attached. No one had to type it in.</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
                      <span className={fresh.stage !== "arrived" ? "text-[#1D6B2B] font-semibold" : "text-[#99A1AF]"}>{fresh.stage !== "arrived" ? "✓" : "–"} Checked by the office</span>
                      <span className={fresh.stage === "invoiced" ? "text-[#1D6B2B] font-semibold" : "text-[#99A1AF]"}>{fresh.stage === "invoiced" ? "✓" : "–"} Invoice drafted</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-3 text-[13px] text-muted">The office sees every load the moment it&apos;s sent, with the photos attached.</p>
      </div>
    </div>
  );
}
