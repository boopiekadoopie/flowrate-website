"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Container, H2, Lede } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

function Cell({ index, place, children, wrong = false }: { index: number; place: string; children: ReactNode; wrong?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.15, duration: 0.5, ease }}
      className="relative flex flex-col p-5 sm:p-6 border-line border-b lg:border-b-0 lg:border-r last:border-0"
    >
      <p className="text-heading text-[15px] font-semibold mb-4">
        <span className="text-faint tabular-nums mr-2">{index + 1}</span>
        {place}
      </p>
      <div className="flex-1 flex items-center">{children}</div>
      {index < 3 && (
        <span
          aria-hidden
          className="hidden lg:flex absolute top-1/2 -right-[13px] -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-paper border border-line items-center justify-center text-faint"
        >
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
            <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
      {wrong && <span className="sr-only">This copy of the number is wrong.</span>}
    </motion.div>
  );
}

function Wrong({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <motion.span
      initial={{ backgroundColor: "rgba(254,243,199,0)", color: "#101828" }}
      whileInView={{ backgroundColor: "rgba(254,243,199,1)", color: "#92400E" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-[4px] px-1 -mx-1"
    >
      {children}
    </motion.span>
  );
}

export function Problem() {
  return (
    <section id="problem" className="bg-paper py-20 md:py-28 border-t border-line">
      <Container>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-16 lg:items-end mb-12 md:mb-16">
          <H2>Most of your admin isn&apos;t work. It&apos;s retyping.</H2>
          <Lede>
            A job comes in on WhatsApp. Someone types it into a spreadsheet. Someone
            else types it into the accounts, and it gets chased again at month-end.
            Every hop is a chance to get it wrong, and nobody notices until the money
            is short.
          </Lede>
        </div>

        <div className="rounded-lg border border-line bg-[#fafafa] grid grid-cols-1 lg:grid-cols-4">
          <Cell index={0} place="WhatsApp group">
            <div className="w-full max-w-[220px] rounded-lg bg-paper border border-line p-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <div className="rounded-[6px] bg-[#f4f4f2] p-3 flex flex-col gap-1.5">
                <span className="h-1.5 w-10 bg-heading/60 rounded-full" />
                <span className="h-1 w-full bg-heading/15 rounded-full" />
                <span className="h-1 w-4/5 bg-heading/15 rounded-full" />
                <span className="mt-1 text-[12px] font-semibold text-heading tabular-nums">Net 28,460 kg</span>
              </div>
              <p className="text-[11px] text-muted mt-1.5 px-1 flex justify-between">
                <span>Photo from driver</span>
                <span className="tabular-nums">17:42</span>
              </p>
            </div>
          </Cell>

          <Cell index={1} place="Spreadsheet">
            <div className="w-full max-w-[240px] rounded-[6px] border border-line bg-paper overflow-hidden text-[12px] tabular-nums">
              {[
                ["2415", "27,900"],
                ["2416", "29,120"],
                ["2417", "28,460"],
              ].map(([load, kg], r) => (
                <div key={load} className="grid grid-cols-[1fr_1.2fr] border-b border-line last:border-0">
                  <span className="px-2.5 py-1.5 border-r border-line text-muted">{load}</span>
                  <span className={`px-2.5 py-1.5 ${r === 2 ? "bg-canvas outline outline-[1.5px] outline-heading -outline-offset-[1.5px] text-heading font-semibold" : "text-body"}`}>
                    {kg}
                  </span>
                </div>
              ))}
            </div>
          </Cell>

          <Cell index={2} place="Accounts" wrong>
            <div className="w-full max-w-[240px] rounded-[6px] border border-line bg-paper px-3 py-2.5 text-[12px]">
              <div className="flex justify-between text-muted mb-1">
                <span>Line item</span>
                <span>Qty</span>
              </div>
              <div className="flex justify-between text-heading font-semibold tabular-nums">
                <span>Load 2417</span>
                <Wrong delay={0.9}>28,640 kg</Wrong>
              </div>
            </div>
          </Cell>

          <Cell index={3} place="Invoice" wrong>
            <div className="w-full max-w-[240px] rounded-[6px] border border-line bg-paper px-3 py-2.5 text-[12px]">
              <p className="text-heading font-semibold mb-1">Sent to customer</p>
              <p className="text-body tabular-nums">
                Billed on <Wrong delay={1.15}>28,640 kg</Wrong>
              </p>
            </div>
          </Cell>
        </div>

        <p className="mt-5 text-[15px] text-muted [text-wrap:pretty]">
          Same number, four places, typed by hand every time. It only takes one slip.
        </p>
      </Container>
    </section>
  );
}
