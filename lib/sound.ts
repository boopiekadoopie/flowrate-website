"use client";
import { useSyncExternalStore } from "react";

/*
 * The site's sound: on unless the visitor turns it off (the switch in the footer), remembered in
 * localStorage. Browsers play nothing until the visitor has clicked or tapped, and nearly every sound here
 * follows a click anyway, so the page never makes a noise on its own. Five soft sounds from the brand kit, used sparingly: pop-in (something arrives), pop-out
 * (something leaves), tick (a step done), slide (a panel moves), chord (it's done), check (sent: two soft
 * rising notes). Plus Andrew's own voice: "Huh, nice one." straight after the check when the contact form is sent.
 */
export type Sound = "pop-in" | "pop-out" | "tick" | "slide" | "chord" | "check" | "nice-one";
const KEY = "sound";
const EVENT = "flowrate-sound";

function read(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}
const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

export function useSoundOn(): boolean {
  return useSyncExternalStore(subscribe, read, () => true);
}

export function setSoundOn(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event(EVENT));
  if (on) play("tick");
}

/*
 * Playback through Web Audio: each sound is fetched and decoded once, then plays instantly from memory (a fresh
 * <audio> per play had to download first, so sounds landed late). Browsers keep audio locked until the first
 * click, tap or key press; at that moment the context is unlocked and every kit sound is loaded ahead of need.
 */
const NAMES: Sound[] = ["pop-in", "pop-out", "tick", "slide", "chord", "check", "nice-one"];
let ctx: AudioContext | null = null;
const buffers = new Map<Sound, Promise<AudioBuffer | null>>();

function context(): AudioContext | null {
  if (ctx) return ctx;
  const AC = typeof window !== "undefined" ? window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext : undefined;
  if (!AC) return null;
  try { ctx = new AC(); } catch { ctx = null; }
  return ctx;
}

function load(name: Sound): Promise<AudioBuffer | null> {
  let b = buffers.get(name);
  if (!b) {
    const c = context();
    b = !c ? Promise.resolve(null) : fetch(`/sounds/${name}.mp3`)
      .then((r) => r.arrayBuffer())
      .then((data) => new Promise<AudioBuffer>((ok, bad) => c.decodeAudioData(data, ok, bad)))
      .catch(() => null);
    buffers.set(name, b);
  }
  return b;
}

if (typeof window !== "undefined") {
  const unlock = () => {
    const c = context();
    if (c && c.state === "suspended") c.resume().catch(() => {});
    if (read()) NAMES.forEach(load);
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
    window.removeEventListener("touchstart", unlock, true);
  };
  window.addEventListener("pointerdown", unlock, true);
  window.addEventListener("keydown", unlock, true);
  window.addEventListener("touchstart", unlock, true);
}

function fallback(name: Sound, volume: number) {
  const a = new Audio(`/sounds/${name}.mp3`);
  a.volume = Math.min(1, 0.7 * volume);
  a.play().catch(() => {});
}

/** Play a kit sound if the visitor has sound on. `volume` is relative (0 to 1); `delay` in ms; `rate` nudges the pitch (1 = as recorded). */
export function play(name: Sound, volume = 1, delay = 0, rate = 1) {
  if (typeof window === "undefined" || !read()) return;
  const c = context();
  if (!c) {
    if (delay) setTimeout(() => fallback(name, volume), delay);
    else fallback(name, volume);
    return;
  }
  if (c.state === "suspended") c.resume().catch(() => {});
  const startAt = c.currentTime + delay / 1000;
  load(name).then((buf) => {
    if (!buf) return fallback(name, volume);
    const src = c.createBufferSource();
    const gain = c.createGain();
    gain.gain.value = Math.min(1, 0.7 * volume);
    src.buffer = buf;
    src.playbackRate.value = rate;
    src.connect(gain).connect(c.destination);
    src.start(Math.max(c.currentTime, startAt));
  });
}
