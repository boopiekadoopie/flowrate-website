"use client";
import { useSyncExternalStore } from "react";

/*
 * The visitor's own wink counter: how many times they have made the mascot wink (hover, tap, focus or the
 * W key; his automatic winks don't count). Kept in this browser only, never sent anywhere.
 */
const KEY = "fr-winks";
const EVENT = "flowrate-winks";

function read(): number {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
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

export function useWinkCount(): number {
  return useSyncExternalStore(subscribe, read, () => 0);
}

/** Add one wink and return the new total. */
export function countWink(): number {
  const n = read() + 1;
  try {
    localStorage.setItem(KEY, String(n));
  } catch {
    /* private mode: it still counts for this page */
  }
  window.dispatchEvent(new Event(EVENT));
  return n;
}
