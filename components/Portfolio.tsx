"use client";
import { motion } from "framer-motion";
import { stagger, slideLeft, slideRight, fadeUp } from "@/lib/animations";

const deliverables = [
  "Full 6-page website",
  "On-page SEO + schema markup",
  "Google Business Profile setup",
  "Google review widget",
  "Mobile-first responsive design",
  "Fast load times (Core Web Vitals)",
];

export function Portfolio() {
  return (
    <section id="portfolio" className="bg-[#0C1A0D] py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-green font-semibold text-xs tracking-widest uppercase mb-4">Our work</p>
          <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Client #1 is live.
          </h2>
          <p className="text-white/45 text-lg max-w-xl mx-auto">
            Sunline Irrigation, launched June 2026. Here is exactly what was built and what it delivers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Browser mockup */}
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/40">
              {/* Browser chrome */}
              <div className="bg-[#1A2B1A] px-4 py-3 flex items-center gap-2.5 border-b border-white/6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                </div>
                <div className="flex-1 bg-[#060C07]/60 rounded-md px-3 py-1 flex items-center gap-2">
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
              {/* Site screenshot */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/section-lawn.jpg"
                  alt="Sunline Irrigation website preview"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060C07]/40 to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <motion.div variants={slideRight}>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Client</p>
              <p className="text-white font-extrabold text-2xl">Sunline Irrigation</p>
              <p className="text-white/40 text-sm mt-1">Austin, TX</p>
            </motion.div>

            {/* Deliverables */}
            <motion.div variants={slideRight}>
              <p className="text-green font-semibold text-xs tracking-widest uppercase mb-4">What was delivered</p>
              <ul className="space-y-3">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-3 text-white/60 text-sm">
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-green flex-shrink-0">
                      <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              variants={slideRight}
              className="bg-[#060C07]/60 border border-green/15 rounded-2xl px-6 py-5"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 12 12" fill="currentColor" className="w-3.5 h-3.5 text-green">
                    <path d="M6 1l1.27 2.57L10 4.1l-2 1.95.47 2.75L6 7.57 3.53 8.8 4 6.05 2 4.1l2.73-.53z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed italic mb-4">
                &ldquo;Andrew built exactly what he promised. The site looks premium
                and professional. Completely different from what we had before.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-green/20 flex items-center justify-center">
                  <span className="text-green font-bold text-sm">S</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-xs">Sunline Irrigation</p>
                  <p className="text-white/35 text-xs">Austin, TX</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
              <a
                href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
                className="inline-flex items-center gap-2 bg-green text-[#060C07] font-bold px-8 py-4 rounded-full text-base hover:bg-green-light transition-colors cursor-pointer"
              >
                Get a site like this
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
