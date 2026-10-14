"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import { Chat, JobCard, Mail, Receipt, Sheet, Sticky } from "./Paperwork";
import { play } from "@/lib/sound";

/*
 * The paperwork a business runs on, drifting around the headline at different depths.
 * As you scroll it gets pulled in toward the product and fades: the system absorbs it.
 *
 * Make a mess: on a desktop the pieces can be picked up and thrown around. Pointing at the main button
 * (the "fr-gather" event from the hero) pulls every piece, one after another, into the product below;
 * letting go lets them drift back to their own places, tidy again. The visitor makes the mess, the
 * system tidies it. Phones and reduced motion keep the quiet drifting version.
 */
export const GATHER_EVENT = "fr-gather";
const GATHER: [number, number, number, number] = [0.55, 0, 0.7, 0.2];
const FLOW: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

function Floating({ p, i, mx, my, progress, interactive }: { p: Piece; i: number; mx: MotionValue<number>; my: MotionValue<number>; progress: MotionValue<number>; interactive: boolean }) {
  const reach = 160 * p.depth;
  const x = useTransform(() => mx.get() * 22 * p.depth + -p.side * progress.get() * reach);
  const y = useTransform(() => my.get() * 16 * p.depth + progress.get() * 220 * p.depth);
  const opacity = useTransform(progress, [0, 0.55], [p.fade ?? (p.depth < 0.6 ? 0.6 : 1), 0]);
  const blur = (1 - p.depth) * 4;
  const scale = p.scale ?? (0.7 + p.depth * 0.3) * K;
  // the visitor's own layer: where they dragged it, and the trip into the product and back
  const dx = useMotionValue(0), dy = useMotionValue(0), gs = useMotionValue(1), go = useMotionValue(1);
  const ref = useRef<HTMLDivElement>(null);
  const away = useRef(false);
  useEffect(() => {
    if (!interactive) return;
    const onGather = (e: Event) => {
      const on = (e as CustomEvent<boolean>).detail;
      const el = ref.current, target = document.querySelector("[data-gather-target]");
      if (!el || !target) return;
      if (on && !away.current) {
        away.current = true;
        const a = el.getBoundingClientRect(), t = target.getBoundingClientRect();
        const tx = t.left + t.width / 2 - (a.left + a.width / 2), ty = t.top + 48 - (a.top + a.height / 2);
        const o = { duration: 0.48, ease: GATHER, delay: i * 0.06 };
        animate(dx, dx.get() + tx, o);
        animate(dy, dy.get() + ty, o);
        animate(gs, 0.3, o);
        animate(go, 0, { ...o, duration: 0.3, delay: o.delay + 0.2 });
        if (i === PIECES.length - 1) play("pop-in", 0.35, (o.delay + 0.45) * 1000); // one soft pop as the pile lands
      } else if (!on && away.current) {
        away.current = false;
        const o = { duration: 1.6, ease: FLOW, delay: (5 - i) * 0.05 };
        animate(dx, 0, o);
        animate(dy, 0, o);
        animate(gs, 1, o);
        animate(go, 1, { duration: 0.5, delay: o.delay });
      }
    };
    window.addEventListener(GATHER_EVENT, onGather);
    return () => window.removeEventListener(GATHER_EVENT, onGather);
  }, [interactive, i, dx, dy, gs, go]);

  const piece = (
    <div style={{ transform: `scale(${scale})`, filter: blur ? `blur(${blur.toFixed(1)}px)` : undefined }}>
      <div className="paper-float" style={{ ["--r" as string]: `${p.rot}deg`, ["--d" as string]: `${p.dur}s` }}>
        {p.el}
      </div>
    </div>
  );
  return (
    <motion.div className="absolute" style={{ left: p.x, top: p.y, x, y, opacity }}>
      {interactive ? (
        <motion.div
          ref={ref}
          drag
          dragMomentum
          dragTransition={{ power: 0.25, timeConstant: 260 }}
          whileDrag={{ scale: 1.04, cursor: "grabbing" }}
          style={{ x: dx, y: dy, scale: gs, opacity: go }}
          onDragStart={() => document.body.classList.add("select-none")}
          onDragEnd={() => document.body.classList.remove("select-none")}
          className="pointer-events-auto cursor-grab touch-none select-none"
        >
          {piece}
        </motion.div>
      ) : (
        piece
      )}
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
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[900px] hidden lg:block z-[5]">
        {PIECES.map((p, i) => (
          <Floating key={i} i={i} p={p} mx={mx} my={my} progress={progress} interactive={canHover && !reduce} />
        ))}
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[820px] lg:hidden">
        {MOBILE_PIECES.map((p, i) => (
          <Floating key={i} i={i} p={p} mx={mx} my={my} progress={progress} interactive={false} />
        ))}
      </div>
    </>
  );
}
