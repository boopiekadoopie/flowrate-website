"use client";
import { motion } from "framer-motion";
import { slideLeft, slideRight, stagger, fadeUp } from "@/lib/animations";

const bullets = [
  "2 years hands-on at Controlled Irrigation CC, Johannesburg",
  "Saw great contractors lose bids to worse ones — bad websites",
  "Built Flowrate to fix that problem permanently",
  "Every site is built around what homeowners fear, not a template",
  "Irrigation-only focus means deeper expertise than any generalist",
];

export function About() {
  return (
    <section id="about" className="bg-[#060C07] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

          {/* Left: Andrew's portrait — dramatic full-height */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative min-h-[480px] lg:min-h-[640px] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/andrew-banner.png"
              alt="Andrew Murray — Flowrate Agency founder"
              className="w-full h-full object-cover"
              style={{ objectPosition: "20% center" }}
            />
            {/* Right edge blend into the text column */}
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#060C07] to-transparent" />
            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060C07] to-transparent" />

            {/* Name plate on photo */}
            <div className="absolute bottom-8 left-8">
              <p className="text-green font-bold text-lg leading-none">Andrew Murray</p>
              <p className="text-white/50 text-sm mt-1">Founder, Flowrate Agency</p>
            </div>
          </motion.div>

          {/* Right: Copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col justify-center px-8 md:px-14 py-16"
          >
            <motion.p variants={fadeUp} className="text-green font-semibold text-xs tracking-widest uppercase mb-5">
              About
            </motion.p>

            <motion.h2 variants={fadeUp} className="text-white font-extrabold text-4xl md:text-5xl tracking-tight leading-tight mb-7">
              I&apos;ve worked in this
              <br />
              industry. I know what{" "}
              <span className="text-green">homeowners fear.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-white/55 text-base leading-relaxed mb-10 max-w-md">
              I spent two years at Controlled Irrigation CC in Johannesburg. Every week
              I watched skilled contractors lose jobs to worse companies — because their
              website looked untrustworthy. Homeowners chose the one that looked credible,
              not the one that was better. I built Flowrate to fix that.
            </motion.p>

            {/* Bullet list */}
            <motion.ul variants={stagger} className="space-y-3.5 mb-10">
              {bullets.map((b) => (
                <motion.li
                  key={b}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-white/55 text-sm"
                >
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-green flex-shrink-0 mt-0.5">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp}>
              <a
                href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
                className="inline-flex items-center gap-2 bg-green text-[#060C07] font-bold px-8 py-4 rounded-full text-base hover:bg-green-light transition-colors cursor-pointer"
              >
                Work with Andrew
              </a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
