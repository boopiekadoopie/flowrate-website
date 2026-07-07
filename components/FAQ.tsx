"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What services does Flowrate Agency offer?",
    a: "Flowrate is a full-service web design and marketing partner for irrigation, landscaping, and home service companies. We build custom, conversion-focused websites and run local SEO, Google Business Profile management, blog content, and monthly performance reporting.",
  },
  {
    q: "How does the website design process work with Flowrate?",
    a: "It starts with a free strategy call. We gather your business info and goals, then show you the design direction before any build work begins. Once you approve it, we build the full site in 3 to 4 weeks, review it together, and launch.",
  },
  {
    q: "How long does it take to build my website?",
    a: "Typically 3 to 4 weeks depending on complexity. We would rather take the time to get it right than rush out something generic.",
  },
  {
    q: "How much does a website cost?",
    a: "Every build is custom-quoted, decided live on a free strategy call. There is no fixed price list because no two businesses need the same site. Book the call and we will scope it together.",
  },
  {
    q: "How much does SEO cost?",
    a: "SEO runs $500 to $5,000 per month depending on your market competition and goals. Unlike paid ads, which stop generating leads the moment you stop paying, SEO builds long-term equity that keeps generating leads for years.",
  },
  {
    q: "Can you help me update my existing website?",
    a: "Yes, and it is the most common situation. We audit your current site, show you exactly what is costing you leads, and build a replacement that fixes it. Your domain stays the same, so there is no disruption to your existing traffic.",
  },
  {
    q: "What if I don't like the design?",
    a: "We show you the design direction before any build work begins. If you don't like it, we revise it or you walk away at no cost. Nothing is invoiced until you approve the direction.",
  },
  {
    q: "How do I get started with Flowrate Agency?",
    a: "Book your free 30-minute Website and SEO Strategy Call, or send a message through the chat in the corner. You can also email andrew@flowrate.agency and Andrew will get back to you personally.",
  },
];

function Item({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={`rounded-2xl border transition-colors duration-300 ${
        open
          ? "bg-[#0A0A0A] border-[#0A0A0A]"
          : "bg-white border-slate-200/60 shadow-sm"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 md:px-8 py-6 text-left gap-4 cursor-pointer"
        aria-expanded={open}
      >
        <span
          className={`font-extrabold uppercase tracking-wide text-sm md:text-base ${
            open ? "text-white" : "text-ink"
          }`}
        >
          {q}
        </span>
        <span className="w-9 h-9 rounded-full bg-green flex items-center justify-center flex-shrink-0">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className={`w-4 h-4 text-[#060C07] transition-transform duration-200 ${open ? "rotate-45" : ""}`}
          >
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-white/60 text-sm md:text-base leading-relaxed px-6 md:px-8 pb-7 -mt-1">
          {a}
        </p>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section className="bg-[#F4F5F4] py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-green-dark font-semibold text-xs tracking-widest uppercase mb-4">FAQ</p>
          <h2
            className="text-ink uppercase text-3xl md:text-5xl tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
          >
            Frequently Asked <span className="text-green-dark italic">Questions</span>
          </h2>
          <p className="text-slate-500 text-lg">
            If it is not here, email us directly or ask the chat in the corner.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
