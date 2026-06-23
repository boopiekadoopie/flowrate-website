export function Guarantee() {
  return (
    <section className="bg-[#0C1A0D] py-20 md:py-24 relative overflow-hidden">
      {/* Background image with overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/section-aerial.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
      />
      <div className="absolute inset-0 bg-[#060C07]/80" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Shield icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-green/12 border border-green/25 flex items-center justify-center">
          <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10 text-green">
            <path d="M16 3L4 8v8c0 7.18 5.16 13.88 12 15.5C22.84 29.88 28 23.18 28 16V8L16 3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M11 16.5l3.5 3.5L22 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="text-green font-semibold text-xs tracking-widest uppercase mb-4">My Guarantee</p>
        <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight mb-6 leading-tight">
          If you don&apos;t love the design,
          <span className="block text-green">I&apos;ll redo it. Free.</span>
        </h2>
        <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          I design your homepage before you pay anything. If you approve, we build. If you don&apos;t like the direction, there is no invoice. No risk to you at any stage of the process.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
          {[
            { title: "Free mockup first", sub: "See it before you pay" },
            { title: "Revision rounds included", sub: "Until you love it" },
            { title: "Cancel anytime", sub: "Retainer, no lock-in" },
          ].map((g) => (
            <div key={g.title} className="bg-[#060C07]/60 border border-green/15 rounded-2xl px-5 py-4">
              <p className="text-white font-semibold text-sm">{g.title}</p>
              <p className="text-white/40 text-xs mt-1">{g.sub}</p>
            </div>
          ))}
        </div>

        <a
          href="#contact"
          className="inline-block bg-green text-[#060C07] font-bold px-10 py-4 rounded-full text-base hover:bg-green-light transition-colors cursor-pointer"
        >
          Claim your free mockup
        </a>
      </div>
    </section>
  );
}
