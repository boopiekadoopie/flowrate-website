const steps = [
  {
    number: "01",
    title: "Free mockup",
    description:
      "I design your homepage upfront at no cost. You keep it whether we work together or not. No strings attached.",
  },
  {
    number: "02",
    title: "You approve, we build",
    description:
      "Once you like the direction, I build the full site. Most projects are live in under two weeks.",
  },
  {
    number: "03",
    title: "Live and generating leads",
    description:
      "Your site goes live, SEO-ready, built to convert the homeowner browsing at 11pm deciding who to call in the morning.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-ink font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Three steps, no risk
          </h2>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            You see the full design before you spend a dollar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connector line between steps (desktop) */}
          <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-teal/40 via-gold/40 to-teal/40" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center md:items-start md:text-left"
            >
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mb-6 ring-1 ring-teal/30">
                <span className="text-gold font-extrabold text-xl tracking-tight">
                  {step.number}
                </span>
              </div>
              <h3 className="text-ink font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
