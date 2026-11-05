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

function Bars({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 17 11" className="h-[8px] w-auto" aria-hidden>
      {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 4.4} y={8 - i * 2.4} width="3" height={3 + i * 2.4} rx="0.9" fill={c} />)}
    </svg>
  );
}

function Wifi({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 16 11.5" className="h-[8px] w-auto" aria-hidden>
      <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 .5 10.2 10.2 0 0 0 .9 3.4L2 4.6a8.6 8.6 0 0 1 6-2.4z" fill={c} />
      <path d="M8 5.6c1.4 0 2.6.5 3.6 1.4l1.1-1.2A6.8 6.8 0 0 0 8 3.9a6.8 6.8 0 0 0-4.7 1.9L4.4 7A5.2 5.2 0 0 1 8 5.6z" fill={c} />
      <path d="M8 9.1 9.9 7.4a2.8 2.8 0 0 0-3.8 0z" fill={c} />
    </svg>
  );
}

function Battery({ c }: { c: string }) {
  return (
    <svg viewBox="0 0 26 12" className="h-[8.5px] w-auto" aria-hidden>
      <rect x="0.6" y="0.6" width="22" height="10.8" rx="3.3" fill="none" stroke={c} strokeOpacity="0.4" strokeWidth="1.1" />
      <rect x="2.3" y="2.3" width="15.5" height="7.4" rx="1.9" fill={c} />
      <path d="M24.2 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill={c} fillOpacity="0.45" />
    </svg>
  );
}

/* The phone's own status bar. `light` = white glyphs, for dark screens. */
export function StatusBar({ time, light = false, className = "" }: { time: string; light?: boolean; className?: string }) {
  const c = light ? "#FFFFFF" : "#0B0C0E";
  return (
    <div className={`relative z-20 flex items-center justify-between pl-[18px] pr-[14px] h-[34px] pt-[3px] ${className}`} style={{ fontFamily: SYS, color: c }}>
      <span className="text-[10.5px] font-semibold tabular-nums tracking-[-0.01em]">{time}</span>
      <span className="flex items-center gap-[3px]">
        <Bars c={c} />
        <Wifi c={c} />
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
  children,
  className = "",
  style,
}: {
  w?: number;
  h?: number;
  screen?: string;
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
      <span aria-hidden className="absolute left-[14%] right-[14%] -bottom-[8px] h-[18px] rounded-[50%] bg-[#101828]/30 blur-[10px]" />
      <div
        className="relative w-full h-full [filter:drop-shadow(0_28px_30px_rgba(16,24,40,0.2))_drop-shadow(0_8px_10px_rgba(16,24,40,0.12))]"
        style={{ borderRadius: px(44), padding: px(3), background: FRAME, boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.28)" }}
      >
        {/* side keys: action, volume up, volume down, power */}
        <span className="absolute rounded-l-[2px]" style={{ left: -2.4 * k, top: px(98), width: 2.4 * k, height: px(22), background: KEY }} />
        <span className="absolute rounded-l-[2px]" style={{ left: -2.4 * k, top: px(136), width: 2.4 * k, height: px(38), background: KEY }} />
        <span className="absolute rounded-l-[2px]" style={{ left: -2.4 * k, top: px(184), width: 2.4 * k, height: px(38), background: KEY }} />
        <span className="absolute rounded-r-[2px]" style={{ right: -2.4 * k, top: px(150), width: 2.4 * k, height: px(60), background: "linear-gradient(90deg,#1A1A1C,#3A3A3E)" }} />

        <div className="relative w-full h-full" style={{ borderRadius: px(41), padding: px(6.5), background: "#060607", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)" }}>
          <div className="relative w-full h-full overflow-hidden [isolation:isolate]" style={{ borderRadius: px(34), background: screen }}>
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
