"use client";
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/animations";
import { CALENDLY_URL } from "@/lib/site";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";

export { CALENDLY_URL };
export const EMAIL = "andrew@flowrate.agency";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[1240px] mx-auto px-5 sm:px-8 ${className}`}>{children}</div>;
}

/*
 * Section heading: Archivo, uppercase, near-black. No eyebrow labels above it.
 * It arrives the way the brand sting does: a fine line of light draws under it, and the words rise up out of
 * their own baseline (each word is clipped at its line) one after another, then the line fades. With reduced
 * motion, or when the heading is not plain text, it simply fades up as before.
 */
const FLOW = [0.22, 1, 0.36, 1] as const;
const riseWord = (i: number): Variants => ({
  hidden: { y: "108%" },
  show: { y: "0%", transition: { duration: 0.6, ease: FLOW, delay: 0.12 + i * 0.035 } },
});
const baseLine: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: [0, 1, 1], opacity: [1, 1, 0], transition: { duration: 1.5, times: [0, 0.25, 1], ease: "easeOut" as const } },
};

export function H2({ children, className = "", light = false }: { children: ReactNode; className?: string; light?: boolean }) {
  const reduce = useReduceAfterMount();
  const text = typeof children === "string" ? children : null;
  const cls = `relative font-display uppercase text-[30px] sm:text-[40px] xl:text-[46px] leading-[1.04] tracking-[-0.02em] [text-wrap:balance] ${
    light ? "text-white" : "text-heading"
  } ${className}`;
  if (!text || reduce) {
    return (
      <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className={cls}>
        {children}
      </motion.h2>
    );
  }
  const words = text.split(" ");
  return (
    <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className={cls}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="inline-block overflow-clip align-bottom pt-[0.06em] -mt-[0.06em]">
            <motion.span className="inline-block" variants={riseWord(i)}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
      <motion.span
        aria-hidden
        variants={baseLine}
        className={`pointer-events-none absolute inset-x-0 -bottom-[5px] h-px origin-left ${
          light ? "bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55)_20%,rgba(255,255,255,0.55)_70%,transparent)]" : "bg-[linear-gradient(90deg,transparent,rgba(16,24,40,0.35)_20%,rgba(16,24,40,0.35)_70%,transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5)_20%,rgba(255,255,255,0.5)_70%,transparent)]"
        }`}
      />
    </motion.h2>
  );
}

export function Lede({ children, className = "", light = false }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <motion.p
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`text-[17px] md:text-[18px] leading-[1.6] [text-wrap:pretty] ${light ? "text-white/70" : "text-body"} ${className}`}
    >
      {children}
    </motion.p>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Arrow({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M3 10h13m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Green is the action colour: filled CTAs only. */
export function PrimaryButton({ href = CALENDLY_URL, children, className = "" }: { href?: string; children: ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-center gap-2 bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-4 rounded-lg hover:bg-green-light transition-colors cursor-pointer ${className}`}
    >
      {children}
      <Arrow className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}

export function DarkButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 bg-carbon text-white dark:bg-white dark:text-[#101828] dark:hover:bg-white/90 font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-4 rounded-lg hover:bg-black transition-colors ${className}`}
    >
      {children}
    </a>
  );
}
