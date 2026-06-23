export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Full-bleed background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Dark gradient overlay — heavier left so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#060C07]/95 via-[#060C07]/80 to-[#060C07]/50" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060C07] to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left column: copy ── */}
          <div>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-green/10 border border-green/25 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
              <span className="text-green font-semibold text-xs tracking-widest uppercase">
                Irrigation Web Design Specialist
              </span>
            </div>

            <h1 className="text-white font-extrabold text-5xl md:text-6xl lg:text-[3.8rem] leading-[1.05] tracking-tight mb-6">
              Your Clients Are Searching Right Now.
              <span className="block text-green mt-2">Make Sure They Find You.</span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-xl mb-10">
              I build high-converting websites for irrigation contractors — designed around the specific fears of homeowners choosing who to trust with their lawn.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { value: "2 weeks", label: "Build to live" },
                { value: "Free", label: "First mockup" },
                { value: "100%", label: "Satisfaction guarantee" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-green font-extrabold text-2xl leading-none">{s.value}</span>
                  <span className="text-white/50 text-xs mt-1 tracking-wide uppercase">{s.label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="bg-green text-[#060C07] font-bold px-8 py-4 rounded-full text-base hover:bg-green-light transition-colors cursor-pointer text-center"
              >
                Schedule a Free Call
              </a>
              <a
                href="#portfolio"
                className="border border-white/25 text-white font-semibold px-8 py-4 rounded-full text-base hover:bg-white/8 hover:border-white/50 transition-colors cursor-pointer text-center"
              >
                See Our Work
              </a>
            </div>

            <p className="mt-5 text-white/40 text-sm">
              No commitment. I design your homepage first — free.
            </p>
          </div>

          {/* ── Right column: Andrew's photo ── */}
          <div className="hidden lg:flex flex-col items-center gap-6">
            {/* Main portrait */}
            <div className="relative">
              <div className="w-72 h-80 rounded-3xl overflow-hidden ring-2 ring-green/30 shadow-2xl bg-[#0C1A0D]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/andrew.jpg"
                  alt="Andrew Murray, Founder of Flowrate Agency"
                  className="w-full h-full object-cover object-top"
                />
                {/* Bottom name plate */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#060C07] to-transparent">
                  <p className="text-white font-bold text-sm">Andrew Murray</p>
                  <p className="text-green text-xs">Founder, Flowrate Agency</p>
                </div>
              </div>

              {/* Floating badge — top right */}
              <div className="absolute -top-4 -right-4 bg-[#0C1A0D] border border-green/30 rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-green font-extrabold text-lg leading-none">1</p>
                <p className="text-white/60 text-[10px] mt-0.5 leading-tight">Client site<br />live</p>
              </div>

              {/* Floating badge — bottom left */}
              <div className="absolute -bottom-4 -left-4 bg-[#0C1A0D] border border-green/30 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-green/15 flex items-center justify-center">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                    <circle cx="8" cy="8" r="8" fill="#99E58C" fillOpacity="0.2" />
                    <path d="M4.5 8L7 10.5L11.5 6" stroke="#99E58C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-xs leading-none">Irrigation-only</p>
                  <p className="text-white/40 text-[10px] mt-0.5">specialist agency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <span className="text-white/50 text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
