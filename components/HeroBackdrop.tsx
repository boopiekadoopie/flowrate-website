"use client";
import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { DeliveryNote } from "./HeroStage";

/*
 * The paperwork a business runs on, drifting around the headline at different depths.
 * As you scroll it gets pulled in toward the product and fades: the system absorbs it.
 */

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(HOVER_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getHover = () => window.matchMedia(HOVER_QUERY).matches;

function Receipt() {
  return (
    <div className="w-[104px] bg-[#FDFDFB] font-mono text-[7px] leading-[1.6] text-[#333] px-2.5 pt-3 pb-4 shadow-[0_12px_28px_-12px_rgba(16,24,40,0.35)] [clip-path:polygon(0_0,100%_0,100%_96%,92%_100%,84%_96%,76%_100%,68%_96%,60%_100%,52%_96%,44%_100%,36%_96%,28%_100%,20%_96%,12%_100%,4%_96%,0_100%)]">
      <p className="font-bold text-center tracking-[0.12em] mb-1">FUEL STOP 14</p>
      <p className="text-center opacity-60 mb-2">06/10 · 05:52</p>
      {[["DIESEL 50", "412.3 L"], ["PUMP", "07"], ["CARD", "•••• 88"]].map(([a, b]) => (
        <p key={a} className="flex justify-between"><span>{a}</span><span>{b}</span></p>
      ))}
      <p className="flex justify-between font-bold border-t border-dashed border-black/30 mt-1.5 pt-1"><span>TOTAL</span><span>9 482.90</span></p>
    </div>
  );
}

function Chat() {
  return (
    <div className="w-[188px] rounded-[12px] rounded-tl-[4px] bg-white border border-[#E5E7EB] p-1.5 shadow-[0_16px_36px_-14px_rgba(16,24,40,0.35)]">
      <div className="rounded-[8px] bg-[#F1F1EE] h-[92px] flex items-center justify-center overflow-hidden">
        <div className="translate-y-3"><DeliveryNote t={0} held={false} scanning={false} width={78} tilt={-4} /></div>
      </div>
      <p className="text-[10.5px] text-[#101828] px-1 pt-1.5 leading-snug">POD for 2412, sorry late. No signal at the mill</p>
      <p className="text-[9px] text-[#99A1AF] px-1 text-right">18:06</p>
    </div>
  );
}

function Sheet() {
  const rows = [["2409", "27,880", "Sent"], ["2410", "29,040", "?"], ["2411", "28,120", "Sent"], ["2412", "", "chase"]];
  return (
    <div className="w-[208px] bg-white border border-[#E5E7EB] rounded-[6px] overflow-hidden text-[9.5px] shadow-[0_16px_36px_-14px_rgba(16,24,40,0.3)]">
      <div className="grid grid-cols-[44px_1fr_52px] bg-[#F7F7F7] text-[#6A7282] border-b border-[#E5E7EB]">
        {["Load", "Net kg", "Invoice"].map((h) => <span key={h} className="px-2 py-1 border-r border-[#E5E7EB] last:border-0">{h}</span>)}
      </div>
      {rows.map((r) => (
        <div key={r[0]} className="grid grid-cols-[44px_1fr_52px] border-b border-[#F0F0F0] last:border-0 tabular-nums">
          <span className="px-2 py-1 border-r border-[#F0F0F0] text-[#6A7282]">{r[0]}</span>
          <span className="px-2 py-1 border-r border-[#F0F0F0] text-[#101828]">{r[1]}</span>
          <span className={`px-2 py-1 ${r[2] === "Sent" ? "text-[#6A7282]" : "text-[#92400E] bg-[#FEF3C7]"}`}>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function Sticky() {
  return (
    <div className="w-[128px] h-[118px] bg-[#FDF1A8] p-3 shadow-[0_14px_28px_-12px_rgba(120,90,10,0.45)] text-[#4A3B07]">
      <p className="text-[11px] leading-[1.35] font-semibold">Ridge Farms still not invoiced for 2410??</p>
      <p className="text-[10px] mt-2 opacity-70">check with Thabo</p>
    </div>
  );
}

function Mail() {
  return (
    <div className="w-[214px] rounded-[8px] bg-white border border-[#E5E7EB] px-3 py-2.5 shadow-[0_16px_36px_-14px_rgba(16,24,40,0.3)]">
      <div className="flex justify-between text-[9.5px] text-[#99A1AF]"><span>Accounts</span><span>Mon 09:14</span></div>
      <p className="text-[11px] font-semibold text-[#101828] mt-0.5 truncate">Re: Re: Fwd: weights for 2407?</p>
      <p className="text-[10px] text-[#6A7282] mt-0.5 leading-snug">Which number do I bill, the ticket or the delivery note?</p>
    </div>
  );
}

type Piece = { el: React.ReactNode; side: -1 | 1; x: string; y: number; depth: number; rot: number; dur: number; scale?: number; fade?: number };

const PIECES: Piece[] = [
  { el: <DeliveryNote t={0} held={false} scanning={false} width={150} />, side: -1, x: "4%", y: 150, depth: 1, rot: -9, dur: 12 },
  { el: <Sticky />, side: -1, x: "13%", y: 470, depth: 0.75, rot: 6, dur: 10 },
  { el: <Receipt />, side: -1, x: "-1%", y: 520, depth: 0.5, rot: -4, dur: 14 },
  { el: <Chat />, side: 1, x: "83%", y: 140, depth: 1, rot: 5, dur: 11 },
  { el: <Sheet />, side: 1, x: "79%", y: 430, depth: 0.7, rot: -3, dur: 13 },
  { el: <Mail />, side: 1, x: "90%", y: 300, depth: 0.45, rot: 3, dur: 15 },
];

/* Phones: fewer, smaller, softer pieces that peek in from the edges and stay clear of the copy. */
const MOBILE_PIECES: Piece[] = [
  { el: <DeliveryNote t={0} held={false} scanning={false} width={150} />, side: -1, x: "-3%", y: 50, depth: 0.85, rot: -11, dur: 12, scale: 0.46, fade: 0.9 },
  { el: <Chat />, side: 1, x: "66%", y: 56, depth: 0.85, rot: 7, dur: 11, scale: 0.46, fade: 0.9 },
  { el: <Sticky />, side: -1, x: "-6%", y: 708, depth: 0.7, rot: 8, dur: 10, scale: 0.55, fade: 0.85 },
  { el: <Sheet />, side: 1, x: "74%", y: 714, depth: 0.6, rot: -5, dur: 13, scale: 0.5, fade: 0.75 },
];

function Floating({ p, mx, my, progress }: { p: Piece; mx: MotionValue<number>; my: MotionValue<number>; progress: MotionValue<number> }) {
  const reach = 160 * p.depth;
  const x = useTransform(() => mx.get() * 22 * p.depth + -p.side * progress.get() * reach);
  const y = useTransform(() => my.get() * 16 * p.depth + progress.get() * 220 * p.depth);
  const opacity = useTransform(progress, [0, 0.55], [p.fade ?? (p.depth < 0.6 ? 0.6 : 1), 0]);
  const blur = (1 - p.depth) * 4;
  const scale = p.scale ?? 0.7 + p.depth * 0.3;
  return (
    <motion.div className="absolute" style={{ left: p.x, top: p.y, x, y, opacity }}>
      <div style={{ transform: `scale(${scale})`, filter: blur ? `blur(${blur.toFixed(1)}px)` : undefined }}>
        <div className="paper-float" style={{ ["--r" as string]: `${p.rot}deg`, ["--d" as string]: `${p.dur}s` }}>
          {p.el}
        </div>
      </div>
    </motion.div>
  );
}

export function HeroBackdrop({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const reduce = useReducedMotion();
  const canHover = useSyncExternalStore(subscribe, getHover, () => false);
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !canHover || reduce) return;
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 2);
      my.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [sectionRef, canHover, reduce, mx, my]);

  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px] hidden lg:block">
        {PIECES.map((p, i) => (
          <Floating key={i} p={p} mx={mx} my={my} progress={progress} />
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[820px] lg:hidden">
        {MOBILE_PIECES.map((p, i) => (
          <Floating key={i} p={p} mx={mx} my={my} progress={progress} />
        ))}
      </div>
    </>
  );
}
