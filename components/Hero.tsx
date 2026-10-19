"use client";
import { useRef } from "react";
import { GATHER_EVENT, HeroBackdrop } from "./HeroBackdrop";
import { HeroStage, HeroStageMobile } from "./HeroStage";
import { Arrow, CALENDLY_URL } from "./ui";
import { mascot, POSES } from "@/lib/mascot";

// The navbar mascot gives these words a half-lidded side-eye while the pointer rests on them. No visual
// change on the words themselves: it is a look people find by accident.
function SideEye({ children }: { children: React.ReactNode }) {
  return (
    <span onPointerEnter={() => mascot.hold("nav", POSES.sideEye)} onPointerLeave={() => mascot.hold("nav", null)}>
      {children}
    </span>
  );
}

// Pointing at the main button: the mascot leans toward it and the paperwork around the headline is pulled
// into the product below (see HeroBackdrop).
// Leaving waits a beat, so brushing the button's edge doesn't send the paperwork back and forth.
let leaveTimer: ReturnType<typeof setTimeout> | undefined;
const gather = (on: boolean) => {
  clearTimeout(leaveTimer);
  const send = () => window.dispatchEvent(new CustomEvent(GATHER_EVENT, { detail: on }));
  if (on) send();
  else leaveTimer = setTimeout(send, 140);
};
const lean = {
  onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
    mascot.lean("nav", e.currentTarget);
    gather(true);
  },
  onPointerLeave: () => {
    mascot.lean("nav", null);
    gather(false);
  },
  onFocus: (e: React.FocusEvent<HTMLElement>) => {
    mascot.lean("nav", e.currentTarget);
    gather(true);
  },
  onBlur: () => {
    mascot.lean("nav", null);
    gather(false);
  },
};

const builds = ["Admin systems", "Field apps", "Reporting", "Websites"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  return (
    <section ref={ref} className="relative overflow-hidden bg-paper pt-44 lg:pt-36 pb-16 lg:pb-24">
      <HeroBackdrop sectionRef={ref} />
      {/* One soft wash of light behind the product. No grid, no shapes. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[42%] h-[58%] bg-[linear-gradient(100deg,rgba(153,229,140,0.22)_0%,rgba(191,219,254,0.26)_50%,rgba(254,240,199,0.22)_100%)] dark:bg-[linear-gradient(100deg,rgba(153,229,140,0.06)_0%,rgba(147,197,253,0.07)_50%,rgba(153,229,140,0.03)_100%)] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8">
        {/* Copy renders immediately (LCP); the product animates in under it. */}
        <div className="max-w-[920px] mx-auto text-center">
          <h1 className="font-display text-heading text-[36px] sm:text-[52px] lg:text-[68px] uppercase leading-[0.98] tracking-[-0.025em] mb-6 [text-wrap:balance]">
            We build the systems your business runs on.
          </h1>
          <p className="text-body text-[17px] md:text-[19px] leading-[1.55] max-w-[620px] mx-auto mb-8 [text-wrap:pretty]">
            Built around the way your team already works, so information goes in once and <SideEye>the
            retyping</SideEye>, <SideEye>the chasing</SideEye> and <SideEye>the month-end scramble</SideEye> stop.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              {...lean}
              className="group inline-flex items-center justify-center gap-2 bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[14px] px-7 py-4 rounded-lg hover:bg-green-light active:scale-[0.98] transition-[background-color,transform] duration-150 cursor-pointer shadow-[0_8px_24px_-8px_rgba(29,107,43,0.45)]"
            >
              Book a free call
              <Arrow className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 bg-carbon text-white dark:bg-white dark:text-[#101828] dark:hover:bg-white/90 font-bold uppercase tracking-[0.025em] text-[14px] px-7 py-4 rounded-lg hover:bg-black active:scale-[0.98] transition-[background-color,transform] duration-150"
            >
              See what we build
            </a>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 max-w-[320px] mx-auto sm:max-w-none sm:flex sm:flex-wrap sm:justify-center sm:gap-x-6 text-[14px] text-body" aria-label="What we build">
            {builds.map((b, i) => (
              <li key={b} className={i > 0 ? "sm:border-l sm:border-line-strong sm:pl-6" : ""}>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div data-gather-target className="fr-rise-in mt-14 lg:mt-20">
          <div className="hidden lg:block">
            <HeroStage />
          </div>
          <div className="lg:hidden max-w-[460px] mx-auto">
            <HeroStageMobile />
          </div>
        </div>

        <p className="mt-14 lg:mt-16 text-center text-[13px] text-muted">
          Built by people who had to do the job by hand first. Names and numbers in the example are made up.
        </p>
      </div>
    </section>
  );
}
