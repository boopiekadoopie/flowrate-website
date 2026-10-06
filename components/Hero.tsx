"use client";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";
import { SystemDemo } from "./SystemDemo";

const CALENDLY_URL = "https://calendly.com/flowrate/30min";

const builds = ["Admin systems", "Driver & field apps", "Reporting", "Websites"];

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M3 10h13m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative bg-[#f5f5f5] pt-20 lg:pt-24 pb-6 lg:pb-10 px-3 sm:px-5 lg:px-8">
      <div className="max-w-[1240px] mx-auto rounded-lg bg-white border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-10 lg:gap-14 items-center px-5 sm:px-8 lg:px-14 pt-12 pb-6 sm:pb-8 lg:py-20">
          {/* Copy */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-[580px]">
            <motion.h1
              variants={fadeUp}
              className="text-[#101828] text-[34px] sm:text-[46px] xl:text-[54px] uppercase leading-[1.02] tracking-[-0.02em] mb-6 [text-wrap:balance]"
              style={{ fontFamily: "var(--font-archivo), var(--font-jakarta), sans-serif" }}
            >
              We build the systems your business runs on.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[#4a5565] text-[17px] md:text-[18px] leading-[1.55] max-w-[500px] mb-7 [text-wrap:pretty]"
            >
              Built around the way you already work, so the retyping, the chasing
              and the month-end scramble stop.
            </motion.p>

            <motion.ul variants={fadeUp} className="flex flex-wrap gap-2 mb-9" aria-label="What we build">
              {builds.map((b) => (
                <li
                  key={b}
                  className="text-[13px] font-semibold text-[#364153] bg-[#f5f5f5] border border-[#e5e7eb] rounded-lg px-3 py-1.5"
                >
                  {b}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-4 rounded-lg hover:bg-green-light transition-colors cursor-pointer"
              >
                Book a free call
                <Arrow className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 bg-[#1f1f1f] text-white font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-4 rounded-lg hover:bg-black transition-colors"
              >
                See what we build
              </a>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-7 text-[13px] text-[#6a7282] leading-relaxed">
              Built by people who had to do the job by hand first.
            </motion.p>
          </motion.div>

          {/* Product tile */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SystemDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
