"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/*
 * Hero showpiece. A fixed 1180×620 artboard, scaled to fit, showing one load travel from a
 * driver's phone, through the office (where the document is read field by field), into a
 * draft invoice. One clock drives every layer; every second loop the weights disagree and
 * the system holds the invoice instead of guessing.
 */

const W = 1180;
const H = 620;
const TICK = 600;
const LOOP = 24;
const FINAL = 17;
const ease = [0.22, 1, 0.36, 1] as const;

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const subscribeHover = (cb: () => void) => {
  const mq = window.matchMedia(HOVER_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getHover = () => window.matchMedia(HOVER_QUERY).matches;

function Check({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------- the paper */

/* Designed on a fixed 280×380 page and scaled to whatever box it sits in, so the
   field highlights always land exactly on the printed values. */
const NOTE_W = 280;
const NOTE_H = 380;
const NOTE_BOXES = [
  { at: 9, x: 182, y: 25, w: 86, h: 19 },
  { at: 10, x: 12, y: 63, w: 112, h: 30 },
  { at: 11, x: 146, y: 63, w: 90, h: 30 },
  { at: 12, x: 146, y: 185, w: 124, h: 20, weight: true },
];

export function DeliveryNote({ t, held, scanning, width, tilt = 0 }: { t: number; held: boolean; scanning: boolean; width: number; tilt?: number }) {
  const k = width / NOTE_W;
  const label = "absolute text-[7.5px] tracking-[0.04em] text-black/50";
  const value = "absolute text-[9.5px] text-[#262626]";
  return (
    <div style={{ width, height: NOTE_H * k, transform: `rotate(${tilt}deg)` }} className="relative">
      <div
        className="absolute left-0 top-0 origin-top-left rounded-[3px] bg-[#FBFAF6] overflow-hidden font-mono shadow-[0_1px_2px_rgba(16,24,40,0.12),0_10px_28px_-12px_rgba(16,24,40,0.35)]"
        style={{ width: NOTE_W, height: NOTE_H, transform: `scale(${k})` }}
      >
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:3px_3px]" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/[0.035]" />
        <p className="absolute left-4 top-4 text-[12px] font-bold tracking-[0.1em] text-[#1A1A1A]">KESTREL HAULAGE</p>
        <p className="absolute left-4 top-[33px] text-[7.5px] text-black/50">Depot 3 · Weighbridge office</p>
        <p className="absolute right-4 top-4 text-[9px] font-bold text-[#1A1A1A]">DELIVERY NOTE</p>
        <p className="absolute right-4 top-[29px] text-[9.5px] text-[#262626]">No. 004417</p>
        <span className="absolute left-4 right-4 top-[54px] border-t border-dashed border-black/25" />
        <p className={label} style={{ left: 16, top: 66 }}>CUSTOMER</p>
        <p className={value} style={{ left: 16, top: 77 }}>Northline Supply</p>
        <p className={label} style={{ left: 150, top: 66 }}>DATE</p>
        <p className={value} style={{ left: 150, top: 77 }}>06/10/2026</p>
        <p className={label} style={{ left: 16, top: 100 }}>PRODUCT</p>
        <p className={value} style={{ left: 16, top: 111 }}>Pine logs, 6 m</p>
        <p className={label} style={{ left: 150, top: 100 }}>VEHICLE</p>
        <p className={value} style={{ left: 150, top: 111 }}>••• 412 ••</p>
        <span className="absolute left-4 right-4 top-[136px] border-t border-dashed border-black/25" />
        <p className={value} style={{ left: 16, top: 148 }}>GROSS MASS</p>
        <p className={value} style={{ right: 16, top: 148 }}>42 640 kg</p>
        <p className={value} style={{ left: 16, top: 165 }}>TARE MASS</p>
        <p className={value} style={{ right: 16, top: 165 }}>14 180 kg</p>
        <span className="absolute left-4 right-4 top-[183px] border-t border-black/40" />
        <p className={`${value} font-bold`} style={{ left: 16, top: 189 }}>NET MASS</p>
        <p className={`${value} font-bold`} style={{ right: 16, top: 189 }}>{held ? "26 980 kg" : "28 460 kg"}</p>
        <div className="absolute left-4 right-4 top-[218px] space-y-[7px]">
          {[92, 78, 86].map((w, i) => <span key={i} className="block h-[3px] rounded-full bg-black/[0.07]" style={{ width: `${w}%` }} />)}
        </div>
        <svg viewBox="0 0 90 26" className="absolute left-4 top-[296px] w-[100px]" aria-hidden>
          <path d="M2 18c8-14 14 6 20-4s6-10 12 2 10-4 16-6 8 10 14 4 12-8 22-2" fill="none" stroke="#1F3A8A" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <p className="absolute left-4 top-[332px] w-[120px] border-t border-black/30 pt-[3px] text-[7.5px] text-black/50">RECEIVED BY</p>
        <div className="absolute right-5 top-[290px] px-2 py-1.5 rounded-[3px] border-2 border-[#B91C1C]/45 text-[#B91C1C]/55 rotate-[-8deg] text-[7.5px] font-bold text-center leading-tight tracking-[0.08em]">
          WEIGHED<br />06 OCT
        </div>

        {scanning && (
          <motion.div
            className="absolute left-0 right-0 h-[70px] pointer-events-none"
            initial={{ top: -70 }}
            animate={{ top: NOTE_H }}
            transition={{ duration: 2.2, ease: "linear" }}
            style={{ background: "linear-gradient(180deg, transparent, rgba(153,229,140,0.32) 82%, rgba(29,107,43,0.75) 100%)" }}
          />
        )}
        {NOTE_BOXES.map((b, i) =>
          t >= b.at ? (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease }}
              className={`absolute rounded-[4px] border-[1.5px] ${b.weight && held && t >= 13 ? "border-[#D97706] bg-[#FEF3C7]/50" : "border-[#1D6B2B] bg-[#99E58C]/15"}`}
              style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- the phone */

export function Phone({ t }: { t: number }) {
  const shots = Math.min(3, Math.max(0, t));
  const offline = t >= 4 && t < 7;
  const sent = t >= 7;
  return (
    <div className="relative w-[230px] h-[456px] rounded-[42px] bg-[#0E0E0E] p-[9px] shadow-[0_50px_80px_-30px_rgba(16,24,40,0.55),0_20px_40px_-20px_rgba(16,24,40,0.35),inset_0_0_0_1.5px_#2A2A2A]">
      <span className="absolute -left-[3px] top-[96px] w-[3px] h-[40px] rounded-l bg-[#1A1A1A]" />
      <span className="absolute -right-[3px] top-[120px] w-[3px] h-[64px] rounded-r bg-[#1A1A1A]" />
      <div className="relative w-full h-full rounded-[34px] bg-[#111] overflow-hidden">
        <div className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[78px] h-[22px] rounded-full bg-black z-20" />
        <div className="relative z-10 flex justify-between px-6 pt-[13px] text-[10px] font-semibold text-white">
          <span>17:42</span>
          <span className="flex items-center gap-1">
            {offline ? <span className="text-white/60">No signal</span> : (
              <span className="flex items-end gap-[2px]">{[4, 6, 8, 10].map((h) => <span key={h} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />)}</span>
            )}
          </span>
        </div>

        {/* viewfinder */}
        <div className="absolute inset-x-0 top-[40px] h-[262px] bg-[linear-gradient(180deg,#2E2E2A,#141414)]">
          <div className="absolute left-1/2 top-[20px] -translate-x-1/2">
            <DeliveryNote t={0} held={false} scanning={false} width={150} tilt={3} />
          </div>
          {["top-[14px] left-[30px] border-t-2 border-l-2", "top-[14px] right-[30px] border-t-2 border-r-2", "bottom-[22px] left-[30px] border-b-2 border-l-2", "bottom-[22px] right-[30px] border-b-2 border-r-2"].map((c) => (
            <span key={c} className={`absolute w-5 h-5 border-[#99E58C] rounded-[3px] ${c}`} />
          ))}
          <AnimatePresence>
            {t >= 1 && t <= 3 && (
              <motion.span key={`flash-${t}`} initial={{ opacity: 0.85 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 bg-white" />
            )}
          </AnimatePresence>
          <p className="absolute bottom-[4px] inset-x-0 text-center text-[9px] text-white/70">{t < 4 ? "Hold steady · reading edges" : "3 pages captured"}</p>
        </div>

        {/* capture tray */}
        <div className="absolute inset-x-0 top-[302px] bottom-0 px-4 pt-3">
          <div className="flex items-center gap-2 mb-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-[38px] h-[50px] rounded-[5px] overflow-hidden transition-colors duration-200 ${shots > i ? "" : "border border-dashed border-white/25"}`}>
                {shots > i && (
                  <motion.div initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35, ease }} className="w-full h-full">
                    <DeliveryNote t={0} held={false} scanning={false} width={38} />
                  </motion.div>
                )}
              </div>
            ))}
            <div className="ml-auto text-right">
              <p className="text-[11px] font-semibold text-white">Load 2417</p>
              <p className="text-[9px] text-white/50">{shots}/3 pages</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {offline && (
              <motion.p key="off" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-[10px] bg-white/10 px-3 py-2 text-[9.5px] leading-snug text-white/80 mb-2">
                No signal. Saved on this phone. It’ll send itself.
              </motion.p>
            )}
          </AnimatePresence>
          <div className={`h-[40px] rounded-[14px] flex items-center justify-center gap-1.5 text-[12px] font-bold transition-colors duration-300 ${sent ? "bg-white/10 text-[#99E58C]" : shots >= 3 ? "bg-[#99E58C] text-[#0C1A0D]" : "bg-white/10 text-white/40"}`}>
            {sent ? <><Check className="w-3.5 h-3.5" /> Sent to office</> : offline ? "Waiting for signal…" : "Send load"}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- the office */

const NAV = ["Loads", "Drivers", "Customers", "Invoices", "Reports"];

export function Dashboard({ t, held }: { t: number; held: boolean }) {
  const arrived = t >= 8;
  const fields = [
    { at: 9, k: "Customer", v: "Northline Supply" },
    { at: 10, k: "Note no.", v: "004417" },
    { at: 11, k: "Product", v: "Pine logs, 6 m" },
    { at: 12, k: "Net mass", v: held ? "26 980 kg" : "28 460 kg" },
  ];
  const checked = t >= 13;
  const status = !arrived ? null : !checked ? { label: "Reading", cls: "bg-[#F0F0F0] text-[#4A5565]" } : held ? { label: "Needs a look", cls: "bg-[#FEF3C7] text-[#92400E]" } : { label: "Ready to invoice", cls: "bg-[#EAF8E6] text-[#1D6B2B]" };
  const rows = [
    { id: "2416", who: "Ridge Farms", s: "Invoiced", cls: "bg-[#1F1F1F] text-white" },
    { id: "2415", who: "Kaya Building", s: "Invoiced", cls: "bg-[#1F1F1F] text-white" },
    { id: "2414", who: "Harbour Foods", s: "Ready to invoice", cls: "bg-[#EAF8E6] text-[#1D6B2B]" },
    { id: "2413", who: "Oakline Joinery", s: "Invoiced", cls: "bg-[#1F1F1F] text-white" },
    { id: "2412", who: "Ridge Farms", s: "Invoiced", cls: "bg-[#1F1F1F] text-white" },
  ];
  return (
    <div className="w-[840px] h-[560px] rounded-[14px] bg-white border border-[#E5E7EB] shadow-[0_60px_100px_-40px_rgba(16,24,40,0.35),0_24px_48px_-24px_rgba(16,24,40,0.18)] overflow-hidden flex flex-col text-[12px]">
      <div className="h-[44px] flex items-center gap-3 px-4 border-b border-[#E5E7EB] bg-[#FCFCFC]">
        <span className="font-semibold text-[#101828]">Office</span>
        <span className="text-[#99A1AF]">/ Loads</span>
        <span className="mx-auto w-[220px] h-[26px] rounded-[7px] bg-white border border-[#E5E7EB] text-[#99A1AF] text-[11px] flex items-center px-2.5 gap-1.5">
          <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>
          Search loads, customers
        </span>
        <span className="text-[11px] text-[#4A5565]">Synced just now</span>
      </div>
      <div className="flex-1 flex min-h-0">
        <aside className="w-[150px] border-r border-[#E5E7EB] bg-[#FAFAFA] p-3 flex flex-col gap-1">
          {NAV.map((n, i) => (
            <span key={n} className={`flex items-center justify-between px-2.5 py-[7px] rounded-[7px] ${i === 0 ? "bg-white border border-[#E5E7EB] text-[#101828] font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.04)]" : "text-[#6A7282]"}`}>
              {n}
              {i === 0 && <span className="text-[10px] font-semibold text-[#4A5565] tabular-nums">{arrived ? 6 : 5}</span>}
            </span>
          ))}
          <div className="mt-auto rounded-[8px] border border-[#E5E7EB] bg-white p-2.5">
            <p className="text-[10px] text-[#6A7282]">This week</p>
            <p className="text-[13px] font-semibold text-[#101828] tabular-nums">31 loads</p>
            <div className="mt-1.5 flex items-end gap-[3px] h-[22px]">
              {[8, 12, 9, 15, 11, 17, 13].map((h, i) => <span key={i} className="flex-1 rounded-[1px] bg-[#101828]/80" style={{ height: h + 4 }} />)}
            </div>
          </div>
        </aside>

        {/* list */}
        <div className="w-[270px] border-r border-[#E5E7EB] flex flex-col">
          <div className="px-4 py-3 flex items-center justify-between border-b border-[#E5E7EB]">
            <p className="font-semibold text-[#101828] text-[13px]">Today</p>
            <span className="text-[11px] text-[#6A7282]">Newest first</span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false}>
              {arrived && (
                <motion.div
                  key="new"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 58, opacity: 1, backgroundColor: ["#EAF8E6", "#F7FCF5"] }}
                  transition={{ duration: 0.45, ease, backgroundColor: { duration: 2 } }}
                  className="overflow-hidden border-b border-[#E5E7EB] border-l-2 border-l-[#101828]"
                >
                  <div className="px-4 h-[58px] flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-[#101828]">Load 2417</p>
                      <p className="text-[11px] text-[#6A7282]">Northline Supply · 17:42</p>
                    </div>
                    {status && <span className={`px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-semibold ${status.cls}`}>{status.label}</span>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {rows.map((r) => (
              <div key={r.id} className="px-4 h-[58px] flex items-center justify-between border-b border-[#F0F0F0]">
                <div>
                  <p className="font-medium text-[#364153]">Load {r.id}</p>
                  <p className="text-[11px] text-[#99A1AF]">{r.who}</p>
                </div>
                <span className={`px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-semibold ${r.cls}`}>{r.s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* detail */}
        <div className="flex-1 min-w-0 p-4 flex flex-col gap-3 bg-[#FCFCFC]">
          {!arrived ? (
            <div className="flex-1 rounded-[10px] border border-dashed border-[#D4D4D4] flex items-center justify-center text-[#99A1AF] text-[12px]">
              Waiting for the next load…
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="flex-1 flex flex-col gap-3 min-h-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#101828] text-[13px]">Load 2417 <span className="font-normal text-[#99A1AF]">· 3 pages</span></p>
                {status && <span className={`px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-semibold ${status.cls}`}>{status.label}</span>}
              </div>
              <div className="flex gap-3 min-h-0">
                <div className="flex-shrink-0 pt-0.5 pl-0.5">
                  <DeliveryNote t={t} held={held} scanning={t >= 8 && t < 13} width={182} tilt={-1} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  {fields.map((f) => (
                    <div key={f.k} className="rounded-[7px] border border-[#E5E7EB] bg-white px-2.5 py-[7px]">
                      <p className="text-[10px] text-[#6A7282]">{f.k}</p>
                      <div className="h-[16px] flex items-center justify-between gap-1">
                        {t >= f.at ? (
                          <motion.span initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} className={`font-semibold tabular-nums truncate ${f.k === "Net mass" && held && checked ? "text-[#92400E]" : "text-[#101828]"}`}>
                            {f.v}
                          </motion.span>
                        ) : (
                          <span className="block h-2 w-20 rounded-full bg-[#F0F0F0] animate-pulse" />
                        )}
                        {t >= f.at && <Check className={`w-3 h-3 flex-shrink-0 ${f.k === "Net mass" && held && checked ? "text-[#D97706]" : "text-[#1D6B2B]"}`} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`rounded-[8px] px-3 py-2.5 text-[11.5px] font-semibold flex items-center gap-2 transition-colors duration-300 ${!checked ? "bg-[#F5F5F5] text-[#6A7282]" : held ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#EAF8E6] text-[#1D6B2B]"}`}>
                {!checked ? (
                  <>Comparing all 3 pages<span className="ml-1 inline-block w-10 h-[3px] rounded-[2px] bg-[linear-gradient(90deg,#D4D4D4,#99A1AF,#D4D4D4)] bg-[length:200%_100%] animate-pulse" /></>
                ) : held ? (
                  <>Ticket says 28 460 kg, note says 26 980 kg. Held for a person to check.</>
                ) : (
                  <><Check className="w-3.5 h-3.5" /> 28 460 kg on all 3 pages. Filed, trip sheet updated.</>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- the accounts */

export function Invoice({ t, held }: { t: number; held: boolean }) {
  const show = t >= 14;
  const lines = [
    { at: 15, k: "Pine logs, 28.46 t", v: "11 384.00" },
    { at: 15, k: "Fuel levy", v: "568.00" },
    { at: 16, k: "VAT", v: "1 792.80" },
  ];
  return (
    <div className="w-[262px] rounded-[14px] bg-white border border-[#E5E7EB] shadow-[0_50px_80px_-30px_rgba(16,24,40,0.45),0_16px_32px_-16px_rgba(16,24,40,0.2)] p-4 text-[11.5px]">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 font-semibold text-[#101828] text-[12.5px]">
          <span className="w-[22px] h-[22px] rounded-[6px] bg-[#F5F5F5] border border-[#E5E7EB] flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" aria-hidden><rect x="3" y="2" width="10" height="12" rx="1.5" stroke="#101828" strokeWidth="1.4" /><path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="#101828" strokeWidth="1.4" strokeLinecap="round" /></svg>
          </span>
          Accounts
        </span>
        <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-semibold ${!show ? "bg-[#F0F0F0] text-[#99A1AF]" : held ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#F0F0F0] text-[#4A5565]"}`}>
          {!show ? "Idle" : held ? "On hold" : "Draft"}
        </span>
      </div>
      <AnimatePresence mode="wait">
        {!show ? (
          <motion.div key="idle" exit={{ opacity: 0 }} className="space-y-2">
            {[70, 90, 55].map((w, i) => <span key={i} className="block h-2.5 rounded-full bg-[#F3F3F3]" style={{ width: `${w}%` }} />)}
          </motion.div>
        ) : held ? (
          <motion.div key="held" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }}>
            <p className="font-semibold text-[#101828] text-[13px] leading-snug">No invoice yet</p>
            <p className="text-[#6A7282] mt-1 leading-snug">This load is waiting for someone to check the weights. Nothing gets billed on a guess.</p>
          </motion.div>
        ) : (
          <motion.div key="inv" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }}>
            <p className="text-[#6A7282]">INV-0193 · Northline Supply</p>
            <div className="mt-2.5 space-y-1.5">
              {lines.map((l) => (
                <motion.p key={l.k} initial={{ opacity: 0 }} animate={{ opacity: t >= l.at ? 1 : 0 }} className="flex justify-between text-[#364153]">
                  <span>{l.k}</span><span className="tabular-nums">{l.v}</span>
                </motion.p>
              ))}
            </div>
            <div className="mt-2.5 pt-2.5 border-t border-[#E5E7EB] flex justify-between items-baseline">
              <span className="font-semibold text-[#101828]">Total</span>
              <span className="font-display text-[19px] text-[#101828] tabular-nums">{t >= 16 ? "13 744.80" : "—"}</span>
            </div>
            <p className="mt-2 text-[10.5px] text-[#6A7282]">Waiting for your approval. Nobody typed anything.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------- beams */

function Beam({ d, fire, id }: { d: string; fire: boolean; id: string }) {
  return (
    <g>
      <path d={d} fill="none" stroke="#D4D4D4" strokeWidth="1.2" strokeDasharray="2 5" />
      {fire && (
        <motion.path
          key={id}
          d={d}
          fill="none"
          stroke={`url(#grad-${id.split("-")[0]})`}
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.18 1"
          initial={{ strokeDashoffset: 0.18 }}
          animate={{ strokeDashoffset: -1 }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
          style={{ filter: "drop-shadow(0 0 6px rgba(153,229,140,0.9))" }}
        />
      )}
    </g>
  );
}

/* ------------------------------------------------------------- shared clock */

function useStageClock(target: React.RefObject<HTMLElement | null>) {
  const inView = useInView(target, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setCount((c) => c + 1), TICK);
    return () => clearInterval(id);
  }, [reduce, inView]);
  const loop = Math.floor(count / LOOP);
  return { t: reduce ? FINAL : count % LOOP, held: !reduce && loop % 2 === 1, loop, reduce };
}

function useFitScale(target: React.RefObject<HTMLElement | null>, width: number, max = 1) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(max, e.contentRect.width / width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [target, width, max]);
  return scale;
}

/* Renders a fixed-size component at a smaller size without reflowing its internals. */
function Scaled({ k, w, h, children }: { k: number; w: number; h: number; children: React.ReactNode }) {
  return (
    <div style={{ width: w * k, height: h * k }} className="relative">
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${k})` }}>{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------- stage */

function Layer({ children, x, y, depth, mx, my, className = "" }: { children: React.ReactNode; x: number; y: number; depth: number; mx: MotionValue<number>; my: MotionValue<number>; className?: string }) {
  const tx = useTransform(mx, (v) => v * depth);
  const ty = useTransform(my, (v) => v * depth);
  return (
    <motion.div className={`absolute ${className}`} style={{ left: x, top: y, x: tx, y: ty }}>
      {children}
    </motion.div>
  );
}

export function HeroStage() {
  const wrap = useRef<HTMLDivElement>(null);
  const scale = useFitScale(wrap, W);
  const canHover = useSyncExternalStore(subscribeHover, getHover, () => false);
  const { t, held, loop, reduce } = useStageClock(wrap);

  // mouse parallax + scroll-driven flatten
  const mx = useSpring(useMotionValue(0), { stiffness: 90, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 90, damping: 20 });
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "center center"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [0.93, 1]);

  function onMove(e: React.MouseEvent) {
    if (!canHover || reduce || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }

  return (
    <div
      ref={wrap}
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className="relative w-full [perspective:2200px]"
      style={{ height: H * scale }}
      role="img"
      aria-label="Animated example: a driver photographs a delivery note with no signal, it sends itself later, the office system reads every field, checks the weights and creates a draft invoice. When the weights disagree, the invoice is held for a person to check."
    >
      <motion.div
        className="absolute left-1/2 top-0 origin-top"
        style={{ width: W, height: H, x: "-50%", scale, transformStyle: "preserve-3d" }}
      >
        <motion.div className="relative w-full h-full origin-[50%_0%]" style={reduce ? undefined : { rotateX, scale: lift }}>
          {/* ground shadow */}
          <div aria-hidden className="absolute left-[8%] right-[8%] bottom-[-40px] h-[80px] rounded-[50%] bg-[#101828]/10 blur-3xl" />

          <Layer x={170} y={20} depth={6} mx={mx} my={my}>
            <Dashboard t={t} held={held} />
          </Layer>

          {/* data beams sit between the office and the front layers */}
          <svg aria-hidden className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox={`0 0 ${W} ${H}`}>
            <defs>
              <linearGradient id="grad-a" x1="0" x2="1"><stop offset="0" stopColor="#99E58C" stopOpacity="0" /><stop offset="1" stopColor="#1D6B2B" /></linearGradient>
              <linearGradient id="grad-b" x1="0" x2="1"><stop offset="0" stopColor="#99E58C" stopOpacity="0" /><stop offset="1" stopColor="#1D6B2B" /></linearGradient>
            </defs>
            <Beam id={`a-${loop}`} d="M 238 330 C 300 330, 330 108, 330 108" fire={t >= 7 && t < 10} />
            <Beam id={`b-${loop}`} d="M 990 470 C 1010 470, 1010 420, 1012 330" fire={t >= 13 && t < 16} />
          </svg>

          <Layer x={10} y={150} depth={18} mx={mx} my={my}>
            <Phone t={t} />
          </Layer>

          <Layer x={905} y={330} depth={14} mx={mx} my={my}>
            <Invoice t={t} held={held} />
          </Layer>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------- mobile */

function CompactOffice({ t, held }: { t: number; held: boolean }) {
  const arrived = t >= 8;
  const checked = t >= 13;
  const fields = [
    { at: 9, k: "Customer", v: "Northline Supply" },
    { at: 10, k: "Note no.", v: "004417" },
    { at: 12, k: "Net mass", v: held ? "26 980 kg" : "28 460 kg" },
  ];
  const status = !arrived ? { label: "Waiting", cls: "bg-[#F0F0F0] text-[#99A1AF]" } : !checked ? { label: "Reading", cls: "bg-[#F0F0F0] text-[#4A5565]" } : held ? { label: "Needs a look", cls: "bg-[#FEF3C7] text-[#92400E]" } : { label: "Ready to invoice", cls: "bg-[#EAF8E6] text-[#1D6B2B]" };
  return (
    <div className="w-[300px] rounded-[14px] bg-white border border-[#E5E7EB] shadow-[0_40px_70px_-30px_rgba(16,24,40,0.35),0_16px_32px_-18px_rgba(16,24,40,0.18)] overflow-hidden text-[12px]">
      <div className="h-[40px] px-3.5 flex items-center justify-between border-b border-[#E5E7EB] bg-[#FCFCFC]">
        <span className="font-semibold text-[#101828]">Office <span className="font-normal text-[#99A1AF]">/ Load 2417</span></span>
        <span className={`px-1.5 py-0.5 rounded-[4px] text-[10.5px] font-semibold ${status.cls}`}>{status.label}</span>
      </div>
      <div className="p-3 flex gap-3 bg-[#FCFCFC]">
        <div className="flex-shrink-0">
          <DeliveryNote t={t} held={held} scanning={t >= 8 && t < 13} width={118} tilt={-1.5} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {fields.map((f) => (
            <div key={f.k} className="rounded-[7px] border border-[#E5E7EB] bg-white px-2 py-1.5">
              <p className="text-[9.5px] text-[#6A7282]">{f.k}</p>
              <div className="h-[15px] flex items-center justify-between gap-1">
                {t >= f.at ? (
                  <motion.span initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} className={`text-[11.5px] font-semibold tabular-nums truncate ${f.k === "Net mass" && held && checked ? "text-[#92400E]" : "text-[#101828]"}`}>{f.v}</motion.span>
                ) : (
                  <span className="block h-1.5 w-14 rounded-[2px] bg-[#F0F0F0]" />
                )}
                {t >= f.at && <Check className={`w-3 h-3 flex-shrink-0 ${f.k === "Net mass" && held && checked ? "text-[#D97706]" : "text-[#1D6B2B]"}`} />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`mx-3 mb-3 rounded-[8px] px-2.5 py-2 text-[11px] font-semibold leading-snug transition-colors duration-300 ${!checked ? "bg-[#F5F5F5] text-[#6A7282]" : held ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#EAF8E6] text-[#1D6B2B]"}`}>
        {!arrived ? "Waiting for the next load" : !checked ? "Reading 3 pages…" : held ? "Weights disagree. Held for a person to check." : "28 460 kg on every page. Filed."}
      </div>
    </div>
  );
}

const MW = 360;
const MH = 560;

export function HeroStageMobile() {
  const wrap = useRef<HTMLDivElement>(null);
  const scale = useFitScale(wrap, MW, 1.25);
  const { t, held, loop } = useStageClock(wrap);
  return (
    <div
      ref={wrap}
      className="relative w-full"
      style={{ height: MH * scale }}
      role="img"
      aria-label="Animated example: a driver photographs a delivery note with no signal, it sends itself later, the office system reads the fields, checks the weights and creates a draft invoice, or holds it when the weights disagree."
    >
      <div className="absolute left-1/2 top-0 origin-top" style={{ width: MW, height: MH, transform: `translateX(-50%) scale(${scale})` }}>
        <div aria-hidden className="absolute left-[10%] right-[10%] bottom-[-10px] h-[50px] rounded-[50%] bg-[#101828]/10 blur-2xl" />
        <div className="absolute" style={{ left: 30, top: 0 }}>
          <CompactOffice t={t} held={held} />
        </div>
        <svg aria-hidden className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox={`0 0 ${MW} ${MH}`}>
          <defs>
            <linearGradient id="grad-ma" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stopColor="#99E58C" stopOpacity="0" /><stop offset="1" stopColor="#1D6B2B" /></linearGradient>
            <linearGradient id="grad-mb" x1="0" x2="1"><stop offset="0" stopColor="#99E58C" stopOpacity="0" /><stop offset="1" stopColor="#1D6B2B" /></linearGradient>
          </defs>
          <Beam id={`ma-${loop}`} d="M 70 300 C 70 270, 26 240, 30 180" fire={t >= 7 && t < 10} />
          <Beam id={`mb-${loop}`} d="M 300 300 C 300 330, 300 350, 300 372" fire={t >= 13 && t < 16} />
        </svg>
        <div className="absolute" style={{ left: 0, top: 262 }}>
          <Scaled k={0.62} w={230} h={456}><Phone t={t} /></Scaled>
        </div>
        <div className="absolute" style={{ left: 158, top: 340 }}>
          <Scaled k={0.77} w={262} h={250}><Invoice t={t} held={held} /></Scaled>
        </div>
      </div>
    </div>
  );
}
