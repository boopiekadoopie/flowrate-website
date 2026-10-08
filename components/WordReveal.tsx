"use client";
import { useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

const subscribeNoop = () => () => {};

/*
 * Scroll-linked statement: words brighten from faint to full as the reader scrolls past.
 * Wrap a word in [brackets] to give it the boxed highlight.
 */
function Word({ word, range, progress, boxed }: { word: string; range: [number, number]; progress: MotionValue<number>; boxed: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const box = useTransform(progress, [range[0], range[1] + 0.04], [0, 1]);
  const boxScale = useTransform(box, [0, 1], [0.92, 1]);
  return (
    <span className="relative inline-block mr-[0.26em]">
      {boxed && (
        <motion.span
          aria-hidden
          style={{ opacity: box, scale: boxScale }}
          className="absolute -inset-x-[0.18em] -inset-y-[0.06em] rounded-[6px] border border-heading/80 bg-canvas"
        />
      )}
      <motion.span style={{ opacity }} className="relative">
        {word}
      </motion.span>
    </span>
  );
}

export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const prefersReduce = useReducedMotion();
  // The server and the first client render always draw the per-word version; only after mount may
  // a reduced-motion visitor get the plain heading, so hydration never mismatches.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const reduce = !!prefersReduce && mounted;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  const plain = text.replace(/[[\]]/g, "");

  // The ref'd <h2> stays mounted in both branches so useScroll's target never disappears.
  return (
    <h2 ref={ref} className={className} aria-label={plain}>
      <span aria-hidden>
        {reduce ? plain : words.map((w, i) => {
          const boxed = w.includes("[");
          const clean = w.replace(/[[\]]/g, "");
          const start = i / words.length;
          return <Word key={i} word={clean} boxed={boxed} progress={scrollYProgress} range={[start, start + 1 / words.length]} />;
        })}
      </span>
    </h2>
  );
}
