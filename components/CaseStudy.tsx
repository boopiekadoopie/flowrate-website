"use client";
import { motion } from "framer-motion";
import { Check, Container, H2, Lede } from "./ui";

const facts = [
  {
    title: "Works with no signal",
    body: "The load saves on the driver’s phone and sends itself when signal comes back.",
  },
  {
    title: "Reads every document",
    body: "Delivery notes, weighbridge tickets and load slips, straight from a photo.",
  },
  {
    title: "Checks before it bills",
    body: "Weights are compared page against page, so a typo can’t become an invoice.",
  },
  {
    title: "Files everything",
    body: "Documents are stored and the trip sheet is updated without anyone touching it.",
  },
  {
    title: "Drafts, never sends",
    body: "It creates a draft invoice in the accounts. A person still approves it.",
  },
  {
    title: "Holds what doesn’t add up",
    body: "If a figure is missing or disagrees, the load waits for someone to check it.",
  },
];

export function CaseStudy() {
  return (
    <section id="proof" className="bg-canvas pb-20 md:pb-28 px-3 sm:px-5 lg:px-8">
      <div className="max-w-[1240px] mx-auto rounded-lg bg-carbon overflow-hidden">
        <Container className="py-14 md:py-20 !px-6 sm:!px-10 lg:!px-14">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16">
            <div>
              <H2 light className="mb-5">The system at the top of this page is real.</H2>
              <Lede light className="mb-8">
                We built it inside a working fleet. Drivers photograph their paperwork at
                the end of a run, and the office never retypes it.
              </Lede>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-[13px] font-semibold text-white">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-green animate-ping opacity-60" />
                  <span className="relative w-2 h-2 rounded-full bg-green" />
                </span>
                Live
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-white/10">
              {facts.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="p-5 sm:p-6 border-r border-b border-white/10"
                >
                  <p className="flex items-center gap-2 text-white font-semibold text-[15px] mb-1.5">
                    <Check className="w-4 h-4 text-white/45 flex-shrink-0" />
                    {f.title}
                  </p>
                  <p className="text-white/60 text-[14px] leading-[1.55]">{f.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
