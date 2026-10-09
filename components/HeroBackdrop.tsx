"use client";
import { useEffect, useSyncExternalStore } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import { Chat, JobCard, Mail, Receipt, Sheet, Sticky } from "./Paperwork";

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

type Piece = { el: React.ReactNode; side: -1 | 1; x: string; y: number; depth: number; rot: number; dur: number; scale?: number; fade?: number };

/* Shared pieces are drawn at cover size; the hero shows them a touch smaller. */
const K = 0.88;

const PIECES: Piece[] = [
  { el: <JobCard width={156} />, side: -1, x: "4%", y: 150, depth: 1, rot: -9, dur: 12 },
  { el: <Sticky />, side: -1, x: "13%", y: 470, depth: 0.75, rot: 6, dur: 10 },
  { el: <Receipt />, side: -1, x: "-1%", y: 520, depth: 0.5, rot: -4, dur: 14 },
  { el: <Chat />, side: 1, x: "82%", y: 140, depth: 1, rot: 5, dur: 11 },
  { el: <Sheet />, side: 1, x: "79%", y: 430, depth: 0.7, rot: -3, dur: 13 },
  { el: <Mail />, side: 1, x: "88%", y: 300, depth: 0.45, rot: 3, dur: 15 },
];

/* Phones: fewer, smaller, softer pieces that peek in from the edges and stay clear of the copy. */
const MOBILE_PIECES: Piece[] = [
  { el: <JobCard width={156} />, side: -1, x: "-4%", y: 18, depth: 0.85, rot: -11, dur: 12, scale: 0.4, fade: 0.9 },
  { el: <Chat />, side: 1, x: "56%", y: 44, depth: 0.85, rot: 7, dur: 11, scale: 0.4, fade: 0.9 },
  { el: <Sticky />, side: -1, x: "-6%", y: 708, depth: 0.7, rot: 8, dur: 10, scale: 0.55, fade: 0.85 },
  { el: <Sheet />, side: 1, x: "74%", y: 714, depth: 0.6, rot: -5, dur: 13, scale: 0.5, fade: 0.75 },
];

function Floating({ p, mx, my, progress }: { p: Piece; mx: MotionValue<number>; my: MotionValue<number>; progress: MotionValue<number> }) {
  const reach = 160 * p.depth;
  const x = useTransform(() => mx.get() * 22 * p.depth + -p.side * progress.get() * reach);
  const y = useTransform(() => my.get() * 16 * p.depth + progress.get() * 220 * p.depth);
  const opacity = useTransform(progress, [0, 0.55], [p.fade ?? (p.depth < 0.6 ? 0.6 : 1), 0]);
  const blur = (1 - p.depth) * 4;
  const scale = p.scale ?? (0.7 + p.depth * 0.3) * K;
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
  const reduce = useReduceAfterMount();
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
