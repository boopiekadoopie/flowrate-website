"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Arrow, CALENDLY_URL, Check, Container, EMAIL, H2, Lede, Reveal } from "./ui";

const inputs = [
  { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "company", label: "Business name", type: "text", required: false, autoComplete: "organization" },
  { name: "phone", label: "Phone", type: "tel", required: false, autoComplete: "tel" },
];

export function LeadCapture() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function mailtoFallback() {
    const body = [
      `Name: ${values.name || ""}`,
      `Email: ${values.email || ""}`,
      `Business: ${values.company || ""}`,
      `Phone: ${values.phone || ""}`,
      "",
      values.message || "",
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setStatus("sent");
        return;
      }
      // Delivery not configured or failed: open the visitor's email app instead.
      mailtoFallback();
      setStatus("idle");
    } catch {
      mailtoFallback();
      setStatus("idle");
    }
  }

  const set = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  const field =
    "w-full bg-paper border border-line-strong rounded-lg px-4 py-3 text-heading text-[16px] placeholder:text-faint outline-none focus:border-heading transition-colors";

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
              <Image src="/mascot.png" alt="" width={1002} height={1530} className="w-full h-auto" />
            </motion.div>

            <div className="relative z-10 rounded-lg bg-paper border border-line shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] p-6 sm:p-8">
              {status === "sent" ? (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 mx-auto mb-5 rounded-lg bg-ok-bg text-ok flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="text-heading font-bold text-[20px] mb-2">Got it. Thanks.</p>
                  <p className="text-body text-[15px] leading-relaxed max-w-[340px] mx-auto">
                    Andrew will read it and reply to you personally.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {inputs.map((f) => (
                    <label key={f.name} className="flex flex-col gap-1.5">
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
                        className={field}
                      />
                    </label>
                  ))}
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-[14px] font-medium text-heading">What&apos;s the job?</span>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={values.message || ""}
                      onChange={set("message")}
                      placeholder="e.g. Every Friday we copy delivery notes from WhatsApp into a spreadsheet, then into the accounts."
                      className={`${field} resize-y min-h-[120px] leading-[1.5]`}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="sm:col-span-2 mt-1 inline-flex items-center justify-center gap-2 bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[14px] px-6 py-4 rounded-lg hover:bg-green-light transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default"
                  >
                    {status === "sending" ? "Sending…" : "Send it to Andrew"}
                    {status !== "sending" && <Arrow className="w-4 h-4" />}
                  </button>
                  <p className="sm:col-span-2 text-muted text-[13px] text-center">
                    No mailing list, no follow-up sequence. Just a reply.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
