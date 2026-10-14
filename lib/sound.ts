"use client";
import { useSyncExternalStore } from "react";

/*
 * The site's sound: off unless the visitor turns it on (the switch in the footer), remembered in
 * localStorage. Five soft sounds from the brand kit, used sparingly: pop-in (something arrives), pop-out
 * (something leaves), tick (a step done), slide (a panel moves), chord (it's done). Plus Andrew's own voice:
 * "Huh, nice one." when the contact form is sent.
 */
export type Sound = "pop-in" | "pop-out" | "tick" | "slide" | "chord" | "nice-one";
const KEY = "sound";
const EVENT = "flowrate-sound";

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
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
  return useSyncExternalStore(subscribe, read, () => false);
}

export function setSoundOn(on: boolean) {
  try {
    if (on) localStorage.setItem(KEY, "on");
    else localStorage.removeItem(KEY);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event(EVENT));
  if (on) play("tick");
}

/** Play a kit sound if the visitor has sound on. `volume` is relative (0 to 1); `delay` in ms. */
export function play(name: Sound, volume = 1, delay = 0) {
  if (typeof window === "undefined" || !read()) return;
  const go = () => {
    const a = new Audio(`/sounds/${name}.mp3`);
    a.volume = Math.min(1, 0.7 * volume);
    a.play().catch(() => {});
  };
  if (delay) setTimeout(go, delay);
  else go();
}
