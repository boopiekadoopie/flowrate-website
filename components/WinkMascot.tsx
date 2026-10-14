"use client";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef } from "react";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";

/*
 * The mascot, able to wink. The eyelid is drawn in SVG over the original artwork, in the image's own
 * 1002x1530 pixel space: a soft skin-toned lid and the ink lash line travel down from the open eye to a
 * closed curve and back, then a small glint flashes on the smile. Same wink as the brand sting, so it
 * stays crisp at any size and the artwork itself never changes.
 *
 * Winks on hover, focus and press; `intro` winks once per visit shortly after the page loads;
 * `winkOnMount` winks every time it appears, after that many ms (the chat avatar saying hello).
 * Stands still with reduced motion or when the visitor has paused animations.
 */

const L = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIn = (x: number) => x * x;
const easeOut = (x: number) => 1 - (1 - x) * (1 - x);

export function WinkMascot({
  className = "",
  imgClassName = "block h-full w-auto",
  sizes,
  priority = false,
  alt = "",
  intro = false,
  winkOnMount,
}: {
  className?: string;
  imgClassName?: string;
  sizes: string;
  priority?: boolean;
  alt?: string;
  intro?: boolean;
  winkOnMount?: number;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReduceAfterMount();
  const wrap = useRef<HTMLSpanElement>(null);
  const lidg = useRef<SVGGElement>(null);
  const lid = useRef<SVGPathElement>(null);
  const lash = useRef<SVGPathElement>(null);
  const flick = useRef<SVGPathElement>(null);
  const crease = useRef<SVGPathElement>(null);
  const glint = useRef<SVGGElement>(null);
  const busy = useRef(false);

  const draw = useCallback((t: number) => {
    const x1 = L(418, 424, t), y1 = L(343, 341, t), cx = 462, cy = L(306, 362, t), x2 = L(508, 500, t), y2 = L(321, 336, t);
    lidg.current?.setAttribute("opacity", t > 0.01 ? "1" : "0");
    lash.current?.setAttribute("d", `M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
    lash.current?.setAttribute("stroke-width", String(L(9, 8, t)));
    lid.current?.setAttribute("d", `M414 346 Q 462 296 512 318 L ${x2 + 2} ${y2 + 1} Q ${cx} ${cy + 2} ${x1 - 2} ${y1 + 1} Z`);
    flick.current?.setAttribute("d", `M${x2} ${y2} l ${L(6, 11, t)} ${L(-3, -7, t)}`);
    crease.current?.setAttribute("opacity", String(0.5 * t));
  }, []);

  const wink = useCallback(() => {
    if (reduce || busy.current) return;
    busy.current = true;
    // a little lift and head tilt so the wink reads even when the mascot is small
    wrap.current?.animate(
      [{ transform: "translateY(0) rotate(0deg) scale(1)" }, { transform: "translateY(-3%) rotate(4deg) scale(1.06)", offset: 0.3 }, { transform: "translateY(-3%) rotate(3deg) scale(1.06)", offset: 0.7 }, { transform: "translateY(0) rotate(0deg) scale(1)" }],
      { duration: 760, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
    glint.current?.animate(
      [{ opacity: 0, transform: "scale(0) rotate(-30deg)" }, { opacity: 1, transform: "scale(1) rotate(15deg)", offset: 0.4 }, { opacity: 0, transform: "scale(0.2) rotate(60deg)" }],
      { duration: 460, delay: 120, easing: "ease-out" }
    );
    const t0 = performance.now();
    const CLOSE = 100, HOLD = 260, OPEN = 140;
    const step = (now: number) => {
      const e = now - t0;
      const t = e < CLOSE ? easeIn(e / CLOSE) : e < CLOSE + HOLD ? 1 : e < CLOSE + HOLD + OPEN ? 1 - easeOut((e - CLOSE - HOLD) / OPEN) : 0;
      draw(t);
      if (e < CLOSE + HOLD + OPEN) requestAnimationFrame(step);
      else busy.current = false;
    };
    requestAnimationFrame(step);
  }, [draw, reduce]);

  useEffect(() => draw(0), [draw]);

  // one wink per visit, a moment after the page has settled (the flag is set only when it actually plays)
  const winkRef = useRef(wink);
  useEffect(() => {
    winkRef.current = wink;
  }, [wink]);
  useEffect(() => {
    if (!intro || reduce) return;
    const tm = setTimeout(() => {
      if (!wrap.current || wrap.current.offsetParent === null) return; // only the copy that is on screen (mobile vs desktop bar)
      try {
        if (sessionStorage.getItem("fr-wink") === "1") return;
        sessionStorage.setItem("fr-wink", "1");
      } catch {}
      winkRef.current();
    }, 1400);
    return () => clearTimeout(tm);
  }, [intro, reduce]);

  useEffect(() => {
    if (winkOnMount === undefined || reduce) return;
    const tm = setTimeout(() => winkRef.current(), winkOnMount);
    return () => clearTimeout(tm);
  }, [winkOnMount, reduce]);

  return (
    <span ref={wrap} className={`relative inline-block ${className}`} onPointerEnter={wink} onPointerDown={wink} onFocus={wink}>
      <Image src="/mascot.png" alt={alt} width={1002} height={1530} sizes={sizes} priority={priority} className={imgClassName} />
      <svg aria-hidden viewBox="0 0 1002 1530" className="pointer-events-none absolute inset-0 w-full h-full">
        <defs>
          <filter id={`f${id}`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="1.6" /></filter>
          <linearGradient id={`g${id}`} x1="0" y1="300" x2="0" y2="365" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#DC9E8F" />
            <stop offset="0.6" stopColor="#EFB296" />
            <stop offset="1" stopColor="#F4B794" />
          </linearGradient>
        </defs>
        <g ref={lidg} opacity="0">
          <path ref={lid} fill={`url(#g${id})`} filter={`url(#f${id})`} />
          <path ref={lash} fill="none" stroke="#1B1311" strokeLinecap="round" />
          <path ref={flick} fill="none" stroke="#1B1311" strokeWidth="5" strokeLinecap="round" />
          <path ref={crease} d="M443 366 Q 465 373 486 364" fill="none" stroke="#1B1311" strokeWidth="3" strokeLinecap="round" opacity="0" />
        </g>
        <g transform="translate(498 476) scale(1.8)">
          <g ref={glint} style={{ opacity: 0, transformBox: "fill-box", transformOrigin: "center" }}>
            <path d="M0 -34 C 3 -6, 6 -3, 34 0 C 6 3, 3 6, 0 34 C -3 6, -6 3, -34 0 C -6 -3, -3 -6, 0 -34 Z" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
    </span>
  );
}
