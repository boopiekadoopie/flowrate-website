"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/*
 * Arriving on a page at a section link (/#how-it-works from another page), the browser jumps to the section,
 * then images and entrance animations above it finish and push it down, so Safari can leave the visitor short.
 * This re-aligns to the section a few times while the page settles, and stops the moment the visitor scrolls.
 */
export function HashSettle() {
  const pathname = usePathname();
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let stopped = false;
    const stop = () => { stopped = true; };
    const opts = { passive: true, once: true } as const;
    window.addEventListener("wheel", stop, opts);
    window.addEventListener("touchmove", stop, opts);
    window.addEventListener("keydown", stop, { once: true });
    const align = () => {
      if (stopped) return;
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (Math.abs(top - pad) > 24) window.scrollTo({ top: window.scrollY + top - pad, behavior: "instant" as ScrollBehavior });
    };
    const timers = [120, 450, 900, 1600].map((ms) => setTimeout(align, ms));
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [pathname]);
  return null;
}
