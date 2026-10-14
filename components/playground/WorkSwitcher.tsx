"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { EASE } from "./kit";

/*
 * Pick one project, see one project. The chosen card is solid and the rest dim (focus by dimming), and the
 * showcase below hands over sideways: the next project slides in from the side of the card you picked, so the
 * three read as one track. The choice lives in the URL hash so a project can be linked to.
 */

export type WorkItem = { id: string; name: string; who: string; line: string; device: "phone" | "desktop"; content: ReactNode };

function DeviceIcon({ kind }: { kind: "phone" | "desktop" }) {
  return kind === "phone" ? (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden><rect x="7" y="3" width="10" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M11 18h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden><rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
  );
}

export function WorkSwitcher({ items }: { items: WorkItem[] }) {
  const [sel, setSel] = useState(items[0].id);

  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1);
      if (items.some((i) => i.id === h)) setSel(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [items]);

  // which way the track moves: +1 when the new project sits to the right of the old one
  const [dir, setDir] = useState(1);
  const pick = (id: string) => {
    setDir(items.findIndex((i) => i.id === id) >= items.findIndex((i) => i.id === sel) ? 1 : -1);
    setSel(id);
    history.replaceState(null, "", `#${id}`);
  };
  const cur = items.find((i) => i.id === sel) ?? items[0];

  return (
    <div>
      <div role="tablist" aria-label="Projects" className="grid gap-3 sm:grid-cols-3">
        {items.map((it, i) => {
          const on = it.id === sel;
          return (
            <button
              key={it.id}
              role="tab"
              aria-selected={on}
              aria-controls="work-panel"
              onClick={() => pick(it.id)}
              className={`group relative text-left rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
                on
                  ? "bg-[#101828] text-white dark:bg-white dark:text-[#101828] shadow-[0_20px_40px_rgba(16,24,40,0.18)]"
                  : "bg-paper border border-line text-heading opacity-70 hover:opacity-100 hover:border-line-strong"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[13px] font-bold tabular-nums ${on ? "opacity-60" : "text-muted"}`}>0{i + 1}</span>
                <span className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${on ? "bg-white/12 dark:bg-[#101828]/8" : "bg-soft border border-line"}`}>
                  <DeviceIcon kind={it.device} />
                </span>
              </div>
              <p className={`mt-3 text-[13px] font-semibold ${on ? "opacity-70" : "text-muted"}`}>{it.who}</p>
              <p className="mt-0.5 font-display uppercase text-[20px] leading-[1.05] tracking-[-0.01em]">{it.name}</p>
              <p className={`mt-2 text-[14px] leading-snug ${on ? "opacity-80" : "text-body"}`}>{it.line}</p>
              {on && <motion.span layoutId="work-sel" className="absolute left-5 right-5 -bottom-[7px] h-[3px] rounded-full bg-[#101828] dark:bg-white" />}
            </button>
          );
        })}
      </div>

      <div id="work-panel" role="tabpanel" className="mt-8">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={cur.id}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 56 }),
              show: { opacity: 1, x: 0, transition: { duration: 0.36, ease: EASE } },
              leave: (d: number) => ({ opacity: 0, x: d * -40, transition: { duration: 0.22, ease: [0.4, 0, 0.2, 1] } }),
            }}
            initial="enter"
            animate="show"
            exit="leave"
          >
            {cur.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
