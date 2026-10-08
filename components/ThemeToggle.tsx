"use client";
import { useSyncExternalStore } from "react";

/*
 * Light / dark switch. The theme lives on <html data-theme>, set before first paint by the inline
 * script in app/layout.tsx (saved choice, else the device setting). This only reads and flips it.
 */

type Theme = "light" | "dark";
const EVENT = "flowrate-theme";

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
};
const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
const getServerTheme = (): Theme => "light";

function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem("theme", t);
  } catch {
    /* private mode: the choice just won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

const Sun = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="w-[15px] h-[15px]" aria-hidden>
    <path d="M10 3V1.5M10 18.5V17M17 10h1.5M1.5 10H3M15 5l1-1M4 16l1-1M15 15l1 1M4 4l1 1" />
    <path d="M10 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
  </svg>
);
const Moon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className="w-[15px] h-[15px]" aria-hidden>
    <path d="M16.5 12.3A7 7 0 0 1 7.7 3.5a7 7 0 1 0 8.8 8.8z" />
  </svg>
);

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        aria-label={`Switch to ${next} mode`}
        className="p-2 text-body hover:text-heading transition-colors cursor-pointer"
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </button>
    );
  }

  return (
    <div role="group" aria-label="Colour theme" className="flex items-center rounded-[9px] border border-line bg-soft p-[3px]">
      {(["light", "dark"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          aria-pressed={theme === t}
          aria-label={`${t === "light" ? "Light" : "Dark"} mode`}
          className={`flex items-center justify-center w-8 h-7 rounded-[6px] transition-colors cursor-pointer ${
            theme === t ? "bg-paper text-heading shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-faint hover:text-heading"
          }`}
        >
          {t === "light" ? <Sun /> : <Moon />}
        </button>
      ))}
    </div>
  );
}
