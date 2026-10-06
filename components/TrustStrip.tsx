"use client";
import { motion } from "framer-motion";

const replaced = [
  "WhatsApp photo groups",
  "Retyped spreadsheets",
  "Paper job cards",
  "Month-end chasing",
  "“Who’s handling this?”",
];

export function TrustStrip() {
  return (
    <section aria-label="What our systems replace" className="bg-canvas pb-14 lg:pb-20 px-3 sm:px-5 lg:px-8">
      <div className="max-w-[1240px] mx-auto px-2 sm:px-6 lg:px-14 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10">
        <p className="text-heading font-semibold text-[15px] flex-shrink-0">Built to replace</p>
        <ul className="flex flex-wrap gap-x-7 gap-y-3">
          {replaced.map((item, i) => (
            <li key={item} className="relative text-body text-[15px]">
              {item}
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: 0.4 + i * 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-heading/70 origin-left"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
