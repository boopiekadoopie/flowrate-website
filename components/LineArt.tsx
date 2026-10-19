"use client";
import { Format, Query } from "@lucasmarkes/hairline/react";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";

/*
 * Fine isometric line drawings (hairline, MIT) that answer the pointer: the brand's line of light, as an object.
 * Plates are filled with the surface they sit on so they blend in, and the lit stroke is the site's ink. They act
 * out the idea next to them on their own until a pointer arrives, and rest with reduced motion or paused animations.
 */
const FIGURES = { query: Query, format: Format };

export function LineArt({ figure, surface, label, className = "" }: { figure: keyof typeof FIGURES; surface: "paper" | "canvas"; label: string; className?: string }) {
  const reduce = useReduceAfterMount();
  const F = FIGURES[figure];
  return (
    <F
      label={label}
      intensity={0.6}
      play={!reduce}
      className={className}
      style={{ ["--hairline-plate" as string]: `var(--color-${surface})`, ["--hairline-hi" as string]: "var(--color-heading)" }}
    />
  );
}
