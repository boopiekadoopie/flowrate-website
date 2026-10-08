"use client";
import { motion } from "framer-motion";
import { Container, H2, Lede } from "./ui";
import { ArtFrame, LiveArt, MapArt, PrototypeArt } from "./IsoArt";

const steps = [
  {
    title: "We learn how the job really runs",
    body: "A call first, then time with the people who do the work. We map every step, including the workarounds nobody wrote down.",
    out: "A clear map of the job as it runs today.",
    art: MapArt,
  },
  {
    title: "You see it before we build it",
    body: "We show you how the system will work, screen by screen, and change it until it fits the way your team already works.",
    out: "A design you’ve signed off, so nothing is a surprise.",
    art: PrototypeArt,
  },
  {
    title: "We build it and launch it with you",
    body: "We test it on real jobs before anyone relies on it, then set it up with your team so it’s used from day one.",
    out: "A working system, running on your real jobs.",
    art: LiveArt,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-paper py-20 md:py-28 border-y border-line">
      <Container>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-16 lg:items-end mb-12 md:mb-16">
          <H2>How a build works.</H2>
          <Lede>
            No long requirements documents, and no software you have to bend your
            business around. It starts with how you work now.
          </Lede>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 md:gap-x-10 border-t border-line md:border-t-0">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative pt-8 pb-10 md:pb-0 md:border-t border-line border-b md:border-b-0 last:border-b-0"
            >
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: 0.2 + i * 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -top-px left-0 right-0 h-[2px] bg-heading origin-left"
              />
              <div className="flex items-start justify-between gap-4">
                <span className="font-display text-[48px] leading-none text-heading tabular-nums">{i + 1}</span>
              </div>
              <ArtFrame className="my-6 h-[168px] sm:h-[176px]">
                <s.art />
              </ArtFrame>
              <h3 className="text-heading text-[20px] font-bold tracking-[-0.01em] mb-2.5">{s.title}</h3>
              <p className="text-body text-[16px] leading-[1.6] mb-6">{s.body}</p>
              <p className="rounded-lg bg-canvas border border-line px-4 py-3 text-[14px] text-heading font-medium">
                {s.out}
              </p>
            </motion.li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
