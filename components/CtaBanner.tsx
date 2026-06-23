export function CtaBanner() {
  return (
    <section id="contact" className="bg-teal py-20 md:py-28 relative overflow-hidden">
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight leading-[1.08] mb-4">
          Want to see what your site could look like?
        </h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          I design your homepage for free. No commitment, no invoice. You
          keep the design regardless of what you decide.
        </p>

        <a
          href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
          className="inline-block bg-gold text-ink font-bold px-10 py-4 rounded-lg text-base transition-colors hover:bg-gold-light cursor-pointer shadow-lg"
        >
          Get your free mockup
        </a>

        <p className="mt-6 text-white/60 text-sm">
          Or email{" "}
          <a
            href="mailto:andrewedwardmurray@gmail.com"
            className="text-white underline hover:text-white/80 transition-colors"
          >
            andrewedwardmurray@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
