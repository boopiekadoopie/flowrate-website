"use client";
import { setMotionPaused, useMotionPaused } from "@/lib/motionPreference";

/* Pause or play the looping product animations (WCAG 2.2.2). The choice is remembered. */
const Pause = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-[13px] h-[13px]" aria-hidden>
    <rect x="5" y="4" width="3.2" height="12" rx="1" />
    <rect x="11.8" y="4" width="3.2" height="12" rx="1" />
  </svg>
);
const Play = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-[13px] h-[13px]" aria-hidden>
    <path d="M6 4.2v11.6a.8.8 0 0 0 1.2.7l9.4-5.8a.8.8 0 0 0 0-1.4L7.2 3.5A.8.8 0 0 0 6 4.2z" />
  </svg>
);

export function MotionToggle({ variant = "icon" }: { variant?: "icon" | "row" }) {
  const paused = useMotionPaused();
  const label = paused ? "Play animations" : "Pause animations";

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={() => setMotionPaused(!paused)}
        aria-pressed={paused}
        className="flex items-center gap-2 text-body text-base font-medium hover:text-heading transition-colors py-1 cursor-pointer"
      >
        {paused ? <Play /> : <Pause />}
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-pressed={paused}
      aria-label={label}
      title={label}
      className="flex items-center justify-center w-[38px] h-[36px] rounded-[9px] border border-line bg-soft text-faint hover:text-heading transition-colors cursor-pointer"
    >
      {paused ? <Play /> : <Pause />}
    </button>
  );
}
