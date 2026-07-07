"use client";
import { motion } from "framer-motion";
import { stagger, fadeUp, slideRight } from "@/lib/animations";

function FlowrateSealBadge() {
  return (
    <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="sg_starGold" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
        <radialGradient id="sg_circleGold" cx="38%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="30%" stopColor="#FCD34D" />
          <stop offset="65%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <radialGradient id="sg_innerGold" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="45%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>
        <linearGradient id="sg_sheen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id="sg_innerClip">
          <circle cx="70" cy="70" r="43" />
        </clipPath>
        <path id="sg_topArc" d="M 17,70 A 53,53 0 0,1 123,70" />
        <path id="sg_bottomArc" d="M 34,107 A 53,53 0 0,0 106,107" />
      </defs>

      {/* 24-spike starburst */}
      <path
        d="M70,2 L77.70,11.51 L87.60,4.32 L92.58,15.49 L104,11.12 L105.92,23.19 L118.08,21.92 L116.81,34.08 L128.88,36 L124.51,47.42 L135.68,52.40 L128.49,62.30 L138,70 L128.49,77.70 L135.68,87.60 L124.51,92.58 L128.88,104 L116.81,105.92 L118.08,118.08 L105.92,116.81 L104,128.88 L92.58,124.51 L87.60,135.68 L77.70,128.49 L70,138 L62.30,128.49 L52.40,135.68 L47.42,124.51 L36,128.88 L34.08,116.81 L21.92,118.08 L23.19,105.92 L11.12,104 L15.49,92.58 L4.32,87.60 L11.51,77.70 L2,70 L11.51,62.30 L4.32,52.40 L15.49,47.42 L11.12,36 L23.19,34.08 L21.92,21.92 L34.08,23.19 L36,11.12 L47.42,15.49 L52.40,4.32 L62.30,11.51 Z"
        fill="url(#sg_starGold)"
      />

      {/* Dark separator behind text ring */}
      <circle cx="70" cy="70" r="60" fill="#451A03" />

      {/* Main gold text disc */}
      <circle cx="70" cy="70" r="57" fill="url(#sg_circleGold)" />

      {/* FLOWRATE AGENCY — circular top text */}
      <text fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="8" fill="#3D1A00" letterSpacing="2.2">
        <textPath href="#sg_topArc" startOffset="50%" textAnchor="middle">
          FLOWRATE AGENCY
        </textPath>
      </text>

      {/* Stars bottom arc */}
      <text fontFamily="Arial, sans-serif" fontSize="7.5" fill="#3D1A00" opacity="0.6" letterSpacing="5">
        <textPath href="#sg_bottomArc" startOffset="50%" textAnchor="middle">
          ★ ★ ★
        </textPath>
      </text>

      {/* Inner border ring */}
      <circle cx="70" cy="70" r="44.5" fill="#3D1A00" opacity="0.45" />

      {/* Inner gold disc */}
      <circle cx="70" cy="70" r="43" fill="url(#sg_innerGold)" />

      {/* Dashed inner ring */}
      <circle cx="70" cy="70" r="40" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="2.5 2" fill="none" opacity="0.5" />

      {/* Flowrate F mark — scaled to 26×39, centered at (70, 55) */}
      <g transform="translate(57, 36) scale(0.448)">
        <path
          fill="#3D1A00"
          d="M56.8225 0.0443641C57.1179 -0.00504054 57.0346 -0.0352749 57.2608 0.0766008C57.555 0.731355 57.268 8.80176 57.3691 10.3862C57.5506 13.2312 57.1862 17.9484 56.3583 20.6911C53.9266 28.5873 47.4323 34.579 39.3427 36.3898C38.0823 36.6664 36.6313 36.8306 35.3463 36.893C31.8557 37.0638 28.7129 36.1357 25.9317 38.8363C23.0449 41.6394 23.4812 44.8439 23.4905 48.5277C23.5013 50.3081 23.497 52.0887 23.4775 53.8691C29.1389 53.692 36.848 55.6641 39.5172 48.363C39.7774 47.6512 39.8559 46.7058 40.1075 45.8978C41.4073 45.7915 44.1055 45.8777 45.544 45.8703C45.4801 49.4248 44.0434 52.8179 41.5327 55.3444C37.7109 59.1456 34.0943 59.4296 29.095 59.4199L23.473 59.4222C23.5838 60.881 23.5264 63.9037 23.4966 65.4408C23.4033 70.2553 24.0901 74.047 21.9195 78.4648C17.9632 85.5808 12.4781 86.3581 4.9656 85.9728C3.35202 85.8899 1.64633 86.0806 0.0221129 86.0606C-0.0101531 85.6161 0.00124102 85.1593 0.0052623 84.7129C0.0575389 78.8158 -0.0125481 72.9407 0.0392498 67.0407C0.0696009 63.5808 1.72972 60.1086 4.1872 57.6991C8.27195 53.6941 12.6949 53.8551 18.0153 54.023C17.7446 52.374 17.9017 49.8267 17.8961 48.11L17.895 36.8613C17.8909 33.3905 17.8891 29.9161 17.8968 26.4454C17.9031 23.5616 17.8839 20.8509 18.5875 18.0301C19.601 14.056 21.6023 10.3999 24.4069 7.3986C28.1007 3.44623 33.0745 0.916766 38.4545 0.254668C40.7064 -0.00303745 42.9219 0.109411 45.1719 0.0775555C49.0031 0.0231914 53.0098 0.188763 56.8225 0.0443641ZM23.3916 33.6724C25.5831 32.4026 27.181 31.5938 29.7847 31.4169C31.9649 31.3117 34.3014 31.4508 36.4324 31.2796C40.3464 30.9651 44.5724 28.61 47.175 25.7275C51.7283 20.6846 51.8473 15.8171 51.6813 9.43935C51.6556 8.44658 51.6084 6.56701 51.6767 5.60897C49.1427 5.53772 46.1802 5.56109 43.6183 5.57692C42.7419 5.58417 41.8614 5.58197 40.9867 5.60505C34.7229 5.77082 29.4337 8.81616 26.2107 14.1529C23.2317 19.0857 23.405 23.4579 23.4929 29.0251C23.4993 29.8737 23.555 32.9808 23.3916 33.6724ZM5.68551 80.4735C7.47564 80.3781 8.96514 80.5498 10.8645 80.3819C13.2426 79.906 15.1599 78.8216 16.5175 76.7595C17.1239 75.8439 17.5393 74.8167 17.7388 73.738C17.9192 72.7604 17.9186 71.7638 17.923 70.7729C17.938 67.3928 17.9209 64.0126 17.9246 60.6325C17.9251 60.2242 17.9325 59.8178 17.9573 59.4102C16.2321 59.4316 14.4342 59.3728 12.7256 59.4515C9.03571 59.7298 6.0073 63.0524 5.76785 66.6652C5.64635 68.4975 5.67852 70.3086 5.68072 72.1433L5.68551 80.4735Z"
        />
      </g>

      {/* SEAL OF EXCELLENCE banner — clipped to inner circle */}
      <g clipPath="url(#sg_innerClip)">
        <rect x="10" y="89" width="120" height="24" fill="#3D1A00" opacity="0.92" />
        <text
          x="70"
          y="104"
          textAnchor="middle"
          fontFamily="Arial Black, sans-serif"
          fontWeight="900"
          fontSize="5.8"
          fill="#FCD34D"
          letterSpacing="1"
        >
          SEAL OF EXCELLENCE
        </text>
      </g>

      {/* Sheen highlight */}
      <circle cx="70" cy="70" r="57" fill="url(#sg_sheen)" />
    </svg>
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

            {/* Seal badge + Signature row */}
            <motion.div variants={fadeUp} className="flex items-center gap-6 mb-8">
              {/* Ornate seal badge */}
              <div className="w-[110px] h-[110px] flex-shrink-0">
                <FlowrateSealBadge />
              </div>
              {/* Signature + founder identity */}
              <div className="flex flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/signature.svg"
                  alt="Andrew Murray signature"
                  className="w-52 h-auto mb-1"
                />
                <p className="text-white font-bold text-base">Andrew Murray</p>
                <p className="text-amber-400 font-semibold text-sm tracking-wide">Founder, Flowrate Agency</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp}>
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

          {/* RIGHT: Photo — contained */}
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
                    i === 0 ? "-left-5 top-16" : "-right-5 top-40"
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
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
