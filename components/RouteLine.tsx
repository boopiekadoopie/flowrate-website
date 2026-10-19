"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { animate, motion, useMotionValue } from "framer-motion";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";

/*
 * The honest loader: the first half second of the brand sting, used between pages. Clicking a link to another
 * page sends a few loose bits sliding in from across the top edge; they gather into a fine ink line that grows
 * while the next page loads, finishes the moment it has arrived, and fades. It only runs for a real page change,
 * never on its own, and stays out of the way with reduced motion or paused animations.
 */
const BITS = [0.18, 0.37, 0.55, 0.72, 0.88]; // where the bits start, as a share of the width

export function RouteLine() {
  const pathname = usePathname();
  const reduce = useReduceAfterMount();
  const w = useMotionValue(0);
  const o = useMotionValue(0);
  const [run, setRun] = useState(0); // bumps on every start, to replay the bits
  const going = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    if (reduce) return;
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return; // same page: nothing loads
      going.current = true;
      setRun((n) => n + 1);
      o.set(1);
      w.set(0);
      animate(w, 0.72, { duration: 2.4, ease: [0.22, 1, 0.36, 1] }); // slows as it waits, never pretends to finish
      clearTimeout(giveUp);
      giveUp = setTimeout(() => { // the click was taken over and no page change came: let the line go
        if (!going.current) return;
        going.current = false;
        animate(o, 0, { duration: 0.35, ease: "easeInOut" });
      }, 6000);
    };
    let giveUp: ReturnType<typeof setTimeout> | undefined;
    // Capture phase: Next's links mark the click as handled before it would bubble up to here.
    document.addEventListener("click", onClick, true);
    return () => { document.removeEventListener("click", onClick, true); clearTimeout(giveUp); };
  }, [reduce, w, o]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!going.current) return;
    going.current = false;
    animate(w, 1, { duration: 0.22, ease: [0.22, 1, 0.36, 1] });
    animate(o, 0, { duration: 0.35, delay: 0.25, ease: "easeInOut" });
  }, [pathname, w, o]);

  if (reduce) return null;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]" style={{ opacity: o }}>
      <motion.div className="absolute inset-y-0 left-0 right-0 origin-left bg-heading" style={{ scaleX: w }} />
      {run > 0 &&
        BITS.map((x, i) => (
          <motion.span
            key={`${run}-${i}`}
            className="absolute top-0 h-[2px] w-[10px] rounded-full bg-heading"
            initial={{ left: `${x * 100}%`, opacity: 0 }}
            animate={{ left: "0%", opacity: [0, 1, 0] }}
            transition={{ duration: 0.45, delay: i * 0.03, ease: [0.55, 0, 0.7, 0.2] }}
          />
        ))}
    </motion.div>
  );
}
