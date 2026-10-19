"use client";
import { motion, useInView } from "framer-motion";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import { useRef, type ReactNode } from "react";
import { siGmail, siGooglesheets, siWhatsapp, siXero, type SimpleIcon } from "simple-icons";
import { Container, H2, Lede } from "./ui";


/* Diagram geometry lives in one 1000×480 coordinate space shared by the SVG and the HTML chips. */
const VW = 1000;
const VH = 480;
const CORE = { x: 395, y: 112, w: 210, h: 256 };
const C_HEAD = 60, C_ROW = 28, C_FOOT = 28; // header, one row per source, footer (all in diagram units)

/*
 * The six places the truth about a job lives today. Real tools get their real marks (brand colour
 * on a neutral tile); the human ones (paper, memory) get plain line icons on the same tile.
 */
type Input = { label: string; short: string; brand?: SimpleIcon; icon?: ReactNode };
const inputs: (Input & { field: string })[] = [
  { label: "WhatsApp groups", short: "WhatsApp", brand: siWhatsapp, field: "Booking" },
  { label: "Google Sheets", short: "Sheets", brand: siGooglesheets, field: "Customer" },
  { label: "Gmail threads", short: "Gmail", brand: siGmail, field: "Quote" },
  { label: "Xero, on its own", short: "Xero", brand: siXero, field: "Invoice" },
  { label: "Paper job cards", short: "Paper", icon: <><path d="M4 2.5h5.5l2.5 2.5v8.5H4z" /><path d="M9.5 2.5V5H12M6 8h4M6 10.5h3" /></>, field: "Job sheet" },
  { label: "Someone’s memory", short: "Memory", icon: <><path d="M8 8.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" /><path d="M2.5 14a5.5 5.5 0 0 1 11 0" /></>, field: "Notes" },
];

const outputs: { label: string; meta: string }[] = [
  { label: "Jobs board", meta: "Every job, one status" },
  { label: "Draft invoices", meta: "Ready for approval" },
  { label: "Reports", meta: "Built as work happens" },
  { label: "Client updates", meta: "No more “where is it?”" },
];

const inY = (i: number) => 40 + i * 80;
const outY = (i: number) => 90 + i * 100;
const rowY = (i: number) => CORE.y + C_HEAD + C_ROW * i + C_ROW / 2;
const outSY = (i: number, n: number) => CORE.y + 84 + (i * (CORE.h - 128)) / (n - 1);
// when each source's streak first reaches the card (matches the Streak timings below); the cycle repeats every 4.2 s
const ARRIVE = (i: number) => 2.8 + i * 0.4;
const PERIOD = 4.2;

const inPaths = inputs.map((_, i) => {
  const y = inY(i), ty = rowY(i);
  return `M 236 ${y} C 330 ${y}, 330 ${ty}, ${CORE.x} ${ty}`;
});
const outPaths = outputs.map((_, i) => {
  const y = outY(i), sy = outSY(i, outputs.length);
  return `M ${CORE.x + CORE.w} ${sy} C 680 ${sy}, 680 ${y}, 764 ${y}`;
});

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/* One neutral tile for every source, so brand marks and line icons sit at the same visual weight. */
function SourceMark({ it, size = 28 }: { it: Input; size?: number }) {
  const glyph = Math.round(size * (it.brand ? 0.6 : 0.54));
  return (
    <span
      className="inline-flex items-center justify-center shrink-0 rounded-[7px] bg-canvas border border-line"
      style={{ width: size, height: size }}
      aria-hidden
    >
      {it.brand ? (
        <svg viewBox="0 0 24 24" style={{ width: glyph, height: glyph }} fill={`#${it.brand.hex}`}>
          <path d={it.brand.path} />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" style={{ width: glyph, height: glyph }} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
          {it.icon}
        </svg>
      )}
    </span>
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


/*
 * The core: not a black box but the system itself, a small white app screen (screens stay white in both themes).
 * Each source's wire plugs into its own row, the row ticks when that wire's light arrives. "Typed once, used everywhere" is shown, not just said.
 */
const Tick = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function CoreCard({ live, reduce }: { live: boolean; reduce: boolean }) {
  const top = (u: number) => pct(u, CORE.h);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute rounded-[14px] bg-white text-[#101828] border border-[#E5E7EB] dark:border-white/10 shadow-[0_24px_48px_-18px_rgba(16,24,40,0.35)] dark:shadow-[0_24px_56px_-12px_rgba(0,0,0,0.75)] overflow-hidden"
        style={{ left: pct(CORE.x, VW), top: pct(CORE.y, VH), width: pct(CORE.w, VW), height: pct(CORE.h, VH), fontSize: "clamp(8.5px, 1.2cqw, 13px)" }}
      >
        <div className="absolute inset-x-0 top-0 flex flex-col justify-center px-[1.1em] border-b border-[#EEF0F2]" style={{ height: top(C_HEAD) }}>
          <span className="font-display uppercase text-[1.3em] leading-none tracking-[-0.01em]">Your system</span>
          <span className="text-[0.9em] text-[#6A7282] mt-[0.35em] leading-none">Job 0418 · Hill &amp; Co</span>
        </div>
        {inputs.map((it, i) => (
          <div key={it.field} className="absolute inset-x-0 flex items-center gap-[0.7em] px-[1.1em] border-b border-[#F2F3F5]" style={{ top: top(C_HEAD + C_ROW * i), height: top(C_ROW) }}>
            {live && (
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-[#101828]/[0.045]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: ARRIVE(i) + PERIOD, duration: 0.7, repeat: Infinity, repeatDelay: PERIOD - 0.7, ease: "easeOut" }}
              />
            )}
            <motion.span
              className="relative w-[1.25em] h-[1.25em] rounded-[0.35em] flex items-center justify-center shrink-0"
              initial={reduce ? false : { backgroundColor: "rgba(16,24,40,0)", boxShadow: "inset 0 0 0 1.5px rgba(16,24,40,0.2)", color: "rgba(255,255,255,0)" }}
              whileInView={{ backgroundColor: "rgba(16,24,40,1)", boxShadow: "inset 0 0 0 0px rgba(16,24,40,0)", color: "rgba(255,255,255,1)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: reduce ? 0 : ARRIVE(i), duration: 0.25 }}
              style={reduce ? { backgroundColor: "#101828", color: "#fff" } : undefined}
            >
              <Tick className="w-[0.85em] h-[0.85em]" />
            </motion.span>
            <span className="relative text-[1em] font-semibold leading-none">{it.field}</span>
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 flex items-center px-[1.1em] text-[0.88em] text-[#4A5565] font-medium" style={{ height: top(C_FOOT) }}>
          Entered once. Used everywhere.
        </div>
      </motion.div>
    </>
  );
}

function Desktop() {
  const reduce = useReduceAfterMount();
  // The looping streaks only run while the diagram is on screen, so they don't keep the phone busy.
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { margin: "120px" }) && !reduce;
  return (
    <div ref={ref} className="relative hidden md:block w-full" style={{ aspectRatio: `${VW} / ${VH}`, containerType: "inline-size" }}>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 w-full h-full overflow-visible" aria-hidden>
        {[...inPaths, ...outPaths].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            className={i < inPaths.length ? "text-line-strong" : "text-heading"}
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
        {live && inPaths.map((d, i) => <Streak key={`p${i}`} d={d} delay={1.2 + i * 0.4} dur={1.6} />)}
        {live && outPaths.map((d, i) => <Streak key={`o${i}`} d={d} delay={2.6 + i * 0.5} dur={1.4} />)}
      </svg>

      {inputs.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ delay: i * 0.08, duration: 0.45 }}
          className="absolute -translate-y-1/2 flex items-center gap-2.5 rounded-lg border border-line bg-paper pl-[7px] pr-3 h-[44px] text-[14px] text-body shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
          style={{ left: 0, width: pct(236, VW), top: pct(inY(i), VH) }}
        >
          <SourceMark it={it} />
          <span className="truncate">{it.label}</span>
        </motion.div>
      ))}

      <CoreCard live={live} reduce={reduce} />

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
const M_CORE = { x: 65, y: 180, w: 220, h: 98 };
const M_TRAY_BOTTOM = 112;
const M_OUT_Y = 360;
function mTickXEarly(i: number) { return M_CORE.x + 26 + (i * (M_CORE.w - 52)) / (inputs.length - 1); }
const mInX = inputs.map((_, i) => 30 + i * 58);
const mOutX = outputs.map((_, i) => 44 + i * 87.3);
const mInPaths = mInX.map((x, i) => {
  const tx = mTickXEarly(i);
  return `M ${x} ${M_TRAY_BOTTOM} C ${x} ${M_TRAY_BOTTOM + 44}, ${tx} ${M_CORE.y - 36}, ${tx} ${M_CORE.y}`;
});
const mOutPaths = mOutX.map((x, i) => {
  const sx = M_CORE.x + 26 + (i * (M_CORE.w - 52)) / (outputs.length - 1);
  const by = M_CORE.y + M_CORE.h;
  return `M ${sx} ${by} C ${sx} ${by + 40}, ${x} ${M_OUT_Y - 40}, ${x} ${M_OUT_Y}`;
});
const mpct = (v: number, of: number) => `${(v / of) * 100}%`;
const mTickX = mTickXEarly;

function Mobile() {
  const reduce = useReduceAfterMount();
  const ref = useRef<HTMLDivElement>(null);
  const live = useInView(ref, { margin: "120px" }) && !reduce;
  return (
    <div ref={ref} className="md:hidden relative w-full max-w-[420px] mx-auto" style={{ aspectRatio: `${MW} / ${MH}` }}>
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
            stroke="currentColor"
            className={i < mInPaths.length ? "text-line-strong" : "text-heading"}
            strokeWidth="1.2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i < mInPaths.length ? 0.3 + 0.08 * i : 1 + 0.1 * (i - mInPaths.length), duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
        {live &&
          mInPaths.map((d, i) => (
            <motion.path key={`s${i}`} d={d} fill="none" stroke="url(#streak-m)" strokeWidth="2.4" strokeLinecap="round" pathLength={1} strokeDasharray="0.22 1"
              initial={{ strokeDashoffset: 0.22 }} animate={{ strokeDashoffset: -1 }}
              transition={{ delay: 1.4 + i * 0.35, duration: 1.2, ease: [0.4, 0, 0.2, 1], repeat: Infinity, repeatDelay: 2.4 }} />
          ))}
        {live &&
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
            className="flex items-center justify-center gap-1 rounded-[6px] bg-canvas px-0.5 min-w-0"
          >
            <SourceMark it={it} size={20} />
            <span className="text-[11px] leading-tight text-body truncate">{it.short}</span>
          </motion.div>
        ))}
      </div>

      {/* Core: the same white system card, compact; each wire lands on its own tick */}
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute rounded-[12px] bg-white text-[#101828] border border-[#E5E7EB] dark:border-white/10 shadow-[0_18px_36px_-14px_rgba(16,24,40,0.35)] dark:shadow-[0_18px_40px_-10px_rgba(0,0,0,0.75)]"
        style={{ left: mpct(M_CORE.x, MW), top: mpct(M_CORE.y, MH), width: mpct(M_CORE.w, MW), height: mpct(M_CORE.h, MH) }}
      >
        {inputs.map((it, i) => (
          <motion.span
            key={it.field}
            title={it.field}
            className="absolute -translate-x-1/2 w-[15px] h-[15px] rounded-[4px] flex items-center justify-center"
            style={{ left: mpct(mTickX(i) - M_CORE.x, M_CORE.w), top: 10, ...(reduce ? { backgroundColor: "#101828", color: "#fff" } : {}) }}
            initial={reduce ? false : { backgroundColor: "rgba(16,24,40,0)", boxShadow: "inset 0 0 0 1.5px rgba(16,24,40,0.2)", color: "rgba(255,255,255,0)" }}
            whileInView={{ backgroundColor: "rgba(16,24,40,1)", boxShadow: "inset 0 0 0 0px rgba(16,24,40,0)", color: "rgba(255,255,255,1)" }}
            viewport={{ once: true }}
            transition={{ delay: reduce ? 0 : 2.6 + i * 0.35, duration: 0.25 }}
          >
            <Tick className="w-[10px] h-[10px]" />
          </motion.span>
        ))}
        <div className="absolute inset-x-0 bottom-0 top-[34px] flex flex-col items-center justify-center text-center border-t border-[#EEF0F2]">
          <span className="font-display uppercase text-[13px] leading-none tracking-[-0.01em]">Your system</span>
          <span className="text-[11px] text-[#6A7282] mt-1.5 leading-none">Entered once. Used everywhere.</span>
        </div>
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
            Right now the truth about a job is scattered across WhatsApp, Google Sheets, Gmail, Xero,
            paper and somebody&apos;s memory. We pull it into one system, and the invoices, reports and
            updates come out the other side.
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
