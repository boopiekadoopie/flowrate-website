"use client";
import { motion } from "framer-motion";
import { stagger, slideLeft, slideRight, fadeUp } from "@/lib/animations";

export function BeforeAfter() {
  return (
    <section className="bg-[#F4F8F4] py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-green-dark font-semibold text-xs tracking-widest uppercase mb-4">The difference</p>
          <h2 className="text-ink font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            This is what we&apos;re up against.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Most irrigation websites look like this. Yours does not have to.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Generic bad website mockup */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3">
                  <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm.5 7.5h-1v-1h1v1zm0-2h-1v-3h1v3z" />
                </svg>
                Before
              </span>
              <span className="text-slate-400 text-sm">Typical irrigation website</span>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-red-200/60 shadow-lg shadow-red-100/50">
              {/* Fake browser bar */}
              <div className="bg-gray-200 px-4 py-2.5 flex items-center gap-2 border-b border-gray-300">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                </div>
                <div className="flex-1 bg-white rounded px-2 py-0.5 text-xs text-gray-400 font-mono">
                  austinirrigation.com
                </div>
              </div>
              {/* Fake bad website content */}
              <div className="bg-gray-100 p-0">
                {/* Nav */}
                <div className="bg-[#003366] px-4 py-2 flex items-center justify-between">
                  <span className="text-white font-bold text-sm">Austin Irrigation Services</span>
                  <div className="hidden sm:flex gap-4 text-xs text-blue-200">
                    <span>Home</span><span>Services</span><span>Contact</span>
                  </div>
                </div>
                {/* Hero */}
                <div className="bg-[#e8e8e8] px-6 py-8 text-center border-b-4 border-[#003366]">
                  <p className="text-[#003366] font-bold text-xl mb-1" style={{ fontFamily: 'serif' }}>
                    Welcome to Austin Irrigation Services
                  </p>
                  <p className="text-gray-600 text-xs mb-4">Serving Austin Since 1998</p>
                  <div className="bg-[#003366] text-white text-xs px-4 py-2 inline-block cursor-default">
                    Click Here For A Free Quote
                  </div>
                </div>
                {/* Body */}
                <div className="bg-white px-6 py-6">
                  <p className="text-gray-700 text-xs leading-relaxed mb-4">
                    We are a family owned and operated irrigation company serving Austin and surrounding areas.
                    We specialize in lawn sprinkler systems, drip irrigation, and repair services.
                    Call us today for a free estimate!! We are fully licensed and insured.
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {["Sprinkler Install", "Repairs", "Winterizing"].map(s => (
                      <div key={s} className="bg-[#e8e8e8] border border-gray-300 text-center py-3 px-1">
                        <div className="w-6 h-6 bg-[#003366] mx-auto mb-1" />
                        <p className="text-gray-700 text-[10px] font-bold">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border border-gray-300 bg-gray-50 p-3 text-center">
                    <p className="text-gray-500 text-[11px]">Call us: <span className="text-[#003366] font-bold">(512) 555-0198</span></p>
                    <p className="text-gray-400 text-[10px] mt-1">Mon-Fri 8am-5pm</p>
                  </div>
                </div>
                {/* Footer */}
                <div className="bg-[#003366] px-4 py-2 text-center">
                  <p className="text-blue-200 text-[10px]">© 2019 Austin Irrigation Services. All Rights Reserved.</p>
                </div>
              </div>
            </div>
            {/* Pain points */}
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-5 space-y-2"
            >
              {[
                "No Google reviews visible. Homeowner has no reason to trust.",
                "No clear call to action above the fold.",
                "Looks like it was built in 2009. Signals an unreliable contractor.",
              ].map((p) => (
                <motion.li key={p} variants={fadeUp} className="flex items-start gap-2 text-sm text-slate-500">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  {p}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* RIGHT: Real Sunline website */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 bg-green/10 border border-green/30 text-green-dark text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                After
              </span>
              <span className="text-slate-400 text-sm">Built by Flowrate Agency</span>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-green/30 shadow-xl shadow-green/10">
              {/* Real browser bar */}
              <div className="bg-[#1A2B1A] px-4 py-2.5 flex items-center gap-2 border-b border-white/8">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                </div>
                <div className="flex-1 bg-[#060C07]/60 rounded px-2 py-0.5 flex items-center gap-1.5">
                  <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5 text-green/60 flex-shrink-0">
                    <path d="M6 1a5 5 0 100 10A5 5 0 006 1zM1 6h10M6 1c-1.5 1.5-2 3.2-2 5s.5 3.5 2 5M6 1c1.5 1.5 2 3.2 2 5s-.5 3.5-2 5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                  <span className="text-white/50 text-xs font-medium">sunlineirrigation.com</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                  <span className="text-green text-xs font-semibold">Live</span>
                </div>
              </div>
              {/* Scrollable screenshot — feels like a real mini-site */}
              <div
                className="overflow-y-auto"
                style={{ height: 420 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sunline-screenshot.png"
                  alt="Sunline Irrigation website built by Flowrate Agency"
                  className="w-full"
                />
              </div>
              {/* Scroll hint */}
              <div className="bg-[#1A2B1A]/80 px-4 py-2 flex items-center justify-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-green/60">
                  <path d="M8 3v10M5 10l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white/30 text-[10px] tracking-wide">Scroll to explore</span>
              </div>
            </div>
            {/* Win points */}
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-5 space-y-2"
            >
              {[
                "Google rating visible immediately. Trust built in 3 seconds.",
                "Single clear CTA above the fold. Homeowner knows exactly what to do.",
                "Premium design. Signals a contractor worth calling.",
              ].map((p) => (
                <motion.li key={p} variants={fadeUp} className="flex items-start gap-2 text-sm text-slate-600">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-green flex-shrink-0 mt-0.5">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {p}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mt-16"
        >
          <a
            href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
            className="inline-flex items-center gap-2.5 bg-ink text-white font-bold px-8 py-4 rounded-full text-base hover:bg-[#1a2e1b] transition-colors cursor-pointer"
          >
            Get your free mockup
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
