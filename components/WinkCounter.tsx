"use client";
import { useWinkCount } from "@/lib/winks";

/* The visitor's own wink counter, in the footer. It only appears once they have made him wink. */
export function WinkCounter() {
  const n = useWinkCount();
  if (!n) return null;
  return (
    <p className="text-white/40">
      Wink counter: <span className="tabular-nums text-white/70 font-semibold">{n}</span>
    </p>
  );
}
