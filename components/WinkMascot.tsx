"use client";
import Image from "next/image";
import { useCallback, useEffect, useId, useRef } from "react";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import { MASCOT_REST, POSES, registerMascot, type Gesture, type Pose } from "@/lib/mascot";
import { countWink } from "@/lib/winks";

/*
 * The mascot, with a face that moves. Both eyelids are drawn in SVG over the original artwork, in the
 * image's own 1002x1530 pixel space: a soft skin-toned lid and the ink lash line travel down from the open
 * eye to a closed curve and back. So he can wink (one eye, with a lift, a tilt and a glint on the smile),
 * blink, do a double-take, nod, shake his head, and hold a look: half-lidded side-eye, thinking, pleased.
 * The artwork itself never changes; every expression is an overlay.
 *
 * Winks on hover, focus and press; `intro` winks once per visit shortly after the page loads;
 * `winkOnMount` winks every time it appears, after that many ms; `idle` blinks now and then while on
 * screen; `role` lets the rest of the page direct it (see lib/mascot.ts); `pose` holds a named look.
 * Stands still with reduced motion or when the visitor has paused animations.
 */

const L = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIn = (x: number) => x * x;
const easeOut = (x: number) => 1 - (1 - x) * (1 - x);
const FLOW = "cubic-bezier(0.22, 1, 0.36, 1)";

// [x1, y1, control x, control y, x2, y2] for the lash, open and shut; `top` is the fixed upper edge of the lid
const EYES = {
  r: { open: [418, 343, 462, 306, 508, 321], shut: [424, 341, 462, 362, 500, 336], top: "M414 346 Q 462 296 512 318", g: [300, 365], flick: 1 },
  l: { open: [303, 380, 333, 350, 364, 371], shut: [306, 382, 333, 398, 361, 377], top: "M297 386 Q 333 334 370 367", g: [338, 392], flick: -1 },
} as const;
type Eye = keyof typeof EYES;

export function WinkMascot({
  className = "",
  imgClassName = "block h-full w-auto",
  sizes,
  priority = false,
  alt = "",
  intro = false,
  winkOnMount,
  idle = false,
  role,
  pose,
}: {
  className?: string;
  imgClassName?: string;
  sizes: string;
  priority?: boolean;
  alt?: string;
  intro?: boolean;
  winkOnMount?: number;
  idle?: boolean;
  role?: string;
  pose?: keyof typeof POSES | null;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReduceAfterMount();
  const wrap = useRef<HTMLSpanElement>(null);
  const body = useRef<HTMLSpanElement>(null);
  const parts = useRef<Record<string, SVGElement | null>>({});
  const glint = useRef<SVGGElement>(null);
  const tally = useRef<HTMLSpanElement>(null);

  const busy = useRef(false);
  const lastEnd = useRef(0);
  const eyes = useRef({ l: 0, r: 0 }); // what is drawn now
  const base = useRef<Required<Pose>>({ l: 0, r: 0, x: 0, y: 0, rot: 0, crease: 0 }); // the held look gestures return to
  const crease = useRef(0);
  const eyeAnim = useRef(0);

  const draw = useCallback(() => {
    (Object.keys(EYES) as Eye[]).forEach((k) => {
      const e = EYES[k], t = eyes.current[k];
      const [x1, y1, cx, cy, x2, y2] = e.open.map((v, i) => L(v, e.shut[i], t));
      const p = parts.current;
      p[k + "g"]?.setAttribute("opacity", t > 0.01 ? "1" : "0");
      p[k + "lash"]?.setAttribute("d", `M${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
      p[k + "lash"]?.setAttribute("stroke-width", String(L(7.5, 8, t)));
      p[k + "lid"]?.setAttribute("d", `${e.top} L ${x2 + 2} ${y2 + 1} Q ${cx} ${cy + 2} ${x1 - 2} ${y1 + 1} Z`);
      const fx = e.flick > 0 ? x2 : x1, fy = e.flick > 0 ? y2 : y1;
      p[k + "flick"]?.setAttribute("d", `M${fx} ${fy} l ${e.flick * L(6, 11, t)} ${L(-3, -7, t)}`);
    });
    parts.current.crease?.setAttribute("opacity", String(crease.current));
  }, []);

  // move the eyelids to a target over `ms`, then resolve
  const eyesTo = useCallback(
    (to: { l?: number; r?: number }, ms: number, ease = easeOut) =>
      new Promise<void>((done) => {
        const from = { ...eyes.current }, run = ++eyeAnim.current, t0 = performance.now();
        const step = (now: number) => {
          if (run !== eyeAnim.current) return done();
          const k = Math.min(1, (now - t0) / ms), e = ease(k);
          eyes.current = { l: L(from.l, to.l ?? from.l, e), r: L(from.r, to.r ?? from.r, e) };
          draw();
          if (k < 1) requestAnimationFrame(step);
          else done();
        };
        requestAnimationFrame(step);
      }),
    [draw]
  );
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const flashGlint = () =>
    glint.current?.animate(
      [{ opacity: 0, transform: "scale(0) rotate(-30deg)" }, { opacity: 1, transform: "scale(1) rotate(15deg)", offset: 0.4 }, { opacity: 0, transform: "scale(0.2) rotate(60deg)" }],
      { duration: 460, delay: 120, easing: "ease-out" }
    );

  const play = useCallback(
    (g: Gesture, opts?: { auto?: boolean; user?: boolean }) => {
      if (reduce || busy.current) return false;
      if (opts?.auto && (performance.now() - lastEnd.current < MASCOT_REST || base.current.l || base.current.r)) return false;
      busy.current = true;
      const b = base.current, w = wrap.current;
      // the visitor's wink counter: only winks they caused, and the new total pops up beside him for a moment
      if (g === "wink" && opts?.user) {
        const n = countWink();
        const t = tally.current;
        if (t && (w?.offsetHeight ?? 0) >= 60) {
          t.textContent = String(n);
          t.animate(
            [{ opacity: 0, transform: "translateY(6px) scale(0.8)" }, { opacity: 1, transform: "translateY(0) scale(1)", offset: 0.15 }, { opacity: 1, transform: "translateY(0) scale(1)", offset: 0.8 }, { opacity: 0, transform: "translateY(-4px) scale(0.95)" }],
            { duration: 1500, easing: FLOW }
          );
        }
      }
      const run = async () => {
        if (g === "wink") {
          // a little lift and head tilt so the wink reads even when the mascot is small
          w?.animate(
            [{ transform: "translateY(0) rotate(0deg) scale(1)" }, { transform: "translateY(-3%) rotate(4deg) scale(1.06)", offset: 0.3 }, { transform: "translateY(-3%) rotate(3deg) scale(1.06)", offset: 0.7 }, { transform: "translateY(0) rotate(0deg) scale(1)" }],
            { duration: 760, easing: FLOW }
          );
          flashGlint();
          crease.current = 0;
          const c0 = performance.now();
          const creaseStep = (now: number) => {
            const e = now - c0;
            crease.current = e < 100 ? 0.5 * (e / 100) : e < 360 ? 0.5 : e < 500 ? 0.5 * (1 - (e - 360) / 140) : 0;
            if (e < 500) requestAnimationFrame(creaseStep);
          };
          requestAnimationFrame(creaseStep);
          await eyesTo({ r: 1 }, 100, easeIn);
          await wait(260);
          await eyesTo({ r: b.r }, 140);
        } else if (g === "blink") {
          await eyesTo({ l: 1, r: 1 }, 110, easeIn);
          await wait(40);
          await eyesTo({ l: b.l, r: b.r }, 160);
        } else if (g === "doubleTake") {
          await eyesTo({ l: 1, r: 1 }, 90, easeIn);
          await eyesTo({ l: b.l, r: b.r }, 120);
          await wait(120);
          w?.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(-4deg) translateY(-2%)", offset: 0.35 }, { transform: "rotate(0deg)" }], { duration: 440, easing: FLOW });
          await eyesTo({ l: 1, r: 1 }, 90, easeIn);
          await eyesTo({ l: b.l, r: b.r }, 160);
          await wait(160);
        } else if (g === "nod") {
          await w?.animate([{ transform: "translateY(0)" }, { transform: "translateY(3%)" }, { transform: "translateY(0)" }, { transform: "translateY(2.5%)" }, { transform: "translateY(0)" }], { duration: 420, easing: "ease-in-out" }).finished;
        } else if (g === "shake") {
          await w?.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(-3deg)" }, { transform: "rotate(3deg)" }, { transform: "rotate(-2deg)" }, { transform: "rotate(0deg)" }], { duration: 420, easing: "ease-in-out" }).finished;
        } else if (g === "lift") {
          w?.animate([{ transform: "translateY(0)" }, { transform: "translateY(-2.5%)", offset: 0.4 }, { transform: "translateY(0)" }], { duration: 320, easing: FLOW });
          await eyesTo({ l: Math.max(b.l, 0.2), r: Math.max(b.r, 0.2) }, 120);
          await wait(120);
          await eyesTo({ l: b.l, r: b.r }, 160);
        } else if (g === "glint") {
          await flashGlint()?.finished;
        }
      };
      run().finally(() => {
        busy.current = false;
        lastEnd.current = performance.now();
      });
      return true;
    },
    [reduce, eyesTo]
  );

  // hold a look: the lids ease to it and the body leans (CSS transition on its own layer, so it never
  // fights the gesture animations on the outer layer)
  const hold = useCallback(
    (p: Pose | null) => {
      if (reduce) return;
      const rest = { l: 0, r: 0, x: 0, y: 0, rot: 0, crease: 0 };
      const next = p ? { ...base.current, ...p } : rest;
      base.current = next;
      if (!busy.current) eyesTo({ l: next.l, r: next.r }, p ? 260 : 200);
      crease.current = next.crease;
      draw();
      if (body.current) body.current.style.transform = next.x || next.y || next.rot ? `translate(${next.x}%, ${next.y}%) rotate(${next.rot}deg)` : "";
    },
    [reduce, eyesTo, draw]
  );

  useEffect(() => draw(), [draw]);

  // the latest functions, for timers that outlive a render
  const live = useRef({ play, hold });
  useEffect(() => {
    live.current = { play, hold };
  }, [play, hold]);

  useEffect(() => {
    if (!role) return;
    return registerMascot(role, { el: () => wrap.current, play: (g, o) => live.current.play(g, o), hold: (p) => live.current.hold(p) });
  }, [role]);

  useEffect(() => {
    live.current.hold(pose ? POSES[pose] : null);
  }, [pose, reduce]);

  // one wink per visit, a moment after the page has settled (the flag is set only when it actually plays)
  useEffect(() => {
    if (!intro || reduce) return;
    const tm = setTimeout(() => {
      if (!wrap.current || wrap.current.offsetParent === null) return; // only the copy that is on screen (mobile vs desktop bar)
      try {
        if (sessionStorage.getItem("fr-wink") === "1") return;
        sessionStorage.setItem("fr-wink", "1");
      } catch {}
      live.current.play("wink");
    }, 1400);
    return () => clearTimeout(tm);
  }, [intro, reduce]);

  useEffect(() => {
    if (winkOnMount === undefined || reduce) return;
    const tm = setTimeout(() => live.current.play("wink"), winkOnMount);
    return () => clearTimeout(tm);
  }, [winkOnMount, reduce]);

  // idle: a blink every 5 to 9 s while on screen and the tab is in front (sometimes a double blink);
  // coming back to the tab after a while gets a double-take
  useEffect(() => {
    if (!idle || reduce) return;
    let tm: ReturnType<typeof setTimeout>;
    let seen = true;
    const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting));
    if (wrap.current) io.observe(wrap.current);
    const next = () => {
      tm = setTimeout(async () => {
        if (!document.hidden && seen && wrap.current?.offsetParent !== null && live.current.play("blink", { auto: true }) && Math.random() < 1 / 6) {
          await wait(420); // the first blink is done by now
          live.current.play("blink");
        }
        next();
      }, 5000 + Math.random() * 4000);
    };
    next();
    let hiddenAt = 0;
    const vis = () => {
      if (document.hidden) hiddenAt = performance.now();
      else if (hiddenAt && performance.now() - hiddenAt > 30000 && wrap.current?.offsetParent !== null) setTimeout(() => live.current.play("doubleTake"), 500);
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      clearTimeout(tm);
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, [idle, reduce]);

  const onWink = () => play("wink", { user: true });
  // overlay parts register themselves by their data-part name
  const setPart = useCallback((el: SVGElement | null) => {
    if (el?.dataset.part) parts.current[el.dataset.part] = el;
  }, []);

  return (
    <span ref={wrap} className={`relative inline-block ${className}`} onPointerEnter={onWink} onPointerDown={onWink} onFocus={onWink}>
      <span ref={body} className="block h-full w-full transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
        <Image src="/mascot.png" alt={alt} width={1002} height={1530} sizes={sizes} priority={priority} className={imgClassName} />
        <svg aria-hidden viewBox="0 0 1002 1530" className="pointer-events-none absolute inset-0 w-full h-full">
          <defs>
            <filter id={`f${id}`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="1.6" /></filter>
            {(Object.keys(EYES) as Eye[]).map((k) => (
              <linearGradient key={k} id={`g${k}${id}`} x1="0" y1={EYES[k].g[0]} x2="0" y2={EYES[k].g[1]} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#DC9E8F" />
                <stop offset="0.6" stopColor="#EFB296" />
                <stop offset="1" stopColor="#F4B794" />
              </linearGradient>
            ))}
          </defs>
          {(Object.keys(EYES) as Eye[]).map((k) => (
            <g key={k} ref={setPart} data-part={k + "g"} opacity="0">
              <path ref={setPart} data-part={k + "lid"} fill={`url(#g${k}${id})`} filter={`url(#f${id})`} />
              <path ref={setPart} data-part={k + "lash"} fill="none" stroke="#1B1311" strokeLinecap="round" />
              <path ref={setPart} data-part={k + "flick"} fill="none" stroke="#1B1311" strokeWidth="5" strokeLinecap="round" />
            </g>
          ))}
          <path ref={setPart} data-part="crease" d="M443 366 Q 465 373 486 364" fill="none" stroke="#1B1311" strokeWidth="3" strokeLinecap="round" opacity="0" />
          <g transform="translate(498 476) scale(1.8)">
            <g ref={glint} style={{ opacity: 0, transformBox: "fill-box", transformOrigin: "center" }}>
              <path d="M0 -34 C 3 -6, 6 -3, 34 0 C 6 3, 3 6, 0 34 C -3 6, -6 3, -34 0 C -6 -3, -3 -6, 0 -34 Z" fill="#FFFFFF" />
            </g>
          </g>
        </svg>
      </span>
      <span
        ref={tally}
        aria-hidden
        className="pointer-events-none absolute -top-1 -right-3 min-w-[22px] h-[22px] px-1.5 rounded-full bg-heading text-paper text-[11px] font-bold tabular-nums flex items-center justify-center opacity-0 shadow-[0_4px_10px_rgba(16,24,40,0.25)]"
      />
    </span>
  );
}
