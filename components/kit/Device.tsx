"use client";
import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";

/*
 * The product kit: the same app screens the reels and carousels use, shown on the site as real devices.
 * Social draws phones bold and flat on purpose (they have to read at thumb speed). The site shows them the
 * way a product photo would: a graphite frame with its side keys, the camera island, glass, the phone's own
 * status bar and home bar, and soft studio shadows. Never outlines, stickers or print shadows here.
 *
 * Proportions follow the hero phone (230 × 456), so every phone on the site is the same device.
 */

export const SYS = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
const FRAME = "linear-gradient(150deg,#55565B 0%,#1C1C1F 26%,#2A2A2E 58%,#5B5C61 100%)";
const KEY = "linear-gradient(90deg,#3A3A3E,#1A1A1C)";

/* Status-bar glyphs, sized by the parent's font size (1em = the glyph height). `dim` = no signal. */
export function Bars({ c, dim = false }: { c: string; dim?: boolean }) {
  return (
    <svg viewBox="0 0 17 11" className="h-[1em] w-auto" aria-hidden>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 4.4} y={8 - i * 2.4} width="3" height={3 + i * 2.4} rx="0.9" fill={c} opacity={dim ? (i === 0 ? 0.6 : 0.22) : 1} />)}
    </svg>
  );
}

export function Wifi({ c, dim = false }: { c: string; dim?: boolean }) {
  return (
    <svg viewBox="0 0 16 11.5" className="h-[1em] w-auto" aria-hidden opacity={dim ? 0.35 : 1}>
      <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 .5 10.2 10.2 0 0 0 .9 3.4L2 4.6a8.6 8.6 0 0 1 6-2.4z" fill={c} />
      <path d="M8 5.6c1.4 0 2.6.5 3.6 1.4l1.1-1.2A6.8 6.8 0 0 0 8 3.9a6.8 6.8 0 0 0-4.7 1.9L4.4 7A5.2 5.2 0 0 1 8 5.6z" fill={c} />
      <path d="M8 9.1 9.9 7.4a2.8 2.8 0 0 0-3.8 0z" fill={c} />
    </svg>
  );
}

export function Battery({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 26 12" className="h-[1.06em] w-auto" aria-hidden>
      <rect x="0.6" y="0.6" width="22" height="10.8" rx="3.3" fill="none" stroke={c} strokeOpacity="0.4" strokeWidth="1.1" />
      <rect x="2.3" y="2.3" width="15.5" height="7.4" rx="1.9" fill={c} />
      <path d="M24.2 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill={c} fillOpacity="0.45" />
    </svg>
  );
}

/*
 * The phone's own status bar, laid out like an iPhone's: the time centred in the left "ear", the signal, wifi
 * and battery centred in the right one, and a gap in the middle sized to the camera island (the island is
 * 30% of the screen; the gap is 36%, so nothing ever runs into it). Every size comes from the screen's width
 * (cqw: HdPhone's screen is a size container), so the row lines up with the island's centre at any phone size
 * and zoom. `light` = white glyphs, for dark screens. `h` pins the row's height when the layout below depends on
 * it (the row still centres on the island). `offline` dims the signal.
 */
export function StatusBar({ time, light = false, className = "", h, offline = false }: { time: string; light?: boolean; className?: string; h?: number; offline?: boolean }) {
  const c = light ? "#FFFFFF" : "#0B0C0E";
  return (
    <div
      className={`relative z-20 shrink-0 grid grid-cols-[1fr_36%_1fr] items-center ${className}`}
      style={{ fontFamily: SYS, color: c, height: h ?? "18cqw", paddingTop: h ? `max(0px, calc(18cqw - ${h}px))` : 0, fontSize: "max(10.5px, 4.6cqw)" }}
    >
      <span className="justify-self-center font-semibold tabular-nums tracking-[-0.01em] leading-none">{time}</span>
      <span />
      <span className="justify-self-center flex items-center leading-none" style={{ gap: "0.28em", fontSize: "0.76em" }}>
        <Bars c={c} dim={offline} />
        <Wifi c={c} dim={offline} />
        <Battery c={c} />
      </span>
    </div>
  );
}

export function HomeBar({ light = false }: { light?: boolean }) {
  return <span aria-hidden className={`absolute z-30 left-1/2 -translate-x-1/2 bottom-[6px] w-[36%] h-[3.5px] rounded-full ${light ? "bg-white/85" : "bg-[#0B0C0E]/85"}`} />;
}

/*
 * A phone. `w` sets the size; everything else scales from the hero phone. The screen is `children`;
 * pass the status bar inside it so it can sit on the app's own header colour.
 */
export function HdPhone({
  w = 196,
  h,
  screen = "#FFFFFF",
  bare = false,
  children,
  className = "",
  style,
}: {
  w?: number;
  h?: number;
  screen?: string;
  bare?: boolean;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const k = w / 230;
  const height = h ?? Math.round(w * 2.06);
  const px = (n: number) => `${(n * k).toFixed(2)}px`;
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: w, height, ...style }}>
      {/* contact shadow where it stands, then the soft studio shadow on the body */}
      {!bare && <span aria-hidden className="absolute left-[14%] right-[14%] -bottom-[8px] h-[18px] rounded-[50%] bg-[#101828]/30 blur-[10px]" />}
      <div
        className={`relative w-full h-full ${bare ? "" : "[filter:drop-shadow(0_28px_30px_rgba(16,24,40,0.2))_drop-shadow(0_8px_10px_rgba(16,24,40,0.12))]"}`}
        style={{ borderRadius: px(44), padding: px(3), background: FRAME, boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.28)" }}
      >
        {/* side keys: action, volume up, volume down, power */}
        <span className="absolute rounded-l-[2px]" style={{ left: -2.4 * k, top: px(98), width: 2.4 * k, height: px(22), background: KEY }} />
        <span className="absolute rounded-l-[2px]" style={{ left: -2.4 * k, top: px(136), width: 2.4 * k, height: px(38), background: KEY }} />
        <span className="absolute rounded-l-[2px]" style={{ left: -2.4 * k, top: px(184), width: 2.4 * k, height: px(38), background: KEY }} />
        <span className="absolute rounded-r-[2px]" style={{ right: -2.4 * k, top: px(150), width: 2.4 * k, height: px(60), background: "linear-gradient(90deg,#1A1A1C,#3A3A3E)" }} />

        <div className="relative w-full h-full" style={{ borderRadius: px(41), padding: px(6.5), background: "#060607", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }}>
          <div className="relative w-full h-full overflow-hidden [isolation:isolate] [container-type:inline-size]" style={{ borderRadius: px(34), background: screen }}>
            {children}
            {/* camera island */}
            <span aria-hidden className="absolute z-30 left-1/2 -translate-x-1/2 rounded-full bg-black" style={{ top: px(9.5), width: px(64), height: px(19) }}>
              <span className="absolute top-1/2 -translate-y-1/2 rounded-full" style={{ right: px(7), width: px(7), height: px(7), background: "radial-gradient(circle at 35% 35%,#2B3A55 0%,#0B0F18 60%,#000 100%)" }} />
            </span>
            {/* glass: a faint sheen across the top corner, the way light catches a screen */}
            <span aria-hidden className="pointer-events-none absolute inset-0 z-40" style={{ background: "linear-gradient(118deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.035) 22%, rgba(255,255,255,0) 36%)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* A fingertip: lands, presses, lifts. Placed by its parent, centred on the point it presses. */
export function Fingertip({ show, down }: { show: boolean; down: boolean }) {
  return (
    <motion.span
      aria-hidden
      initial={false}
      animate={show ? { opacity: 1, scale: down ? 0.82 : 1, y: 0 } : { opacity: 0, scale: 1.15, y: 10 }}
      transition={{ type: "spring", stiffness: 520, damping: 32 }}
      className="pointer-events-none absolute z-40 w-[30px] h-[30px] -ml-[15px] -mt-[15px] rounded-full bg-white/35 border border-white/80 shadow-[0_6px_14px_rgba(16,24,40,0.35),inset_0_1px_2px_rgba(255,255,255,0.6)] backdrop-blur-[2px]"
    >
      {down && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 rounded-full border-2 border-white/80"
        />
      )}
    </motion.span>
  );
}

/* A desktop pointer that glides in and clicks. Its tip is the element's top-left corner. */
export function Pointer({ show, down, from = { x: 70, y: 56 } }: { show: boolean; down: boolean; from?: { x: number; y: number } }) {
  return (
    <motion.span
      aria-hidden
      initial={false}
      animate={show ? { opacity: 1, x: 0, y: 0, scale: down ? 0.88 : 1 } : { opacity: 0, x: from.x, y: from.y, scale: 1 }}
      transition={{ x: { duration: 0.75, ease: [0.22, 1, 0.36, 1] }, y: { duration: 0.75, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.25 }, scale: { type: "spring", stiffness: 600, damping: 30 } }}
      className="pointer-events-none absolute z-40 w-[17px] h-[24px] origin-top-left [filter:drop-shadow(0_2px_3px_rgba(16,24,40,0.35))]"
    >
      <svg viewBox="0 0 17 24" className="w-full h-full">
        <path d="M1.2 1.2v19.1l4.9-4.6 3.1 7.1 3.3-1.4-3.1-7h6.6z" fill="#0B0C0E" stroke="#FFFFFF" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </motion.span>
  );
}

/*
 * A laptop, seen from the front: `w` is the lid's width, the screen is 16:10 and is `children`. Thin black
 * bezel with the camera notch, a graphite lid edge, and a slim base that's wider than the lid.
 */
export function HdLaptop({ w = 620, screen = "#FFFFFF", children, className = "", style }: { w?: number; screen?: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  const k = w / 620;
  const side = 11 * k, top = 15 * k, chin = 18 * k;
  const sw = w - 4 * k - 2 * side;
  const sh = Math.round((sw * 10) / 16);
  const lidH = sh + top + chin + 4 * k;
  const baseW = Math.round(w * 1.13), baseH = Math.max(8, Math.round(13 * k));
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: baseW, height: lidH + baseH, ...style }}>
      <span aria-hidden className="absolute left-[5%] right-[5%] -bottom-[9px] h-[22px] rounded-[50%] bg-[#101828]/30 blur-[12px]" />
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 [filter:drop-shadow(0_26px_30px_rgba(16,24,40,0.18))]"
        style={{ width: w, height: lidH, padding: 2 * k, borderRadius: `${16 * k}px ${16 * k}px ${3 * k}px ${3 * k}px`, background: FRAME, boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.3)" }}
      >
        <div className="relative w-full h-full" style={{ borderRadius: `${14 * k}px ${14 * k}px ${2 * k}px ${2 * k}px`, background: "#060607", padding: `${top}px ${side}px ${chin}px` }}>
          <span aria-hidden className="absolute z-20 left-1/2 -translate-x-1/2 top-0 bg-[#060607]" style={{ width: 64 * k, height: top + 3 * k, borderRadius: `0 0 ${7 * k}px ${7 * k}px` }}>
            <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 6 * k, width: 5 * k, height: 5 * k, background: "radial-gradient(circle at 35% 35%,#2B3A55 0%,#0B0F18 60%,#000 100%)" }} />
          </span>
          <div className="relative w-full overflow-hidden [isolation:isolate] [container-type:inline-size]" style={{ height: sh, borderRadius: 3 * k, background: screen }}>
            {children}
            <span aria-hidden className="pointer-events-none absolute inset-0 z-40" style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 26%, rgba(255,255,255,0) 40%)" }} />
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="absolute left-0 bottom-0"
        style={{ width: baseW, height: baseH, borderRadius: `${2 * k}px ${2 * k}px ${baseH * 0.7}px ${baseH * 0.7}px`, background: "linear-gradient(180deg,#9EA0A5 0%,#6E7075 45%,#4A4C51 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 1px 0 rgba(0,0,0,0.25)" }}
      >
        <span className="absolute left-1/2 -translate-x-1/2 top-0" style={{ width: 92 * k, height: 4.5 * k, borderRadius: `0 0 ${6 * k}px ${6 * k}px`, background: "linear-gradient(180deg,#56585D,#8C8E93)" }} />
      </div>
    </div>
  );
}

/* A tablet in landscape: graphite frame, even black bezel, camera on the long edge. `children` is the screen. */
export function HdTablet({ w = 640, h, auto = false, fluid = false, screen = "#FFFFFF", children, className = "", style }: { w?: number; h?: number; auto?: boolean; fluid?: boolean; screen?: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  const k = w / 640;
  const height = auto ? undefined : h ?? Math.round(w * 0.72);
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: fluid ? `min(${w}px, 100%)` : w, height, ...style }}>
      <span aria-hidden className="absolute left-[8%] right-[8%] -bottom-[10px] h-[24px] rounded-[50%] bg-[#101828]/30 blur-[13px]" />
      <div
        className="relative w-full h-full [filter:drop-shadow(0_30px_34px_rgba(16,24,40,0.2))_drop-shadow(0_8px_12px_rgba(16,24,40,0.12))]"
        style={{ borderRadius: 28 * k, padding: 2.5 * k, background: FRAME, boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.3)" }}
      >
        <div className="relative w-full h-full" style={{ borderRadius: 26 * k, padding: 13 * k, background: "#060607" }}>
          <span aria-hidden className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 4.5 * k, width: 5 * k, height: 5 * k, background: "radial-gradient(circle at 35% 35%,#2B3A55 0%,#0B0F18 60%,#000 100%)" }} />
          <div className={`relative w-full h-full overflow-hidden [isolation:isolate] ${fluid ? "" : "[container-type:inline-size]"}`} style={{ borderRadius: 14 * k, background: screen }}>
            {children}
            <span aria-hidden className="pointer-events-none absolute inset-0 z-40" style={{ background: "linear-gradient(118deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 24%, rgba(255,255,255,0) 38%)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
