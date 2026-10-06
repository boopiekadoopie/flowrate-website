"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Check, Container, H2, Lede } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- Product miniatures (code-native, representative UI) ---------- */

function AdminMini() {
  const rows = [
    { job: "Job 1042", who: "TM", status: "Ready to invoice", tone: "ok" },
    { job: "Job 1041", who: "SN", status: "Waiting on signature", tone: "wait" },
    { job: "Job 1040", who: "TM", status: "Invoiced", tone: "done" },
    { job: "Job 1039", who: "LK", status: "Needs a look", tone: "hold" },
  ];
  const tones: Record<string, string> = {
    ok: "bg-ok-bg text-ok",
    wait: "bg-[#f0f0f0] text-body",
    done: "bg-carbon text-white",
    hold: "bg-hold-bg text-hold",
  };
  return (
    <div className="w-full max-w-[400px] rounded-lg bg-paper border border-line shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden text-[12px]">
      <div className="flex items-center justify-between px-3.5 h-9 border-b border-line">
        <span className="font-semibold text-heading">All jobs</span>
        <span className="text-muted">This week</span>
      </div>
      {rows.map((r, i) => (
        <motion.div
          key={r.job}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.08, duration: 0.4, ease }}
          className="grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3.5 py-2 border-b border-line last:border-0"
        >
          <span className="text-heading font-medium tabular-nums">{r.job}</span>
          <span className={`px-1.5 py-0.5 rounded-[4px] text-[11px] font-semibold whitespace-nowrap ${tones[r.tone]}`}>{r.status}</span>
          <span className="w-6 h-6 rounded-full bg-canvas border border-line text-[10px] font-semibold text-body flex items-center justify-center">{r.who}</span>
        </motion.div>
      ))}
    </div>
  );
}

function FieldMini() {
  const items = [
    { label: "Photo of delivery note", done: true },
    { label: "Odometer reading", done: true },
    { label: "Customer signature", done: false },
  ];
  return (
    <div className="w-[200px] rounded-[20px] bg-carbon p-2 shadow-[0_10px_30px_-12px_rgba(16,24,40,0.45)]">
      <div className="rounded-[14px] bg-[#141414] px-3.5 pt-3.5 pb-3">
        <p className="text-[13px] font-semibold text-white mb-0.5">Drop-off</p>
        <p className="text-[11px] text-white/50 mb-3">Stop 3 of 5</p>
        <div className="flex flex-col gap-2">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.12 }}
              className="flex items-center gap-2"
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                  it.done ? "bg-green text-[#0C1A0D]" : "border border-white/30"
                }`}
              >
                {it.done && <Check className="w-2.5 h-2.5" />}
              </span>
              <span className={`text-[11px] ${it.done ? "text-white" : "text-white/55"}`}>{it.label}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-3.5 rounded-[8px] bg-white/10 text-[10px] text-white/60 px-2.5 py-1.5">
          No signal. Saved on this phone, sends when it&apos;s back.
        </div>
      </div>
    </div>
  );
}

function ReportMini() {
  const weeks = [
    { b: 70, d: 70 },
    { b: 82, d: 82 },
    { b: 64, d: 76, gap: true },
    { b: 88, d: 88 },
    { b: 74, d: 74 },
  ];
  return (
    <div className="w-full max-w-[400px] rounded-lg bg-paper border border-line shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-3.5 text-[12px]">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-heading">Delivered vs billed</span>
        <span className="flex items-center gap-3 text-[11px] text-muted">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-[2px] bg-heading" />Delivered</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-[2px] bg-line-strong" />Billed</span>
        </span>
      </div>
      <div className="flex items-end gap-4 h-[96px] border-b border-line px-1">
        {weeks.map((w, i) => (
          <div key={i} className="relative flex-1 flex items-end justify-center gap-1 h-full">
            <motion.span
              initial={{ height: 0 }}
              whileInView={{ height: `${w.d}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease }}
              className="w-3 rounded-t-[2px] bg-heading"
            />
            <motion.span
              initial={{ height: 0 }}
              whileInView={{ height: `${w.b}%` }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.07, duration: 0.6, ease }}
              className={`w-3 rounded-t-[2px] ${w.gap ? "bg-hold/70" : "bg-line-strong"}`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-faint mt-1.5 px-1 tabular-nums">
        <span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span><span>Wk 5</span>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="mt-2.5 rounded-[6px] bg-hold-bg text-hold font-semibold px-2.5 py-1.5"
      >
        Week 3: two deliveries were never invoiced
      </motion.div>
    </div>
  );
}

function WebMini() {
  return (
    <div className="relative w-full max-w-[400px]">
      <div className="rounded-lg bg-paper border border-line shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 h-7 border-b border-line bg-[#fafafa]">
          <span className="flex-1 h-3.5 rounded-[4px] bg-paper border border-line text-[9px] text-faint px-2 leading-[13px]">yourbusiness.com</span>
        </div>
        <div className="p-4">
          <span className="block h-2.5 w-3/5 rounded-full bg-heading mb-1.5" />
          <span className="block h-2.5 w-2/5 rounded-full bg-heading mb-3" />
          <span className="block h-1.5 w-4/5 rounded-full bg-line-strong mb-1" />
          <span className="block h-1.5 w-3/5 rounded-full bg-line-strong mb-3.5" />
          <span className="inline-block h-5 w-20 rounded-[4px] bg-green" />
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-10 rounded-[4px] bg-canvas border border-line" />
            ))}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.45, ease }}
        className="absolute -bottom-3 right-3 sm:-right-3 rounded-lg bg-paper border border-line shadow-[0_8px_24px_-8px_rgba(16,24,40,0.25)] px-3 py-2 text-[11px]"
      >
        <p className="font-semibold text-heading">New enquiry</p>
        <p className="text-muted">Added to your jobs list</p>
      </motion.div>
    </div>
  );
}

/* ---------- Section ---------- */

const builds: { title: string; desc: string; visual: ReactNode }[] = [
  {
    title: "Admin systems",
    desc: "One place where every job, order or booking lives, from the first call to the paid invoice. Nobody has to ask who’s handling what.",
    visual: <AdminMini />,
  },
  {
    title: "Driver & field apps",
    desc: "Your people send the job in from their phone, with photos, signatures and readings. It works without signal and sends itself later.",
    visual: <FieldMini />,
  },
  {
    title: "Reporting",
    desc: "What you delivered next to what you billed, without anyone building the report. Gaps show up this week, not at year end.",
    visual: <ReportMini />,
  },
  {
    title: "Websites",
    desc: "Sites that look as good as your work, with enquiries that land straight in your system instead of someone’s inbox.",
    visual: <WebMini />,
  },
];

export function Services() {
  return (
    <section id="services" className="bg-canvas py-20 md:py-28">
      <Container>
        <div className="max-w-[760px] mb-12 md:mb-16">
          <H2 className="mb-5">Whatever the job runs on, we can build it.</H2>
          <Lede>
            Every business has a process held together by WhatsApp, a spreadsheet and
            somebody&apos;s memory. We find it, and build the system that runs it.
          </Lede>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {builds.map((b, i) => (
            <motion.article
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 2) * 0.1, duration: 0.55, ease }}
              className="rounded-lg bg-paper border border-line overflow-hidden flex flex-col"
            >
              <div className="h-[250px] sm:h-[270px] bg-[#fafafa] border-b border-line flex items-center justify-center px-5 sm:px-8">
                {b.visual}
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-heading text-[22px] font-bold tracking-[-0.01em] mb-2">{b.title}</h3>
                <p className="text-body text-[16px] leading-[1.6] max-w-[460px]">{b.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
