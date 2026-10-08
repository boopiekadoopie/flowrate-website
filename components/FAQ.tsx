"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container, EMAIL, H2, Lede } from "./ui";

export const faqs = [
  {
    q: "What kind of systems do you build?",
    a: "Admin systems that track every job from first call to paid invoice, apps your team uses on their phones out on the job, reports that show what really happened, and websites. Most projects are a mix: the point is that information gets entered once and flows everywhere it needs to go.",
  },
  {
    q: "Do you only work with certain industries?",
    a: "No. The process matters more than the industry. If your business has work that gets retyped, chased, or kept in someone’s head, it’s a good candidate for a system.",
  },
  {
    q: "Do I actually need custom software?",
    a: "Not always. If a spreadsheet or an off-the-shelf tool will do the job, we’ll tell you on the first call. Custom makes sense when your process is what sets you apart, or when you’ve been bending your business around software that doesn’t fit.",
  },
  {
    q: "Will it work with the tools we already use?",
    a: "Usually, yes. Systems can connect to accounting software such as Xero, to spreadsheets, storage and email, so nobody has to copy information from one place to another.",
  },
  {
    q: "What if my team works where there’s no signal?",
    a: "Field apps can be built to work offline. The phone saves the job and sends it on its own when signal comes back, so nothing is lost on site or on the road.",
  },
  {
    q: "How much does a system cost?",
    a: "Every system is scoped and quoted on a call, because no two businesses need the same thing. Book a free call and we’ll work out what you need before talking numbers.",
  },
  {
    q: "How long does a build take?",
    a: "It depends on the size of the system. You’ll get a timeline with your quote, and you’ll see how it works before the build starts.",
  },
  {
    q: "Do you still build websites?",
    a: "Yes. Websites are part of what we build, often alongside a system that handles what happens after someone gets in touch.",
  },
];

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer group"
      >
        <span className="text-heading text-[17px] font-semibold group-hover:text-black">{q}</span>
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
