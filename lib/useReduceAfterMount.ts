"use client";
import { useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";

/*
 * Reduced motion is only known in the browser, so it is applied after mount: the server and the
 * first client render must match or React throws a hydration error and rebuilds the page.
 */
const subscribeNoop = () => () => {};

export function useReduceAfterMount() {
  const prefersReduce = useReducedMotion();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  return !!prefersReduce && mounted;
}
