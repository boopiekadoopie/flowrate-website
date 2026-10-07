"use client";
import { motion } from "framer-motion";
import { Check, Container, H2, Lede } from "./ui";

const facts = [
  "Works with no signal",
  "Reads every document",
  "Checks weights before it bills",
  "Files everything automatically",
  "Drafts invoices, never sends them",
  "Holds anything that doesn’t add up",
];

const log: { t: string; title: string; meta: string; tone?: "hold" | "ok" }[] = [
  { t: "17:42", title: "Load 2417 captured", meta: "3 photos · no signal, saved on the driver’s phone" },
  { t: "18:06", title: "Signal back, sent automatically", meta: "Nothing re-entered" },
  { t: "18:06", title: "Documents read", meta: "Delivery note, weighbridge ticket, load slip" },
  { t: "18:06", title: "Weights checked", meta: "28,460 kg on every page", tone: "ok" },
  { t: "18:07", title: "Filed and trip sheet updated", meta: "Stored with the load" },
  { t: "18:07", title: "Draft invoice created", meta: "Waiting for a person to approve", tone: "ok" },
  { t: "18:31", title: "Load 2418 held", meta: "Ticket and delivery note disagree · needs a look", tone: "hold" },
];

export function CaseStudy() {
  return (
    <section id="proof" className="bg-canvas py-20 md:py-28 px-3 sm:px-5 lg:px-8">
      <div className="max-w-[1240px] mx-auto rounded-lg bg-carbon overflow-hidden">
        <Container className="py-14 md:py-20 !px-6 sm:!px-10 lg:!px-14">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center">
            <div>
              <H2 light className="mb-5">The system at the top of this page is real.</H2>
              <Lede light className="mb-8">
                We built it inside a working fleet. Drivers photograph their paperwork at the end of a
                run, and the office never retypes it.
              </Lede>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-9">
                {facts.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[15px] text-white/80">
                    <Check className="w-4 h-4 text-white/40 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-[13px] font-semibold text-white">
                Live
              </span>
            </div>

            {/* Activity log, the way the office sees it */}
            <div className="rounded-xl bg-[#171717] border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]">
              <div className="h-11 flex items-center justify-between px-5 border-b border-white/10 text-[12px]">
                <span className="text-white/90 font-semibold">Activity <span className="text-white/55 font-normal">/ today</span></span>
                <span className="text-white/55">Example data</span>
              </div>
              <ol className="relative px-5 py-5">
                                {log.map((e, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 0.15 + i * 0.28, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative grid grid-cols-[44px_16px_1fr] gap-x-3 items-start py-2"
                  >
                    <span className="text-[12px] text-white/55 tabular-nums pt-0.5">{e.t}</span>
                    <span className="relative flex justify-center pt-1.5">
                      <span className={`w-[3px] h-[14px] rounded-[1px] ${e.tone === "hold" ? "bg-[#F59E0B]" : e.tone === "ok" ? "bg-green" : "bg-white/50"}`} />
                    </span>
                    <span>
                      <span className={`block text-[14px] font-semibold ${e.tone === "hold" ? "text-[#FCD34D]" : "text-white"}`}>{e.title}</span>
                      <span className="block text-[13px] text-white/50">{e.meta}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
