"use client";
import { useEffect } from "react";

/* Sets which side a .fr-ul link's underline grows from (where the pointer entered) and shrinks to (where it left). */
export function UnderlineFrom() {
  useEffect(() => {
    const side = (e: PointerEvent, a: HTMLElement) => {
      const r = a.getBoundingClientRect();
      a.style.setProperty("--ul-from", e.clientX < r.left + r.width / 2 ? "left" : "right");
    };
    // entering or leaving a link (not moving between its children) records the side
    const edge = (e: PointerEvent) => {
      const a = (e.target as Element | null)?.closest?.(".fr-ul") as HTMLElement | null;
      if (a && !a.contains(e.relatedTarget as Node | null)) side(e, a);
    };
    document.addEventListener("pointerover", edge);
    document.addEventListener("pointerout", edge);
    return () => {
      document.removeEventListener("pointerover", edge);
      document.removeEventListener("pointerout", edge);
    };
  }, []);
  return null;
}
