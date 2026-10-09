"use client";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { useMotionPaused } from "@/lib/motionPreference";

/* Visitors who ask their device for less motion, or press "Pause animations", get fades instead of movement. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const paused = useMotionPaused();
  return <MotionConfig reducedMotion={paused ? "always" : "user"}>{children}</MotionConfig>;
}
