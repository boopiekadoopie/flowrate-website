"use client";
import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { useMotionPaused } from "./motionPreference";

/*
 * True when animations should stand still: the device asks for reduced motion, or the visitor
 * pressed "Pause animations". Only known in the browser, so it is applied after mount: the server
 * and the first client render must match or React throws a hydration error and rebuilds the page.
 */
const subscribeNoop = () => () => {};

export function useReduceAfterMount() {
  const prefersReduce = useReducedMotion();
  const paused = useMotionPaused();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  return (!!prefersReduce || paused) && mounted;
}
