"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";

/*
 * Hero showpiece. A fixed 1180×620 artboard, scaled to fit, showing one finished job travel from
 * a team member's phone, through the office (where the signed job card is read field by field),
 * into a draft invoice that waits for approval. One clock drives every layer; every second loop
 * the parts on the card don't match what was booked out of stock, and the system holds the
 * invoice for a person instead of guessing. Industry-neutral on purpose: any service business.
 *
 * Visual direction (refero lock): Flighty's "control tower" layering — a device with live cards
 * floating around it, depth from stacked hairline shadows — with Clerk/Linear in-app chrome:
 * hairlines, tabular numbers, mono IDs, icons beside every nav item, avatars for people.
 */

const W = 1200;
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
const subscribeNoop = () => () => {};

/* ------------------------------------------------------------- icons (1.5px line, 16 grid) */

const ICON = {
  check: "M3.5 8.5l3 3 6-7",
  clipboard: "M6 2.5h4v2H6zM4.5 3.5H4v10h8v-10h-.5M6 8h4M6 10.5h2.5",
  users: "M6 7.5a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6zM2.5 13.3c0-2 1.6-3.6 3.5-3.6s3.5 1.6 3.5 3.6M10.3 3.1a2.3 2.3 0 0 1 0 4.4M11.3 9.9c1.3.4 2.2 1.7 2.2 3.4",
  building: "M3 13.5v-10h7v10M10 6.5h3v7M2 13.5h12M5.2 5.8h.6M7.2 5.8h.6M5.2 8.3h.6M7.2 8.3h.6M5.2 10.8h.6M7.2 10.8h.6",
  receipt: "M4 2.5h8v11l-1.6-1-1.6 1-.8-.5-.8.5-1.6-1-1.6 1zM6 6h4M6 8.5h4",
  chart: "M3 13.5h10M4.8 11V7.5M8 11V4.5M11.2 11V9",
  search: "M7 11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM10.5 10.5L14 14",
  sync: "M13 8a5 5 0 0 1-8.6 3.5M3 8a5 5 0 0 1 8.6-3.5M11.6 2.2v2.7H8.9M4.4 13.8v-2.7h2.7",
  clock: "M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM8 4.8V8l2.2 1.4",
  checkCircle: "M8 14.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM5.3 8.2l1.9 1.9 3.6-4",
  alert: "M8 2.5l6 10.5H2zM8 6.5v3M8 11.3v.2",
  cloudOff: "M5 12.5h6.5a2.7 2.7 0 0 0 .6-5.4A4 4 0 0 0 4.6 8 2.3 2.3 0 0 0 5 12.5zM2.5 2.5l11 11",
  wifi: "M2 6.3a9 9 0 0 1 12 0M4.3 8.8a5.6 5.6 0 0 1 7.4 0M6.6 11.2a2.3 2.3 0 0 1 2.8 0M8 13.3v.1",
  camera: "M3 5.5h2.2l1-1.5h3.6l1 1.5H13v7.5H3zM8 11a2.2 2.2 0 1 0 0-4.4A2.2 2.2 0 0 0 8 11z",
  send: "M2.5 8h10M8.5 3.5L13 8l-4.5 4.5",
  file: "M4 2.5h5.5L12.5 5.5v8H4zM9.5 2.5v3h3M6 8.5h4M6 11h3",
  bell: "M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9zM6.8 14h2.4",
  filter: "M2.5 4h11M4.5 8h7M6.5 12h3",
  pin: "M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 9.8 8 14 8 14zM8 8a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  lock: "M4.5 7.5h7v6h-7zM6 7.5V5.5a2 2 0 0 1 4 0v2",
} as const;

function Icon({ d, className = "w-3.5 h-3.5", sw = 1.5 }: { d: string; className?: string; sw?: number }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Check({ className = "w-3 h-3" }: { className?: string }) {
  return <Icon d={ICON.check} className={className} sw={2} />;
}

/* Initials avatar: a rounded square (never a circle) in one of a few muted, named tones. */
const TONES: Record<string, string> = {
  S: "bg-[#DCEBF7] text-[#1E4F7A]",
  L: "bg-[#F3E3D3] text-[#7A4A1E]",
  A: "bg-[#E6E1F5] text-[#4A3A7A]",
  G: "bg-[#E1F0DC] text-[#1D6B2B]",
  N: "bg-[#101828] text-white",
};
function Avatar({ name, size = 22, className = "" }: { name: string; size?: number; className?: string }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  const tone = TONES[initials[0]] ?? "bg-[#EEF0F3] text-[#364153]";
  return (
    <span
      className={`inline-flex flex-shrink-0 items-center justify-center rounded-[6px] font-semibold ${tone} ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42), letterSpacing: "0.01em" }}
    >
      {initials}
    </span>
  );
}

/* Status chip with a leading icon. Green stays a quiet status tone inside the product. */
type ChipTone = "ok" | "hold" | "done" | "idle" | "read";
const CHIP: Record<ChipTone, { cls: string; icon: string }> = {
  ok: { cls: "bg-[#EAF8E6] text-[#1D6B2B]", icon: ICON.checkCircle },
  hold: { cls: "bg-[#FEF3C7] text-[#92400E]", icon: ICON.alert },
  done: { cls: "bg-[#1F1F1F] text-white", icon: ICON.check },
  idle: { cls: "bg-[#F2F3F5] text-[#99A1AF]", icon: ICON.clock },
  read: { cls: "bg-[#F2F3F5] text-[#4A5565]", icon: ICON.sync },
};
function Chip({ tone, children, className = "" }: { tone: ChipTone; children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 pl-1 pr-1.5 py-[2px] rounded-[5px] text-[10.5px] font-semibold whitespace-nowrap ${CHIP[tone].cls} ${className}`}>
      <Icon d={CHIP[tone].icon} className={`w-3 h-3 ${tone === "read" ? "animate-[spin_2.4s_linear_infinite] motion-reduce:animate-none" : ""}`} sw={1.7} />
      {children}
    </span>
  );
}

/* Count-up for money. Tabular, space-grouped thousands, two decimals. */
function fmt(v: number) {
  const s = v.toFixed(2);
  const [i, d] = s.split(".");
  return `${i.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}.${d}`;
}
function CountUp({ to, run, className = "" }: { to: number; run: boolean; className?: string }) {
  const reduce = useReduceAfterMount();
  const mv = useMotionValue(run && reduce ? to : 0);
  const text = useTransform(mv, fmt);
  useEffect(() => {
    if (!run) { mv.set(0); return; }
    if (reduce) { mv.set(to); return; }
    const c = animate(mv, to, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [run, to, reduce, mv]);
  return <motion.span className={`tabular-nums ${className}`}>{text}</motion.span>;
}

/* A text value that wipes in from the left, like it's being filled rather than pasted. */
function Fill({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReduceAfterMount();
  return (
    <motion.span
      initial={reduce ? false : { clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
      animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      transition={{ duration: 0.42, ease: "linear", delay }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------- the paper */

/* A signed job card from a printed pad. Designed on a fixed 280×380 page and scaled to whatever
   box it sits in, so the field highlights always land exactly on the printed values.
   Still exported as `DeliveryNote`: app/social imports it under that name. */
const NOTE_W = 280;
const NOTE_H = 380;
const NOTE_BOXES = [
  { at: 9, x: 182, y: 25, w: 86, h: 19 },
  { at: 10, x: 12, y: 63, w: 124, h: 30 },
  { at: 11, x: 12, y: 97, w: 124, h: 30 },
  { at: 12, x: 146, y: 185, w: 124, h: 20, parts: true },
];

export function DeliveryNote({ t, held, scanning, width, tilt = 0 }: { t: number; held: boolean; scanning: boolean; width: number; tilt?: number }) {
  const k = width / NOTE_W;
  const label = "absolute text-[7.5px] tracking-[0.04em] text-black/50";
  const value = "absolute text-[9.5px] text-[#262626]";
  return (
    <div style={{ width, height: NOTE_H * k, transform: `rotate(${tilt}deg)` }} className="relative">
      <div
        className="absolute left-0 top-0 origin-top-left rounded-[3px] overflow-hidden font-mono shadow-[0_0_0_0.5px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.10),0_12px_28px_-12px_rgba(16,24,40,0.35)]"
        style={{ width: NOTE_W, height: NOTE_H, transform: `scale(${k})`, background: "linear-gradient(160deg,#FCFBF7 0%,#F7F5EE 100%)" }}
      >
        {/* paper grain and a faint fold */}
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:3px_3px]" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-black/[0.04]" />
        <div className="absolute inset-y-0 left-1/2 w-[18px] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.025),transparent)]" />
        <p className="absolute left-4 top-4 text-[12px] font-bold tracking-[0.1em] text-[#1A1A1A]">NORTHSIDE SERVICES</p>
        <p className="absolute left-4 top-[33px] text-[7.5px] text-black/50">Repairs &amp; maintenance · Pad B</p>
        <p className="absolute right-4 top-4 text-[9px] font-bold text-[#1A1A1A]">JOB CARD</p>
        <p className="absolute right-4 top-[29px] text-[9.5px] text-[#262626]">No. 0418</p>
        <span className="absolute left-4 right-4 top-[54px] border-t border-dashed border-black/25" />
        <p className={label} style={{ left: 16, top: 66 }}>CUSTOMER</p>
        <p className={value} style={{ left: 16, top: 77 }}>Greenway Café</p>
        <p className={label} style={{ left: 150, top: 66 }}>DATE</p>
        <p className={value} style={{ left: 150, top: 77 }}>14/10/2026</p>
        <p className={label} style={{ left: 16, top: 100 }}>JOB</p>
        <p className={value} style={{ left: 16, top: 111 }}>Fridge not cooling</p>
        <p className={label} style={{ left: 150, top: 100 }}>DONE BY</p>
        <p className={value} style={{ left: 150, top: 111 }}>Sam</p>
        <span className="absolute left-4 right-4 top-[136px] border-t border-dashed border-black/25" />
        <p className={value} style={{ left: 16, top: 148 }}>WORK DONE</p>
        <p className={value} style={{ right: 16, top: 148 }}>Door seal replaced</p>
        <p className={value} style={{ left: 16, top: 165 }}>TIME ON SITE</p>
        <p className={value} style={{ right: 16, top: 165 }}>1.5 h</p>
        <span className="absolute left-4 right-4 top-[183px] border-t border-black/40" />
        <p className={`${value} font-bold`} style={{ left: 16, top: 189 }}>PARTS USED</p>
        <p className={`${value} font-bold`} style={{ right: 16, top: 189 }}>{held ? "Door seal × 2" : "Door seal × 1"}</p>
        <div className="absolute left-4 right-4 top-[218px] space-y-[7px]">
          {[92, 78, 86].map((w, i) => <span key={i} className="block h-[3px] rounded-full bg-black/[0.07]" style={{ width: `${w}%` }} />)}
        </div>
        <svg viewBox="0 0 90 26" className="absolute left-4 top-[296px] w-[100px]" aria-hidden>
          <path d="M2 18c8-14 14 6 20-4s6-10 12 2 10-4 16-6 8 10 14 4 12-8 22-2" fill="none" stroke="#1F3A8A" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <p className="absolute left-4 top-[332px] w-[120px] border-t border-black/30 pt-[3px] text-[7.5px] text-black/50">CUSTOMER SIGNATURE</p>
        <div className="absolute right-5 top-[290px] px-2 py-1.5 rounded-[3px] border-2 border-[#B91C1C]/45 text-[#B91C1C]/55 rotate-[-8deg] text-[7.5px] font-bold text-center leading-tight tracking-[0.08em]">
          JOB DONE<br />14 OCT
        </div>

        {scanning && (
          <motion.div
            className="absolute left-0 right-0 h-[70px] pointer-events-none"
            initial={{ top: -70 }}
            animate={{ top: NOTE_H }}
            transition={{ duration: 2.2, ease: "linear" }}
            style={{ background: "linear-gradient(180deg, transparent, rgba(153,229,140,0.30) 82%, rgba(29,107,43,0.8) 99%, rgba(255,255,255,0.9) 100%)" }}
          />
        )}
        {NOTE_BOXES.map((b, i) =>
          t >= b.at ? (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease }}
              className={`absolute rounded-[4px] border-[1.5px] ${b.parts && held && t >= 13 ? "border-[#D97706] bg-[#FEF3C7]/50" : "border-[#1D6B2B] bg-[#99E58C]/15"}`}
              style={{ left: b.x, top: b.y, width: b.w, height: b.h }}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- the phone */

function StatusBar({ offline }: { offline: boolean }) {
  /* Kept narrow so the right-hand cluster clears the island. Offline, the bars dim rather than
     spelling out "No service": the toast on screen already says there's no signal. */
  return (
    <div className="relative z-10 flex items-center justify-between pl-[22px] pr-[16px] pt-[14px] text-[10.5px] font-semibold text-white">
      <span className="tabular-nums tracking-[0.01em]">17:42</span>
      <span className="flex items-center gap-[4px]">
        <svg viewBox="0 0 18 10" className="w-[14px] h-[8px]" aria-hidden>
          {[3.5, 5.5, 7.5, 9.5].map((h, i) => (
            <rect key={h} x={i * 4.5} y={10 - h} width="3" height={h} rx="0.8" fill="white" opacity={offline ? (i === 0 ? 0.6 : 0.22) : 1} />
          ))}
        </svg>
        <Icon d={ICON.wifi} className={`w-[12px] h-[12px] ${offline ? "text-white/35" : "text-white"}`} sw={1.6} />
        <span className="relative ml-[1px] w-[20px] h-[10px] rounded-[3px] border border-white/60">
          <span className="absolute inset-[1.5px] right-[4px] rounded-[1.5px] bg-white" />
          <span className="absolute -right-[2.5px] top-[2.5px] w-[1.5px] h-[4px] rounded-r bg-white/60" />
        </span>
      </span>
    </div>
  );
}

export function Phone({ t }: { t: number }) {
  const shots = Math.min(3, Math.max(0, t));
  const tapped = t === 4;
  const offline = t >= 4 && t < 7;
  const sent = t >= 7;
  return (
    <div
      className="relative w-[230px] h-[456px] rounded-[44px] p-[3px]"
      style={{ background: "linear-gradient(150deg,#4A4A4E 0%,#1C1C1F 28%,#232326 60%,#515156 100%)" }}
    >
      {/* side keys */}
      <span className="absolute -left-[2.5px] top-[98px] w-[2.5px] h-[22px] rounded-l-[2px] bg-[linear-gradient(90deg,#3A3A3E,#1A1A1C)]" />
      <span className="absolute -left-[2.5px] top-[136px] w-[2.5px] h-[38px] rounded-l-[2px] bg-[linear-gradient(90deg,#3A3A3E,#1A1A1C)]" />
      <span className="absolute -left-[2.5px] top-[184px] w-[2.5px] h-[38px] rounded-l-[2px] bg-[linear-gradient(90deg,#3A3A3E,#1A1A1C)]" />
      <span className="absolute -right-[2.5px] top-[150px] w-[2.5px] h-[60px] rounded-r-[2px] bg-[linear-gradient(90deg,#1A1A1C,#3A3A3E)]" />

      <div className="relative w-full h-full rounded-[41px] bg-[#070708] p-[7px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
        <div className="relative w-full h-full rounded-[34px] bg-[#0B0B0C] overflow-hidden shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
          <div className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[62px] h-[20px] rounded-full bg-black z-20" />
          <StatusBar offline={offline} />

          {/* viewfinder */}
          <div className="absolute inset-x-0 top-[40px] h-[262px] overflow-hidden" style={{ background: "radial-gradient(120% 80% at 50% 30%, #35332E 0%, #1E1D1B 55%, #0F0F0F 100%)" }}>
            <div className="absolute inset-x-0 top-0 h-[26px] flex items-center justify-between px-4 text-[9px] text-white/60">
              <span className="flex items-center gap-1"><Icon d={ICON.camera} className="w-3 h-3" />Job card</span>
              <span className="tabular-nums">{shots}/3</span>
            </div>
            <div className="absolute left-1/2 top-[28px] -translate-x-1/2" style={{ filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.45))" }}>
              <DeliveryNote t={0} held={false} scanning={false} width={148} tilt={3} />
            </div>
            {/* detected document edges hugging the card */}
            <svg viewBox="0 0 230 262" className="absolute inset-0 w-full h-full" aria-hidden>
              <motion.rect
                x="39.5" y="27" width="151" height="204" rx="4" transform="rotate(3 115 129)"
                fill="none" stroke="#99E58C" strokeWidth="1.6" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: t < 4 ? 0.95 : 0.45 }}
                transition={{ pathLength: { duration: 1.1, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
                style={{ filter: "drop-shadow(0 0 3px rgba(153,229,140,0.6))" }}
              />
            </svg>
            <AnimatePresence>
              {t >= 1 && t <= 3 && (
                <motion.span key={`flash-${t}`} initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.55 }} className="absolute inset-0 bg-white" />
              )}
            </AnimatePresence>
            <p className="absolute bottom-[6px] inset-x-0 text-center text-[9px] text-white/70">{t < 4 ? "Edges found · hold steady" : "3 photos captured"}</p>
          </div>

          {/* capture tray */}
          <div className="absolute inset-x-0 top-[302px] bottom-0 px-4 pt-2.5" style={{ background: "linear-gradient(180deg,#0B0B0C,#111113)" }}>
            <div className="flex items-center gap-2 mb-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`relative w-[38px] h-[50px] rounded-[6px] overflow-hidden ${shots > i ? "shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" : "border border-dashed border-white/20"}`}>
                  {shots > i && (
                    <motion.div initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35, ease }} className="w-full h-full">
                      <DeliveryNote t={0} held={false} scanning={false} width={38} />
                      <span className="absolute right-[3px] bottom-[3px] w-[11px] h-[11px] rounded-[3px] bg-[#1D6B2B] text-white flex items-center justify-center"><Check className="w-2 h-2" /></span>
                    </motion.div>
                  )}
                </div>
              ))}
              <div className="ml-auto text-right whitespace-nowrap">
                <p className="text-[11px] font-semibold text-white">Job 0418</p>
                <p className="text-[9px] text-white/50">Greenway Café</p>
              </div>
            </div>
            <AnimatePresence mode="wait">
              {offline && (
                <motion.p key="off" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 rounded-[9px] bg-white/[0.08] px-2.5 py-[5px] text-[9px] leading-none whitespace-nowrap text-white/80 mb-1.5">
                  <Icon d={ICON.cloudOff} className="w-3 h-3 flex-shrink-0 text-white/60" />
                  No signal. Saved. It sends itself later.
                </motion.p>
              )}
            </AnimatePresence>
            <motion.div
              animate={{ scale: tapped ? 0.97 : 1 }}
              transition={{ duration: 0.18 }}
              className={`relative h-[40px] rounded-[14px] flex items-center justify-center gap-1.5 text-[12px] font-bold transition-colors duration-300 overflow-hidden ${sent ? "bg-white/[0.08] text-[#99E58C]" : offline ? "bg-white/[0.08] text-white/80" : shots >= 3 ? "bg-[#99E58C] text-[#0C1A0D]" : "bg-white/[0.08] text-white/40"}`}
            >
              {sent ? <><Check className="w-3.5 h-3.5" /> Sent to office · 17:49</> : offline ? <><Icon d={ICON.clock} className="w-3.5 h-3.5 text-white/70" /><span className="text-white/80">Waiting for signal…</span></> : <>Send job <Icon d={ICON.send} className="w-3.5 h-3.5" sw={2} /></>}
              {/* fingertip press */}
              <AnimatePresence>
                {tapped && (
                  <motion.span key="tap" initial={{ opacity: 0.55, scale: 0.4 }} animate={{ opacity: 0, scale: 2.4 }} transition={{ duration: 0.6, ease: "easeOut" }} className="absolute left-1/2 top-1/2 -ml-5 -mt-5 w-10 h-10 rounded-full bg-white" />
                )}
              </AnimatePresence>
              {/* upload bar when it finally sends */}
              {t === 7 && (
                <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.55, ease: "easeOut" }} className="absolute left-0 bottom-0 h-[2px] w-full origin-left bg-[#99E58C]" />
              )}
            </motion.div>
          </div>

          {/* glass: a soft specular sheen over the whole screen */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-30 rounded-[34px]" style={{ background: "linear-gradient(112deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 24%, rgba(255,255,255,0) 42%, rgba(255,255,255,0) 100%)" }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- the office */

const NAV = [
  { n: "Jobs", d: ICON.clipboard },
  { n: "Team", d: ICON.users },
  { n: "Customers", d: ICON.building },
  { n: "Invoices", d: ICON.receipt },
  { n: "Reports", d: ICON.chart },
];

const WEEK = [
  { d: "M", v: 5 }, { d: "T", v: 6 }, { d: "W", v: 4 }, { d: "T", v: 7 }, { d: "F", v: 5 }, { d: "S", v: 3 }, { d: "S", v: 1 },
];

function statusFor(t: number, held: boolean): { tone: ChipTone; label: string } | null {
  if (t < 8) return null;
  if (t < 13) return { tone: "read", label: "Reading" };
  if (held) return { tone: "hold", label: "Needs a look" };
  if (t >= 20) return { tone: "done", label: "Invoiced" };
  return { tone: "ok", label: "Ready to invoice" };
}

/* `inset` reserves space on the right of the lower detail area for a card that floats over the
   dashboard on the hero stage (the invoice), so nothing important is hidden under it. */
export function Dashboard({ t, held, inset = 0 }: { t: number; held: boolean; inset?: number }) {
  const arrived = t >= 8;
  const checked = t >= 13;
  const approved = !held && t >= 20;
  const fields = [
    { at: 9, k: "Card no.", v: "0418" },
    { at: 10, k: "Customer", v: "Greenway Café" },
    { at: 11, k: "Job", v: "Fridge not cooling" },
    { at: 12, k: "Parts & time", v: held ? "Door seal × 2 · 1.5 h" : "Door seal × 1 · 1.5 h" },
  ];
  const status = statusFor(t, held);
  const rows: { id: string; who: string; by: string; at: string; tone: ChipTone; s: string }[] = [
    { id: "0417", who: "Hill & Co", by: "Lee Moyo", at: "16:10", tone: "done", s: "Invoiced" },
    { id: "0416", who: "Mara's Bakery", by: "Ana Pires", at: "15:35", tone: "done", s: "Invoiced" },
    { id: "0415", who: "Harbour Foods", by: "Sam Reed", at: "14:20", tone: "ok", s: "Ready to invoice" },
    { id: "0414", who: "Fernlea Dental", by: "Lee Moyo", at: "12:48", tone: "done", s: "Invoiced" },
    { id: "0413", who: "Hill & Co", by: "Ana Pires", at: "11:05", tone: "done", s: "Invoiced" },
    { id: "0412", who: "Oakridge Vet", by: "Sam Reed", at: "09:30", tone: "done", s: "Invoiced" },
    { id: "0411", who: "Fernlea Dental", by: "Lee Moyo", at: "08:15", tone: "done", s: "Invoiced" },
  ];
  const partsOk = !held;
  return (
    <div className="w-[840px] h-[560px] rounded-[14px] bg-white overflow-hidden flex flex-col text-[12px] text-[#101828] shadow-[0_0_0_0.5px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.06),0_24px_48px_-24px_rgba(16,24,40,0.22),0_64px_110px_-40px_rgba(16,24,40,0.32)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_24px_48px_-20px_rgba(0,0,0,0.6),0_64px_110px_-30px_rgba(0,0,0,0.8)]">
      {/* top bar */}
      <div className="h-[44px] flex items-center gap-2.5 px-3.5 border-b border-[#E9EAEE] bg-[#FCFCFD]">
        <Avatar name="Northside" size={22} className="rounded-[7px]" />
        <span className="font-semibold">Office</span>
        <span className="text-[#C2C7D0]">/</span>
        <span className="text-[#6A7282]">Jobs</span>
        <span className="mx-auto w-[236px] h-[27px] rounded-[7px] bg-white border border-[#E5E7EB] text-[#99A1AF] text-[11px] flex items-center px-2.5 gap-1.5 shadow-[0_1px_1px_rgba(16,24,40,0.03)]">
          <Icon d={ICON.search} className="w-3 h-3" />
          Search jobs, customers
          <kbd className="ml-auto text-[9.5px] font-medium text-[#99A1AF] border border-[#E5E7EB] rounded-[4px] px-1 leading-[14px] bg-[#FAFAFA]">⌘K</kbd>
        </span>
        <span className="flex items-center gap-1 text-[11px] text-[#4A5565]">
          <Icon d={ICON.sync} className={`w-3 h-3 text-[#6A7282] ${t === 8 ? "animate-[spin_1s_linear_1]" : ""}`} />
          {arrived ? "Synced 17:49" : "Synced 17:41"}
        </span>
        <span className="w-px h-4 bg-[#E9EAEE] mx-1" />
        <span className="flex -space-x-1">
          {["Lee", "Ana", "Sam"].map((n) => <Avatar key={n} name={n} size={21} className="ring-2 ring-white" />)}
        </span>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* sidebar */}
        <aside className="w-[150px] border-r border-[#E9EAEE] bg-[#FAFAFB] px-3 py-2.5 flex flex-col gap-[2px]">
          {NAV.map((it, i) => {
            const active = i === 0;
            const count = i === 0 ? (arrived ? 6 : 5) : i === 3 ? (approved ? 13 : 12) : null;
            return (
              <span key={it.n} className={`relative flex items-center gap-2 px-2 py-[6px] rounded-[7px] text-[12px] ${active ? "bg-white text-[#101828] font-semibold shadow-[0_0_0_0.5px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.05)]" : "text-[#5B6472]"}`}>
                <Icon d={it.d} className={`w-[14px] h-[14px] ${active ? "text-[#101828]" : "text-[#8B93A1]"}`} />
                {it.n}
                {count !== null && <span className={`ml-auto text-[10px] font-semibold tabular-nums ${active ? "text-[#4A5565]" : "text-[#99A1AF]"}`}>{count}</span>}
              </span>
            );
          })}
          <div className="mt-auto rounded-[8px] border border-[#E9EAEE] bg-white p-2.5 shadow-[0_1px_1px_rgba(16,24,40,0.03)]">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] text-[#6A7282]">This week</p>
              <p className="text-[10px] text-[#1D6B2B] font-semibold">Thu</p>
            </div>
            <p className="text-[14px] font-semibold tabular-nums leading-tight">{arrived ? 32 : 31} jobs</p>
            <div className="mt-2 flex items-end gap-[3px] h-[26px]">
              {WEEK.map((w, i) => {
                const today = i === 3;
                const v = today && arrived ? w.v + 1 : w.v;
                return (
                  <span key={i} className="flex-1 flex flex-col items-center gap-[3px]">
                    <span className={`w-full rounded-[2px] ${today ? "bg-[#101828]" : "bg-[#D5D8DE]"} ${i > 4 ? "opacity-50" : ""}`} style={{ height: 3 + v * 2.4 }} />
                  </span>
                );
              })}
            </div>
            <div className="mt-[3px] flex gap-[3px]">
              {WEEK.map((w, i) => <span key={i} className={`flex-1 text-center text-[7.5px] leading-none ${i === 3 ? "text-[#101828] font-semibold" : "text-[#99A1AF]"}`}>{w.d}</span>)}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 px-1">
            <Avatar name="Nia Okafor" size={22} />
            <span className="min-w-0 leading-tight">
              <p className="text-[11px] font-semibold truncate">Nia Okafor</p>
              <p className="text-[9.5px] text-[#99A1AF] truncate">Office · admin</p>
            </span>
          </div>
        </aside>

        {/* list */}
        <div className="w-[270px] border-r border-[#E9EAEE] flex flex-col bg-white">
          <div className="px-3.5 h-[42px] flex items-center justify-between border-b border-[#E9EAEE]">
            <p className="font-semibold text-[13px]">Today <span className="font-normal text-[#99A1AF] tabular-nums">· {arrived ? 8 : 7}</span></p>
            <span className="flex items-center gap-1 text-[11px] text-[#6A7282]"><Icon d={ICON.filter} className="w-3 h-3" />Newest first</span>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false}>
              {arrived && (
                <motion.div
                  key="new"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 58, opacity: 1, backgroundColor: ["#EAF8E6", "#F8FCF6"] }}
                  transition={{ duration: 0.45, ease, backgroundColor: { duration: 2 } }}
                  className="overflow-hidden border-b border-[#E9EAEE] border-l-2 border-l-[#101828]"
                >
                  <div className="pl-3 pr-3.5 h-[58px] flex items-center gap-2.5">
                    <Avatar name="Sam Reed" size={26} />
                    <div className="min-w-0">
                      <p className="font-semibold">Job 0418</p>
                      <p className="text-[11px] text-[#6A7282] truncate">Greenway Café · <span className="tabular-nums">17:42</span></p>
                    </div>
                    {status && <Chip tone={status.tone} className="ml-auto">{status.label}</Chip>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {rows.map((r) => (
              <div key={r.id} className="pl-3.5 pr-3.5 h-[52px] flex items-center gap-2.5 border-b border-[#F0F1F3]">
                <Avatar name={r.by} size={26} />
                <div className="min-w-0">
                  <p className="font-medium text-[#364153]">Job {r.id}</p>
                  <p className="text-[11px] text-[#99A1AF] truncate">{r.who} · <span className="tabular-nums">{r.at}</span></p>
                </div>
                <Chip tone={r.tone} className="ml-auto">{r.s}</Chip>
              </div>
            ))}
          </div>
        </div>

        {/* detail */}
        <div className="flex-1 min-w-0 p-4 flex flex-col gap-3 bg-[#FCFCFD] overflow-hidden">
          {!arrived ? (
            <div className="flex-1 rounded-[10px] border border-dashed border-[#D9DCE1] flex flex-col items-center justify-center gap-1.5 text-[#99A1AF] text-[12px]">
              <Icon d={ICON.clipboard} className="w-5 h-5 text-[#C2C7D0]" />
              Waiting for the next job…
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }} className="flex-1 flex flex-col gap-3 min-h-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[13px] flex items-center gap-1.5">
                  Job 0418
                  <span className="font-normal text-[#99A1AF]">· 3 photos</span>
                  <span className="font-normal text-[#99A1AF] flex items-center gap-0.5"><Icon d={ICON.pin} className="w-3 h-3" />Greenway Café</span>
                </p>
                {status && <Chip tone={status.tone}>{status.label}</Chip>}
              </div>
              <div className="flex gap-3 min-h-0">
                <div className="flex-shrink-0 pt-0.5 pl-0.5">
                  <DeliveryNote t={t} held={held} scanning={t >= 8 && t < 13} width={176} tilt={-1} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  {fields.map((f) => {
                    const warn = f.k === "Parts & time" && held && checked;
                    return (
                      <div key={f.k} className={`rounded-[7px] border bg-white px-2.5 py-[6px] transition-colors duration-300 ${t === f.at ? "border-[#1D6B2B]/50 shadow-[0_0_0_3px_rgba(153,229,140,0.25)]" : warn ? "border-[#F5D08A]" : "border-[#E5E7EB]"}`}>
                        <p className="text-[10px] text-[#6A7282]">{f.k}</p>
                        <div className="h-[17px] flex items-center justify-between gap-1">
                          {t >= f.at ? (
                            <Fill className={`font-semibold tabular-nums truncate text-[12px] ${warn ? "text-[#92400E]" : "text-[#101828]"}`}>{f.v}</Fill>
                          ) : (
                            <span className="block h-2 w-20 rounded-full bg-[#F0F1F3] animate-pulse" />
                          )}
                          {t >= f.at && <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 0.25, ease }}><Check className={`w-3 h-3 flex-shrink-0 ${warn ? "text-[#D97706]" : "text-[#1D6B2B]"}`} /></motion.span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* the check: card vs stock vs timesheet */}
              <div className="rounded-[9px] border border-[#E5E7EB] bg-white overflow-hidden" style={{ marginRight: inset }}>
                <div className="grid grid-cols-[1.6fr_0.8fr_0.8fr_1fr_20px] items-center px-3 h-[24px] text-[9.5px] text-[#6A7282] border-b border-[#F0F1F3] bg-[#FAFAFB]">
                  <span>Checked against</span><span>Card</span><span>Stock</span><span>Timesheet</span><span />
                </div>
                {[
                  { k: "Door seal", card: held ? "2" : "1", stock: "1", sheet: "—", ok: partsOk, at: 12 },
                  { k: "Time on site", card: "1.5 h", stock: "—", sheet: "1.5 h", ok: true, at: 12 },
                ].map((r) => {
                  const ready = t >= r.at;
                  const verdict = ready && checked;
                  return (
                    <div key={r.k} className="grid grid-cols-[1.6fr_0.8fr_0.8fr_1fr_20px] items-center px-3 h-[26px] text-[11px] border-b border-[#F0F1F3] last:border-0">
                      <span className="text-[#364153] font-medium">{r.k}</span>
                      <span className={`tabular-nums ${verdict && !r.ok ? "text-[#92400E] font-semibold" : "text-[#101828]"}`}>{ready ? <Fill>{r.card}</Fill> : <span className="block h-2 w-8 rounded-full bg-[#F0F1F3]" />}</span>
                      <span className="tabular-nums text-[#101828]">{ready ? <Fill delay={0.15}>{r.stock}</Fill> : <span className="block h-2 w-8 rounded-full bg-[#F0F1F3]" />}</span>
                      <span className="tabular-nums text-[#101828]">{ready ? <Fill delay={0.3}>{r.sheet}</Fill> : <span className="block h-2 w-8 rounded-full bg-[#F0F1F3]" />}</span>
                      <span className="flex justify-end">
                        {verdict ? (
                          <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25, ease }}>
                            {r.ok ? <Check className="w-3 h-3 text-[#1D6B2B]" /> : <Icon d={ICON.alert} className="w-3.5 h-3.5 text-[#D97706]" sw={1.8} />}
                          </motion.span>
                        ) : ready ? (
                          <Icon d={ICON.sync} className="w-3 h-3 text-[#C2C7D0] animate-[spin_2.4s_linear_infinite] motion-reduce:animate-none" />
                        ) : null}
                      </span>
                    </div>
                  );
                })}
                <div className={`px-3 h-[34px] text-[11.5px] font-semibold flex items-center gap-2 transition-colors duration-300 ${!checked ? "bg-[#F5F6F7] text-[#6A7282]" : held ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#EAF8E6] text-[#1D6B2B]"}`}>
                  {!checked ? (
                    <><Icon d={ICON.sync} className="w-3.5 h-3.5 animate-[spin_2.4s_linear_infinite] motion-reduce:animate-none" />Checking card against stock and timesheet</>
                  ) : held ? (
                    <><Icon d={ICON.alert} className="w-3.5 h-3.5" sw={1.8} />Card says 2 seals, stock says 1. Held for a person.</>
                  ) : (
                    <><Check className="w-3.5 h-3.5" /> Parts and time match. Filed, job closed.</>
                  )}
                </div>
              </div>

              {/* activity */}
              <div className="flex flex-col gap-[5px] text-[10.5px] text-[#6A7282] px-0.5" style={{ marginRight: inset }}>
                {[
                  { at: 8, t: "17:42", s: "Sam photographed the card · no signal on site" },
                  { at: 8, t: "17:49", s: "Sent itself when signal came back" },
                  { at: 13, t: "17:49", s: held ? "Parts don’t match stock · assigned to Lee Moyo" : "4 fields read, parts and time match · draft created" },
                  { at: 20, t: "17:51", s: "Nia approved INV-0193 · sent to the customer" },
                ].filter((a) => t >= a.at && (a.at !== 20 || !held)).map((a) => (
                  <motion.p key={a.s} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease }} className="flex gap-2 leading-tight">
                    <span className="tabular-nums text-[#99A1AF] w-[30px] flex-shrink-0">{a.t}</span>
                    <span className="truncate">{a.s}</span>
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- the accounts */

function Cursor({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`w-[20px] h-[20px] ${className}`} aria-hidden>
      <path d="M4 2.5l12 7.3-5.4 1.3-2.9 5.2z" fill="#101828" stroke="white" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function Invoice({ t, held }: { t: number; held: boolean }) {
  const show = t >= 14;
  const approving = !held && t >= 18;
  const approved = !held && t >= 20;
  const clicking = !held && t === 19;
  // 640 + 780 = 1 420; tax at 15% = 213; total 1 633.
  const lines = [
    { at: 15, k: "Door seal", q: "1 × 640.00", v: "640.00" },
    { at: 15, k: "Labour", q: "1.5 h × 520.00", v: "780.00" },
  ];
  const tone: ChipTone = !show ? "idle" : held ? "hold" : approved ? "done" : "read";
  const label = !show ? "Idle" : held ? "On hold" : approved ? "Approved" : "Draft";
  return (
    <div className="relative w-[262px] rounded-[14px] bg-white p-4 text-[11.5px] text-[#101828] shadow-[0_0_0_0.5px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.06),0_16px_32px_-16px_rgba(16,24,40,0.22),0_48px_80px_-28px_rgba(16,24,40,0.40)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_16px_32px_-12px_rgba(0,0,0,0.6),0_48px_80px_-20px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 font-semibold text-[12.5px]">
          <span className="w-[22px] h-[22px] rounded-[6px] bg-[#F5F6F7] border border-[#E5E7EB] flex items-center justify-center text-[#101828]">
            <Icon d={ICON.file} className="w-3 h-3" />
          </span>
          Accounts
        </span>
        <span className={`inline-flex items-center gap-1 pl-1 pr-1.5 py-[2px] rounded-[5px] text-[10px] font-semibold ${CHIP[tone].cls}`}>
          <Icon d={tone === "read" ? ICON.file : CHIP[tone].icon} className="w-3 h-3" sw={1.7} />{label}
        </span>
      </div>
      <AnimatePresence mode="wait">
        {!show ? (
          <motion.div key="idle" exit={{ opacity: 0, transition: { duration: 0.12 } }} className="space-y-2.5 pt-0.5">
            {[70, 90, 55].map((w, i) => <span key={i} className="block h-2.5 rounded-full bg-[#F2F3F5]" style={{ width: `${w}%` }} />)}
            <p className="text-[10.5px] text-[#99A1AF] pt-1">Nothing to bill yet.</p>
          </motion.div>
        ) : held ? (
          <motion.div key="held" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }}>
            <p className="font-semibold text-[13px] leading-snug">No invoice yet</p>
            <p className="text-[#6A7282] mt-1 leading-snug">This job is waiting for someone to check the parts. Nothing gets billed on a guess.</p>
            <div className="mt-3 flex items-center gap-2 rounded-[8px] border border-[#E5E7EB] bg-[#FAFAFB] px-2.5 py-2">
              <Avatar name="Lee Moyo" size={22} />
              <span className="leading-tight">
                <p className="text-[11px] font-semibold">Lee Moyo</p>
                <p className="text-[10px] text-[#6A7282]">{t >= 18 ? "Opened the job · checking the van" : "Assigned to check"}</p>
              </span>
              <Icon d={ICON.lock} className="ml-auto w-3.5 h-3.5 text-[#99A1AF]" />
            </div>
          </motion.div>
        ) : (
          <motion.div key="inv" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease }}>
            <div className="flex items-center gap-2">
              <Avatar name="Greenway Café" size={22} />
              <span className="leading-tight min-w-0">
                <p className="text-[11.5px] font-semibold truncate">Greenway Café</p>
                <p className="text-[10px] text-[#6A7282] font-mono tracking-[0.01em]">INV-0193 · due 28 Oct</p>
              </span>
            </div>
            <div className="mt-3 space-y-[7px]">
              {lines.map((l) => (
                <motion.div key={l.k} initial={{ opacity: 0, x: 4 }} animate={{ opacity: t >= l.at ? 1 : 0, x: t >= l.at ? 0 : 4 }} transition={{ duration: 0.3, ease }} className="flex justify-between items-start text-[#364153]">
                  <span className="leading-tight"><span className="text-[#101828] leading-none">{l.k}</span><span className="block text-[9.5px] text-[#99A1AF] tabular-nums">{l.q}</span></span>
                  <span className="tabular-nums leading-none pt-[1px]">{l.v}</span>
                </motion.div>
              ))}
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: t >= 16 ? 1 : 0 }} className="flex justify-between text-[#6A7282] pt-1 border-t border-[#F0F1F3]">
                <span>Tax 15%</span><span className="tabular-nums">213.00</span>
              </motion.p>
            </div>
            <div className="mt-2 pt-2.5 border-t border-[#E5E7EB] flex justify-between items-baseline">
              <span className="font-semibold">Total</span>
              <span className="font-display text-[19px] tabular-nums tracking-[-0.01em]">{t >= 16 ? <CountUp to={1633} run={t >= 16} /> : <span className="text-[#C2C7D0]">—</span>}</span>
            </div>
            <div className={`mt-2.5 h-[28px] rounded-[8px] flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-colors duration-300 ${approved ? "bg-[#EAF8E6] text-[#1D6B2B]" : "bg-[#101828] text-white"}`}>
              {approved ? <><Check className="w-3.5 h-3.5" /> Approved · sent 17:51</> : <>Approve and send <Icon d={ICON.send} className="w-3 h-3" sw={2} /></>}
            </div>
            <p className="mt-2 text-[10.5px] text-[#6A7282] leading-snug [text-wrap:balance]">{approved ? "One click. Nobody typed anything." : "Waiting for your approval. Nobody typed a thing."}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* a person's cursor comes in and approves */}
      <AnimatePresence>
        {approving && !approved && (
          <motion.div
            key="cursor"
            initial={{ x: 300, y: 70, opacity: 0 }}
            animate={{ x: 164, y: 232, opacity: 1, scale: clicking ? 0.85 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ x: { duration: 0.7, ease }, y: { duration: 0.7, ease }, opacity: { duration: 0.2 }, scale: { duration: 0.12 } }}
            className="absolute left-0 top-0 pointer-events-none z-10"
            style={{ filter: "drop-shadow(0 2px 3px rgba(16,24,40,0.35))" }}
          >
            <Cursor />
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
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 5" className="text-[#D4D4D4] dark:text-[#3A3A40]" />
      {fire && (
        <>
          <motion.path
            key={`${id}-line`}
            d={d}
            fill="none"
            stroke="#1D6B2B"
            strokeOpacity="0.35"
            strokeWidth="1.2"
            pathLength={1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.path
            key={id}
            d={d}
            fill="none"
            stroke={`url(#grad-${id.split("-")[0]})`}
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.22 1"
            initial={{ strokeDashoffset: 0.22 }}
            animate={{ strokeDashoffset: -1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
            style={{ filter: "drop-shadow(0 0 6px rgba(153,229,140,0.9))" }}
          />
        </>
      )}
    </g>
  );
}

/* ------------------------------------------------------------- shared clock */

function useStageClock(target: React.RefObject<HTMLElement | null>) {
  const inView = useInView(target, { amount: 0.2 });
  const prefersReduce = useReducedMotion();
  // The server (and the first client render) always draw frame 0. Only after mount may a
  // reduced-motion visitor jump to the still final frame, so hydration never mismatches.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const reduce = !!prefersReduce && mounted;
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (prefersReduce || !inView) return;
    const id = setInterval(() => setCount((c) => c + 1), TICK);
    return () => clearInterval(id);
  }, [prefersReduce, inView]);
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

function Layer({ children, x, y, depth, mx, my, className = "", style }: { children: React.ReactNode; x: number; y: number; depth: number; mx: MotionValue<number>; my: MotionValue<number>; className?: string; style?: React.CSSProperties }) {
  const tx = useTransform(mx, (v) => v * depth);
  const ty = useTransform(my, (v) => v * depth);
  return (
    <motion.div className={`absolute ${className}`} style={{ left: x, top: y, x: tx, y: ty, ...style }}>
      {children}
    </motion.div>
  );
}

const PHONE_SHADOW = "drop-shadow(0 2px 2px rgba(16,24,40,0.18)) drop-shadow(0 18px 18px rgba(16,24,40,0.20)) drop-shadow(0 44px 40px rgba(16,24,40,0.22))";

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
      aria-label="Animated example: a team member photographs a signed job card with no signal, it sends itself when signal returns, the office system reads every field, checks the parts and time against stock and the timesheet, and creates a draft invoice that waits for approval. When the card and the stock record disagree, the invoice is held for a person to check."
    >
      <motion.div
        className="absolute left-1/2 top-0 origin-top"
        style={{ width: W, height: H, x: "-50%", scale, transformStyle: "preserve-3d" }}
      >
        <motion.div className="relative w-full h-full origin-[50%_0%]" style={reduce ? undefined : { rotateX, scale: lift }}>
          {/* light falls from the top-left; the ground catches a soft contact shadow */}
          <div aria-hidden className="absolute -inset-x-16 -top-20 h-[420px] pointer-events-none bg-[radial-gradient(60%_60%_at_30%_20%,rgba(255,255,255,0.75),transparent_70%)] dark:bg-[radial-gradient(60%_60%_at_30%_20%,rgba(255,255,255,0.05),transparent_70%)]" />
          <div aria-hidden className="absolute left-[10%] right-[10%] bottom-[-44px] h-[90px] rounded-[50%] bg-[#101828]/10 dark:bg-black/60 blur-3xl" />

          <Layer x={210} y={20} depth={6} mx={mx} my={my}>
            <Dashboard t={t} held={held} inset={84} />
          </Layer>

          {/* data beams sit between the office and the front layers */}
          <svg aria-hidden className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox={`0 0 ${W} ${H}`}>
            <defs>
              <linearGradient id="grad-a" x1="0" x2="1"><stop offset="0" stopColor="#99E58C" stopOpacity="0" /><stop offset="1" stopColor="#1D6B2B" /></linearGradient>
              <linearGradient id="grad-b" x1="0" x2="1"><stop offset="0" stopColor="#99E58C" stopOpacity="0" /><stop offset="1" stopColor="#1D6B2B" /></linearGradient>
            </defs>
            <Beam id={`a-${loop}`} d="M 220 330 C 300 330, 366 135, 366 135" fire={t >= 7 && t < 10} />
            <Beam id={`b-${loop}`} d="M 1050 300 C 1092 300, 1116 318, 1116 338" fire={t >= 13 && t < 16} />
          </svg>

          <Layer x={-8} y={150} depth={18} mx={mx} my={my} style={{ filter: PHONE_SHADOW }}>
            <Phone t={t} />
          </Layer>

          <Layer x={970} y={340} depth={14} mx={mx} my={my} style={{ rotate: "-1.5deg" }}>
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
    { at: 9, k: "Card no.", v: "0418" },
    { at: 10, k: "Customer", v: "Greenway Café" },
    { at: 12, k: "Parts & time", v: held ? "Door seal × 2 · 1.5 h" : "Door seal × 1 · 1.5 h" },
  ];
  const status = !arrived ? { tone: "idle" as ChipTone, label: "Waiting" } : statusFor(t, held)!;
  return (
    <div className="w-[300px] rounded-[14px] bg-white overflow-hidden text-[12px] text-[#101828] shadow-[0_0_0_0.5px_rgba(16,24,40,0.10),0_1px_2px_rgba(16,24,40,0.06),0_20px_40px_-20px_rgba(16,24,40,0.25),0_48px_80px_-32px_rgba(16,24,40,0.30)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_24px_48px_-20px_rgba(0,0,0,0.7)]">
      <div className="h-[40px] px-3 flex items-center gap-2 border-b border-[#E9EAEE] bg-[#FCFCFD]">
        <Avatar name="Northside" size={20} />
        <span className="font-semibold">Office <span className="font-normal text-[#99A1AF]">/ Job 0418</span></span>
        <Chip tone={status.tone} className="ml-auto">{status.label}</Chip>
      </div>
      <div className="p-3 flex gap-3 bg-[#FCFCFD]">
        <div className="flex-shrink-0">
          <DeliveryNote t={t} held={held} scanning={t >= 8 && t < 13} width={118} tilt={-1.5} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {fields.map((f) => {
            const warn = f.k === "Parts & time" && held && checked;
            return (
              <div key={f.k} className={`rounded-[7px] border bg-white px-2 py-1.5 transition-colors duration-300 ${t === f.at ? "border-[#1D6B2B]/50 shadow-[0_0_0_3px_rgba(153,229,140,0.25)]" : warn ? "border-[#F5D08A]" : "border-[#E5E7EB]"}`}>
                <p className="text-[9.5px] text-[#6A7282]">{f.k}</p>
                <div className="h-[15px] flex items-center justify-between gap-1">
                  {t >= f.at ? (
                    <Fill className={`text-[11.5px] font-semibold tabular-nums truncate ${warn ? "text-[#92400E]" : "text-[#101828]"}`}>{f.v}</Fill>
                  ) : (
                    <span className="block h-1.5 w-14 rounded-[2px] bg-[#F0F1F3]" />
                  )}
                  {t >= f.at && <Check className={`w-3 h-3 flex-shrink-0 ${warn ? "text-[#D97706]" : "text-[#1D6B2B]"}`} />}
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 px-0.5 pt-0.5 text-[9.5px] text-[#6A7282]">
            <Avatar name="Sam Reed" size={16} />
            <span className="truncate">Sam · <span className="tabular-nums">17:42</span> · 3 photos</span>
          </div>
        </div>
      </div>
      <div className={`mx-3 mb-3 rounded-[8px] px-2.5 py-2 text-[11px] font-semibold leading-snug flex items-start gap-1.5 transition-colors duration-300 ${!checked ? "bg-[#F5F6F7] text-[#6A7282]" : held ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#EAF8E6] text-[#1D6B2B]"}`}>
        {!arrived ? <Icon d={ICON.clock} className="w-3.5 h-3.5 mt-[1px] flex-shrink-0" /> : !checked ? <Icon d={ICON.sync} className="w-3.5 h-3.5 mt-[1px] flex-shrink-0 animate-[spin_2.4s_linear_infinite] motion-reduce:animate-none" /> : held ? <Icon d={ICON.alert} className="w-3.5 h-3.5 mt-[1px] flex-shrink-0" sw={1.8} /> : <Check className="w-3.5 h-3.5 mt-[1px] flex-shrink-0" />}
        {!arrived ? "Waiting for the next job" : !checked ? "Reading 3 photos…" : held ? "Parts don’t match stock. Held for a person." : "Parts and time match. Filed, job closed."}
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
      aria-label="Animated example: a team member photographs a signed job card with no signal, it sends itself when signal returns, the office system reads the fields, checks parts and time, and creates a draft invoice for approval, or holds it when the card and the stock record disagree."
    >
      <div className="absolute left-1/2 top-0 origin-top" style={{ width: MW, height: MH, transform: `translateX(-50%) scale(${scale})` }}>
        <div aria-hidden className="absolute left-[10%] right-[10%] bottom-[-10px] h-[50px] rounded-[50%] bg-[#101828]/10 dark:bg-black/60 blur-2xl" />
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
        <div className="absolute" style={{ left: 0, top: 262, filter: PHONE_SHADOW }}>
          <Scaled k={0.62} w={230} h={456}><Phone t={t} /></Scaled>
        </div>
        <div className="absolute" style={{ left: 158, top: 336, rotate: "-1.5deg" }}>
          <Scaled k={0.77} w={262} h={250}><Invoice t={t} held={held} /></Scaled>
        </div>
      </div>
    </div>
  );
}
