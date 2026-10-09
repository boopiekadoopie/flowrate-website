"use client";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/* Visitors who ask their device for less motion get fades instead of movement everywhere. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
