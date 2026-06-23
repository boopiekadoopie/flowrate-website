"use client";
import { motion } from "framer-motion";
import { stagger, scaleIn, fadeUp } from "@/lib/animations";

const steps = [
  {
    number: "01",
    title: "Free mockup, no strings",
    description:
      "I design your full homepage before you commit to anything. You see exactly what you're getting. If you don't love it, there is no invoice.",
    image: "/golden-sprinkler.png",
    imageAlt: "Golden hour sprinkler on a lush green lawn",
    tag: "Zero risk",
  },
  {
    number: "02",
    title: "You approve, we build",
    description:
      "Once you're happy with the direction, I build the full site in under two weeks. You provide your business details. I handle everything else.",
    image: "/nighttime-sprinkler.png",
    imageAlt: "Nighttime illuminated irrigation system in action",
    tag: "2 weeks",
  },
  {
    number: "03",
    title: "Live and generating leads",
    description:
      "Your site goes live, SEO-optimized, mobile-first, and built to convert the homeowner reading it at 11pm. Then I can run your SEO every month.",
    image: "/luxury-aerial.png",
    imageAlt: "Luxury property with perfectly irrigated green lawn",
    tag: "Done",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F4F8F4] py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-green-dark font-semibold text-xs tracking-widest uppercase mb-4">
            The process
          </p>
          <h2 className="text-ink font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Three steps, no risk.
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            From first conversation to a live, lead-generating site in under two weeks.
          </p>
        </motion.div>

        {/* Cards with real photos */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={scaleIn}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg hover:border-green/20 transition-all duration-300 cursor-default"
            >
              {/* Photo header */}
              <div className="relative h-52 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.image}
                  alt={step.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060C07]/70 via-[#060C07]/20 to-transparent" />
                {/* Step number + tag */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <span className="text-white/90 font-extrabold text-4xl leading-none select-none">{step.number}</span>
                  <span className="bg-green/90 text-[#060C07] text-xs font-bold px-3 py-1 rounded-full">{step.tag}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                <h3 className="text-ink font-bold text-xl mb-3 leading-snug">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                {/* Green accent line at bottom */}
                <div className="mt-6 h-0.5 w-8 bg-green rounded-full group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom nudge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-14"
        >
          <a
            href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
            className="inline-flex items-center gap-2.5 bg-ink text-white font-bold px-8 py-4 rounded-full text-base hover:bg-[#1a2e1b] transition-colors cursor-pointer"
          >
            Start with step 1. It&apos;s free
            <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
