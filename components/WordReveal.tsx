"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

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
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  const plain = text.replace(/[[\]]/g, "");

  if (reduce) {
    return <h2 className={className}>{plain}</h2>;
  }
  return (
    <h2 ref={ref} className={className} aria-label={plain}>
      <span aria-hidden>
        {words.map((w, i) => {
          const boxed = w.includes("[");
          const clean = w.replace(/[[\]]/g, "");
          const start = i / words.length;
          return <Word key={i} word={clean} boxed={boxed} progress={scrollYProgress} range={[start, start + 1 / words.length]} />;
        })}
      </span>
    </h2>
  );
}
