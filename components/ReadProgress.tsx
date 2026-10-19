"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/*
 * A thin ink line under the navbar that fills as you read the guide (from the top of the article to its end).
 * Ink, not green. It only appears once reading has started, and reduced motion still gets it: it moves with
 * the reader's own scrolling, it doesn't animate by itself.
 */
export function ReadProgress({ target }: { target: string }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => setEl(document.getElementById(target)), [target]);
  const { scrollYProgress } = useScroll({ target: el ? { current: el } : undefined, offset: ["start 64px", "end end"] });
  const x = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fr-progress fixed left-0 right-0 top-16 z-50 h-[2px] origin-left bg-heading"
      style={{ scaleX: x, opacity: el ? 1 : 0 }}
    />
  );
}
