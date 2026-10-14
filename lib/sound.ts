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
