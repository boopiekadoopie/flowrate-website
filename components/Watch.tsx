"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue } from "framer-motion";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import { Arrow, Container, H2, Lede } from "./ui";
import { HdPhone, HomeBar, StatusBar, SYS } from "./kit/Device";

/*
 * The newest reels in the house style (only those: the older 3D and flat-text reels stay on Instagram), playing on a
 * real phone. Add each new house-style reel to the top of REELS, as a site cut that ends on the logo (no Instagram
 * "Comment ..." ask): website-previews/bridge-rollout-2026-11/cut-site-films.sh. This is where the bold social style lives on the site: inside
 * the films, never in the page around them. It plays muted while in view and moves on to the next film when
 * one ends; with motion paused it waits for a press.
 */

const IG = "https://www.instagram.com/flowrate.agency";
const REELS = [
  { slug: "is-it-ready", title: "Is it ready yet?", line: "Customers phoning to ask. A tracking page answers for you.", len: "0:39" },
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

export function Watch() {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.45 });
  const reduce = useReduceAfterMount();
  const progress = useMotionValue(0);
  const reel = REELS[active];

  // In view and motion allowed: play (muted until someone asks for sound). Out of view: pause.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (inView && (!reduce || started)) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce, started, active]);

  const pick = (i: number) => {
    progress.set(0);
    setActive(i);
    setStarted(true);
  };

  return (
    <section id="watch" className="bg-paper py-20 md:py-28 border-t border-line overflow-x-clip">
      <Container>
        {/* phones: heading, the film, then the list; wide screens: heading and list on the left, film on the right */}
        <div className="grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-x-16 gap-y-10 lg:gap-y-9">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <H2 className="mb-4">Short films, one problem each.</H2>
            <Lede className="max-w-[540px]">
              We post short films about the jobs that still eat a business owner&apos;s day, and the simple app
              that takes each one over. These are the newest.
            </Lede>
          </div>

          <div className="min-w-0 lg:col-start-1 lg:row-start-2">
            <ol className="flex flex-col gap-2 max-w-[560px]">
              {REELS.map((r, i) => {
                const on = i === active;
                return (
                  <li key={r.slug}>
                    <button
                      type="button"
                      onClick={() => pick(i)}
                      aria-current={on ? "true" : undefined}
                      className={`relative w-full text-left rounded-lg border px-3 py-2.5 flex items-center gap-3.5 overflow-hidden cursor-pointer transition-colors duration-150 ${
                        on ? "bg-paper border-heading" : "bg-canvas border-line hover:border-line-strong"
                      }`}
                    >
                      <span className="relative w-[34px] h-[60px] shrink-0 rounded-[6px] overflow-hidden bg-carbon shadow-[0_2px_6px_-2px_rgba(16,24,40,0.3)]">
                        <Image src={`/reels/${r.slug}.jpg`} alt="" fill sizes="34px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block text-[16px] font-bold leading-tight ${on ? "text-heading" : "text-body"}`}>{r.title}</span>
                        <span className="block text-[14px] text-muted leading-snug mt-0.5 [text-wrap:pretty]">{r.line}</span>
                      </span>
                      <span className="text-[13px] text-faint tabular-nums shrink-0">{r.len}</span>
                      {on && (
                        <motion.span aria-hidden className="absolute left-0 right-0 bottom-0 h-[2px] bg-heading origin-left" style={{ scaleX: progress }} />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>

            <a href={IG} target="_blank" rel="noopener noreferrer" className="group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-heading underline underline-offset-4 decoration-line-strong hover:decoration-heading">
              More on Instagram
              <Arrow className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div ref={box} className="justify-self-center self-center lg:col-start-2 lg:row-start-1 lg:row-span-2 max-lg:row-start-2">
            <HdPhone w={290} screen="#000" className="max-sm:[zoom:0.88]">
              <div className="absolute inset-0 flex flex-col bg-black text-white">
                <StatusBar time="9:41" light />
                <div className="relative w-full aspect-[9/16] bg-black">
                  <video
                    key={reel.slug}
                    ref={video}
                    src={`/reels/${reel.slug}.mp4`}
                    poster={`/reels/${reel.slug}.jpg`}
                    muted={muted}
                    playsInline
                    preload="metadata"
                    aria-label={`Flowrate film: ${reel.title}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onTimeUpdate={(e) => {
                      const v = e.currentTarget;
                      if (v.duration) progress.set(v.currentTime / v.duration);
                    }}
                    onEnded={() => pick((active + 1) % REELS.length)}
                  />
                  {!playing && (
                    <button
                      type="button"
                      onClick={() => {
                        setStarted(true);
                        setMuted(false);
                        video.current?.play().catch(() => {});
                      }}
                      aria-label={`Play ${reel.title} with sound`}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    >
                      <span className="w-14 h-14 rounded-full bg-white/90 text-[#101828] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                        <svg viewBox="0 0 16 16" className="w-5 h-5 ml-0.5" aria-hidden><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
                      </span>
                    </button>
                  )}
                </div>
                <div className="relative h-[2px] bg-white/15">
                  <motion.span className="absolute inset-0 bg-white origin-left" style={{ scaleX: progress }} />
                </div>
                <div className="flex items-center gap-2.5 px-3.5 pt-2.5" style={{ fontFamily: SYS }}>
                  <span className="w-6 h-6 shrink-0 rounded-full overflow-hidden relative bg-white/10">
                    <Image src="/reels/avatar.png" alt="" fill sizes="24px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold leading-tight">flowrate.agency</span>
                    <span className="block text-[10px] text-white/60 leading-tight truncate">{reel.title}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMuted((m) => !m);
                      setStarted(true);
                    }}
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
        </div>
      </Container>
    </section>
  );
}
