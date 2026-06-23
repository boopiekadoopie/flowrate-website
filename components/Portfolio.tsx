const deliverables = [
  "Full 6-page website",
  "On-page SEO + schema markup",
  "Google Business Profile setup",
  "Google review widget",
  "Trust badges + lead capture form",
  "Mobile-optimized, fast-loading",
];

export function Portfolio() {
  return (
    <section id="portfolio" className="bg-surface py-20 md:py-28 relative">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: "radial-gradient(#99E58C22 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-green-dark font-semibold text-xs tracking-widest uppercase mb-4">Recent Work</p>
          <h2 className="text-ink font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Built for real irrigation businesses
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Every site is designed from scratch around the homeowner decision journey — not a generic template.
          </p>
        </div>

        {/* Client showcase */}
        <div className="bg-[#060C07] rounded-3xl overflow-hidden border border-[#99E58C]/15 shadow-2xl max-w-5xl mx-auto">
          {/* Browser chrome */}
          <div className="bg-[#0C1A0D] px-4 py-3 flex items-center gap-3 border-b border-[#99E58C]/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
            </div>
            <div className="flex-1 bg-[#060C07] rounded-md px-3 py-1.5 flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-green/60 flex-shrink-0">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1z" stroke="currentColor" strokeWidth="1.2" />
                <path d="M5.5 8s0-3 2.5-3 2.5 3 2.5 3-0 3-2.5 3S5.5 8 5.5 8z" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="text-white/50 text-xs font-mono">sunlineirrigation.com</span>
            </div>
          </div>

          {/* Site preview image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/section-lawn.jpg"
              alt="Sunline Irrigation website"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060C07]/80 via-transparent to-transparent" />

            {/* Overlay badge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <p className="text-white font-bold text-xl">Sunline Irrigation</p>
                <p className="text-green text-sm">Austin, TX — Full site + monthly retainer</p>
              </div>
              <div className="flex gap-2">
                <div className="bg-green/15 border border-green/30 rounded-lg px-3 py-1.5 text-green text-xs font-semibold">Live</div>
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-4">What We Delivered</p>
              <ul className="space-y-2.5">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-3">
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0">
                      <circle cx="8" cy="8" r="7" fill="#99E58C" fillOpacity="0.15" />
                      <path d="M5 8l2.5 2.5L11 6" stroke="#99E58C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-white/70 text-sm">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col justify-between">
              <div className="bg-[#0C1A0D] rounded-2xl p-6 border border-[#99E58C]/10">
                <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-3">Result</p>
                <p className="text-white/80 text-sm leading-relaxed italic">
                  &ldquo;Professional site built fast, exactly what we needed to stand out from competitors in the Austin market.&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-green/15 flex items-center justify-center text-green font-bold text-sm">S</div>
                  <div>
                    <p className="text-white text-xs font-semibold">Sunline Irrigation</p>
                    <p className="text-white/40 text-[10px]">Austin, TX</p>
                  </div>
                </div>
              </div>

              <a
                href="#contact"
                className="mt-4 text-center bg-green text-[#060C07] font-bold px-6 py-3.5 rounded-xl text-sm hover:bg-green-light transition-colors cursor-pointer"
              >
                Get a site like this
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          More client sites in progress. Yours could be next.
        </p>
      </div>
    </section>
  );
}
