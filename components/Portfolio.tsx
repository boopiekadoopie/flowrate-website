"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp, scaleIn } from "@/lib/animations";

const results = [
  {
    stat: "14",
    unit: "days",
    label: "Average build time",
    sub: "From deposit to a live, ranking site",
  },
  {
    stat: "100%",
    unit: "",
    label: "Satisfaction rate",
    sub: "Every client approved their mockup",
  },
  {
    stat: "$0",
    unit: "",
    label: "Cost if you walk",
    sub: "Free mockup. No invoice if it is not right.",
  },
];

const deliverables = [
  "Full website up to 6 service pages",
  "On-page SEO and schema markup",
  "Google review widget above the fold",
  "Google Business Profile setup",
  "Mobile-first, Core Web Vitals optimised",
  "Copy written for you. No blank forms to fill.",
  "Custom domain setup and SSL",
  "30-day post-launch support included",
];

export function Portfolio() {
  return (
    <section id="portfolio" className="relative bg-[#060C07] py-24 md:py-32 overflow-hidden">
      {/* Subtle bg texture */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/sprinkler-macro.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-8 pointer-events-none"
      />
      <div className="absolute inset-0 bg-[#060C07]/80" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-green font-semibold text-xs tracking-widest uppercase mb-4">What you get</p>
          <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Everything your site needs.<br />Nothing you don&apos;t.
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            One flat price. No retainer traps. No hourly billing. A complete, conversion-ready website delivered in two weeks.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {results.map((r) => (
            <motion.div
              key={r.label}
              variants={scaleIn}
              className="bg-white/5 border border-white/10 rounded-2xl px-8 py-8 text-center hover:border-green/20 hover:bg-white/8 transition-all duration-300"
            >
              <div className="flex items-end justify-center gap-1 mb-2">
                <span className="text-green font-extrabold text-5xl leading-none">{r.stat}</span>
                {r.unit && <span className="text-green/60 font-bold text-xl mb-1">{r.unit}</span>}
              </div>
              <p className="text-white font-semibold text-base mb-1">{r.label}</p>
              <p className="text-white/35 text-sm">{r.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Deliverables grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: what is included */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-green font-semibold text-xs tracking-widest uppercase mb-6">Included in every build</p>
            <ul className="space-y-4">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-white/65 text-sm">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-green flex-shrink-0 mt-0.5">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {d}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right: testimonial + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Testimonial card */}
            <div className="bg-white/5 border border-green/15 rounded-2xl px-7 py-7">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 12 12" fill="currentColor" className="w-4 h-4 text-green">
                    <path d="M6 1l1.27 2.57L10 4.1l-2 1.95.47 2.75L6 7.57 3.53 8.8 4 6.05 2 4.1l2.73-.53z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/75 text-base leading-relaxed italic mb-5">
                &ldquo;Andrew built exactly what he promised. The site looks premium
                and professional. Completely different from what we had before.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-green font-bold">S</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Sunline Irrigation</p>
                  <p className="text-white/35 text-xs">Austin, TX · Client #1</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <a
                href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
                className="inline-flex items-center gap-2.5 bg-green text-[#060C07] font-bold px-8 py-4 rounded-full text-base hover:bg-green-light transition-colors cursor-pointer"
              >
                Get your free mockup
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <p className="text-white/25 text-xs mt-3">No commitment. No invoice if you walk.</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
