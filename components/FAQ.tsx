"use client";
import { useState } from "react";

const faqs = [
  {
    q: "How long does a website take to build?",
    a: "Two weeks from deposit to live site. Most projects finish in 10 business days. You see a full homepage design before we start — if revisions are needed, we address them before building the rest.",
  },
  {
    q: "Do I need to provide my own content and photos?",
    a: "No. I write all the copy, source industry imagery, and handle everything. You provide basic business details (services, service areas, phone number) and I do the rest. If you have your own photos, even better.",
  },
  {
    q: "What if I don&apos;t like the design?",
    a: "I design your homepage first, for free, before any payment. You approve the direction before work begins. Once in the build phase, two revision rounds are included. If you never approve the mockup, there is no charge.",
  },
  {
    q: "Do you work with non-irrigation contractors?",
    a: "No. Flowrate works exclusively with irrigation companies. That specialization is why the sites convert better — every trust signal, every CRO decision, and every word of copy is built around the homeowner choosing an irrigation contractor specifically.",
  },
  {
    q: "What does the monthly retainer include?",
    a: "The $500/month retainer covers: Google Business Profile updates each month, two seasonal blog posts, local keyword rank tracking with monthly reports, priority site edits, and ongoing SEO maintenance. You can cancel at any time with 30 days notice.",
  },
  {
    q: "What if I already have a website?",
    a: "That is actually the most common situation. I will audit your current site, show you exactly what is costing you leads, and build a replacement that fixes those issues. Your current domain stays the same — no disruption to your existing traffic.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-ink font-semibold text-base">{q}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={`w-5 h-5 flex-shrink-0 text-green transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <p
          className="text-slate-500 text-sm leading-relaxed pb-5"
          dangerouslySetInnerHTML={{ __html: a }}
        />
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-green-dark font-semibold text-xs tracking-widest uppercase mb-4">FAQ</p>
          <h2 className="text-ink font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Common questions
          </h2>
          <p className="text-slate-500 text-lg">
            If it is not here, email me directly.
          </p>
        </div>

        <div className="bg-surface rounded-3xl p-6 md:p-10 border border-slate-100">
          {faqs.map((f) => (
            <Item key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
