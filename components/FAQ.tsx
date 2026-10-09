"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, EMAIL, H2, Lede } from "./ui";
import { faqs } from "@/lib/faqs";

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer group"
      >
        <span className="text-heading text-[17px] font-semibold">{q}</span>
        <span
          className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
            open ? "bg-carbon border-carbon text-white" : "border-line-strong text-heading"
          }`}
        >
          <svg viewBox="0 0 16 16" fill="none" className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-45" : ""}`} aria-hidden>
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="text-body text-[16px] leading-[1.65] pb-6 pr-14 max-w-[640px]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-paper py-20 md:py-28 border-y border-line">
      <Container>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <H2 className="mb-5">Questions people ask first.</H2>
            <Lede>
              Not covered here? Ask the assistant in the corner, or email{" "}
              <a href={`mailto:${EMAIL}`} className="text-heading font-semibold underline underline-offset-4 decoration-line-strong hover:decoration-heading">
                {EMAIL}
              </a>
              .
            </Lede>
          </div>
          <div className="border-t border-line">
            {faqs.map((f, i) => (
              <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
