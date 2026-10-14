"use client";
import { setSoundOn, useSoundOn } from "@/lib/sound";

/* Sound is off by default; this plain switch in the footer turns the site's few soft sounds on. */
export function SoundToggle() {
  const on = useSoundOn();
  return (
    <button
      type="button"
      onClick={() => setSoundOn(!on)}
      aria-pressed={on}
      className="fr-ul inline-flex items-center gap-1.5 text-white/40 hover:text-white/80 transition-colors cursor-pointer w-fit"
    >
      <svg viewBox="0 0 20 20" className="w-[14px] h-[14px]" aria-hidden>
        <path d="M3 8h3l4-3v10l-4-3H3z" fill="currentColor" />
        {on ? (
          <path d="M13 7.5a3.5 3.5 0 0 1 0 5M15 5a7 7 0 0 1 0 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        ) : (
          <path d="M13 8l4 4M17 8l-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        )}
      </svg>
      Sound {on ? "on" : "off"}
    </button>
  );
}
