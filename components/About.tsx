"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp, slideRight } from "@/lib/animations";

function FlowrateSealBadge() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/seal-badge.png"
      alt="Flowrate Agency Seal of Excellence"
      className="w-full h-full object-contain"
    />
  );
}

const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Website Design",
    desc: "Premium, conversion-focused sites built specifically for irrigation contractors.",
    color: "text-slate-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    ),
    title: "Local SEO",
    desc: "Rank on Google Maps and organic search for every service area you target.",
    color: "text-green",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
      </svg>
    ),
    title: "Reputation Management",
    desc: "Google review strategy that builds trust before homeowners even call.",
    color: "text-amber-400",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Content & Copywriting",
    desc: "Every word written around what homeowners fear, not a generic template.",
    color: "text-slate-300",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Google Business Profile",
    desc: "Monthly updates, post management, and photo strategy to stay visible.",
    color: "text-green",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Lead Generation",
    desc: "The full package. Not just a website, a system that pulls clients in.",
    color: "text-amber-400",
  },
];

const trustBadges = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    label: "Free mockup, no deposit",
    sub: "See it before you pay",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-amber-400">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    label: "3 to 4 week delivery",
    sub: "From deposit to live site",
  },
];

export function About() {
  return (
    <section id="about" className="bg-[#060C07] py-24 md:py-32 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT: All content */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeUp} className="text-white/40 font-semibold text-xs tracking-widest uppercase mb-5">
              About
            </motion.p>

            <motion.h2 variants={fadeUp} className="text-white font-extrabold text-4xl md:text-5xl tracking-tight leading-tight mb-6">
              Your vision.
              <span className="block text-green">Our commitment.</span>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-white/55 text-base leading-relaxed mb-5">
              I am Andrew Murray, founder of Flowrate Agency. I spent two years hands-on at Controlled Irrigation CC in Johannesburg, watching skilled contractors lose jobs to worse competitors every single week. The difference was never skill. It was the website.
            </motion.p>

            <motion.p variants={fadeUp} className="text-white/55 text-base leading-relaxed mb-5">
              Homeowners make their decision in the first three seconds. If your site does not look credible, they call someone else. That is the problem Flowrate was built to fix permanently.
            </motion.p>

            <motion.p variants={fadeUp} className="text-white/55 text-base leading-relaxed mb-10">
              We are not just a web design agency. We are a full-service growth partner for irrigation and landscaping companies: websites, SEO, Google Business Profile management, reputation building, and content that generates inbound leads every month. One relationship. Everything handled.
            </motion.p>

            {/* Services grid */}
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
              {services.map((s) => (
                <motion.div
                  key={s.title}
                  variants={fadeUp}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className={s.color}>{s.icon}</span>
                    <p className="text-white/80 font-semibold text-sm">{s.title}</p>
                  </div>
                  <p className="text-white/35 text-xs leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>

          {/* RIGHT: Photo, seal badge on its corner, signature block underneath */}
          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col items-center lg:items-start lg:pt-12"
          >
            <div className="relative w-full max-w-sm">
              {/* Subtle glow */}
              <div className="absolute -inset-4 bg-white/5 rounded-3xl blur-2xl" />
              {/* Border frame */}
              <div className="relative rounded-3xl overflow-hidden border border-white/8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/andrew-portrait.png"
                  alt="Andrew Murray, founder of Flowrate Agency"
                  className="w-full object-cover object-top"
                  style={{ maxHeight: 480 }}
                />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060C07] to-transparent" />
              </div>

              {/* Trust badge 1 — top left */}
              {trustBadges.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                  className={`absolute bg-[#0F1F10]/95 border border-white/10 rounded-2xl px-4 py-3 shadow-xl shadow-black/50 ${
                    i === 0 ? "-left-5 top-[220px]" : "-right-5 top-[290px]"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    {b.icon}
                    <p className="text-white font-semibold text-xs">{b.label}</p>
                  </div>
                  <p className="text-white/40 text-[11px] pl-6">{b.sub}</p>
                </motion.div>
              ))}

              {/* Bottom badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#0F1F10]/95 border border-white/10 rounded-2xl px-5 py-3 shadow-xl shadow-black/50 whitespace-nowrap"
              >
                <p className="text-white font-semibold text-sm">Irrigation-only specialist</p>
                <p className="text-white/35 text-xs">Deeper expertise than any generalist agency</p>
              </motion.div>

              {/* Seal badge — perched on the photo's bottom-right corner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="absolute -bottom-9 -right-6 w-24 h-24 md:w-28 md:h-28 z-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]"
              >
                <FlowrateSealBadge />
              </motion.div>
            </div>

            {/* Signature block — fills the space below the photo */}
            <motion.div variants={fadeUp} className="w-full max-w-sm mt-20 flex flex-col items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/signature.svg"
                alt="Andrew Murray signature"
                className="w-52 h-auto mb-1 [filter:brightness(0)_invert(1)]"
              />
              <p className="text-white font-bold text-base">Andrew Murray</p>
              <p className="text-amber-400 font-semibold text-sm tracking-wide mb-6">Founder, Flowrate Agency</p>

              <a
                href="mailto:andrew@flowrate.agency?subject=Free%20Mockup%20Request"
                className="inline-flex items-center gap-2.5 bg-green text-[#060C07] font-bold px-8 py-4 rounded-full text-base hover:bg-green-light transition-colors cursor-pointer"
              >
                Work with Andrew
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
