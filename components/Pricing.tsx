"use client";
import React from "react";
import { motion } from "framer-motion";
import { stagger, scaleIn, fadeUp } from "@/lib/animations";

const MonitorIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400">
    <rect x="2" y="3" width="16" height="11" rx="2" />
    <path d="M6 18h8M10 14v4" />
  </svg>
);
const PagesIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400">
    <path d="M6 2h8l4 4v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
    <path d="M14 2v4h4M8 13h4M8 9h4" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-400">
    <path d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.5l-4.33 2-0.83-4.82L2 7.27l4.91-1.01z" />
  </svg>
);
const SeoIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-400">
    <circle cx="9" cy="9" r="6" />
    <path d="M17 17l-3.5-3.5" />
    <path d="M9 6v6M6 9h6" />
  </svg>
);
const MobileIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400">
    <rect x="5" y="2" width="10" height="16" rx="2" />
    <circle cx="10" cy="15" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
const MockupIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-400">
    <path d="M3 3h14v10H3zM7 17h6M10 13v4" />
    <path d="M6 7h8M6 10h5" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-400">
    <path d="M4 10l4 4 8-8" />
  </svg>
);
const MapPinIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400">
    <path d="M10 2a5 5 0 015 5c0 4-5 9-5 9s-5-5-5-9a5 5 0 015-5z" />
    <circle cx="10" cy="7" r="2" />
  </svg>
);
const PenIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-400">
    <path d="M13.5 3.5l3 3-9 9H4.5v-3l9-9z" />
    <path d="M11.5 5.5l3 3" />
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400">
    <path d="M3 14l4-4 4 2 4-6" />
    <rect x="2" y="2" width="16" height="16" rx="2" />
  </svg>
);
const ZapIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-400">
    <path d="M11 2L5 11h6l-2 7 8-10h-6l2-6z" />
  </svg>
);
const UnlockIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400">
    <rect x="3" y="9" width="14" height="9" rx="2" />
    <path d="M7 9V6a5 5 0 0110 0" />
  </svg>
);

type FeatureItem = { icon: React.ReactNode; text: string };

const websiteFeatures: FeatureItem[] = [
  { icon: <MonitorIcon />, text: "Full website with up to 6 service pages" },
  { icon: <PagesIcon />, text: "About, Gallery, FAQ, and Contact pages" },
  { icon: <StarIcon />, text: "Google review widget above the fold" },
  { icon: <SeoIcon />, text: "On-page SEO and schema markup" },
  { icon: <MobileIcon />, text: "Mobile-first, fast-loading build" },
  { icon: <MockupIcon />, text: "Free homepage mockup before you pay" },
];

const retainerFeatures: FeatureItem[] = [
  { icon: <CheckIcon />, text: "Ongoing local SEO for your service area" },
  { icon: <MapPinIcon />, text: "Monthly Google Business Profile updates" },
  { icon: <PenIcon />, text: "Blog posts included every month" },
  { icon: <ChartIcon />, text: "Rank tracking + monthly performance report" },
  { icon: <ZapIcon />, text: "Site maintenance and priority edits" },
  { icon: <UnlockIcon />, text: "Optional, month to month, no lock-in" },
];

function FeatureRow({ icon, text, delay = 0 }: { icon: React.ReactNode; text: string; delay?: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 text-sm"
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-white/70">{text}</span>
    </motion.li>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden">
      {/* Rich layered background */}
      <div className="absolute inset-0 bg-[#0a1a0b]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/dewdrop-lawn.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060C07] via-[#0a1a0b]/60 to-[#060C07]" />

      {/* Animated glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green/15 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green/10 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-green font-semibold text-xs tracking-widest uppercase mb-4">Pricing</p>
          <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Simple, honest pricing.
            <span className="block text-green">No surprises.</span>
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            50% deposit once you approve the design direction. 50% at launch. The retainer is always optional.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-6"
        >
          {/* Website Build card */}
          <motion.div
            variants={scaleIn}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group relative bg-white/6 backdrop-blur-sm border border-white/12 rounded-3xl p-8 hover:border-green/30 hover:bg-white/10 transition-all duration-400 cursor-default overflow-hidden"
          >
            {/* Card inner glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-3xl" />

            <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-6">Website Build</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-white font-extrabold text-6xl leading-none">Custom</span>
            </div>
            <p className="text-white/35 text-sm mb-8">Quoted live on your free strategy call. One-time build, no contract.</p>

            <ul className="space-y-4 mb-10">
              {websiteFeatures.map((f, i) => (
                <FeatureRow key={f.text} icon={f.icon} text={f.text} delay={i * 0.07} />
              ))}
            </ul>

            <a
              href="https://calendly.com/flowrate/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center border border-white/20 text-white font-bold px-6 py-3.5 rounded-full text-sm hover:bg-white/10 hover:border-white/40 transition-colors cursor-pointer"
            >
              Book your free call
            </a>
          </motion.div>

          {/* Retainer card — recommended */}
          <motion.div
            variants={scaleIn}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group relative bg-green/8 backdrop-blur-sm border border-green/30 rounded-3xl p-8 hover:border-green/55 hover:bg-green/12 transition-all duration-400 cursor-default overflow-hidden"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green/12 via-transparent to-transparent opacity-60 pointer-events-none rounded-3xl" />

            {/* Recommended badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-green text-[#060C07] text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg shadow-green/30">
                Most Popular
              </span>
            </div>

            <p className="text-green/80 text-xs font-semibold tracking-widest uppercase mb-6">Monthly SEO Retainer</p>
            <div className="flex flex-wrap items-baseline gap-1 mb-2">
              <span className="text-white font-extrabold text-4xl md:text-5xl leading-none">$500</span>
              <span className="text-white/50 text-xl md:text-2xl font-bold">-</span>
              <span className="text-white font-extrabold text-4xl md:text-5xl leading-none">$5k</span>
              <span className="text-white/40 text-sm">/month</span>
            </div>
            <p className="text-white/50 text-sm mb-1">based on your market competition and goals</p>
            <p className="text-white/35 text-sm mb-8">Ads stop when you stop paying. SEO keeps earning for years. Month to month, no lock-in.</p>

            <ul className="space-y-4 mb-10">
              {retainerFeatures.map((f, i) => (
                <FeatureRow key={f.text} icon={f.icon} text={f.text} delay={i * 0.07} />
              ))}
            </ul>

            <a
              href="https://calendly.com/flowrate/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-green text-[#060C07] font-bold px-6 py-3.5 rounded-full text-sm hover:bg-green-light transition-colors cursor-pointer shadow-lg shadow-green/20"
            >
              Book your free call
            </a>
          </motion.div>
        </motion.div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-green/60">
            <path d="M8 2L3 4.5v4c0 3.3 2.3 6.3 5 7 2.7-.7 5-3.7 5-7v-4L8 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <p className="text-white/30 text-sm">Free mockup. No invoice if you walk. No risk, ever.</p>
        </motion.div>
      </div>
    </section>
  );
}
