"use client";
import { motion } from "framer-motion";
import { stagger, slideLeft, slideRight } from "@/lib/animations";

const problems = [
  {
    number: "01",
    title: "No social proof above the fold",
    description:
      "Homeowners won't call if they can't see your rating immediately. Before they read a single word, they need to know other people trusted you.",
  },
  {
    number: "02",
    title: "Looks like it was built in 2012",
    description:
      "A dated website signals an unreliable contractor before they read a word. In five seconds, they've already decided and moved on.",
  },
  {
    number: "03",
    title: "No clear next step",
    description:
      "If a homeowner has to hunt for your phone number, they're already calling your competitor. Every extra click costs you a job.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative bg-[#060C07] overflow-hidden">
      {/* Aerial comparison image — green vs dead — the perfect visual metaphor */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/aerial-comparison.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-15"
      />
      <div className="absolute inset-0 bg-[#060C07]/70" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-green font-semibold text-xs tracking-widest uppercase mb-4">
            Why leads slip away
          </p>
          <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight leading-tight max-w-2xl mx-auto">
            Most irrigation sites lose
            <br />
            the job before a call is made.
          </h2>
        </motion.div>

        {/* Two-column split: visual left, problems right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: aerial comparison image — dramatic visual */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/aerial-comparison.png"
                alt="Aerial view showing the stark contrast between an irrigated green lawn and a dry dead one"
                className="w-full h-full object-cover"
              />
              {/* Label overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-stretch gap-2">
                <div className="flex-1 bg-[#060C07]/80 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-green/20">
                  <p className="text-green text-xs font-bold uppercase tracking-wide">With Flowrate</p>
                  <p className="text-white/60 text-xs mt-0.5">Converting, trust-first site</p>
                </div>
                <div className="flex-1 bg-[#060C07]/80 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/8">
                  <p className="text-white/40 text-xs font-bold uppercase tracking-wide">Without it</p>
                  <p className="text-white/30 text-xs mt-0.5">Losing leads to competitors</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: numbered problem list */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-10"
          >
            {problems.map((p) => (
              <motion.div
                key={p.number}
                variants={slideRight}
                className="group flex gap-5"
              >
                {/* Large decorative number */}
                <span className="text-green/20 font-extrabold text-5xl leading-none flex-shrink-0 group-hover:text-green/35 transition-colors duration-300 select-none">
                  {p.number}
                </span>
                <div className="pt-1">
                  <h3 className="text-white font-bold text-lg mb-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-relaxed">{p.description}</p>
                </div>
              </motion.div>
            ))}

            {/* CTA nudge */}
            <motion.div variants={slideRight}>
              <a
                href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
                className="inline-flex items-center gap-2 text-green font-semibold text-sm hover:gap-3 transition-all duration-200"
              >
                Fix all three. Get a free mockup
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
