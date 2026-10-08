"use client";
import { motion, useReducedMotion } from "framer-motion";

/*
 * The sign-off: FLOWRATE set edge to edge across the bottom of the page, as a low-contrast
 * typographic closing detail (reference: Figma Config's footer wordmark). The SVG viewBox is cut
 * to the measured ink box of "FLOWRATE" in Archivo Black (advance 6.064em, ink 0.074em to
 * 6.018em, cap height 0.70em), so the letters span exactly the page width at any size and the
 * block's height follows from the width. It rises into place once as it scrolls into view;
 * with reduced motion it is simply there.
 */
const INK_W = 5944; // ink width at font-size 1000
const INK_H = 712; // ascent 700 + descent 12
const PAD_B = 16;

export function FooterWordmark() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="relative w-full overflow-hidden select-none pt-8 sm:pt-12">
      <motion.svg
        viewBox={`0 0 ${INK_W} ${INK_H + PAD_B}`}
        className="block w-full h-auto"
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
        <text x="74" y="700" className="font-display" fontSize="1000" fontWeight="400" fill="url(#fw-fill)">
          FLOWRATE
        </text>
      </motion.svg>
    </div>
  );
}
