"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const fields = [
  { name: "name", label: "Full Name:", type: "text" },
  { name: "phone", label: "Phone:", type: "tel" },
  { name: "email", label: "Email:", type: "email" },
  { name: "website", label: "Website URL (if you have one):", type: "text" },
  { name: "jobs", label: "Jobs You Run Per Week (roughly):", type: "text" },
];

const promises = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
        <path d="M8 11h6M11 8v6" />
      </svg>
    ),
    text: "An honest review of your current website: what works, and what is quietly costing you jobs.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M4 20V10M10 20V4M16 20v-8M21 20H3" />
      </svg>
    ),
    text: "How you stack up on Google against the companies winning your service area right now.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M4 6h16M4 12h16M4 18h10" />
        <path d="M18 16l2 2 3-3" />
      </svg>
    ),
    text: "The exact fixes we would make first, in plain words you can act on with or without us.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
    text: "Sent straight to your inbox. No meeting required, no strings attached.",
  },
];

export function LeadCapture() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function mailtoFallback() {
    const body = [
      `Name: ${values.name || ""}`,
      `Phone: ${values.phone || ""}`,
      `Email: ${values.email || ""}`,
      `Website: ${values.website || ""}`,
      `Jobs per week: ${values.jobs || ""}`,
      "",
      "Requesting the free website and market breakdown.",
    ].join("\n");
    window.location.href = `mailto:andrew@flowrate.agency?subject=${encodeURIComponent(
      "Free Website Breakdown Request",
    )}&body=${encodeURIComponent(body)}`;
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

  return (
    <section className="bg-[#F4F5F4] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

        {/* LEFT: form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-slate-200/60 overflow-hidden max-w-xl w-full mx-auto lg:mx-0"
        >
          {/* Dark gradient header with mascot */}
          <div className="relative bg-[radial-gradient(ellipse_at_top,rgba(37,90,45,0.85)_0%,#0A1A0B_55%,#050505_100%)] px-8 pt-8 pb-7 text-center">
            <Image
              src="/mascot.png"
              alt="Flowrate Agency mascot"
              width={1002}
              height={1530}
              className="h-36 w-auto mx-auto -mt-2 mb-4 drop-shadow-[0_12px_20px_rgba(0,0,0,0.5)]"
            />
            <p
              className="text-white uppercase text-2xl tracking-tight mb-2"
              style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
            >
              Want us to <span className="text-green italic">take a look?</span>
            </p>
            <p className="text-white/60 text-sm leading-relaxed">
              Drop your details below and we will send your free breakdown.
            </p>
          </div>

          {/* Fields / confirmation */}
          {status === "sent" ? (
            <div className="p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-green/15 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-green-dark">
                  <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-ink font-bold text-lg mb-2">Got it. Your breakdown is on the way.</p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Andrew reviews every request personally. Expect your breakdown
                within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              {fields.map((f) => (
                <input
                  key={f.name}
                  type={f.type}
                  required={f.name === "name" || f.name === "email"}
                  placeholder={f.label}
                  value={values[f.name] || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-5 py-3.5 text-ink text-sm placeholder-slate-400 outline-none focus:border-green-dark transition-colors"
                />
              ))}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-green text-[#060C07] font-extrabold uppercase tracking-wide text-sm px-6 py-4 rounded-xl hover:bg-green-light transition-colors shadow-[0_0_30px_rgba(153,229,140,0.45)] cursor-pointer disabled:opacity-60 disabled:cursor-default"
              >
                {status === "sending" ? "Sending..." : "Send My Free Breakdown"}
              </button>
              <p className="text-slate-400 text-xs text-center pt-1">
                No spam, no follow-up sequence. One useful email.
              </p>
            </form>
          )}
        </motion.div>

        {/* RIGHT: pitch */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:pt-6"
        >
          <h2
            className="text-ink uppercase text-4xl md:text-5xl leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
          >
            Your market. <span className="text-green-dark italic">Our game plan.</span> Free.
          </h2>
          <p className="text-ink font-extrabold uppercase text-lg md:text-xl leading-snug mb-5">
            A quick, no-pressure breakdown of what is holding your website back
            and how we would fix it.
          </p>
          <p className="text-slate-500 leading-relaxed mb-9">
            Most agencies want you on a sales call before they show you
            anything. We would rather show you first,{" "}
            <strong className="text-ink">completely free:</strong>
          </p>

          <div className="space-y-4">
            {promises.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                className="group flex items-center gap-5 rounded-2xl border border-slate-300 bg-white text-ink px-6 py-5 transition-colors duration-300 cursor-default hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white"
              >
                <span className="flex-shrink-0 text-green-dark transition-colors duration-300 group-hover:text-green">{p.icon}</span>
                <p className="font-bold text-sm md:text-base leading-snug uppercase">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
