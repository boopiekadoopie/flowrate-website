"use client";
import { motion } from "framer-motion";
import { stagger, scaleIn, fadeUp } from "@/lib/animations";

const websiteFeatures = [
  "Full website (up to 6 service pages)",
  "About, Gallery, FAQ, Contact pages",
  "Google review widget above the fold",
  "On-page SEO and schema markup",
  "Mobile-first, fast-loading",
  "Free homepage mockup before you pay",
];

const retainerFeatures = [
  "Everything in the website build",
  "Monthly Google Business Profile update",
  "Two seasonal blog posts per month",
  "Local keyword rank tracking + reports",
  "Priority site edits and changes",
  "Cancel anytime — no lock-in",
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#0C1A0D] py-24 md:py-32 relative overflow-hidden">
      {/* Subtle dewdrop image bg */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dewdrop-lawn.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-8"
      />
      <div className="absolute inset-0 bg-[#0C1A0D]/80" />

      {/* Green glow orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-green font-semibold text-xs tracking-widest uppercase mb-4">Pricing</p>
          <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Simple, honest pricing.
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            50% deposit on design approval. 50% on delivery. No retainer traps.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {/* Website Build card */}
          <motion.div
            variants={scaleIn}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-green/25 hover:bg-white/8 transition-all duration-300"
          >
            <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-6">Website Build</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-white font-extrabold text-5xl">$1,200</span>
            </div>
            <p className="text-white/35 text-sm mb-8">One-time. Full site. Ready to convert.</p>

            <ul className="space-y-3.5 mb-10">
              {websiteFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-white/60 text-sm">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-green/70 flex-shrink-0 mt-0.5">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="mailto:andrewedwardmurray@gmail.com?subject=Website%20Build%20Inquiry"
              className="block w-full text-center border border-white/20 text-white font-bold px-6 py-3.5 rounded-full text-sm hover:bg-white/8 hover:border-white/35 transition-colors cursor-pointer"
            >
              Get started
            </a>
          </motion.div>

          {/* Retainer card — recommended */}
          <motion.div
            variants={scaleIn}
            className="relative bg-green/8 backdrop-blur-sm border border-green/30 rounded-3xl p-8 hover:border-green/50 hover:bg-green/12 transition-all duration-300"
          >
            {/* Recommended badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-green text-[#060C07] text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                Most Popular
              </span>
            </div>

            <p className="text-green/80 text-xs font-semibold tracking-widest uppercase mb-6">Build + Monthly SEO</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-white font-extrabold text-5xl">$1,200</span>
            </div>
            <p className="text-white/50 text-sm mb-1">one-time build +</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-green font-extrabold text-2xl">$500</span>
              <span className="text-white/40 text-sm">/mo retainer</span>
            </div>
            <p className="text-white/35 text-sm mb-8">Cancel anytime. No contract.</p>

            <ul className="space-y-3.5 mb-10">
              {retainerFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-white/70 text-sm">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-green flex-shrink-0 mt-0.5">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="mailto:andrewedwardmurray@gmail.com?subject=Build%20%2B%20Retainer%20Inquiry"
              className="block w-full text-center bg-green text-[#060C07] font-bold px-6 py-3.5 rounded-full text-sm hover:bg-green-light transition-colors cursor-pointer"
            >
              Get started
            </a>
          </motion.div>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-white/25 text-sm mt-10"
        >
          First client (Sunline Irrigation) was at the introductory rate of $750. Standard pricing applies going forward.
        </motion.p>
      </div>
    </section>
  );
}
