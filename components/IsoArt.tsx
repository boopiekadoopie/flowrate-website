"use client";
import { createContext, useContext, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* Visibility is measured on the HTML frame (reliable on mobile Safari), then shared with the SVG parts. */
const Shown = createContext(false);

export function IsoFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className={className}>
      <Shown.Provider value={inView || !!reduce}>{children}</Shown.Provider>
    </div>
  );
}

/* Fine-line isometric drawings for the three build steps. Geometry is projected in code. */
const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);
const P = (x: number, y: number, z = 0) => [(x - y) * C, (x + y) * S - z] as const;
const pts = (a: (readonly [number, number])[]) => a.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function Box({ x, y, z, w, d, h, accent = false }: { x: number; y: number; z: number; w: number; d: number; h: number; accent?: boolean }) {
  const top = [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)];
  const left = [P(x, y + d, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x, y + d, z)];
  const right = [P(x + w, y, z + h), P(x + w, y + d, z + h), P(x + w, y + d, z), P(x + w, y, z)];
  const stroke = "#101828";
  return (
    <g strokeWidth="1" strokeLinejoin="round" stroke={stroke}>
      <polygon points={pts(left)} fill="#EDEDED" />
      <polygon points={pts(right)} fill="#F6F6F6" />
      <polygon points={pts(top)} fill={accent ? "#EAF8E6" : "#FFFFFF"} />
    </g>
  );
}

function Dashed({ from, to, delay }: { from: readonly [number, number]; to: readonly [number, number]; delay: number }) {
  const show = useContext(Shown);
  return (
    <motion.line
      x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}
      stroke="#99A1AF" strokeWidth="1" strokeDasharray="3 3"
      initial={{ opacity: 0 }} animate={{ opacity: show ? 1 : 0 }}
      transition={{ delay, duration: 0.4 }}
    />
  );
}

function Drop({ children, delay, from = -18 }: { children: React.ReactNode; delay: number; from?: number }) {
  const reduce = useReducedMotion();
  const show = useContext(Shown);
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, y: from }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: from }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.g>
  );
}

const frame = "w-full h-full max-h-[150px] overflow-visible";

/* 1 — scattered pieces of the job, mapped and connected */
export function IsoMap() {
  const blocks = [
    { x: 0, y: 0 }, { x: 70, y: -10 }, { x: 20, y: 70 }, { x: 95, y: 60 }, { x: 150, y: 10 },
  ];
  const c = (b: { x: number; y: number }) => P(b.x + 14, b.y + 14, 14);
  return (
    <svg viewBox="-110 -45 300 190" className={frame} aria-hidden>
      {[[0, 1], [0, 2], [1, 3], [2, 3], [1, 4], [3, 4]].map(([a, b], i) => (
        <Dashed key={i} from={c(blocks[a])} to={c(blocks[b])} delay={0.6 + i * 0.1} />
      ))}
      {blocks.map((b, i) => (
        <Drop key={i} delay={i * 0.08}>
          <Box x={b.x} y={b.y} z={0} w={28} d={28} h={14} accent={i === 3} />
        </Drop>
      ))}
    </svg>
  );
}

/* 2 — the system, screen by screen, exploded into layers */
export function IsoLayers() {
  const layers = [0, 34, 68];
  return (
    <svg viewBox="-150 -110 300 230" className={frame} aria-hidden>
      {[[0, 0], [110, 0], [110, 80], [0, 80]].map(([x, y], i) => (
        <Dashed key={i} from={P(x, y, 4)} to={P(x, y, 72)} delay={0.7} />
      ))}
      {layers.map((z, i) => (
        <Drop key={z} delay={i * 0.15} from={-24}>
          <Box x={0} y={0} z={z} w={110} d={80} h={4} accent={i === 2} />
          {i === 2 && (
            <g stroke="#101828" strokeWidth="1" strokeLinecap="round">
              {[[12, 14, 60], [12, 26, 44], [12, 44, 86], [12, 56, 70]].map(([x, y, len], k) => {
                const a = P(x, y, z + 4), b = P(x + len, y, z + 4);
                return <line key={k} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} opacity={k < 2 ? 1 : 0.35} />;
              })}
            </g>
          )}
        </Drop>
      ))}
    </svg>
  );
}

/* 3 — built, stacked and running */
export function IsoBuilt() {
  const stack = [0, 16, 32];
  return (
    <svg viewBox="-150 -80 300 200" className={frame} aria-hidden>
      {stack.map((z, i) => (
        <Drop key={z} delay={i * 0.14} from={-30}>
          <Box x={0} y={0} z={z} w={110} d={80} h={16} accent={i === 2} />
        </Drop>
      ))}
      <Drop delay={0.6} from={-14}>
        <Box x={40} y={28} z={48} w={30} d={24} h={8} accent />
      </Drop>
    </svg>
  );
}
