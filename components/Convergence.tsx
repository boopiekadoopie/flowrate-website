"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Container, H2, Lede } from "./ui";

/* Diagram geometry lives in one 1000×480 coordinate space shared by the SVG and the HTML chips. */
const VW = 1000;
const VH = 480;
const CORE = { x: 420, y: 160, w: 160, h: 160 };

const inputs: { label: string; icon: ReactNode }[] = [
  { label: "WhatsApp groups", icon: <path d="M3 13l1-3.2A6 6 0 1 1 6.6 12L3 13z" /> },
  { label: "Spreadsheets", icon: <><rect x="2.5" y="2.5" width="11" height="11" rx="1.5" /><path d="M2.5 6.5h11M2.5 10h11M6.5 2.5v11" /></> },
  { label: "Paper job cards", icon: <><path d="M4 2.5h5.5l2.5 2.5v8.5H4z" /><path d="M6 8h4M6 10.5h3" /></> },
  { label: "Email threads", icon: <><rect x="2" y="3.5" width="12" height="9" rx="1.5" /><path d="M2.5 4.5L8 8.5l5.5-4" /></> },
  { label: "Phone calls", icon: <path d="M4.5 2.5l2 .5.8 2.7-1.4 1a7 7 0 0 0 3.4 3.4l1-1.4 2.7.8.5 2a1.6 1.6 0 0 1-1.7 1.5A10.5 10.5 0 0 1 3 4.2 1.6 1.6 0 0 1 4.5 2.5z" /> },
  { label: "Someone’s memory", icon: <><path d="M3 2.5h10v8l-3 3H3z" /><path d="M10 13.5v-3h3" /></> },
];

const outputs: { label: string; meta: string }[] = [
  { label: "Jobs board", meta: "Every job, one status" },
  { label: "Draft invoices", meta: "Ready for approval" },
  { label: "Reports", meta: "Built as work happens" },
  { label: "Client updates", meta: "No more “where is it?”" },
];

const inY = (i: number) => 40 + i * 80;
const outY = (i: number) => 90 + i * 100;
const coreY = (i: number, n: number) => CORE.y + 28 + (i * (CORE.h - 56)) / (n - 1);

const inPaths = inputs.map((_, i) => {
  const y = inY(i), ty = coreY(i, inputs.length);
  return `M 236 ${y} C 330 ${y}, 330 ${ty}, ${CORE.x} ${ty}`;
});
const outPaths = outputs.map((_, i) => {
  const y = outY(i), sy = coreY(i, outputs.length);
  return `M ${CORE.x + CORE.w} ${sy} C 680 ${sy}, 680 ${y}, 764 ${y}`;
});

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden>
      {children}
    </svg>
  );
}

/* A short streak of light travelling along a wire: no dots, just a moving gradient segment. */
function Streak({ d, delay, dur }: { d: string; delay: number; dur: number }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="url(#streak)"
      strokeWidth="2.4"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray="0.16 1"
      initial={{ strokeDashoffset: 0.16 }}
      animate={{ strokeDashoffset: -1 }}
      transition={{ delay, duration: dur, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay: 2.6 }}
    />
  );
}

function Desktop() {
  const reduce = useReducedMotion();
  return (
    <div className="relative hidden md:block w-full" style={{ aspectRatio: `${VW} / ${VH}` }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden>
        {[...inPaths, ...outPaths].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke={i < inPaths.length ? "#D4D4D4" : "#101828"}
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i < inPaths.length ? 0.1 * i : 0.9 + 0.1 * (i - inPaths.length), duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
        <defs>
          <linearGradient id="streak" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VW} y2="0">
            <stop offset="0" stopColor="#1D6B2B" />
            <stop offset="1" stopColor="#1D6B2B" />
          </linearGradient>
        </defs>
        {!reduce && inPaths.map((d, i) => <Streak key={`p${i}`} d={d} delay={1.2 + i * 0.4} dur={1.6} />)}
        {!reduce && outPaths.map((d, i) => <Streak key={`o${i}`} d={d} delay={2.6 + i * 0.5} dur={1.4} />)}
      </svg>

      {inputs.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          className="absolute -translate-y-1/2 flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 h-[42px] text-[14px] text-body"
          style={{ left: 0, width: pct(236, VW), top: pct(inY(i), VH) }}
        >
          <span className="text-faint"><Icon>{it.icon}</Icon></span>
          <span className="truncate">{it.label}</span>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute rounded-xl bg-carbon text-white flex flex-col items-center justify-center text-center shadow-[0_24px_48px_-16px_rgba(16,24,40,0.45)]"
        style={{ left: pct(CORE.x, VW), top: pct(CORE.y, VH), width: pct(CORE.w, VW), height: pct(CORE.h, VH) }}
      >
        <span className="absolute inset-2 rounded-lg border border-white/10" aria-hidden />
        <span className="absolute inset-0 rounded-xl bg-[linear-gradient(160deg,rgba(255,255,255,0.12),transparent_45%)]" aria-hidden />
        <span className="font-display uppercase text-[15px] lg:text-[17px] leading-tight tracking-[-0.01em]">Your system</span>
        <span className="text-[11px] lg:text-[12px] text-white/55 mt-1">Entered once</span>
      </motion.div>

      {outputs.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: 1.2 + i * 0.1, duration: 0.45 }}
          className="absolute -translate-y-1/2 rounded-lg border border-line bg-paper shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-4 py-2.5"
          style={{ left: pct(764, VW), width: pct(VW - 764, VW), top: pct(outY(i), VH) }}
        >
          <p className="flex items-center justify-between gap-2 text-[14px] font-semibold text-heading leading-tight">
            {it.label}
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-ok flex-shrink-0" aria-hidden><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </p>
          <p className="text-[12px] text-muted leading-tight mt-0.5 truncate">{it.meta}</p>
        </motion.div>
      ))}
    </div>
  );
}

/*
 * Phone version: the same story, stacked to fit one screen. Six scattered sources sit in a
 * tray, six wires drop into the core, four wires fan out to what the business gets.
 * Geometry shares one 350×470 space between the SVG and the HTML.
 */
const MW = 350;
const MH = 446;
const M_CORE = { x: 105, y: 186, w: 140, h: 76 };
const M_TRAY_BOTTOM = 112;
const M_OUT_Y = 360;
const mInX = inputs.map((_, i) => 30 + i * 58);
const mOutX = outputs.map((_, i) => 44 + i * 87.3);
const mInPaths = mInX.map((x, i) => {
  const tx = M_CORE.x + 20 + (i * (M_CORE.w - 40)) / (inputs.length - 1);
  return `M ${x} ${M_TRAY_BOTTOM} C ${x} ${M_TRAY_BOTTOM + 44}, ${tx} ${M_CORE.y - 36}, ${tx} ${M_CORE.y}`;
});
const mOutPaths = mOutX.map((x, i) => {
  const sx = M_CORE.x + 26 + (i * (M_CORE.w - 52)) / (outputs.length - 1);
  const by = M_CORE.y + M_CORE.h;
  return `M ${sx} ${by} C ${sx} ${by + 40}, ${x} ${M_OUT_Y - 40}, ${x} ${M_OUT_Y}`;
});
const SHORT = ["WhatsApp", "Spreadsheets", "Paper", "Email", "Calls", "Memory"];
const mpct = (v: number, of: number) => `${(v / of) * 100}%`;

function Mobile() {
  const reduce = useReducedMotion();
  return (
    <div className="md:hidden relative w-full max-w-[420px] mx-auto" style={{ aspectRatio: `${MW} / ${MH}` }}>
      <svg viewBox={`0 0 ${MW} ${MH}`} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="streak-m" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={MH}>
            <stop offset="0" stopColor="#1D6B2B" />
            <stop offset="1" stopColor="#1D6B2B" />
          </linearGradient>
        </defs>
        {[...mInPaths, ...mOutPaths].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke={i < mInPaths.length ? "#D4D4D4" : "#101828"}
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i < mInPaths.length ? 0.3 + 0.08 * i : 1 + 0.1 * (i - mInPaths.length), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
        {!reduce &&
          mInPaths.map((d, i) => (
            <motion.path key={`s${i}`} d={d} fill="none" stroke="url(#streak-m)" strokeWidth="2.4" strokeLinecap="round" pathLength={1} strokeDasharray="0.22 1"
              initial={{ strokeDashoffset: 0.22 }} animate={{ strokeDashoffset: -1 }}
              transition={{ delay: 1.4 + i * 0.35, duration: 1.2, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay: 2.4 }} />
          ))}
        {!reduce &&
          mOutPaths.map((d, i) => (
            <motion.path key={`t${i}`} d={d} fill="none" stroke="url(#streak-m)" strokeWidth="2.4" strokeLinecap="round" pathLength={1} strokeDasharray="0.25 1"
              initial={{ strokeDashoffset: 0.25 }} animate={{ strokeDashoffset: -1 }}
              transition={{ delay: 2.6 + i * 0.4, duration: 1, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay: 2.6 }} />
          ))}
      </svg>

      {/* Tray of scattered sources */}
      <div className="absolute inset-x-0 top-0 rounded-lg border border-line bg-paper p-2 grid grid-cols-3 gap-1.5" style={{ height: mpct(M_TRAY_BOTTOM, MH) }}>
        {inputs.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="flex items-center justify-center rounded-[6px] bg-canvas px-1 min-w-0"
          >
            <span className="text-[12px] leading-tight text-body truncate">{SHORT[i]}</span>
          </motion.div>
        ))}
      </div>

      {/* Core */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute rounded-xl bg-carbon text-white flex flex-col items-center justify-center shadow-[0_18px_36px_-14px_rgba(16,24,40,0.45)]"
        style={{ left: mpct(M_CORE.x, MW), top: mpct(M_CORE.y, MH), width: mpct(M_CORE.w, MW), height: mpct(M_CORE.h, MH) }}
      >
        <span className="font-display uppercase text-[13px] leading-none tracking-[-0.01em]">Your system</span>
        <span className="text-[11px] text-white/55 mt-1.5">Entered once</span>
      </motion.div>

      {/* What comes out */}
      <div className="absolute inset-x-0 bottom-0 grid grid-cols-4 gap-1.5" style={{ top: mpct(M_OUT_Y, MH) }}>
        {outputs.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.3 + i * 0.08, duration: 0.4 }}
            className="rounded-lg border border-line bg-paper shadow-[0_1px_3px_rgba(0,0,0,0.08)] px-2 py-2 flex flex-col justify-between"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-ok" aria-hidden><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <p className="text-[12px] font-semibold text-heading leading-[1.15] mt-1.5">{it.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function Convergence() {
  return (
    <section id="one-system" className="bg-canvas py-20 md:py-28">
      <Container>
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-16 lg:items-end mb-12 md:mb-16">
          <H2>Six places to look. Or one.</H2>
          <Lede>
            Right now the truth about a job is scattered across WhatsApp, spreadsheets, paper and
            somebody&apos;s memory. We pull it into one system, and the invoices, reports and updates
            come out the other side.
          </Lede>
        </div>
        <div className="relative rounded-lg border border-line bg-soft px-3 py-5 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <Desktop />
          <Mobile />
        </div>
      </Container>
    </section>
  );
}
