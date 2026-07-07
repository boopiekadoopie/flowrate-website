const CALENDLY_URL = "https://calendly.com/andrewedwardmurray/30min";

export function CtaBanner() {
  return (
    <section id="contact" className="relative py-28 md:py-36 overflow-hidden bg-[#050505]">
      {/* Green radial glow, bottom center */}
      <div className="absolute bottom-[-40%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(153,229,140,0.14)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,199,44,0.07)_0%,transparent_65%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2
          className="text-white uppercase text-3xl md:text-5xl xl:text-[52px] leading-[1.1] tracking-tight mb-8"
          style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
        >
          Ready to own the{" "}
          <span className="text-green italic">best home service website</span>{" "}
          in your market?
        </h2>

        <p className="text-white/55 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Custom website design, SEO, and digital marketing for irrigation,
          landscaping, and home service companies that want to win their local
          market. Free design direction first. Nothing invoiced until you
          approve it.
        </p>

        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green text-[#060C07] font-extrabold uppercase tracking-wide text-base px-10 py-5 rounded-xl hover:bg-green-light transition-colors shadow-[0_0_50px_rgba(153,229,140,0.35)] cursor-pointer"
        >
          Get Your Free Custom Design
        </a>

        <p className="text-white/35 text-sm mt-8">
          Or email directly:{" "}
          <a
            href="mailto:andrew@flowrate.agency"
            className="text-green hover:text-green-light underline underline-offset-2 transition-colors"
          >
            andrew@flowrate.agency
          </a>
        </p>
      </div>
    </section>
  );
}
