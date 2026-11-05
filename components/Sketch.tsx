"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WinkMascot } from "./WinkMascot";
import { LeadCapture } from "./LeadCapture";
import { Arrow, Check, Container, PrimaryButton } from "./ui";
import { SketchSkeleton, SketchStage } from "./SketchScreens";
import { SKETCH_KEY } from "./SketchBand";
import { useReduceAfterMount } from "@/lib/useReduceAfterMount";
import type { SketchResult } from "@/lib/sketch";

/*
 * Sketch my app: a visitor says what eats their week (or pastes a spreadsheet's top row) and sees a first
 * sketch of the small app that would take it over, drawn on real devices. The mascot thinks while it works.
 * The sketch can go straight to Andrew: the contact form below is filled in with it. Nothing is stored.
 */

const FLOW = [0.22, 1, 0.36, 1] as const;
type Mode = "problem" | "sheet";

const EXAMPLES = [
  "Customers keep phoning to ask if their car is ready, and someone has to stop and check.",
  "Job cards come back crumpled and late, and the office retypes every one.",
  "We quote on WhatsApp and lose track of who said yes.",
  "Staff hours are on paper, and Friday payroll takes all morning.",
  "We only notice stock has run out when a job needs it.",
];
const SHEET_EXAMPLE = "Date, Job no, Customer, Address, Tech, Parts used, Hours, Photos?, Signed?, Invoiced?, Paid?, Notes";

const ERRORS: Record<string, string> = {
  "too-short": "Tell us a little more: a sentence about the job is enough.",
  "not-a-problem": "That doesn't look like a job in your business. Try one of the examples, or describe what eats your week.",
  "slow-down": "That's a lot of sketches in a few minutes. Give it a moment, or tell Andrew about it below.",
  unavailable: "That didn't work just now. Try again in a minute, or tell Andrew about it below.",
};

const WAITING = ["Reading what you wrote…", "Sketching the phone screen…", "Laying out the office list…", "Adding the finishing touches…"];

export function Sketch() {
  const reduce = useReduceAfterMount();
  const [mode, setMode] = useState<Mode>("problem");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SketchResult | null>(null);
  const [asked, setAsked] = useState("");
  const [prefill, setPrefill] = useState<string | undefined>();
  const resultRef = useRef<HTMLDivElement>(null);

  // the waiting line moves on every 1.4 s while the sketch is being drawn
  useEffect(() => {
    if (!busy) return;
    const id = setInterval(() => setWait((w) => Math.min(w + 1, WAITING.length - 1)), 1400);
    return () => clearInterval(id);
  }, [busy]);

  async function run(t: string, m: Mode) {
    const clean = t.trim();
    if (busy) return;
    if (clean.length < (m === "sheet" ? 3 : 12)) {
      setError(ERRORS["too-short"]);
      document.getElementById("sketch-text")?.focus();
      return;
    }
    setBusy(true);
    setWait(0);
    setError("");
    setResult(null);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 60);
    try {
      const res = await fetch("/api/sketch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: m, text: clean }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.result) {
        setResult(data.result);
        setAsked(clean);
      } else setError(ERRORS[data.error] ?? ERRORS.unavailable);
    } catch {
      setError(ERRORS.unavailable);
    } finally {
      setBusy(false);
    }
  }

  // arriving from the homepage band: pick up what was typed there (sessionStorage, never the URL) and run it
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("run") !== "1") return;
    // read and clear inside the timer, so a cancelled first pass (React's double effect in development) leaves it be
    const t = setTimeout(() => {
      let saved = "";
      try {
        saved = sessionStorage.getItem(SKETCH_KEY) || "";
        sessionStorage.removeItem(SKETCH_KEY);
      } catch {}
      history.replaceState(null, "", "/sketch");
      if (!saved) return;
      setText(saved);
      run(saved, "problem");
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sendToAndrew() {
    if (!result) return;
    setPrefill(
      `${mode === "sheet" ? "My spreadsheet's columns" : "What eats my week"}: ${asked}\n\n` +
        `The sketch: ${result.name}. ${result.fix}\nFirst version: ${result.first.join("; ")}.`,
    );
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  const label = mode === "problem" ? "What eats your week?" : "Your spreadsheet's column names";

  return (
    <>
      <section className="pt-36 md:pt-44 pb-12 md:pb-16">
        <Container>
          <div className="max-w-[780px] mx-auto">
            <div className="flex items-end gap-5 mb-6">
              <h1 className="font-display text-heading uppercase text-[34px] sm:text-[48px] leading-[1] tracking-[-0.02em] [text-wrap:balance]">
                Tell us what eats your week. We&apos;ll sketch the app.
              </h1>
              <div className="hidden sm:block shrink-0 w-[92px] -mb-2" aria-hidden>
                <WinkMascot sizes="92px" role="confession" pose={busy ? "think" : null} className="w-full" imgClassName="block w-full h-auto" />
              </div>
            </div>
            <p className="text-body text-[17px] md:text-[18px] leading-[1.6] mb-8 max-w-[640px] [text-wrap:pretty]">
              A sentence or two is enough. In a few seconds you&apos;ll see a first <span className="kw">sketch</span> of the app
              that would take it over: what your team fills in, what the office sees, and what your customer gets.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(text, mode);
              }}
              className="rounded-xl border border-line bg-paper p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_18px_40px_-24px_rgba(16,24,40,0.25)]"
            >
              <div role="tablist" aria-label="What to sketch from" className="inline-flex p-1 mb-4 rounded-lg bg-canvas border border-line text-[13px] font-semibold">
                {(["problem", "sheet"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => {
                      setMode(m);
                      setError("");
                    }}
                    className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${mode === m ? "bg-paper text-heading shadow-[0_1px_2px_rgba(16,24,40,0.12)]" : "text-muted hover:text-heading"}`}
                  >
                    {m === "problem" ? "In a sentence" : "From a spreadsheet"}
                  </button>
                ))}
              </div>
              <label htmlFor="sketch-text" className="block text-[14px] font-medium text-heading mb-2">
                {label}
              </label>
              <textarea
                id="sketch-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                maxLength={mode === "problem" ? 500 : 600}
                placeholder={mode === "problem" ? EXAMPLES[0] : SHEET_EXAMPLE}
                className="w-full bg-paper border border-line-strong rounded-lg px-4 py-3 text-heading text-[16px] leading-[1.5] placeholder:text-faint outline-none focus:border-heading focus-visible:ring-2 focus-visible:ring-heading/15 resize-y"
              />
              {mode === "problem" ? (
                <div className="mt-3 flex flex-wrap gap-2" aria-label="Examples">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setText(ex)}
                      className="text-left text-[13px] leading-snug text-body rounded-full border border-line bg-canvas px-3 py-1.5 hover:border-line-strong hover:text-heading cursor-pointer transition-colors"
                    >
                      {ex.split(",")[0].replace(/\.$/, "")}
                    </button>
                  ))}
                </div>
              ) : (
                <button type="button" onClick={() => setText(SHEET_EXAMPLE)} className="mt-3 fr-ul text-[14px] font-semibold text-body hover:text-heading cursor-pointer">
                  Try an example
                </button>
              )}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-3.5 rounded-lg hover:bg-green-light transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                >
                  {busy ? "Sketching…" : "Sketch my app"}
                  {!busy && <Arrow className="w-4 h-4" />}
                </button>
                <p className="sm:ml-auto text-[13px] text-muted">Only what you type is sent, to draw the sketch. Nothing is stored.</p>
              </div>
              <div role="status" aria-live="polite" className="empty:hidden">
                {error && <p className="mt-4 rounded-lg border border-hold/30 bg-hold-bg text-hold dark:text-[#F3C96B] px-4 py-3 text-[14px] leading-snug">{error}</p>}
              </div>
            </form>
          </div>

          <div ref={resultRef} className="scroll-mt-28">
            <AnimatePresence mode="wait">
              {busy && (
                <motion.div key="wait" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-14">
                  <p className="text-center text-[15px] font-semibold text-heading mb-8" aria-live="polite">{WAITING[wait]}</p>
                  <SketchSkeleton />
                </motion.div>
              )}
              {!busy && result && (
                <motion.div key={result.name + asked} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: FLOW }} className="mt-14">
                  <div className="max-w-[780px] mx-auto text-center mb-10">
                    <p className="text-[14px] text-muted">A first sketch for your {result.business}</p>
                    <p className="mt-1 font-display text-heading uppercase text-[30px] sm:text-[40px] leading-[1.02] tracking-[-0.02em]">{result.name}</p>
                    {result.fix && <p className="mt-3 text-body text-[16px] md:text-[17px] leading-[1.6] [text-wrap:pretty]">{result.fix}</p>}
                  </div>

                  <SketchStage r={result} reduce={reduce} />

                  <div className="max-w-[780px] mx-auto mt-12 grid md:grid-cols-[1.2fr_1fr] gap-6 md:gap-10 items-start">
                    <div className="rounded-xl border border-line bg-paper p-5">
                      <p className="text-[13px] font-semibold text-muted mb-3">What the first version would include</p>
                      <ul className="space-y-2.5">
                        {result.first.map((f) => (
                          <li key={f} className="flex gap-2.5 text-[15px] text-heading leading-snug">
                            <span className="mt-0.5 w-5 h-5 shrink-0 rounded-md bg-heading text-paper flex items-center justify-center"><Check className="w-3 h-3" /></span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={sendToAndrew}
                        className="inline-flex items-center justify-center gap-2 bg-carbon text-white dark:bg-white dark:text-[#101828] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-3.5 rounded-lg hover:bg-black dark:hover:bg-white/90 transition-colors cursor-pointer"
                      >
                        Send this sketch to Andrew
                        <Arrow className="w-4 h-4" />
                      </button>
                      <PrimaryButton>Book a free call about it</PrimaryButton>
                      <button
                        type="button"
                        onClick={() => {
                          setResult(null);
                          setText("");
                          setTimeout(() => document.getElementById("sketch-text")?.focus(), 50);
                        }}
                        className="fr-ul w-fit mx-auto text-[14px] font-semibold text-body hover:text-heading cursor-pointer"
                      >
                        Sketch another
                      </button>
                      <p className="text-[13px] text-muted text-center leading-snug">
                        A first sketch from a sentence. The real app is shaped around how your team actually works.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </section>
      <LeadCapture key={prefill ?? "empty"} prefill={prefill} />
    </>
  );
}
