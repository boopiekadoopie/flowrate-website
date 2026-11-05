"use client";
import { forwardRef, type ReactNode, type Ref } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HomeBar, StatusBar, SYS } from "./Device";

/*
 * Torvik Auto, the made-up car workshop from the "Is it ready yet?" reel: the team's job app, the customer's
 * tracking page and the WhatsApp that says the car is ready. Same names, jobs and colours as the reel, drawn
 * as real app screens. The workshop's own colours stay inside its screens.
 */

const INK = "#1E1E24";
const YELLOW = "#FFC93C";
const GREEN = "#2F8F3E";
const GREY = "#667085";
const ease = [0.22, 1, 0.36, 1] as const;

function Tick({ className = "w-2.5 h-2.5", c = "#fff", w = 3.2 }: { className?: string; c?: string; w?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function Brand({ second }: { second: string }) {
  return (
    <span className="text-[12.5px] font-bold tracking-[-0.01em] text-white">
      Torvik <span style={{ color: YELLOW }}>{second}</span>
    </span>
  );
}

/* ---------------------------------------------------------------- the team's phone */

export const TeamApp = forwardRef(function TeamApp(
  { ready, children }: { ready: boolean; children?: ReactNode },
  markRef: Ref<HTMLDivElement>,
) {
  const rows = [
    ["Tyres × 4", "Bakkie · P. Venter", "15:30"],
    ["Battery check", "Mrs Naidoo", "16:00"],
  ];
  return (
    <div className="absolute inset-0 flex flex-col text-white" style={{ background: "#111214" }}>
      <div style={{ background: "#0A0A0C" }}>
        <StatusBar time="14:57" light />
        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-0.5">
          <Brand second="Workshop" />
          <span className="text-[9px] font-semibold text-white/60 rounded-[5px] bg-white/[0.07] px-1.5 py-[3px]">Bay 2</span>
        </div>
      </div>
      <p className="px-3.5 pt-3 pb-2 text-[8.5px] font-semibold tracking-[0.09em] uppercase text-[#8A90A0]">Today · 3 jobs</p>

      <div className="mx-2.5 rounded-[12px] p-2.5 transition-[border-color,background-color] duration-300" style={{ background: "#1C1D22", border: `1px solid ${ready ? "rgba(74,190,96,0.55)" : "rgba(255,201,60,0.55)"}` }}>
        <p className="text-[12px] font-semibold leading-tight">Brakes + service</p>
        <p className="text-[9.5px] text-[#9AA0AC] mt-0.5">Silver hatchback · Thabo M.</p>
        <div
          ref={markRef}
          className="relative mt-2.5 h-[30px] rounded-[9px] flex items-center justify-center gap-1.5 text-[10.5px] font-semibold transition-colors duration-300"
          style={ready ? { background: GREEN, color: "#fff" } : { background: YELLOW, color: INK }}
        >
          <Tick c={ready ? "#fff" : INK} className="w-3 h-3" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={ready ? "r" : "m"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
              {ready ? "Ready · Thabo told" : "Mark as ready"}
            </motion.span>
          </AnimatePresence>
          {children}
        </div>
      </div>

      {rows.map(([t, s, when]) => (
        <div key={t} className="mx-2.5 mt-2 rounded-[12px] px-2.5 py-2 border border-white/[0.06] flex items-center gap-2" style={{ background: "#18191D" }}>
          <span className="min-w-0 flex-1">
            <span className="block text-[11.5px] font-semibold leading-tight">{t}</span>
            <span className="block text-[9.5px] text-[#9AA0AC] mt-0.5 truncate">{s}</span>
          </span>
          <span className="shrink-0 text-[9.5px] font-medium tabular-nums text-white/55">{when}</span>
        </div>
      ))}

      {/* tab bar */}
      <div className="mt-auto border-t border-white/[0.07] pt-2 pb-[22px] px-6 flex justify-between text-[8px] font-medium" style={{ background: "#0E0F11", fontFamily: SYS }}>
        {["Jobs", "Parts", "Team"].map((t, i) => (
          <span key={t} className={`flex flex-col items-center gap-[3px] ${i === 0 ? "text-[#FFC93C]" : "text-white/40"}`}>
            <span className={`w-[14px] h-[3px] rounded-full ${i === 0 ? "bg-[#FFC93C]" : "bg-white/25"}`} />
            {t}
          </span>
        ))}
      </div>
      <HomeBar light />
    </div>
  );
});

/* ---------------------------------------------------------------- the customer's tracking page */

type Step = { t: string; s: string };

export const TrackerPage = forwardRef(function TrackerPage(
  { ready, banner }: { ready: boolean; banner?: ReactNode },
  dotRef: Ref<HTMLSpanElement>,
) {
  const steps: Step[] = [
    { t: "Booked in", s: "Mon 08:10" },
    { t: "Being worked on", s: "Brake pads fitted" },
    { t: "Ready to collect", s: ready ? "Ready now · 14:58" : "Today, about 15:00" },
  ];
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#F6F6F3", color: INK }}>
      <div style={{ background: INK }}>
        <StatusBar time="14:58" light />
        <div className="flex items-center justify-between px-3.5 pb-2.5 pt-0.5">
          <Brand second="Auto" />
          <span className="text-[9px] font-semibold text-[#B8BCC6]">Job 418</span>
        </div>
      </div>

      <div className="px-3.5 pt-2">
        <p className="text-[9.5px] font-medium" style={{ color: GREY }}>Hi Thabo</p>
        <p className="text-[16px] font-bold tracking-[-0.02em] leading-tight mt-0.5">Your car</p>
        <span className="inline-flex mt-1 px-1.5 py-[3px] rounded-[6px] text-[9px] font-semibold" style={{ background: "#FFF3CC", color: "#6B4E00" }}>Brakes + service</span>
      </div>

      <div className="mx-2.5 mt-2 rounded-[14px] bg-white px-3 py-2.5 border border-black/[0.05] shadow-[0_1px_2px_rgba(16,24,40,0.06),0_6px_16px_-8px_rgba(16,24,40,0.12)]">
        {steps.map((st, i) => {
          const done = i === 0 || (i === 1 ? true : ready);
          const now = i === 1 && !ready;
          const live = i === 2;
          return (
            <div key={st.t} className={`relative flex gap-2.5 ${i < 2 ? "pb-2.5" : ""}`}>
              {i < 2 && (
                <span className="absolute left-[8px] top-[18px] bottom-0 w-[2px] rounded-full overflow-hidden" style={{ background: "#E4E7EC" }}>
                  <motion.span
                    initial={false}
                    animate={{ scaleY: i === 0 || ready ? 1 : 0 }}
                    transition={{ duration: 0.45, ease }}
                    className="absolute inset-0 origin-top"
                    style={{ background: GREEN }}
                  />
                </span>
              )}
              <span
                ref={live ? dotRef : undefined}
                className="relative z-[1] mt-[1px] w-[18px] h-[18px] shrink-0 rounded-full flex items-center justify-center transition-colors duration-300"
                style={done && !now ? { background: GREEN } : now ? { background: YELLOW } : { background: "#fff", boxShadow: "inset 0 0 0 1.5px #D0D5DD" }}
              >
                {now && (
                  <>
                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: INK }} />
                    <motion.span
                      aria-hidden
                      animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: YELLOW }}
                    />
                  </>
                )}
                {done && !now && (
                  <motion.span key={live ? "live" : "static"} initial={live ? { scale: 0.4 } : false} animate={{ scale: [0.4, 1.18, 1] }} transition={{ duration: 0.5, ease }}>
                    <Tick className="w-2.5 h-2.5" />
                  </motion.span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-[11px] font-semibold leading-tight transition-colors duration-300 ${live && !ready ? "text-[#98A2B3]" : ""}`}>{st.t}</p>
                <p className={`text-[9px] mt-0.5 leading-snug ${live && ready ? "font-semibold" : ""}`} style={{ color: live && ready ? GREEN : GREY }}>{st.s}</p>
                {i === 1 && (
                  <div className="relative mt-1.5 h-[40px] rounded-[8px] overflow-hidden">
                    <Image src="/images/kit/torvik-car.jpg" alt="" fill sizes="160px" className="object-cover object-[38%_55%]" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>


      {/* Safari's address bar: it's a web page, nothing to install */}
      <div className="mt-auto pt-1.5 pb-[17px] px-3 border-t border-black/[0.06] bg-[#F6F6F3]/90 backdrop-blur-md" style={{ fontFamily: SYS }}>
        <div className="h-[24px] rounded-[8px] bg-black/[0.06] flex items-center justify-center gap-1 text-[9.5px] text-[#3A3A40]">
          <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="#3A3A40" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" /></svg>
          torvikauto.co.za
        </div>
      </div>
      <HomeBar />
      {banner}
    </div>
  );
});

/* ---------------------------------------------------------------- WhatsApp */

function WaIcon() {
  return (
    <span className="w-[22px] h-[22px] shrink-0 rounded-[6px] flex items-center justify-center" style={{ background: "#25D366" }}>
      <svg viewBox="0 0 24 24" className="w-[14px] h-[14px]" fill="#fff" aria-hidden>
        <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.3 20.7l4.4-1.1A8.8 8.8 0 1 0 12 3.2zm0 1.6a7.2 7.2 0 1 1-3.7 13.4l-.3-.2-2.6.7.7-2.5-.2-.3A7.2 7.2 0 0 1 12 4.8z" />
        <path d="M9.2 7.9c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.6 4 3.5 2 .8 2.4.6 2.8.6.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.2-.2-.5-.3l-1.6-.8c-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1a6 6 0 0 1-3-2.6c-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4z" />
      </svg>
    </span>
  );
}

/* The notification itself: the phone's frosted card, in the phone's own type. */
export function WhatsAppNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[15px] px-2.5 py-2 bg-[rgba(250,250,252,0.82)] backdrop-blur-xl backdrop-saturate-150 shadow-[0_10px_24px_-6px_rgba(0,0,0,0.35),0_0_0_0.5px_rgba(0,0,0,0.06)] ${className}`}
      style={{ fontFamily: SYS }}
    >
      <div className="flex items-center gap-2">
        <WaIcon />
        <span className="text-[10.5px] font-semibold text-[#101828] flex-1">Torvik Auto</span>
        <span className="text-[9px] text-[#667085]">now</span>
      </div>
      <p className="mt-1.5 text-[10.5px] leading-[1.35] text-[#101828]">
        Hi Thabo, your car is <b className="font-semibold">ready to collect</b> ✅ We&apos;re open until 17:30.
      </p>
    </div>
  );
}

/* A banner that drops in over whatever is on the screen. */
export function DropBanner({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -36, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="absolute z-40 top-[34px] inset-x-2"
        >
          <WhatsAppNote />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------- the lock screen */

export function LockScreen({ show }: { show: boolean }) {
  return (
    <div className="absolute inset-0 text-white" style={{ background: "radial-gradient(130% 75% at 28% 18%, #45506A 0%, #1E2433 46%, #0B0E14 100%)", fontFamily: SYS }}>
      <StatusBar time="" light />
      <div className="text-center mt-3">
        <svg viewBox="0 0 24 24" className="w-3 h-3 mx-auto mb-1 opacity-80" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" /></svg>
        <p className="text-[10px] font-semibold text-white/80">Thursday 5 November</p>
        <p className="text-[50px] font-light leading-[1] tracking-[-0.03em] text-white/95 mt-0.5 tabular-nums">14:58</p>
      </div>
      <div className="absolute top-[150px] inset-x-2">
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ y: 26, opacity: 0, scale: 0.94 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
            >
              <WhatsAppNote />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute bottom-[22px] inset-x-5 flex justify-between">
        {["M9 3h6l-1 6h3l-6 12 1-8H9z", "M4 8h3.5l1.5-2.5h6L16.5 8H20v11H4zM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"].map((d) => (
          <span key={d} className="w-[30px] h-[30px] rounded-full bg-white/[0.14] backdrop-blur-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
          </span>
        ))}
      </div>
      <HomeBar light />
    </div>
  );
}
