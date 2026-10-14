"use client";
import { useEffect, useRef, useState } from "react";
import { WinkMascot } from "@/components/WinkMascot";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { mascot, POSES } from "@/lib/mascot";
import { play } from "@/lib/sound";
import { Arrow, CALENDLY_URL, Check, Container, EMAIL, H2, Lede, Reveal } from "./ui";

// When the message goes, the fields fold away one after another and the form becomes one card: what was sent
const foldOut: Variants = { exit: { opacity: 0, y: -18, transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] } } };
const FLOW = [0.22, 1, 0.36, 1] as const;

const inputs = [
  { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "company", label: "Business name", type: "text", required: false, autoComplete: "organization" },
  { name: "phone", label: "Phone", type: "tel", required: false, autoComplete: "tel" },
];

export function LeadCapture({ prefill }: { prefill?: string } = {}) {
  const [values, setValues] = useState<Record<string, string>>(prefill ? { message: prefill } : {});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const doneRef = useRef<HTMLParagraphElement>(null);

  // Move focus to the confirmation so keyboard and screen-reader users know it went through.
  useEffect(() => {
    if (status === "sent") {
      doneRef.current?.focus();
      setTimeout(() => mascot.play("lead", "wink"), 350);
      play("chord", 0.8, 150);
    }
  }, [status]);

  // The mascot on top of the form keeps an eye on it: he leans toward the field being filled in, gives a
  // small lift when a field is done, and a sideways look (plus a friendly line, never a red error) when
  // something looks off.
  const [hints, setHints] = useState<Record<string, string>>({});
  const HINT: Record<string, string> = { email: "That email looks a little off. Mind checking it?" };
  const buddy = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => mascot.lean("lead", e.currentTarget),
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      mascot.lean("lead", null);
      if (!el.value.trim()) return;
      if (el.checkValidity()) {
        mascot.play("lead", "lift");
      } else {
        mascot.hold("lead", POSES.sideEye);
        setTimeout(() => mascot.hold("lead", { l: 0, r: 0 }), 900);
        const msg = HINT[el.name];
        if (msg) setHints((h) => ({ ...h, [el.name]: msg }));
      }
    },
  };
  // Spam checks: when the visitor started typing, and a hidden field only bots fill in.
  const startedAt = useRef<number | null>(null);
  const [trap, setTrap] = useState("");

  function mailtoHref() {
    const body = [
      `Name: ${values.name || ""}`,
      `Email: ${values.email || ""}`,
      `Business: ${values.company || ""}`,
      `Phone: ${values.phone || ""}`,
      "",
      values.message || "",
    ].join("\n");
    return `mailto:${EMAIL}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: trap, startedAt: startedAt.current }),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      // Delivery not configured or failed: say so and offer email, rather than opening the mail app unasked.
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const set = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    startedAt.current ??= Date.now();
    setValues((v) => ({ ...v, [name]: e.target.value }));
    if (hints[name]) setHints((h) => ({ ...h, [name]: "" }));
  };

  const field =
    "w-full bg-paper border border-line-strong rounded-lg px-4 py-3 text-heading text-[16px] placeholder:text-faint outline-none focus:border-heading focus-visible:ring-2 focus-visible:ring-heading/25 transition-colors";

  return (
    <section id="contact" className="bg-canvas py-20 md:py-28">
      <Container>
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-20 items-start">
          <div className="lg:pt-6">
            <H2 className="mb-6">Tell us the job you&apos;d love to stop doing by hand.</H2>
            <Lede className="mb-9 max-w-[520px]">
              A few lines is enough. Andrew reads every message himself and replies with
              how he&apos;d approach it, whether or not that ends with us working together.
            </Lede>
            <Reveal className="flex flex-col gap-3 text-[15px]">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-heading font-semibold w-fit"
              >
                Rather talk? Book a free 30-minute call
                <Arrow className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <a href={`mailto:${EMAIL}`} className="text-body hover:text-heading w-fit">
                Or email {EMAIL}
              </a>
            </Reveal>
          </div>

          <Reveal className="relative pt-28">
            {/* Mascot leaning on the top of the form */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 right-6 sm:right-10 w-[120px] z-0"
              aria-hidden
            >
              <WinkMascot sizes="120px" role="lead" className="w-full" imgClassName="block w-full h-auto" />
            </motion.div>

            <div className="relative z-10 rounded-lg bg-paper border border-line shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scaleY: 0.72, y: -12 }}
                  animate={{ opacity: 1, scaleY: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: FLOW }}
                  style={{ originY: 0 }}
                  className="relative py-6"
                >
                  <div className="w-11 h-11 mb-5 rounded-lg bg-ok-bg text-ok flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <p ref={doneRef} tabIndex={-1} className="text-heading font-bold text-[20px] mb-2 outline-none">
                    Got it{values.name?.trim() ? `, ${values.name.trim().split(" ")[0]}` : ""}. Thanks.
                  </p>
                  <p className="text-body text-[15px] leading-relaxed">
                    Andrew will read it and reply{values.email ? <> to <span className="text-heading font-semibold">{values.email}</span></> : null} personally.
                  </p>
                  {values.message?.trim() && (
                    <p className="mt-5 border-l-2 border-heading/60 pl-4 text-[14px] text-body leading-relaxed line-clamp-3 [overflow-wrap:anywhere]">
                      {values.message.trim()}
                    </p>
                  )}
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0, opacity: 0.9 }}
                    animate={{ scaleX: 1, opacity: 0.35 }}
                    transition={{ scaleX: { duration: 0.5, ease: FLOW, delay: 0.2 }, opacity: { duration: 1.2, delay: 0.8 } }}
                    className="absolute inset-x-0 -bottom-px h-px origin-left bg-[linear-gradient(90deg,transparent,rgba(16,24,40,0.45)_20%,rgba(16,24,40,0.45)_80%,transparent)] dark:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5)_20%,rgba(255,255,255,0.5)_80%,transparent)]"
                  />
                </motion.div>
              ) : (
                <motion.form key="form" exit="exit" variants={{ exit: { transition: { staggerChildren: 0.04 } } }} onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
                    Leave this empty
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                  </label>
                  {inputs.map((f) => (
                    <motion.label variants={foldOut} key={f.name} className="flex flex-col gap-1.5">
                      <span className="text-[14px] font-medium text-heading">
                        {f.label}
                        {!f.required && <span className="text-faint font-normal"> (optional)</span>}
                      </span>
                      <input
                        type={f.type}
                        name={f.name}
                        required={f.required}
                        autoComplete={f.autoComplete}
                        value={values[f.name] || ""}
                        onChange={set(f.name)}
                        {...buddy}
                        aria-describedby={hints[f.name] ? `hint-${f.name}` : undefined}
                        className={field}
                      />
                      {hints[f.name] && (
                        <span id={`hint-${f.name}`} className="text-[13px] text-body leading-snug">
                          {hints[f.name]}
                        </span>
                      )}
                    </motion.label>
                  ))}
                  <motion.label variants={foldOut} className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-[14px] font-medium text-heading">What&apos;s the job?</span>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={values.message || ""}
                      onChange={set("message")}
                      {...buddy}
                      placeholder="e.g. Every Friday we copy job sheets from WhatsApp into a spreadsheet, then into the accounts."
                      className={`${field} resize-y min-h-[120px] leading-[1.5]`}
                    />
                  </motion.label>
                  <motion.button
                    variants={foldOut}
                    type="submit"
                    disabled={status === "sending"}
                    className="sm:col-span-2 mt-1 inline-flex items-center justify-center gap-2 bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-4 rounded-lg hover:bg-green-light transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default"
                  >
                    {status === "sending" ? "Sending…" : "Send it to Andrew"}
                    {status !== "sending" && <Arrow className="w-4 h-4" />}
                  </motion.button>
                  <div role="status" aria-live="polite" className="sm:col-span-2 empty:hidden">
                    {status === "sending" && <span className="sr-only">Sending your message</span>}
                    {status === "error" && (
                      <p className="rounded-lg border border-hold/30 bg-hold-bg text-hold dark:text-[#F3C96B] px-4 py-3 text-[14px] leading-snug">
                        That didn&apos;t send, sorry. Your message is still here.{" "}
                        <a href={mailtoHref()} className="font-semibold underline underline-offset-2">
                          Email it to Andrew instead
                        </a>
                        .
                      </p>
                    )}
                  </div>
                  <p className="sm:col-span-2 text-muted text-[13px] text-center">
                    No mailing list, no follow-up sequence. Just a reply.
                  </p>
                </motion.form>
              )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
