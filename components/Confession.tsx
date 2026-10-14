"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { WinkMascot } from "./WinkMascot";
import { LeadCapture } from "./LeadCapture";
import { Arrow, Container } from "./ui";
import { mascot } from "@/lib/mascot";
import type { ConfessionResult } from "@/app/api/confession/route";
import { SHEET_KEY } from "./SheetBand";

/*
 * Spreadsheet confession: paste the top row of the spreadsheet you hate, see the app it would become.
 * The mascot thinks while it works and winks when it's done. The answer can go straight to Andrew: the
 * contact form below is filled in with it.
 */

const FLOW = [0.22, 1, 0.36, 1] as const;
const EXAMPLE = "Date, Job no, Customer, Address, Tech, Parts used, Hours, Photos?, Signed?, Invoiced?, Paid?, Notes";

const ERRORS: Record<string, string> = {
  "not-headers": "That doesn't look like a header row. Paste just the top row: the column names.",
  "slow-down": "That's a lot of tries in a few minutes. Give it a moment, or tell Andrew about it below.",
  unavailable: "That didn't work just now. Try again in a minute, or tell Andrew about it below.",
};

const COLS: { key: "phone" | "office" | "dashboard"; title: string }[] = [
  { key: "phone", title: "On the phone" },
  { key: "office", title: "In the office" },
  { key: "dashboard", title: "On the dashboard" },
];

export function Confession() {
  const [headers, setHeaders] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ConfessionResult | null>(null);
  const [prefill, setPrefill] = useState<string | undefined>();

  async function go(e: React.FormEvent) {
    e.preventDefault();
    run(headers);
  }

  async function run(headers: string) {
    if (busy || headers.trim().length < 3) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/confession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.result) {
        setResult(data.result);
        setTimeout(() => mascot.play("confession", "wink"), 500);
      } else setError(ERRORS[data.error] ?? ERRORS.unavailable);
    } catch {
      setError(ERRORS.unavailable);
    } finally {
      setBusy(false);
    }
  }

  // arriving from the homepage band: pick up what was pasted there (sessionStorage, never the URL) and run it
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("run") !== "1") return;
    // read and clear inside the timer, so a cancelled first pass (React's double effect in development) leaves it be
    const t = setTimeout(() => {
      let h = "";
      try {
        h = sessionStorage.getItem(SHEET_KEY) || "";
        sessionStorage.removeItem(SHEET_KEY);
      } catch {}
      history.replaceState(null, "", "/spreadsheet");
      if (!h) return;
      setHeaders(h);
      run(h);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function sendToAndrew() {
    if (!result) return;
    setPrefill(`My spreadsheet's columns: ${headers.trim()}\n\nThe app it would become: ${result.name}. ${result.fix}`);
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  return (
    <>
      <section className="pt-36 md:pt-44 pb-16 md:pb-24">
        <Container>
          <div className="max-w-[760px] mx-auto">
            <div className="flex items-end gap-5 mb-6">
              <h1 className="font-display text-heading uppercase text-[34px] sm:text-[48px] leading-[1] tracking-[-0.02em] [text-wrap:balance]">
                Paste the top row of the spreadsheet you hate.
              </h1>
              <div className="hidden sm:block shrink-0 w-[92px] -mb-2" aria-hidden>
                <WinkMascot sizes="92px" role="confession" pose={busy ? "think" : null} className="w-full" imgClassName="block w-full h-auto" />
              </div>
            </div>
            <p className="text-body text-[17px] md:text-[18px] leading-[1.6] mb-8 max-w-[600px]">
              Just the column names. We&apos;ll show you the simple app it would become: what goes in on the phone,
              what the office sees, and what adds itself up.
            </p>

            <form onSubmit={go} className="rounded-lg border border-line bg-paper p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <label htmlFor="headers" className="block text-[14px] font-medium text-heading mb-2">
                Your column names
              </label>
              <textarea
                id="headers"
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                rows={3}
                maxLength={600}
                placeholder={EXAMPLE}
                className="w-full bg-paper border border-line-strong rounded-lg px-4 py-3 text-heading text-[16px] leading-[1.5] placeholder:text-faint outline-none focus:border-heading focus-visible:ring-2 focus-visible:ring-heading/25 resize-y"
              />
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={busy || headers.trim().length < 3}
                  className="inline-flex items-center justify-center gap-2 bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-3.5 rounded-lg hover:bg-green-light transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default"
                >
                  {busy ? "Thinking…" : "Show me the app"}
                  {!busy && <Arrow className="w-4 h-4" />}
                </button>
                <button type="button" onClick={() => setHeaders(EXAMPLE)} className="fr-ul text-[14px] font-semibold text-body hover:text-heading w-fit cursor-pointer">
                  Try an example
                </button>
                <p className="sm:ml-auto text-[13px] text-muted">Only the column names are sent. Nothing is stored.</p>
              </div>
              <div role="status" aria-live="polite" className="empty:hidden">
                {error && <p className="mt-4 rounded-lg border border-hold/30 bg-hold-bg text-hold dark:text-[#F3C96B] px-4 py-3 text-[14px] leading-snug">{error}</p>}
              </div>
            </form>

            <AnimatePresence>
              {result && (
                <motion.div key={result.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: FLOW }} className="mt-12">
                  <div className="relative pb-4 mb-6">
                    <p className="font-display text-heading uppercase text-[26px] sm:text-[32px] leading-[1.05] tracking-[-0.02em]">{result.name}</p>
                    {result.fix && <p className="mt-2 text-body text-[16px] leading-[1.6] max-w-[620px]">{result.fix}</p>}
                    <motion.span
                      aria-hidden
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, ease: FLOW, delay: 0.15 }}
                      className="absolute left-0 right-0 bottom-0 h-px origin-left bg-[linear-gradient(90deg,rgba(16,24,40,0.4),rgba(16,24,40,0.4)_60%,transparent)] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.45),rgba(255,255,255,0.45)_60%,transparent)]"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {COLS.map((c, ci) => (
                      <motion.div
                        key={c.key}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: FLOW, delay: 0.25 + ci * 0.1 }}
                        className="rounded-lg border border-line bg-paper p-4"
                      >
                        <p className="text-[13px] font-semibold text-muted mb-3">{c.title}</p>
                        <ul className="space-y-2">
                          {result[c.key].map((it, i) => (
                            <motion.li
                              key={it}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, ease: FLOW, delay: 0.4 + ci * 0.1 + i * 0.05 }}
                              className="text-[14.5px] text-heading leading-snug pl-3 border-l-2 border-line-strong"
                            >
                              {it}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={sendToAndrew}
                      className="inline-flex items-center justify-center gap-2 bg-carbon text-white dark:bg-white dark:text-[#101828] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-3.5 rounded-lg hover:bg-black transition-colors cursor-pointer"
                    >
                      Send this to Andrew
                      <Arrow className="w-4 h-4" />
                    </button>
                    <p className="text-[13px] text-muted">A sketch from your column names. The real thing is built around how your team actually works.</p>
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
