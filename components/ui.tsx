"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/animations";

export const CALENDLY_URL = "https://calendly.com/flowrate/30min";
export const EMAIL = "andrew@flowrate.agency";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`max-w-[1240px] mx-auto px-5 sm:px-8 ${className}`}>{children}</div>;
}

/* Section heading: Archivo, uppercase, near-black. No eyebrow labels above it. */
export function H2({ children, className = "", light = false }: { children: ReactNode; className?: string; light?: boolean }) {
  return (
    <motion.h2
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`font-display uppercase text-[30px] sm:text-[40px] xl:text-[46px] leading-[1.04] tracking-[-0.02em] [text-wrap:balance] ${
        light ? "text-white" : "text-heading"
      } ${className}`}
    >
      {children}
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
