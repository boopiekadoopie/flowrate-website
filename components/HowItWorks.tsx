const steps = [
  {
    number: "01",
    title: "Free mockup — no strings",
    description:
      "I design your homepage upfront at zero cost. You keep the design whether we work together or not. See exactly what you're getting before spending a cent.",
    detail: "Most agencies charge $500+ just for a discovery call.",
  },
  {
    number: "02",
    title: "You approve, we build",
    description:
      "Once you like the direction, I build the full site in under two weeks. All copy written, all images sourced, all pages designed. You just give feedback.",
    detail: "Average build time: 10 business days.",
  },
  {
    number: "03",
    title: "Live and generating leads",
    description:
      "Your site goes live, SEO-optimized, Google Business Profile connected, mobile-perfect. Built to convert the homeowner browsing at 11pm deciding who to call.",
    detail: "Ongoing retainer available for monthly SEO and updates.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0C1A0D] py-20 md:py-28 relative overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#99E58C 1px, transparent 1px), linear-gradient(90deg, #99E58C 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-green font-semibold text-xs tracking-widest uppercase mb-4">The Process</p>
          <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Three steps, no risk
          </h2>
          <p className="text-white/50 text-lg max-w-md mx-auto">
            You see the full design before you spend a dollar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-8 h-px bg-green/20 z-10 -translate-x-0" />
              )}

              <div className="bg-[#060C07] rounded-2xl p-8 border border-[#99E58C]/12 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center mb-6 flex-shrink-0">
                  <span className="text-green font-extrabold text-xl tracking-tight">{step.number}</span>
                </div>
                <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-white/55 leading-relaxed text-sm flex-1">{step.description}</p>
                <p className="mt-5 pt-5 border-t border-white/8 text-green/70 text-xs font-medium">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
