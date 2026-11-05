"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { Arrow } from "./ui";
import { HdPhone, HomeBar, StatusBar, SYS } from "./kit/Device";

/*
 * The newest reels in the house style (only those: the older 3D and flat-text reels stay on Instagram), shown
 * as two small cards in About. A card opens the film with sound on a real phone, over the page. Add each new
 * house-style reel to the top of REELS, as a site cut that ends on the logo (no Instagram "Comment ..." ask):
 * website-previews/bridge-rollout-2026-11/cut-site-films.sh.
 */

const IG = "https://www.instagram.com/flowrate.agency";
const REELS = [
  { slug: "is-it-ready", title: "Is it ready yet?", line: "Customers phoning to ask, and the tracking page that answers for you.", len: "0:39" },
  { slug: "five-steps", title: "Five steps out of the group chat", line: "Getting a business out of WhatsApp, one step at a time.", len: "0:53" },
];

function Icon({ d, className = "w-4 h-4" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}
const SOUND_ON = "M4 9.5h3.5L12 6v12l-4.5-3.5H4zM16 9a4.5 4.5 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11";
const SOUND_OFF = "M4 9.5h3.5L12 6v12l-4.5-3.5H4zM16.5 9.5l5 5M21.5 9.5l-5 5";

function FilmDialog({ start, onClose }: { start: number; onClose: () => void }) {
  const [active, setActive] = useState(start);
  const [muted, setMuted] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const progress = useMotionValue(0);
  const reel = REELS[active];

  // a dialog: focus moves in, Esc closes, and the page behind doesn't scroll
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = before;
    };
  }, [onClose]);

  useEffect(() => {
    progress.set(0);
    video.current?.play().catch(() => setMuted(true));
  }, [active, progress]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Film: ${reel.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0B1220]/80 backdrop-blur-md p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div initial={{ y: 24, scale: 0.97 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} className="relative flex flex-col items-center">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close the film"
          className="absolute -top-2 -right-14 max-sm:right-0 max-sm:-top-12 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
        >
          <Icon d="M6 6l12 12M18 6L6 18" className="w-5 h-5" />
        </button>
        <div className="[zoom:1] max-[700px]:[zoom:0.86] max-[380px]:[zoom:0.78] max-h-[100dvh]">
          <HdPhone w={300} screen="#000">
            <div className="absolute inset-0 flex flex-col bg-black text-white">
              <StatusBar time="9:41" light />
              <div className="relative w-full flex-1 min-h-0 bg-black">
                <video
                  key={reel.slug}
                  ref={video}
                  src={`/reels/${reel.slug}.mp4`}
                  poster={`/reels/${reel.slug}.jpg`}
                  muted={muted}
                  playsInline
                  autoPlay
                  preload="auto"
                  aria-label={`Flowrate film: ${reel.title}`}
                  className="absolute inset-0 w-full h-full object-contain"
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration) progress.set(v.currentTime / v.duration);
                  }}
                  onEnded={() => setActive((a) => (a + 1) % REELS.length)}
                />
              </div>
              <div className="relative h-[2px] bg-white/15">
                <motion.span className="absolute inset-0 bg-white origin-left" style={{ scaleX: progress }} />
              </div>
              <div className="flex items-center gap-2.5 px-3.5 pt-2.5 pb-[22px]" style={{ fontFamily: SYS }}>
                <span className="w-6 h-6 shrink-0 rounded-full overflow-hidden relative bg-white/10">
                  <Image src="/reels/avatar.png" alt="" fill sizes="24px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold leading-tight">flowrate.agency</span>
                  <span className="block text-[10px] text-white/60 leading-tight truncate">{reel.title}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "Turn the sound on" : "Turn the sound off"}
                  aria-pressed={!muted}
                  className="w-8 h-8 shrink-0 rounded-full bg-white/[0.12] hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Icon d={muted ? SOUND_OFF : SOUND_ON} className="w-4 h-4" />
                </button>
              </div>
              <HomeBar light />
            </div>
          </HdPhone>
        </div>
        <div className="mt-5 flex items-center gap-2">
          {REELS.map((r, i) => (
            <button
              key={r.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-current={i === active ? "true" : undefined}
              className={`h-9 px-3.5 rounded-full text-[13px] font-semibold cursor-pointer transition-colors ${i === active ? "bg-white text-[#101828]" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Two small film cards: cover, title, length. A press opens the film. */
export function FilmCards() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <div>
      <p className="text-[14px] font-semibold text-heading mb-3">Short films, one problem each</p>
      <div className="grid sm:grid-cols-2 gap-3 max-w-[560px]">
        {REELS.map((r, i) => (
          <button
            key={r.slug}
            type="button"
            onClick={() => setOpen(i)}
            className="group text-left rounded-xl border border-line bg-paper p-2.5 flex items-center gap-3 hover:border-line-strong transition-colors cursor-pointer"
          >
            <span className="relative w-[52px] h-[92px] shrink-0 rounded-[8px] overflow-hidden bg-carbon shadow-[0_4px_12px_-4px_rgba(16,24,40,0.35)]">
              <Image src={`/reels/${r.slug}.jpg`} alt="" fill sizes="52px" className="object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/5 transition-colors">
                <span className="w-7 h-7 rounded-full bg-white/90 text-[#101828] flex items-center justify-center">
                  <svg viewBox="0 0 16 16" className="w-3 h-3 ml-0.5" aria-hidden><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
                </span>
              </span>
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold text-heading leading-tight">{r.title}</span>
              <span className="block text-[13px] text-muted leading-snug mt-1 [text-wrap:pretty]">{r.line}</span>
              <span className="block text-[12px] text-faint tabular-nums mt-1">{r.len}</span>
            </span>
          </button>
        ))}
      </div>
      <a href={IG} target="_blank" rel="noopener noreferrer" className="group mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-heading underline underline-offset-4 decoration-line-strong hover:decoration-heading">
        More on Instagram
        <Arrow className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
      <AnimatePresence>{open !== null && <FilmDialog key="film" start={open} onClose={close} />}</AnimatePresence>
    </div>
  );
}
