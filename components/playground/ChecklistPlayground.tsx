"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check } from "@/components/ui";
import { EASE, Hl, PhoneFrame, Steps, Toast, useTimers } from "./kit";
import { play } from "@/lib/sound";

/*
 * Playground 2: the pre-start checklist we built for a transport fleet's workshop, rebuilt as a safe demo.
 * Same rules as the real one: every check is OK / Fault / N/A, a fault picks what's wrong, and a fault on a
 * STOP item (brakes, steering) turns the screen red: do not start. "Send to supervisor" uses WhatsApp in the
 * real app; here it only fills in the supervisor's copy beside the phone. Made-up truck, people and times.
 */

type Ans = "ok" | "fault" | "na";

/* Pull the plug: the demo reads the visitor's real connection. With no signal the checks keep saving on the
   phone (as the real app does) and the supervisor's report waits; when the signal is back, the waiting
   changes go across one by one. */
const subscribeOnline = (cb: () => void) => {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
};
/* The paper sheet carries a QR code that opens this demo with the same check already filled in, so the person
   holding the paper watches it become the app in their other hand. (Pre-generated, encodes
   https://flowrate.agency/work?paper=1#workshop-checklist) */
const QR_PATH = "M0 0.5h7m1 0h1m3 0h2m1 0h4m4 0h1m2 0h7M0 1.5h1m5 0h1m3 0h2m1 0h2m1 0h1m1 0h3m3 0h1m1 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m2 0h2m1 0h1m1 0h1m2 0h6m3 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h2m6 0h1m1 0h2m2 0h3m1 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h1m1 0h4m2 0h1m6 0h1m2 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m1 0h2m1 0h1m1 0h3m1 0h4m5 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h2m1 0h2m4 0h2m1 0h2m2 0h1M0 8.5h1m3 0h1m1 0h5m4 0h3m2 0h4m1 0h5m2 0h1M2 9.5h2m1 0h1m2 0h3m1 0h1m1 0h2m5 0h3m1 0h1m3 0h2M0 10.5h1m3 0h8m1 0h3m4 0h2m1 0h4m2 0h1m1 0h1M1 11.5h1m1 0h1m6 0h4m2 0h3m1 0h2m2 0h3m4 0h1M2 12.5h1m1 0h3m1 0h2m1 0h1m1 0h1m1 0h3m1 0h4m1 0h1m1 0h1m1 0h2m2 0h1M0 13.5h3m1 0h1m2 0h1m2 0h1m1 0h1m1 0h1m2 0h1m5 0h1m3 0h1m2 0h1M0 14.5h7m4 0h1m1 0h1m1 0h1m1 0h1m2 0h2m1 0h1m1 0h2m2 0h3M0 15.5h1m2 0h2m3 0h1m1 0h1m2 0h7m1 0h3m1 0h2m1 0h2M0 16.5h1m1 0h6m3 0h1m5 0h2m1 0h4m2 0h1m1 0h2m1 0h1M0 17.5h1m2 0h2m5 0h3m1 0h3m1 0h1m4 0h1m1 0h1m3 0h3M1 18.5h1m1 0h4m2 0h2m1 0h1m1 0h5m1 0h1m1 0h3m2 0h1m1 0h1m1 0h1M0 19.5h2m1 0h1m3 0h2m7 0h2m1 0h3m2 0h1m1 0h2M0 20.5h5m1 0h6m1 0h2m3 0h7m1 0h4m1 0h2M0 21.5h1m1 0h1m1 0h1m5 0h2m1 0h1m2 0h3m4 0h1m1 0h1m1 0h1m1 0h1m1 0h1M3 22.5h1m1 0h3m5 0h2m1 0h1m1 0h1m1 0h2m1 0h3m5 0h1M2 23.5h2m3 0h2m1 0h1m6 0h3m1 0h1m4 0h4m1 0h2M0 24.5h5m1 0h2m3 0h1m3 0h3m1 0h3m2 0h6m2 0h1M8 25.5h1m2 0h1m2 0h4m3 0h1m2 0h1m3 0h1m1 0h1M0 26.5h7m1 0h2m1 0h1m1 0h3m2 0h1m1 0h3m1 0h1m1 0h1m1 0h2m1 0h1M0 27.5h1m5 0h1m2 0h3m9 0h2m1 0h1m3 0h1m2 0h1M0 28.5h1m1 0h3m1 0h1m1 0h1m1 0h2m2 0h3m2 0h4m1 0h6m1 0h2M0 29.5h1m1 0h3m1 0h1m3 0h3m5 0h1m2 0h1m2 0h1m1 0h3m1 0h1M0 30.5h1m1 0h3m1 0h1m2 0h2m2 0h3m2 0h1m1 0h1m3 0h1m1 0h3M0 31.5h1m5 0h1m2 0h4m2 0h4m1 0h3m1 0h1m1 0h1m2 0h1M0 32.5h7m1 0h1m2 0h4m2 0h1m1 0h6m7 0h1";
function PaperQR() {
  return (
    <svg viewBox="0 0 33 33" shapeRendering="crispEdges" className="w-[64px] h-[64px]" role="img" aria-label="QR code: open this check on your phone">
      <path fill="#fff" d="M0 0h33v33H0z" />
      <path stroke="#101828" d={QR_PATH} />
    </svg>
  );
}
const PAPER_ANS: Record<number, Ans> = { 1: "ok", 2: "fault", 3: "ok", 4: "ok", 5: "ok", 6: "ok", 7: "ok", 8: "na" };

function useOnline() {
  return useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
}
type Item = { n: number; zone: number; label: string; hint: string; parts: string[]; stop?: boolean };
const ZONES = ["Walk around", "In the cab & start"];
const ITEMS: Item[] = [
  { n: 1, zone: 0, label: "Truck condition", hint: "Dents, cracks, loose bolts", parts: ["Dents", "Cracks", "Loose bolts"] },
  { n: 2, zone: 0, label: "Mirrors", hint: "Clean, set, not cracked", parts: ["Dirty", "Not set", "Cracked"] },
  { n: 3, zone: 0, label: "Wheels & tyres", hint: "Hubs, tyres, pressure", parts: ["Hubs", "Tyres", "Pressure"] },
  { n: 4, zone: 0, label: "Lights", hint: "Head, tail, indicators", parts: ["Head", "Tail", "Indicators"] },
  { n: 5, zone: 1, label: "Brakes", hint: "Foot and park brake hold", parts: ["Foot brake", "Park brake", "Air leak"], stop: true },
  { n: 6, zone: 1, label: "Steering", hint: "No play, no noise", parts: ["Play", "Noise", "Pulls"], stop: true },
  { n: 7, zone: 1, label: "Horn", hint: "Works", parts: ["Not working"] },
  { n: 8, zone: 1, label: "Seatbelt", hint: "Clicks and locks", parts: ["Won't lock", "Damaged"] },
];

const STEPS = [
  { key: "ok", label: "Tick the checks", hint: "Tap OK on a few items" },
  { key: "fault", label: "Report a fault", hint: "Tap Fault on Mirrors, then pick what's wrong" },
  { key: "stop", label: "Try a stop item", hint: "Tap Fault on Brakes and watch the screen" },
  { key: "send", label: "Send it to the supervisor", hint: "Finish the list, then tap Send" },
];

function Icon({ n }: { n: number }) {
  const d: Record<number, string> = {
    1: "M3 13h2l1-4h9l3 4h3v3H3zM7 17a1.5 1.5 0 1 0 0 .1M17 17a1.5 1.5 0 1 0 0 .1",
    2: "M12 6c4 0 7 6 7 6s-3 6-7 6-7-6-7-6 3-6 7-6zm0 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z",
    3: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    4: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z",
    5: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v5M12 16h.01",
    6: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4.5 12H9M15 12h4.5M12 15v5",
    7: "M4 10v4h3l5 4V6L7 10zM16 9a4 4 0 0 1 0 6",
    8: "M6 4l6 8 6-8M12 12v8",
  };
  return (
    <span className="w-8 h-8 shrink-0 rounded-[9px] bg-[#EEF0F3] flex items-center justify-center">
      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#364153]" aria-hidden><path d={d[n]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

/* The walk-around route, seen from above: follow the numbers. Markers turn green / red as checks are answered. */
const SPOTS: { n: number; x: number; y: number }[] = [
  { n: 1, x: 214, y: 101 }, // beside the cab: truck condition
  { n: 2, x: 262, y: 30 },  // front: mirrors
  { n: 3, x: 120, y: 101 }, // along the side: wheels & tyres
  { n: 4, x: 22, y: 60 },   // at the back: lights
];
function RouteMap({ ans, focus, small = false }: { ans: Record<number, Ans>; focus?: number; small?: boolean }) {
  const fill = (n: number) => (ans[n] === "ok" ? "#1D6B2B" : ans[n] === "fault" ? "#B42318" : ans[n] === "na" ? "#4A5565" : "#FFFFFF");
  const cab = [5, 6, 7, 8];
  const cabDone = cab.every((n) => ans[n]);
  const cabFault = cab.some((n) => ans[n] === "fault");
  return (
    <svg viewBox="0 0 284 124" className={small ? "w-full max-w-[300px]" : "w-full"} role="img" aria-label="Walk-around route: start beside the cab, walk around the truck, then climb into the cab">
      {/* walking route */}
      <rect x="10" y="12" width="262" height="100" rx="18" fill="none" stroke="#99A1AF" strokeWidth="1.6" strokeDasharray="5 5" />
      <path d="M168 112l-6-4v8z M92 12l6-4v8z" fill="#99A1AF" />
      {/* truck from above: load body, cab at the front (right) */}
      <rect x="44" y="38" width="150" height="48" rx="4" fill="#EEF0F3" stroke="#4A5565" strokeWidth="1.4" />
      <rect x="198" y="40" width="40" height="44" rx="7" fill="#E4E7EC" stroke="#4A5565" strokeWidth="1.4" />
      <rect x="236" y="34" width="6" height="8" rx="1" fill="#4A5565" /><rect x="236" y="82" width="6" height="8" rx="1" fill="#4A5565" />
      {[60, 80, 160, 178, 214].map((x) => (<g key={x}><rect x={x} y="31" width="12" height="7" rx="1.5" fill="#364153" /><rect x={x} y="86" width="12" height="7" rx="1.5" fill="#364153" /></g>))}
      <text x="119" y="66" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6A7282" letterSpacing="0.8">LOAD BODY</text>
      <text x="218" y="60" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#6A7282">CAB</text>
      <text x="218" y="70" textAnchor="middle" fontSize="7" fill="#6A7282">5–8</text>
      <text x="230" y="121" textAnchor="middle" fontSize="7.5" fontWeight="800" fill="#101828" letterSpacing="0.6">START</text>
      {/* checkpoints */}
      {SPOTS.map((sp) => {
        const done = !!ans[sp.n];
        const on = focus === sp.n;
        return (
          <g key={sp.n}>
            {on && <rect x={sp.x - 13} y={sp.y - 13} width="26" height="26" rx="8" fill="none" stroke="#101828" strokeWidth="2" />}
            <rect x={sp.x - 9} y={sp.y - 9} width="18" height="18" rx="5.5" fill={fill(sp.n)} stroke={done ? "none" : "#101828"} strokeWidth="1.4" />
            <text x={sp.x} y={sp.y + 3.6} textAnchor="middle" fontSize="10" fontWeight="800" fill={done ? "#FFFFFF" : "#101828"}>{sp.n}</text>
          </g>
        );
      })}
      <rect x="203" y="45" width="30" height="34" rx="6" fill="none" stroke={cabFault ? "#B42318" : cabDone ? "#1D6B2B" : "transparent"} strokeWidth="2" />
    </svg>
  );
}

export function ChecklistPlayground() {
  const [ans, setAns] = useState<Record<number, Ans>>({});
  const [parts, setParts] = useState<Record<number, string[]>>({});
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState(false);
  const [auto, setAuto] = useState(false);
  const [view, setView] = useState<"report" | "paper">("report");
  const { later, clear } = useTimers();
  const listRef = useRef<HTMLDivElement>(null);

  // what the supervisor's report shows: live while online; frozen while offline, then caught up one change at a time
  const online = useOnline();
  const [frozen, setFrozen] = useState<{ ans: Record<number, Ans>; parts: Record<number, string[]> } | null>(null);
  const [flash, setFlash] = useState<number | null>(null);
  const [justSynced, setJustSynced] = useState(false);
  const [sendQueued, setSendQueued] = useState(false);
  const pendingKeys = frozen ? ITEMS.map((i) => i.n).filter((n) => frozen.ans[n] !== ans[n] || (frozen.parts[n] || []).join() !== (parts[n] || []).join()) : [];

  // freeze the report at the moment the signal goes
  const latest = useRef({ ans, parts });
  useEffect(() => {
    latest.current = { ans, parts };
  }, [ans, parts]);
  useEffect(() => {
    const off = () => setFrozen((f) => f ?? { ans: { ...latest.current.ans }, parts: { ...latest.current.parts } });
    window.addEventListener("offline", off);
    return () => window.removeEventListener("offline", off);
  }, []);

  // signal back: catch the report up, one waiting change at a time
  useEffect(() => {
    if (!online || !frozen) return;
    const n = pendingKeys[0];
    if (n === undefined) {
      const t = setTimeout(() => {
        setFrozen(null);
        setJustSynced(true);
        if (sendQueued) {
          setSendQueued(false);
          setSent(true);
          setToast(true);
          later(3000, () => setToast(false));
        }
        later(3200, () => setJustSynced(false));
      }, 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setFrozen((f) => (f ? { ans: { ...f.ans, [n]: ans[n] }, parts: { ...f.parts, [n]: parts[n] || [] } } : f));
      setFlash(n);
      play("tick", 0.5);
      later(600, () => setFlash(null));
    }, 380);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online, frozen, ans, parts]);
  const shownAns = frozen?.ans ?? ans;
  const shownParts = frozen?.parts ?? parts;
  // the report's own counts, from what it has actually received
  const rAnswered = Object.keys(shownAns).length;
  const rFaults = ITEMS.filter((i) => shownAns[i.n] === "fault");
  const rStatus = rFaults.some((i) => i.stop) ? "stop" : rFaults.length ? "faults" : "ok";

  // opened from the QR on the paper sheet: fill in the same answers as the printed example
  const [fromPaper, setFromPaper] = useState(false);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("paper") !== "1") return;
    const t = setTimeout(() => {
      setAns(PAPER_ANS);
      setParts({ 2: ["Cracked"] });
      setFromPaper(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const answered = Object.keys(ans).length;
  const faults = ITEMS.filter((i) => ans[i.n] === "fault");
  const stopFault = faults.some((i) => i.stop);
  const status = stopFault ? "stop" : faults.length ? "faults" : "ok";
  const okCount = Object.values(ans).filter((a) => a === "ok").length;

  const step = sent ? "done" : okCount < 2 && !faults.length ? "ok" : !faults.some((i) => !i.stop) ? "fault" : !stopFault ? "stop" : "send";

  /* keep the next thing to tap in view inside the phone */
  useEffect(() => {
    const box = listRef.current;
    if (!box) return;
    const target = step === "stop" ? box.querySelector('[data-item="5"]') : step === "fault" ? box.querySelector('[data-item="2"]') : null;
    if (target instanceof HTMLElement) box.scrollTo({ top: Math.max(0, target.offsetTop - 12), behavior: "smooth" });
    else if (step === "send" || step === "done") box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
  }, [step]);

  const answer = (n: number, a: Ans) => {
    if (sent) return;
    setAns((s) => ({ ...s, [n]: a }));
    if (a !== "fault") setParts((p) => ({ ...p, [n]: [] }));
  };
  const togglePart = (n: number, part: string) => setParts((p) => {
    const cur = p[n] || [];
    return { ...p, [n]: cur.includes(part) ? cur.filter((x) => x !== part) : [...cur, part] };
  });
  const send = () => {
    if (answered < ITEMS.length || sent) return;
    if (!online || frozen) {
      setSendQueued(true);
      return;
    }
    setSent(true);
    later(200, () => setToast(true));
    later(3200, () => setToast(false));
  };
  const reset = () => {
    clear(); setAns({}); setParts({}); setSent(false); setToast(false); setAuto(false); setView("report");
    setSendQueued(false); setFrozen(online ? null : { ans: {}, parts: {} });
  };
  const watch = () => {
    reset(); setAuto(true);
    const seq: [number, () => void][] = [
      [600, () => setAns((s) => ({ ...s, 1: "ok" }))],
      [1100, () => setAns((s) => ({ ...s, 2: "fault" }))],
      [1700, () => setParts((p) => ({ ...p, 2: ["Cracked"] }))],
      [2300, () => setAns((s) => ({ ...s, 3: "ok", 4: "ok" }))],
      [3000, () => setAns((s) => ({ ...s, 5: "fault" }))],
      [3600, () => setParts((p) => ({ ...p, 5: ["Air leak"] }))],
      [4300, () => setAns((s) => ({ ...s, 6: "ok", 7: "ok", 8: "na" }))],
      [5200, () => { setSent(true); setToast(true); setAuto(false); }],
      [8200, () => setToast(false)],
    ];
    seq.forEach(([ms, fn]) => later(ms, fn));
  };

  /* print only the paper form (see the print rules in globals.css) */
  const printPaper = () => {
    document.body.dataset.printing = "ck-paper";
    const done = () => { delete document.body.dataset.printing; window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print();
  };

  const head = status === "stop" ? "bg-[#B42318]" : "bg-[#101828]";

  return (
    <div className="grid gap-10 lg:gap-8 lg:grid-cols-[300px_330px_minmax(0,1fr)] items-start">
      <Steps
        steps={STEPS}
        current={step}
        allDone={step === "done"}
        auto={auto}
        onWatch={watch}
        onReset={reset}
        note={{ title: "Works on paper too", body: "The same checklist prints as a paper form, with the same route and the same STOP items. Open Paper version and tap Print to try it." }}
      />

      {/* ---------------- phone */}
      <div className="justify-self-center lg:pt-[46px]">
        <PhoneFrame>
          <div className={`${head} text-white px-4 pt-1 pb-3 transition-colors duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-extrabold tracking-tight">Truck pre-start check</p>
                <p className="text-[11px] text-white/70">Unit TRK 04 · Sam M.</p>
              </div>
              <span className="text-[13px] font-bold tabular-nums">{answered}/{ITEMS.length}</span>
            </div>
            <div className="mt-2 h-[4px] rounded-full bg-white/20 overflow-hidden">
              <motion.div className="h-full bg-white" animate={{ width: `${(answered / ITEMS.length) * 100}%` }} transition={{ duration: 0.35, ease: EASE }} />
            </div>
            <AnimatePresence initial={false}>
              {(!online || frozen) && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden text-[11px] font-semibold text-white/85"
                  role="status"
                >
                  <span className="block pt-2">
                    {!online
                      ? `No signal · saved on this phone${pendingKeys.length ? ` · ${pendingKeys.length} waiting` : ""}`
                      : `Signal back · sending ${pendingKeys.length || ""}`.trim()}
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {status === "stop" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="bg-[#FEE4E2] text-[#912018] text-[12px] font-bold px-4 py-2 overflow-hidden">
                Do not start this truck. Tell your supervisor.
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={listRef} className={`absolute inset-x-0 bottom-0 ${status === "stop" ? "top-[152px]" : "top-[120px]"} transition-[top] duration-300 overflow-y-auto overscroll-contain px-3 pb-[84px] pt-1 [scrollbar-width:none]`}>
            <div className="rounded-[14px] bg-white border border-[#E5E7EB] p-2.5 mt-1">
              <p className="px-0.5 text-[10px] font-bold tracking-[0.12em] text-[#4A5565] mb-1">YOUR ROUTE: FOLLOW THE NUMBERS</p>
              <RouteMap ans={ans} focus={step === "fault" ? 2 : step === "ok" ? ITEMS.find((i) => !ans[i.n] && i.zone === 0)?.n : undefined} />
              <p className="px-0.5 text-[10.5px] text-[#6A7282] leading-snug">Start beside the cab and walk around the truck, checks 1–4. Then climb in for 5–8.</p>
            </div>
            {ZONES.map((z, zi) => (
              <div key={z} className="mt-2">
                <p className="px-1 text-[10px] font-bold tracking-[0.12em] text-[#4A5565] mb-1.5">{zi + 1}. {z.toUpperCase()}</p>
                <div className="space-y-2">
                  {ITEMS.filter((i) => i.zone === zi).map((it) => {
                    const a = ans[it.n];
                    const hint = !auto && ((step === "ok" && !a && it.n === 1) || (step === "fault" && it.n === 2 && a !== "fault") || (step === "stop" && it.n === 5 && a !== "fault"));
                    return (
                      <div key={it.n} data-item={it.n} className={`rounded-[14px] bg-white border p-2.5 transition-colors ${a === "fault" ? (it.stop ? "border-[#F04438]" : "border-[#F79009]") : "border-[#E5E7EB]"}`}>
                        <div className="flex items-center gap-2.5">
                          <Icon n={it.n} />
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-bold leading-tight flex items-center gap-1.5">
                              {it.label}
                              {it.stop && <span className="text-[9px] font-extrabold tracking-wide text-white bg-[#B42318] rounded-[4px] px-1.5 py-[1px]">STOP</span>}
                            </p>
                            <p className="text-[11px] text-[#6A7282] leading-tight">{it.hint}</p>
                          </div>
                        </div>
                        <Hl on={!!hint} className="mt-2">
                          <div className="grid grid-cols-3 gap-1.5">
                            {(["ok", "fault", "na"] as Ans[]).map((k) => (
                              <button
                                key={k}
                                type="button"
                                onClick={() => answer(it.n, k)}
                                className={`h-[34px] rounded-[9px] border text-[12px] font-bold cursor-pointer transition-colors ${
                                  a === k
                                    ? k === "ok" ? "bg-[#1D6B2B] border-[#1D6B2B] text-white" : k === "fault" ? "bg-[#B42318] border-[#B42318] text-white" : "bg-[#4A5565] border-[#4A5565] text-white"
                                    : "bg-white border-[#D4D4D4] text-[#101828]"
                                }`}
                              >
                                {k === "ok" ? "✓ OK" : k === "fault" ? "✕ Fault" : "N/A"}
                              </button>
                            ))}
                          </div>
                        </Hl>
                        <AnimatePresence initial={false}>
                          {a === "fault" && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: EASE }} className="overflow-hidden">
                              <p className="mt-2 text-[10.5px] font-semibold text-[#4A5565]">What&apos;s wrong?</p>
                              <div className="mt-1 flex flex-wrap gap-1.5">
                                {it.parts.map((p) => {
                                  const on = (parts[it.n] || []).includes(p);
                                  return (
                                    <button key={p} type="button" onClick={() => togglePart(it.n, p)} className={`h-[26px] px-2.5 rounded-full border text-[11px] font-semibold cursor-pointer ${on ? "bg-[#101828] border-[#101828] text-white" : "bg-white border-[#D4D4D4]"}`}>
                                      {p}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 inset-x-0 px-3 pb-4 pt-3 bg-[linear-gradient(to_top,#F4F4F2_70%,rgba(244,244,242,0))]">
            <Hl on={step === "send" && answered === ITEMS.length && !auto}>
              <button type="button" onClick={send} disabled={answered < ITEMS.length || sent} className="w-full h-[50px] rounded-[14px] bg-[#101828] text-white text-[14px] font-extrabold disabled:bg-[#101828]/35 cursor-pointer">
                {sent ? "Sent to supervisor" : sendQueued ? "Sends when there's signal" : answered < ITEMS.length ? `Send to supervisor (${ITEMS.length - answered} left)` : "Send to supervisor"}
              </button>
            </Hl>
          </div>
          <Toast show={toast} id="sent" title="Sent to the supervisor" sub={faults.length ? `With ${faults.length} ${faults.length === 1 ? "fault" : "faults"} marked` : "All checks OK"} />
        </PhoneFrame>
        {fromPaper && (
          <p className="mt-4 max-w-[300px] mx-auto text-center text-[13px] font-semibold text-heading leading-snug">Filled in from the paper sheet you scanned.</p>
        )}
        <p className="mt-4 max-w-[300px] mx-auto text-center text-[13px] text-muted leading-snug">
          Try it: turn your Wi-Fi off and keep ticking. It saves on the phone and sends when the signal is back.
        </p>
      </div>

      {/* ---------------- the report that goes to the supervisor, or the same check on paper */}
      <div className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex rounded-full bg-soft border border-line p-1">
            {([["report", "Report"], ["paper", "Paper version"]] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => setView(k)} className={`relative h-8 px-4 rounded-full text-[13px] font-semibold cursor-pointer ${view === k ? "text-paper" : "text-body"}`}>
                {view === k && <motion.span layoutId="ck-view" className="absolute inset-0 rounded-full bg-heading" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                <span className="relative">{l}</span>
              </button>
            ))}
          </div>
          {view === "paper" && (
            <button type="button" onClick={printPaper} className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-line-strong text-heading text-[13px] font-bold cursor-pointer hover:bg-soft">
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
              Print
            </button>
          )}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {view === "report" ? (
            <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: EASE }}>
              <div className="rounded-[20px] bg-white border border-[#E5E7EB] overflow-hidden text-[#101828] [filter:drop-shadow(0_30px_40px_rgba(16,24,40,0.12))]" data-theme="light">
          <div className="flex items-center justify-between px-5 h-[58px] border-b border-[#EEF0F2] bg-[#FAFAFA]">
            <p className="text-[15px] font-bold">Report for the supervisor · TRK 04</p>
            <span className="text-[12px] text-[#6A7282]">Example data</span>
          </div>
          <div className={`px-5 py-3 flex items-center justify-between text-[13px] font-bold transition-colors duration-300 ${rStatus === "stop" ? "bg-[#FEE4E2] text-[#912018]" : rStatus === "faults" ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#EAF8E6] text-[#1D6B2B]"}`}>
            <span>{rStatus === "stop" ? "Do not start" : rStatus === "faults" ? `${rFaults.length} ${rFaults.length === 1 ? "fault" : "faults"} to fix` : rAnswered ? "Safe to start so far" : "Waiting for the check"}</span>
            <span className="font-semibold tabular-nums">{rAnswered}/{ITEMS.length} checked</span>
          </div>
          <div>
            {ITEMS.map((it) => {
              const a = shownAns[it.n];
              return (
                <div key={it.n} className={`grid grid-cols-[24px_1fr_auto] gap-3 items-center px-5 h-[42px] border-b border-[#F3F4F6] text-[13px] transition-colors duration-500 ${flash === it.n ? "bg-[#EAF8E6]" : ""}`}>
                  <span className="text-[#99A1AF] tabular-nums">{it.n}</span>
                  <span className="min-w-0 truncate">
                    {it.label}
                    {a === "fault" && (shownParts[it.n] || []).length > 0 && <span className="text-[#B42318]"> · {(shownParts[it.n] || []).join(", ")}</span>}
                  </span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={a || "none"} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="justify-self-end">
                      {a === "ok" ? (
                        <span className="w-6 h-6 rounded-[7px] bg-[#EAF8E6] text-[#1D6B2B] flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
                      ) : a === "fault" ? (
                        <span className={`rounded-full px-2.5 h-[22px] flex items-center text-[11px] font-bold ${it.stop ? "bg-[#B42318] text-white" : "bg-[#FEF3C7] text-[#92400E]"}`}>{it.stop ? "STOP" : "Fault"}</span>
                      ) : a === "na" ? (
                        <span className="text-[12px] text-[#6A7282]">N/A</span>
                      ) : (
                        <span className="w-6 h-6 rounded-[7px] border border-dashed border-[#D4D4D4] block" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 text-[12px] text-[#6A7282] flex justify-between bg-[#FAFAFA]">
            <span>Checked by Sam M. · 6:42</span>
            <span className={sent || justSynced ? "text-[#1D6B2B] font-semibold" : !online ? "text-[#92400E] font-semibold" : ""}>
              {!online
                ? pendingKeys.length ? `Waiting for signal · ${pendingKeys.length} on the phone` : "Waiting for signal"
                : frozen ? "Receiving…" : sent ? "✓ Sent on WhatsApp" : justSynced ? "✓ Synced just now" : "Not sent yet"}
            </span>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-muted">When the check is sent, the supervisor gets this report on WhatsApp, with every fault named.</p>
            </motion.div>
          ) : (
            <motion.div key="paper" initial={{ opacity: 0, y: 10, rotate: 0.6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease: EASE }}>
              <div id="ck-paper" className="bg-white text-[#101828] ring-1 ring-[#E5E7EB] shadow-[0_24px_40px_rgba(16,24,40,0.12)] p-6 print:shadow-none print:ring-0" data-theme="light">
            <div className="flex items-start justify-between border-b-2 border-[#101828] pb-2">
              <div>
                <p className="text-[17px] font-extrabold tracking-tight">Truck pre-start check</p>
                <p className="text-[11px] text-[#4A5565]">Tick one box for every check. A fault on a STOP item: do not start.</p>
              </div>
              <span className="text-[10px] font-bold text-[#6A7282]">Example data</span>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3 text-[11px]">
              {[["Unit no.", "TRK 04"], ["Operator", "Sam M."], ["Date", "13/10/2026"], ["Shift", "Day"]].map(([k, v]) => (
                <div key={k}><p className="text-[#6A7282] font-semibold">{k}</p><p className="border-b border-[#99A1AF] h-[20px] [font-family:'Bradley_Hand','Marker_Felt',cursive] text-[13px] text-[#1E3A8A]">{v}</p></div>
              ))}
            </div>
            <div className="mt-3 flex justify-center"><RouteMap ans={ans} small /></div>
            <table className="w-full mt-2 text-[11.5px] border-collapse">
              <thead>
                <tr className="text-[10px] text-[#6A7282] border-b border-[#D4D4D4]">
                  <th className="text-left font-bold py-1 w-[22px]">#</th><th className="text-left font-bold">Check</th>
                  <th className="font-bold w-[40px]">OK</th><th className="font-bold w-[40px]">Fault</th><th className="font-bold w-[40px]">N/A</th>
                </tr>
              </thead>
              <tbody>
                {ITEMS.map((it) => (
                  <tr key={it.n} className="border-b border-[#E5E7EB]">
                    <td className="py-1.5 text-[#6A7282] tabular-nums">{it.n}</td>
                    <td className="py-1.5">
                      <span className="font-semibold">{it.label}</span>
                      {it.stop && <span className="ml-1.5 text-[8.5px] font-extrabold text-white bg-[#B42318] rounded-[3px] px-1 py-[1px]">STOP</span>}
                      <span className="block text-[10px] text-[#6A7282]">{it.hint}</span>
                    </td>
                    {(["ok", "fault", "na"] as Ans[]).map((k) => (
                      <td key={k} className="text-center">
                        <span className="inline-flex w-[18px] h-[18px] border border-[#4A5565] items-center justify-center text-[13px] leading-none [font-family:'Bradley_Hand','Marker_Felt',cursive] text-[#1E3A8A]">{ans[it.n] === k ? "✓" : ""}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-[11px]">
              <p className="text-[#6A7282] font-semibold">Faults found</p>
              <p className="border-b border-[#99A1AF] min-h-[20px] [font-family:'Bradley_Hand','Marker_Felt',cursive] text-[13px] text-[#1E3A8A]">{faults.map((f) => `${f.label}${(parts[f.n] || []).length ? ` (${(parts[f.n] || []).join(", ").toLowerCase()})` : ""}`).join("; ")}</p>
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-6 mt-4 items-end text-[11px] text-[#6A7282] font-semibold">
              <p className="border-t border-[#99A1AF] pt-1">Operator signature</p>
              <p className="border-t border-[#99A1AF] pt-1">Supervisor signature</p>
              <div className="flex items-center gap-2">
                <p className="text-[9.5px] leading-tight text-right max-w-[92px] font-semibold">Scan: the same check, on the phone</p>
                <PaperQR />
              </div>
            </div>
          </div>
<p className="mt-3 text-[13px] text-muted">Ready to print: the same checks, route and STOP items, for machines without a phone nearby. Your taps on the phone fill it in here.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
