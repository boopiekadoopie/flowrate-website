export function Hero() {
  return (
    <section className="bg-navy min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#0E7490 1px, transparent 1px), linear-gradient(90deg, #0E7490 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-fr-green inline-block" />
          <span className="text-teal-light font-semibold text-xs tracking-widest uppercase">
            Web design for irrigation contractors
          </span>
        </div>

        <h1 className="text-white font-extrabold text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.06] tracking-tight mb-6">
          Homeowners Google
          <br />
          three companies.
          <br />
          <span className="text-gold">Make sure they call yours.</span>
        </h1>

        <p className="text-silver text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          I build websites that win the trust of homeowners who are anxious
          about being overcharged, so they pick my clients first.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#how-it-works"
            className="border border-white/20 text-white font-semibold px-8 py-4 rounded-lg text-base transition-colors hover:bg-white/8 hover:border-white/40 cursor-pointer"
          >
            See how it works
          </a>
          <a
            href="#contact"
            className="bg-gold text-ink font-semibold px-8 py-4 rounded-lg text-base transition-colors hover:bg-gold-light cursor-pointer"
          >
            Book a free call
          </a>
        </div>

        <p className="mt-8 text-silver/60 text-sm">
          Free homepage mockup. No commitment.
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
          <span className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
