"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/animations";
import { LawnReveal } from "./LawnReveal";

const CALENDLY_URL = "https://calendly.com/andrewedwardmurray/30min";

const chips = [
  { label: "Irrigation & Sprinklers", color: "#99E58C" },
  { label: "Landscaping & Lawn Care", color: "#99E58C" },
  { label: "HVAC", color: "#60A5FA" },
  { label: "Plumbing", color: "#FBBF24" },
];

function Check({ color }: { color: string }) {
  return (
    <span
      className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      <svg viewBox="0 0 16 16" fill="none" className="w-2.5 h-2.5 text-[#050505]">
        <path d="M3.5 8l3 3L12.5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Base layer: dry lawn */}
      <div className="absolute inset-0 z-[1] bg-center bg-cover bg-no-repeat" style={{ backgroundImage: "url(/dry-lawn.jpg)" }} />

      {/* Reveal layer: green lawn under the cursor */}
      <LawnReveal />

      {/* Heavy dark overlays so the section reads near-black like the reference */}
      <div className="absolute inset-0 z-[4] bg-[#050505]/85" />
      <div className="absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,5,5,0.82)_100%)]" />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Gold glows behind the corner laptops */}
      <div className="absolute z-[6] bottom-[-12%] left-[-8%] w-[46vw] h-[60vh] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,199,44,0.16)_0%,transparent_65%)]" />
      <div className="absolute z-[6] bottom-[-12%] right-[-8%] w-[46vw] h-[60vh] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,199,44,0.16)_0%,transparent_65%)]" />
      {/* Faint green brand tint top center */}
      <div className="absolute z-[6] top-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[50vh] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(153,229,140,0.08)_0%,transparent_65%)]" />

      {/* Left laptop: stone pedestal */}
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block absolute z-[8] bottom-0 left-[-2%] pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <Image
            src="/laptop-mockup-left.png"
            alt="Irrigation contractor website on a laptop, on a mossy stone pedestal"
            width={786}
            height={944}
            priority
            className="h-[52vh] max-h-[540px] w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)]"
          />
        </motion.div>
      </motion.div>

      {/* Right laptop: wood stump */}
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:block absolute z-[8] bottom-0 right-[-2%] pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5.6, ease: "easeInOut" }}
        >
          <Image
            src="/laptop-mockup-right.png"
            alt="Sunline Irrigation website on a laptop, on a tree stump"
            width={1466}
            height={1964}
            priority
            className="h-[52vh] max-h-[540px] w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)]"
          />
        </motion.div>
      </motion.div>

      {/* Centered content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-[10] max-w-6xl mx-auto px-6 pt-36 pb-24 lg:pt-44 lg:pb-32 flex flex-col items-center text-center"
      >
        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-white text-[40px] md:text-[54px] xl:text-[64px] uppercase leading-[1.05] tracking-tight mb-7"
          style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
        >
          The AI Agency for America&apos;s
          <br />
          <span className="text-green italic">Home Service Brands</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          className="text-white/65 text-lg md:text-xl leading-relaxed max-w-2xl mb-10"
        >
          Custom websites, SEO, and content built for irrigation and landscape
          contractors, so the homeowners searching in your area find you and
          call you first.
        </motion.p>

        {/* Service chips */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-12">
          {chips.map((c) => (
            <span
              key={c.label}
              className="inline-flex items-center gap-2 bg-[#0A0A0A]/80 backdrop-blur-sm text-[13px] font-bold px-3.5 py-2 rounded-full border"
              style={{ color: c.color, borderColor: `${c.color}55` }}
            >
              <Check color={c.color} />
              {c.label}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green text-[#060C07] font-extrabold uppercase tracking-wide text-base md:text-lg px-10 py-5 rounded-xl hover:bg-green-light transition-colors shadow-[0_0_50px_rgba(153,229,140,0.4)] cursor-pointer"
          >
            Get Your Free Custom Design
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
              <path d="M3 10h13m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
