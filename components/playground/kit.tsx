"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { Check } from "@/components/ui";

/* Shared pieces for the /work playgrounds: phone frame, steps list, outline hint, toast, timers. */

export const EASE = [0.22, 1, 0.36, 1] as const;

export function useTimers() {
  const t = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => t.current.forEach(clearTimeout), []);
  const later = useCallback((ms: number, fn: () => void) => {
    t.current.push(setTimeout(fn, ms));
  }, []);
  const clear = useCallback(() => {
    t.current.forEach(clearTimeout);
    t.current = [];
  }, []);
  return { later, clear };
}

/* Plain outline on the next thing to tap (no pulsing rings). */
export function Hl({ on, children, className = "" }: { on: boolean; children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[12px] transition-shadow duration-300 ${on ? "shadow-[0_0_0_2.5px_#101828,0_0_0_6px_rgba(16,24,40,0.12)]" : ""} ${className}`}>
      {children}
    </div>
  );
}

export type StepDef = { key: string; label: string; hint: string };

/* Focus by dimming: the current step is lit, done steps get a tick, later ones stay grey. */
export function Steps({ steps, current, allDone, note, onWatch, onReset, auto }: { steps: StepDef[]; current: string; allDone: boolean; note?: { title: string; body: string }; onWatch: () => void; onReset: () => void; auto: boolean }) {
  const idx = steps.findIndex((s) => s.key === current);
  return (
    <div className="lg:pt-6">
      <ol className="space-y-1.5">
        {steps.map((s, i) => {
          const done = allDone || i < idx;
          const now = !allDone && s.key === current;
          return (
            <li key={s.key} className={`flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors ${now ? "bg-paper ring-1 ring-line shadow-[0_1px_2px_rgba(16,24,40,0.05)]" : ""}`}>
              <span className={`mt-0.5 w-6 h-6 shrink-0 rounded-[7px] flex items-center justify-center text-[12px] font-bold ${done ? "bg-[#1D6B2B] text-white" : now ? "bg-heading text-paper" : "bg-line text-muted"}`}>
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </span>
              <span>
                <span className={`block text-[15px] font-semibold ${now || done ? "text-heading" : "text-muted"}`}>{s.label}</span>
                {now && <span className="block text-[13px] text-body mt-0.5">{s.hint}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      {note && (
        <div className="mt-6 rounded-xl border border-dashed border-line-strong px-4 py-3.5">
          <p className="text-[14px] font-semibold text-heading">{note.title}</p>
          <p className="text-[13px] text-body mt-1 leading-relaxed">{note.body}</p>
        </div>
      )}
      <div className="mt-6 flex flex-wrap gap-2.5">
        <button type="button" onClick={onWatch} disabled={auto} className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-carbon text-white dark:bg-white dark:text-[#101828] text-[14px] font-bold disabled:opacity-50 cursor-pointer">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" aria-hidden><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
          Watch it run
        </button>
        <button type="button" onClick={onReset} className="h-11 px-5 rounded-lg border border-line-strong text-heading text-[14px] font-semibold cursor-pointer hover:bg-soft">
          Reset
        </button>
      </div>
    </div>
  );
}

/* A phone with a light app screen inside. */
export function PhoneFrame({ children, h = 692 }: { children: ReactNode; h?: number }) {
  return (
    <div
      className="relative w-[312px] rounded-[52px] p-[3px] [filter:drop-shadow(0_40px_50px_rgba(16,24,40,0.22))_drop-shadow(0_10px_16px_rgba(16,24,40,0.1))]"
      style={{ height: h, background: "linear-gradient(150deg,#4A4A4E 0%,#1C1C1F 28%,#232326 60%,#515156 100%)" }}
    >
      <div className="relative w-full h-full rounded-[49px] bg-[#070708] p-[8px]">
        <div className="relative w-full h-full rounded-[41px] bg-[#F4F4F2] overflow-hidden text-[#101828]" data-theme="light">
          <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[86px] h-[25px] rounded-full bg-black z-30" />
          <div className="relative z-20 h-[46px] flex items-center justify-between px-7 text-[13px] font-semibold">
            <span className="tabular-nums">6:42</span>
            <span className="flex items-end gap-[2px]">
              {[4, 6, 8, 10].map((x) => <span key={x} className="w-[3px] rounded-[1px] bg-[#101828]" style={{ height: x }} />)}
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* A dark notice that drops in at the top of a screen. */
export function Toast({ show, id, title, sub }: { show: boolean; id: string; title: string; sub: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={id}
          initial={{ y: -24, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          role="status"
          className="absolute top-2 inset-x-3 z-40 rounded-[16px] bg-[#101828] text-white px-3.5 py-2.5 flex items-center gap-3 shadow-[0_12px_28px_rgba(16,24,40,0.35)]"
        >
          <span className="w-8 h-8 shrink-0 rounded-[10px] bg-[#1D6B2B] flex items-center justify-center"><Check className="w-4 h-4" /></span>
          <span className="min-w-0">
            <span className="block text-[13px] font-bold leading-tight">{title}</span>
            <span className="block text-[11.5px] text-white/70 leading-tight mt-0.5">{sub}</span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
