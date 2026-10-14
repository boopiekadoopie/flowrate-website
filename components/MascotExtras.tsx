"use client";
import { useEffect } from "react";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import { mascot } from "@/lib/mascot";
import { play } from "@/lib/sound";

/*
 * Small things around the mascot that live outside any one section:
 * - press W (outside a text field) and the navbar mascot winks; Shift+W gets a double-take
 * - the tab's icon is his face, drawn live: it blinks now and then while the tab is open, and closes its
 *   eyes when the tab has been in the background for a minute
 * - after two minutes in the background the tab title says so, and goes back when the visitor returns
 * With reduced motion the icon stays still; the title change still happens (it is text, not motion).
 */

const IDLE_TITLE = "Still here. It's tidy.";

// the same overlay geometry as WinkMascot, in the artwork's 1002x1530 space
const SHUT = {
  r: { lid: "M414 346 Q 462 296 512 318 L 502 337 Q 462 364 422 342 Z", lash: "M424 341 Q 462 362 500 336" },
  l: { lid: "M297 386 Q 333 334 370 367 L 363 378 Q 333 400 304 383 Z", lash: "M306 382 Q 333 398 361 377" },
};

function drawIcon(img: HTMLImageElement, closed: boolean) {
  const S = 64, c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.beginPath();
  g.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
  g.clip();
  g.fillStyle = "#101828";
  g.fillRect(0, 0, S, S);
  // head-and-shoulders crop, the same framing as the profile picture
  const k = S / 940;
  g.setTransform(k, 0, 0, k, S / 2 - 455 * k, S / 2 - 430 * k);
  g.drawImage(img, 0, 0);
  if (closed) {
    for (const e of [SHUT.l, SHUT.r]) {
      g.fillStyle = "#EDB095";
      g.fill(new Path2D(e.lid));
      g.strokeStyle = "#1B1311";
      g.lineWidth = 16; // thicker than on the page, so it reads at tab size
      g.lineCap = "round";
      g.stroke(new Path2D(e.lash));
    }
  }
  return c.toDataURL("image/png");
}

export function MascotExtras() {
  const reduce = useReduceAfterMount();

  // press W
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "w" || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      mascot.play("nav", e.shiftKey ? "doubleTake" : "wink");
      play("pop-in", 0.4, 90);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // the tab title, after two minutes away
  useEffect(() => {
    let tm: ReturnType<typeof setTimeout> | undefined;
    let original = "";
    const vis = () => {
      if (document.hidden) {
        tm = setTimeout(() => {
          original = document.title;
          document.title = IDLE_TITLE;
        }, 120000);
      } else {
        clearTimeout(tm);
        if (original && document.title === IDLE_TITLE) document.title = original;
        original = "";
      }
    };
    document.addEventListener("visibilitychange", vis);
    return () => {
      clearTimeout(tm);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  // the live tab icon
  useEffect(() => {
    if (reduce) return;
    const img = new window.Image();
    img.src = "/mascot.png";
    let open = "", shut = "", tm: ReturnType<typeof setTimeout> | undefined, asleep: ReturnType<typeof setTimeout> | undefined;
    // our own icon link, kept last in <head> so browsers use it over the static ones
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    const set = (href: string) => {
      link.href = href;
      if (document.head.lastElementChild !== link) document.head.appendChild(link);
    };
    const blink = () => {
      set(shut);
      setTimeout(() => !document.hidden && set(open), 180);
    };
    const loop = () => {
      tm = setTimeout(() => {
        if (!document.hidden) blink();
        loop();
      }, 22000 + Math.random() * 6000);
    };
    const vis = () => {
      if (document.hidden) asleep = setTimeout(() => set(shut), 60000);
      else {
        clearTimeout(asleep);
        set(open);
        setTimeout(blink, 600);
      }
    };
    img.onload = () => {
      open = drawIcon(img, false);
      shut = drawIcon(img, true);
      set(open);
      loop();
      document.addEventListener("visibilitychange", vis);
    };
    return () => {
      clearTimeout(tm);
      clearTimeout(asleep);
      document.removeEventListener("visibilitychange", vis);
      link.remove();
    };
  }, [reduce]);

  return null;
}
