"use client";
import { useSyncExternalStore } from "react";

/*
 * The visitor's "pause animations" choice, saved in localStorage. When paused, every animated
 * mockup shows its finished frame instead of looping (the same path as the device's reduce-motion
 * setting). Components read it through useReduceAfterMount.
 */
const KEY = "motion";
const EVENT = "flowrate-motion";

function read(): boolean {
  try {
    return localStorage.getItem(KEY) === "paused";
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

export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}

export function setMotionPaused(paused: boolean) {
  try {
    if (paused) localStorage.setItem(KEY, "paused");
    else localStorage.removeItem(KEY);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event(EVENT));
}
