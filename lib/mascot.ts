/*
 * The mascot's director. Every WinkMascot with a `role` registers here, so any part of the page can ask
 * "the navbar mascot" to blink, side-eye, lean or nod without holding a ref to it.
 *
 * Choreography budget: one gesture at a time per mascot, and automatic ones (idle blinks) wait for a
 * rest of MASCOT_REST ms after the last gesture and never interrupt a held pose. Only mascots that are
 * actually on screen respond (the navbar has a mobile and a desktop copy).
 */

export type Gesture = "wink" | "blink" | "doubleTake" | "nod" | "shake" | "lift" | "glint";

/**
 * A held expression: eyelids 0 (open) to 1 (shut), plus a small lean (percent of the mascot) and tilt.
 * Holds merge: a lean leaves the eyelids alone and a look leaves the lean alone. hold(null) lets go of all.
 */
export type Pose = { l?: number; r?: number; x?: number; y?: number; rot?: number; crease?: number };

export const POSES = {
  // one lid half down, head turned a touch away: he has opinions about retyping
  sideEye: { l: 0.1, r: 0.5, rot: -3, x: -2 },
  // both lids low, head tilted up and away: thinking
  think: { l: 0.4, r: 0.4, rot: 5, y: -3 },
  // a small pleased squint
  pleased: { l: 0.2, r: 0.2, y: -2, crease: 0.35 },
} satisfies Record<string, Pose>;

export const MASCOT_REST = 1200;

export interface MascotHandle {
  el: () => HTMLElement | null;
  /** auto: an idle gesture that waits its turn; user: the visitor caused it (counts on the wink counter) */
  play: (g: Gesture, opts?: { auto?: boolean; user?: boolean }) => boolean;
  hold: (p: Pose | null) => void;
}

const registry = new Map<string, Set<MascotHandle>>();

export function registerMascot(role: string, h: MascotHandle) {
  if (!registry.has(role)) registry.set(role, new Set());
  registry.get(role)!.add(h);
  return () => {
    registry.get(role)?.delete(h);
  };
}

function onScreen(h: MascotHandle) {
  const el = h.el();
  return !!el && el.offsetParent !== null;
}

function each(role: string, fn: (h: MascotHandle) => void) {
  registry.get(role)?.forEach((h) => onScreen(h) && fn(h));
}

export const mascot = {
  play(role: string, g: Gesture, opts?: { user?: boolean }) {
    each(role, (h) => h.play(g, opts));
  },
  hold(role: string, p: Pose | null) {
    each(role, (h) => h.hold(p));
  },
  /** Lean toward an element (a button being hovered, a field being filled in); null lets go. */
  lean(role: string, target: Element | null) {
    each(role, (h) => {
      if (!target) return h.hold({ x: 0, y: 0, rot: 0 });
      const a = h.el()!.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const sx = Math.sign(dx) || 1;
      h.hold({ x: sx * 3, y: dy < 0 ? -2 : 1, rot: sx * 3 });
    });
  },
};
