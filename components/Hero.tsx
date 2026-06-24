"use client";
import { motion } from "framer-motion";
import { fadeUp, stagger, slideRight } from "@/lib/animations";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#060C07]">
      {/* Looping sprinkler video — premium feel */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center opacity-40"
        poster="/hero-video-fallback.jpg"
      >
        <source src="/hero-sprinkler.mp4" type="video/mp4" />
      </video>
      {/* Gradient overlays: heavy left so text reads, fades right for the mockup */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#060C07]/98 via-[#060C07]/85 to-[#060C07]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#060C07]/80 via-transparent to-[#060C07]/30" />

      <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-4 items-center w-full min-h-screen">
        {/* Left: Text content */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="z-10 flex flex-col justify-center"
        >
          {/* Eyebrow badge */}
          <motion.div variants={fadeUp} className="mb-7">
            <span className="inline-flex items-center gap-2.5 bg-green/10 border border-green/20 text-green text-xs font-semibold tracking-widest uppercase px-4 py-2.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse flex-shrink-0" />
              Irrigation Web Design Specialist
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-white font-extrabold text-5xl md:text-6xl lg:text-[64px] tracking-tight leading-[1.04] mb-6"
          >
            Your clients are
            <br />
            searching right{" "}
            <span className="text-green">now.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-white/60 text-lg md:text-xl leading-relaxed max-w-[500px] mb-10"
          >
            I build websites for irrigation contractors that win homeowners
            before they ever pick up the phone. Full site in two weeks.
            Free mockup first. No invoice if you walk.
          </motion.p>

          {/* Stats row */}
          <motion.div variants={fadeUp} className="flex items-center gap-8 mb-10">
            {[
              { value: "2 wks", label: "build time" },
              { value: "Free", label: "mockup first" },
              { value: "100%", label: "satisfaction" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-green font-extrabold text-2xl leading-none">{s.value}</span>
                <span className="text-white/35 text-xs mt-1">{s.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <a
              href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
              className="bg-green text-[#060C07] font-bold px-8 py-4 rounded-full text-base hover:bg-green-light transition-colors cursor-pointer"
            >
              Schedule a free call
            </a>
            <a
              href="#portfolio"
              className="border border-white/20 text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-white/6 hover:border-white/35 transition-colors cursor-pointer"
            >
              See our work
            </a>
          </motion.div>
        </motion.div>

        {/* Right: Browser mockup of the Sunline site — shows the actual product */}
        <motion.div
          variants={slideRight}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.35 }}
          className="relative hidden lg:flex justify-end items-center"
        >
          <div className="relative">
            {/* Browser mockup card */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60" style={{ width: 480 }}>
              {/* Browser chrome bar */}
              <div className="bg-[#1A2B1A] px-4 py-3 flex items-center gap-2.5 border-b border-white/8">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                </div>
                <div className="flex-1 bg-[#060C07]/60 rounded-md px-3 py-1.5 flex items-center gap-2">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-green/60 flex-shrink-0">
                    <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM1 8h14M8 1c-2 2-3 4.5-3 7s1 5 3 7M8 1c2 2 3 4.5 3 7s-1 5-3 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-white/50 text-xs font-medium">sunlineirrigation.com</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  <span className="text-green text-xs font-semibold">Live</span>
                </div>
              </div>
              {/* Real Sunline screenshot */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sunline-screenshot.png"
                alt="Sunline Irrigation website built by Flowrate Agency"
                className="w-full"
              />
            </div>

            {/* Floating badge: built in 2 weeks */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -left-10 top-10 bg-[#0C1A0D]/95 border border-green/25 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-green/15 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-green">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-xs leading-none mb-0.5">Sunline Irrigation</p>
                  <p className="text-green text-xs">Live in under 2 weeks</p>
                </div>
              </div>
            </motion.div>

            {/* Floating badge: stars */}
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -right-6 bottom-16 bg-[#0C1A0D]/95 border border-green/25 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl"
            >
              <div className="flex items-center gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-green">
                    <path d="M6 1l1.27 2.57L10 4.1l-2 1.95.47 2.75L6 7.57 3.53 8.8 4 6.05 2 4.1l2.73-.53z" />
                  </svg>
                ))}
              </div>
              <p className="text-white font-semibold text-xs">Irrigation-only specialist</p>
            </motion.div>

            {/* Floating stat: free mockup */}
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -right-6 top-32 bg-green/10 border border-green/30 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl"
            >
              <p className="text-green font-extrabold text-xl leading-none">Free</p>
              <p className="text-white/50 text-xs mt-0.5">mockup first</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
      >
        <span className="text-white/20 text-[10px] tracking-[0.2em] uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-green/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
