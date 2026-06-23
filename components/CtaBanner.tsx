export function CtaBanner() {
  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/section-golden.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Dark overlay — heavier so text reads cleanly */}
      <div className="absolute inset-0 bg-[#060C07]/85" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#99E58C 1px, transparent 1px), linear-gradient(90deg, #99E58C 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <p className="text-green font-semibold text-xs tracking-widest uppercase mb-6">Ready to grow?</p>
        <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight leading-[1.08] mb-5">
          Want to see what your site could look like?
        </h2>
        <p className="text-white/65 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          I design your homepage for free. No commitment, no invoice. You keep the design regardless of what you decide.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
            className="bg-green text-[#060C07] font-bold px-10 py-4 rounded-full text-base transition-colors hover:bg-green-light cursor-pointer"
          >
            Get your free mockup
          </a>
          <a
            href="https://youtu.be/P5xOuZLpS34"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/25 text-white font-semibold px-10 py-4 rounded-full text-base hover:bg-white/8 hover:border-white/50 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
            Watch how we build
          </a>
        </div>

        <p className="text-white/40 text-sm">
          Or email directly:{" "}
          <a
            href="mailto:andrewedwardmurray@gmail.com"
            className="text-green hover:text-green-light underline underline-offset-2 transition-colors"
          >
            andrewedwardmurray@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
