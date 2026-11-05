"use client";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Fingertip, HdLaptop, HdPhone, HdTablet, HomeBar, StatusBar, SYS } from "./kit/Device";
import { PALETTE_COLORS, type SketchField, type SketchResult } from "@/lib/sketch";

/*
 * A sketch from /api/sketch, drawn on the site's realistic devices: the team's phone fills in, one tap sends it,
 * the office list updates, the customer's WhatsApp lands and the numbers count up. Then it holds, fades and
 * plays again. Each business gets its own app colours (lib/sketch PALETTE_COLORS); our green stays ours.
 */

const ease = [0.22, 1, 0.36, 1] as const;
const INK = "#101828";

/* the story, in steps: 1..n fields fill, then the tap, the office row, the WhatsApp, the numbers */
function useStory(fields: number, reduce: boolean, hasCustomer: boolean) {
  const TAP = fields + 1, SENT = fields + 2, ROW = fields + 3, WA = fields + 4, NUMS = fields + 5;
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [fade, setFade] = useState(false);
  useEffect(() => {
    if (reduce) return;
    const at: [number, () => void][] = [];
    for (let i = 1; i <= fields; i++) at.push([500 + i * 380, () => setStep(i)]);
    const t0 = 500 + fields * 380;
    at.push([t0 + 350, () => setStep(TAP)], [t0 + 650, () => setStep(SENT)], [t0 + 1000, () => setStep(ROW)]);
    at.push([t0 + (hasCustomer ? 1550 : 1000), () => setStep(hasCustomer ? WA : ROW)], [t0 + 2000, () => setStep(NUMS)]);
    // hold the finished sketch, dissolve, then start again from a clean frame
    at.push([t0 + 6400, () => setFade(true)], [t0 + 6900, () => { setStep(0); setFade(false); setCycle((c) => c + 1); }]);
    const ids = at.map(([ms, f]) => setTimeout(f, ms));
    return () => ids.forEach(clearTimeout);
  }, [reduce, fields, hasCustomer, cycle, TAP, SENT, ROW, WA, NUMS]);
  const s = reduce ? NUMS : step;
  return { s, fade: !reduce && fade, cycle, TAP, SENT, ROW, WA, NUMS };
}

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/* "Ready Board" -> "Ready" + accent "Board" */
function AppName({ name, accent, className = "" }: { name: string; accent: string; className?: string }) {
  const words = name.split(" ");
  const last = words.length > 1 ? words.pop() : "";
  return (
    <span className={`font-bold tracking-[-0.01em] text-white ${className}`}>
      {words.join(" ")}
      {last && <> <span style={{ color: accent }}>{last}</span></>}
    </span>
  );
}

function Tick({ c = "#fff", className = "w-3 h-3" }: { c?: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/* ---------------------------------------------------------------- the team's phone */

function Field({ f, on, header }: { f: SketchField; on: boolean; header: string }) {
  if (f.kind === "check") {
    return (
      <div className="flex items-center gap-2 rounded-[10px] bg-white border border-black/[0.06] px-2.5 h-[38px]">
        <span className="w-[18px] h-[18px] shrink-0 rounded-[5px] flex items-center justify-center transition-colors duration-300" style={on ? { background: header } : { boxShadow: "inset 0 0 0 1.5px #D0D5DD" }}>
          {on && <Tick className="w-2.5 h-2.5" />}
        </span>
        <span className="text-[11px] font-semibold leading-tight truncate" style={{ color: INK }}>{f.label}</span>
      </div>
    );
  }
  let control: ReactNode;
  if (f.kind === "choice" && f.options.length) {
    const pick = f.options.includes(f.value) ? f.value : f.options[0];
    control = (
      <div className="mt-1 flex flex-wrap gap-1">
        {f.options.map((o) => {
          const sel = on && o === pick;
          return (
            <span key={o} className="whitespace-nowrap rounded-[6px] px-1.5 py-[3px] text-[9px] font-semibold leading-tight transition-colors duration-300" style={sel ? { background: header, color: "#fff" } : { background: "#F2F4F7", color: "#475467" }}>
              {o}
            </span>
          );
        })}
      </div>
    );
  } else if (f.kind === "photo") {
    control = (
      <div className="mt-1 flex items-center gap-1.5">
        {[0, 1].map((i) => (
          <span key={i} className="w-[30px] h-[30px] rounded-[6px] flex items-center justify-center transition-all duration-300" style={on ? { background: `linear-gradient(135deg, ${header}33, ${header}66)` } : { background: "#F2F4F7", boxShadow: "inset 0 0 0 1px #E4E7EC" }}>
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke={on ? header : "#98A2B3"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 8h3.5l1.5-2.5h6L16.5 8H20v11H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /></svg>
          </span>
        ))}
        <span className="text-[9.5px] text-[#667085]">{on ? f.value || "2 photos" : "Add photos"}</span>
      </div>
    );
  } else if (f.kind === "signature") {
    control = (
      <svg viewBox="0 0 80 14" className="mt-1 w-[78px] h-[15px]" aria-hidden>
        <motion.path initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.5 }} d="M2 10 C 8 2, 12 2, 16 9 S 24 12, 28 6 S 36 3, 40 9 S 50 12, 56 5 S 66 4, 78 8" fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  } else {
    control = (
      <p className={`mt-0.5 text-[11.5px] font-semibold leading-tight truncate transition-colors duration-300 ${f.kind === "money" || f.kind === "number" ? "tabular-nums" : ""}`} style={{ color: on ? INK : "#D0D5DD" }}>
        {on ? f.value || "—" : "Tap to add"}
      </p>
    );
  }
  return (
    <div className="rounded-[10px] bg-white border border-black/[0.06] px-2.5 py-[7px]">
      <p className="text-[8.5px] font-semibold uppercase tracking-[0.05em] text-[#98A2B3] leading-none">{f.label}</p>
      {control}
    </div>
  );
}

function PhoneApp({ r, s, TAP, SENT }: { r: SketchResult; s: number; TAP: number; SENT: number }) {
  const c = PALETTE_COLORS[r.palette];
  const sent = s >= SENT;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#F6F7F9", color: INK }}>
      <div style={{ background: c.header }}>
        <StatusBar time="9:41" light />
        <div className="px-3.5 pb-2.5">
          <AppName name={r.name} accent={c.accent} className="text-[13px]" />
          {r.phone.who && <p className="text-[9px] text-white/60 mt-0.5 truncate">{r.phone.who}</p>}
        </div>
      </div>
      <p className="px-3.5 pt-3 pb-2 text-[14px] font-bold tracking-[-0.01em] truncate">{r.phone.title}</p>
      <div className="px-2.5 flex flex-col gap-1.5">
        {r.phone.fields.map((f, i) => <Field key={f.label + i} f={f} on={s > i} header={c.header} />)}
      </div>
      <div className="px-2.5 mt-2.5">
        <div className="relative h-[34px] rounded-[10px] flex items-center justify-center gap-1.5 text-[11.5px] font-bold transition-colors duration-300" style={sent ? { background: "#2F8F3E", color: "#fff" } : { background: c.accent, color: c.header }}>
          {sent && <Tick className="w-3 h-3" />}
          <span className="truncate">{sent ? "Sent" : r.phone.button}</span>
          <span className="absolute left-1/2 top-1/2"><Fingertip show={s >= TAP && s < SENT + 1} down={s === SENT} /></span>
        </div>
      </div>
      <HomeBar />
    </div>
  );
}

/* ---------------------------------------------------------------- the office */

function tone(i: number, n: number) {
  if (i >= n - 1) return { background: "#E3F6DF", color: "#1D6B2B" };
  if (i === 0) return { background: "#F2F4F7", color: "#475467" };
  return { background: "#FEF0C7", color: "#93370D" };
}

function Count({ value, run, reduce }: { value: string; run: boolean; reduce: boolean }) {
  // counts up the leading number of "34", "2 h" or "1,250.00"; anything else just appears
  const m = value.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  const target = m ? Number(m[1].replace(/,/g, "")) : NaN;
  const decimals = m && m[1].includes(".") ? m[1].split(".")[1].length : 0;
  const [v, setV] = useState(0);
  useEffect(() => {
    if (reduce || !run || Number.isNaN(target)) return;
    const ctl = animate(0, target, { duration: 0.8, ease, onUpdate: setV });
    return () => ctl.stop();
  }, [run, reduce, target]);
  if (!m || reduce) return <>{value}</>;
  const shown = (run ? v : 0).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <>{shown}{m[2]}</>;
}

function OfficeApp({ r, s, ROW, NUMS, reduce, narrow = false }: { r: SketchResult; s: number; ROW: number; NUMS: number; reduce: boolean; narrow?: boolean }) {
  const c = PALETTE_COLORS[r.palette];
  const n = r.office.statuses.length;
  // the job the phone just sent moves to the last status
  const live = r.office.rows.findIndex((row) => row[2] !== r.office.statuses[n - 1]);
  const rows = r.office.rows.map((row, i) => (i === live && s >= ROW ? [row[0], row[1], r.office.statuses[n - 1]] : row));
  return (
    <div className="h-full flex flex-col" style={{ background: "#F6F7F9", color: INK }}>
      <div className="h-[38px] shrink-0 flex items-center gap-4 px-4" style={{ background: c.header }}>
        <AppName name={r.name} accent={c.accent} className="text-[13px]" />
        {!narrow && <span className="text-[10.5px] font-medium text-white/60">Office</span>}
        <span className="ml-auto w-6 h-6 rounded-full bg-white/15 text-white text-[9px] font-bold flex items-center justify-center">OF</span>
      </div>
      <div className="px-4 pt-3.5 flex items-baseline justify-between">
        <p className="text-[15px] font-bold tracking-[-0.01em] truncate">{r.office.title}</p>
        <span className="text-[10px] text-[#667085] whitespace-nowrap">Updated just now</span>
      </div>
      <div className="mx-4 mt-2.5 rounded-[10px] bg-white border border-[#E5E7EB] overflow-hidden">
        <div className={`grid ${narrow ? "grid-cols-[1.3fr_1fr]" : "grid-cols-[1.4fr_1fr_1.1fr]"} px-3 py-2 border-b border-[#EEF0F3] text-[9.5px] font-semibold uppercase tracking-[0.05em] text-[#98A2B3]`}>
          <span>{r.office.columns[0]}</span>
          {!narrow && <span>{r.office.columns[1]}</span>}
          <span>{r.office.columns[2]}</span>
        </div>
        {rows.map((row, i) => {
          const si = Math.max(0, r.office.statuses.indexOf(row[2]));
          const flash = i === live && s >= ROW;
          return (
            <motion.div
              key={i}
              initial={false}
              animate={{ backgroundColor: flash && s < ROW + 2 ? "rgba(153,229,140,0.22)" : "rgba(255,255,255,0)" }}
              transition={{ duration: 0.5 }}
              className={`grid ${narrow ? "grid-cols-[1.3fr_1fr]" : "grid-cols-[1.4fr_1fr_1.1fr]"} items-center px-3 ${narrow ? "py-2.5" : "py-3"} border-b border-[#F2F4F7] last:border-0 text-[12px]`}
            >
              <span className="font-semibold truncate pr-2">{row[0]}{narrow && <span className="block text-[10px] font-normal text-[#667085] truncate">{row[1]}</span>}</span>
              {!narrow && <span className="text-[#475467] truncate pr-2">{row[1]}</span>}
              <span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={row[2]} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }} className="inline-flex max-w-full truncate px-1.5 py-[2px] rounded-[5px] text-[10px] font-semibold" style={tone(si, n)}>
                    {row[2]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.div>
          );
        })}
      </div>
      {r.numbers.length > 0 && (
        <div className="mx-4 mt-auto mb-4 pt-3 grid grid-cols-3 gap-2">
          {r.numbers.map((x) => (
            <div key={x.label} className="rounded-[10px] bg-white border border-[#E5E7EB] px-2.5 py-2">
              <p className="text-[9.5px] font-semibold text-[#101828]/55 leading-tight line-clamp-2 min-h-[2.4em]">{x.label}</p>
              <p className={`mt-1 ${narrow ? "text-[17px]" : "text-[20px]"} font-extrabold tracking-[-0.03em] tabular-nums leading-none`}><Count value={x.value} run={s >= NUMS} reduce={reduce} /></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- the customer's WhatsApp */

function Note({ from, message }: { from: string; message: string }) {
  return (
    <div className="w-[248px] rounded-[16px] px-3 py-2.5 bg-[rgba(250,250,252,0.86)] backdrop-blur-xl backdrop-saturate-150 shadow-[0_18px_36px_-10px_rgba(16,24,40,0.35),0_0_0_0.5px_rgba(0,0,0,0.06)]" style={{ fontFamily: SYS }}>
      <div className="flex items-center gap-2">
        <span className="w-[22px] h-[22px] shrink-0 rounded-[6px] flex items-center justify-center" style={{ background: "#25D366" }}>
          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="#fff" aria-hidden><path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.3 20.7l4.4-1.1A8.8 8.8 0 1 0 12 3.2zm0 1.6a7.2 7.2 0 1 1-3.7 13.4l-.3-.2-2.6.7.7-2.5-.2-.3A7.2 7.2 0 0 1 12 4.8z" /></svg>
        </span>
        <span className="text-[11px] font-semibold text-[#101828] flex-1 truncate">{from}</span>
        <span className="text-[9.5px] text-[#667085]">now</span>
      </div>
      <p className="mt-1.5 text-[11px] leading-[1.38] text-[#101828]">{message}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- the whole sketch */

export function SketchStage({ r, reduce }: { r: SketchResult; reduce: boolean }) {
  const { s, fade, cycle, TAP, SENT, ROW, WA, NUMS } = useStory(r.phone.fields.length, reduce, !!r.customer);
  const from = titleCase(r.business === "business" ? r.name : r.business);
  const wa = r.customer && s >= WA;
  return (
    <motion.div initial={false} animate={{ opacity: fade ? 0 : 1 }} transition={{ duration: 0.45 }} className="relative" data-cycle={cycle}>
      {/* wide screens: the phone beside a laptop */}
      <div className="hidden md:flex relative items-end justify-center gap-10 max-lg:[zoom:0.82]">
        <div className="relative z-10">
          <HdPhone w={228}><PhoneApp r={r} s={s} TAP={TAP} SENT={SENT} /></HdPhone>
        </div>
        <HdLaptop w={600}>
          <div style={{ zoom: 0.94, width: 610, height: 381 }}>
            <OfficeApp r={r} s={s} ROW={ROW} NUMS={NUMS} reduce={reduce} />
          </div>
        </HdLaptop>
        <AnimatePresence>
          {wa && (
            <motion.div
              key="wa"
              initial={{ opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="absolute z-20 left-[236px] -top-[10px]"
            >
              <Note from={from} message={r.customer!.message} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* phones: the phone, then the office on a tablet, then the WhatsApp */}
      <div className="md:hidden flex flex-col items-center gap-8">
        <div className="[zoom:0.92]"><HdPhone w={228}><PhoneApp r={r} s={s} TAP={TAP} SENT={SENT} /></HdPhone></div>
        <HdTablet w={320} h={430}>
          <div style={{ zoom: 0.74, width: 412, height: 557 }}>
            <OfficeApp r={r} s={s} ROW={ROW} NUMS={NUMS} reduce={reduce} narrow />
          </div>
        </HdTablet>
        <div className="h-[92px]">
          <AnimatePresence>
            {wa && (
              <motion.div key="wa-m" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 360, damping: 28 }}>
                <Note from={from} message={r.customer!.message} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* While the sketch is being drawn: the same devices, empty, with soft bars that shimmer. */
export function SketchSkeleton() {
  const bar = "rounded-[6px] bg-[#E9ECF1] animate-pulse";
  const phone = (
    <HdPhone w={228}>
      <div className="absolute inset-0 bg-[#F6F7F9]">
        <div className="h-[64px] bg-[#D9DDE3]" />
        <div className="p-3 flex flex-col gap-2">
          <span className={`${bar} h-[14px] w-2/3`} />
          {[0, 1, 2, 3, 4].map((i) => <span key={i} className={`${bar} h-[38px]`} style={{ animationDelay: `${i * 120}ms` }} />)}
          <span className={`${bar} h-[34px] mt-1`} />
        </div>
      </div>
    </HdPhone>
  );
  return (
    <div aria-hidden>
      <div className="hidden md:flex items-end justify-center gap-10 max-lg:[zoom:0.82]">
        {phone}
        <HdLaptop w={600}>
          <div className="absolute inset-0 bg-[#F6F7F9]">
            <div className="h-[34px] bg-[#D9DDE3]" />
            <div className="p-4 flex flex-col gap-2.5">
              <span className={`${bar} h-[14px] w-1/3`} />
              {[0, 1, 2].map((i) => <span key={i} className={`${bar} h-[30px]`} style={{ animationDelay: `${i * 150}ms` }} />)}
              <div className="grid grid-cols-3 gap-2 mt-1">{[0, 1, 2].map((i) => <span key={i} className={`${bar} h-[50px]`} />)}</div>
            </div>
          </div>
        </HdLaptop>
      </div>
      <div className="md:hidden flex justify-center [zoom:0.92]">{phone}</div>
    </div>
  );
}
