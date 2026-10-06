"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

/*
 * Hero product tile: one load moving through a driver-to-invoice system.
 * Driven by a single tick counter so every element derives from one clock.
 * Every second loop the weights disagree and the system holds the invoice
 * instead of guessing.
 */

const TICK_MS = 700;
const LAST_TICK = 15;
const FINAL_TICK = 11;

const DOCS = [
  { label: "Delivery note", short: "Delivery note" },
  { label: "Weighbridge ticket", short: "Weighbridge" },
  { label: "Load slip", short: "Load slip" },
];

const STEPS = ["Captured", "Read", "Checked", "Invoiced"];

const ease = [0.22, 1, 0.36, 1] as const;

function stepFor(tick: number) {
  if (tick >= 10) return 3;
  if (tick >= 9) return 2;
  if (tick >= 5) return 1;
  return 0;
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PauseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path d="M6 4v8M10 4v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DocThumb({ captured, label, short }: { captured: boolean; label: string; short: string }) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-2.5 text-center sm:text-left">
      <div
        className={`relative w-9 h-11 rounded-[4px] flex-shrink-0 overflow-hidden transition-colors duration-300 ${
          captured ? "bg-[#f4f4f2]" : "border border-dashed border-white/25"
        }`}
      >
        <AnimatePresence>
          {captured && (
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="absolute inset-0 p-1.5 flex flex-col gap-[3px]"
            >
              <span className="h-[3px] w-4 bg-[#1f1f1f]/70 rounded-full" />
              <span className="h-[2px] w-full bg-[#1f1f1f]/20 rounded-full" />
              <span className="h-[2px] w-5/6 bg-[#1f1f1f]/20 rounded-full" />
              <span className="h-[2px] w-full bg-[#1f1f1f]/20 rounded-full" />
              <span className="mt-auto h-[3px] w-3 self-end bg-[#1f1f1f]/50 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Shutter flash */}
        <AnimatePresence>
          {captured && (
            <motion.span
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 bg-white"
            />
          )}
        </AnimatePresence>
      </div>
      <div className="min-w-0 w-full">
        <p className="text-[11px] leading-tight font-semibold text-white truncate">
          <span className="sm:hidden">{short}</span>
          <span className="hidden sm:inline">{label}</span>
        </p>
        <p className={`text-[10px] leading-tight mt-0.5 ${captured ? "text-[#99E58C]" : "text-white/45"}`}>
          {captured ? "Photo saved" : <><span className="sm:hidden">Photograph</span><span className="hidden sm:inline">Tap to photograph</span></>}
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, show }: { label: string; value: string; show: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-[#e5e7eb] last:border-b-0">
      <span className="text-[11px] sm:text-xs text-[#4a5565]">{label}</span>
      <span className="relative h-4 flex items-center">
        <AnimatePresence mode="wait">
          {show ? (
            <motion.span
              key="v"
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease }}
              className="text-[11px] sm:text-xs font-semibold text-[#101828] tabular-nums whitespace-nowrap"
            >
              {value}
            </motion.span>
          ) : (
            <motion.span
              key="s"
              exit={{ opacity: 0 }}
              className="block h-2 w-16 rounded-full bg-[#f0f0f0]"
            />
          )}
        </AnimatePresence>
      </span>
    </div>
  );
}

export function SystemDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(() => setCount((c) => c + 1), TICK_MS);
    return () => clearInterval(id);
  }, [reduce, inView]);

  const loop = Math.floor(count / (LAST_TICK + 1));
  const t = reduce ? FINAL_TICK : count % (LAST_TICK + 1);
  const held = !reduce && loop % 2 === 1;
  const step = stepFor(t);
  const noteWeight = held ? "26,980 kg" : "28,460 kg";

  return (
    <div
      ref={ref}
      className="relative w-full rounded-lg bg-white border border-[#e5e7eb] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden"
      role="img"
      aria-label="Example system: a driver photographs three load documents, the system reads them, checks the weights agree, and creates a draft invoice. When the weights disagree, it holds the invoice for a person to check."
    >
      {/* Tile header */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 h-11 border-b border-[#e5e7eb]">
        <p className="text-[11px] sm:text-xs font-semibold text-[#101828] truncate">
          Example system <span className="text-[#99a1af] font-medium">/ driver to invoice</span>
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.025em] text-[#4a5565]">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-[#5fc04f] animate-ping opacity-60" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-[#5fc04f]" />
          </span>
          Running
        </span>
      </div>

      {/* Step track */}
      <div className="grid grid-cols-4 border-b border-[#e5e7eb]">
        {STEPS.map((s, i) => {
          const done = i < step || (i === step && i === 3);
          const active = i === step;
          return (
            <div key={s} className="relative px-2 sm:px-4 py-2.5 border-r border-[#e5e7eb] last:border-r-0">
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold transition-colors duration-300 ${
                    done && !(held && i === 3)
                      ? "bg-[#99E58C] text-[#0C1A0D]"
                      : held && i === 3 && active
                      ? "bg-[#fef3c7] text-[#92400e]"
                      : active
                      ? "bg-[#101828] text-white"
                      : "bg-[#f0f0f0] text-[#99a1af]"
                  }`}
                >
                  {done && !(held && i === 3) ? <CheckIcon className="w-2.5 h-2.5" /> : held && i === 3 && active ? <PauseIcon className="w-2.5 h-2.5" /> : i + 1}
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold truncate transition-colors duration-300 ${
                    active ? "" : "hidden sm:inline"
                  } ${active || done ? "text-[#101828]" : "text-[#99a1af]"}`}
                >
                  {held && i === 3 ? "Held" : s}
                </span>
              </div>
              {active && (
                <motion.span
                  layoutId="step-bar"
                  className={`absolute left-0 right-0 -bottom-px h-[2px] ${held && i === 3 ? "bg-[#d97706]" : "bg-[#101828]"}`}
                  transition={{ duration: 0.4, ease }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Body: driver phone + office record */}
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] gap-3 sm:gap-5 p-3 sm:p-5 bg-[#fafafa]">
        {/* Driver phone */}
        <div className="rounded-[18px] bg-[#1f1f1f] p-2 shadow-[0_10px_30px_-12px_rgba(16,24,40,0.45)]">
          <div className="rounded-[12px] bg-[#141414] px-3 pt-3 pb-3 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.025em] text-white/50">Driver app</p>
              <span className="w-8 h-1 rounded-full bg-white/15" />
            </div>
            <p className="text-[13px] sm:text-sm font-semibold text-white mb-3">New load</p>
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-col sm:gap-2.5">
              {DOCS.map((d, i) => (
                <DocThumb key={d.label} label={d.label} short={d.short} captured={t >= i + 1} />
              ))}
            </div>
            <div className="mt-auto pt-3 sm:pt-4">
              <div
                className={`h-8 rounded-[8px] flex items-center justify-center gap-1.5 text-[11px] font-bold transition-colors duration-300 ${
                  t >= 4 ? "bg-white/10 text-[#99E58C]" : t >= 3 ? "bg-[#99E58C] text-[#0C1A0D]" : "bg-white/10 text-white/40"
                }`}
              >
                {t >= 4 ? (
                  <>
                    <CheckIcon className="w-3 h-3" /> Sent
                  </>
                ) : (
                  "Send load"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Office record */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="rounded-lg bg-white border border-[#e5e7eb] px-3 sm:px-4 pt-3 pb-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[12px] sm:text-[13px] font-semibold text-[#101828] whitespace-nowrap">Load 2417</p>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap transition-colors duration-300 ${
                  t < 5 ? "bg-[#f0f0f0] text-[#99a1af]" : t < 9 ? "bg-[#f0f0f0] text-[#4a5565]" : held ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#eaf8e6] text-[#1d6b2b]"
                }`}
              >
                {t < 5 ? "Waiting" : t < 9 ? "Reading…" : held ? "Needs a look" : "Checked"}
              </span>
            </div>
            <Field label="Customer" value="Northline Supply" show={t >= 6} />
            <Field label="Ticket net weight" value="28,460 kg" show={t >= 7} />
            <Field label="Note net weight" value={noteWeight} show={t >= 8} />
          </div>

          {/* Weight check */}
          <div className="min-h-[34px]">
          <AnimatePresence>
            {t >= 9 && (
              <motion.div
                key={held ? "mismatch" : "match"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease }}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] sm:text-xs font-semibold ${
                  held ? "bg-[#fef3c7] text-[#92400e]" : "bg-[#eaf8e6] text-[#1d6b2b]"
                }`}
              >
                {held ? <PauseIcon className="w-3.5 h-3.5 flex-shrink-0" /> : <CheckIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                {held ? "Weights don't agree" : "Weights agree on every page"}
              </motion.div>
            )}
          </AnimatePresence>
          </div>

          {/* Outcome */}
          <div className="min-h-[86px]">
          <AnimatePresence>
            {t >= 10 && (
              <motion.div
                key={held ? "held" : "invoice"}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                className="rounded-lg bg-white border border-[#e5e7eb] px-3 sm:px-4 py-3"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.025em] text-[#4a5565] mb-1">
                  {held ? "Invoice" : "Accounts"}
                </p>
                <p className="text-[12px] sm:text-[13px] font-semibold text-[#101828] leading-snug">
                  {held ? "Held until someone checks it" : "Draft invoice created"}
                </p>
                <p className="text-[11px] text-[#6a7282] mt-0.5 leading-snug">
                  {held ? "Nothing gets billed on a guess." : "Waiting for your approval. Nobody typed anything."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
