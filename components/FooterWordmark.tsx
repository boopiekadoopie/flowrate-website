"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import { mascot } from "@/lib/mascot";
import { WinkMascot } from "./WinkMascot";

/*
 * The sign-off: FLOWRATE set edge to edge across the bottom of the page, as a low-contrast
 * typographic closing detail (reference: Figma Config's footer wordmark). The SVG viewBox is cut
 * to the measured ink box of "FLOWRATE" in Archivo Black (advance 6.064em, ink 0.074em to
 * 6.018em, cap height 0.70em), so the letters span exactly the page width at any size and the
 * block's height follows from the width. It rises into place once as it scrolls into view;
 * with reduced motion it is simply there.
 *
 * The encore: the page ends the way every reel ends. A line of light draws along the top of the letters
 * and the mascot rises from behind them, then winks. Once per visit; after that (and with reduced
 * motion) he is simply standing there, and still winks on hover.
 */
const INK_W = 5944; // ink width at font-size 1000
const INK_H = 712; // ascent 700 + descent 12
const PAD_B = 16;
const SEEN = "fr-encore";

// whether the encore already played this visit (read once per page load; set when it plays)
let seenThisVisit: boolean | null = null;
const getSeen = () => {
  if (seenThisVisit === null) {
    try {
      seenThisVisit = sessionStorage.getItem(SEEN) === "1";
    } catch {
      seenThisVisit = false;
    }
  }
  return seenThisVisit;
};
const subscribeNoop = () => () => {};

export function FooterWordmark() {
  const reduce = useReduceAfterMount();
  const stage = useRef<HTMLDivElement>(null);
  const seen = useSyncExternalStore(subscribeNoop, getSeen, () => false);
  const [rising, setRising] = useState(false);

  useEffect(() => {
    if (reduce || seen) return;
    const el = stage.current;
    if (!el) return;
    let tm: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        try {
          sessionStorage.setItem(SEEN, "1");
        } catch {}
        seenThisVisit = true;
        setRising(true);
        tm = setTimeout(() => mascot.play("footer", "wink"), 1250);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(tm);
    };
  }, [reduce, seen]);

  const shown = reduce || seen || rising;
  const animate = rising;

  return (
    <div className="relative w-full overflow-hidden select-none pt-24 sm:pt-36 lg:pt-44">
      {/* the encore stage: everything above the top edge of the letters */}
      <div ref={stage} className="absolute inset-x-0 top-0 h-24 sm:h-36 lg:h-44 overflow-hidden">
        <div
          className="absolute top-[10%] left-1/2 h-[225%]"
          style={{
            transform: `translate(-50%, ${shown ? "0%" : "62%"})`,
            transition: animate ? "transform 680ms cubic-bezier(0.34, 1.4, 0.64, 1) 380ms" : "none",
          }}
        >
          <WinkMascot sizes="(min-width: 1024px) 200px, 140px" role="footer" className="h-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.5)]" imgClassName="block h-full w-auto" />
        </div>
      </div>
      {/* the line of light he rises from: the top edge of the letters */}
      <div
        aria-hidden
        className="absolute left-[18%] right-[18%] h-px top-24 sm:top-36 lg:top-44 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55)_30%,rgba(255,255,255,0.55)_70%,transparent)]"
        style={{
          transform: `scaleX(${shown ? 1 : 0})`,
          opacity: shown ? (animate ? 0.9 : 0.35) : 0,
          transition: animate ? "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1600ms ease 900ms" : "none",
        }}
      />
      <motion.svg
        aria-hidden
        viewBox={`0 0 ${INK_W} ${INK_H + PAD_B}`}
        className="relative block w-full h-auto"
        initial={reduce ? false : { y: "30%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <linearGradient id="fw-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.17" />
            <stop offset="0.65" stopColor="#FFFFFF" stopOpacity="0.075" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.035" />
          </linearGradient>
        </defs>
        <text x="-74" y="700" className="font-display" fontSize="1000" fontWeight="400" fill="url(#fw-fill)">
          FLOWRATE
        </text>
      </motion.svg>
    </div>
  );
}
