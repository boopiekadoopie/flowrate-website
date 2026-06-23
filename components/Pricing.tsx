const websiteFeatures = [
  "Full website (up to 6 service pages)",
  "About, Gallery, FAQ, Contact pages",
  "Google review widget above the fold",
  "On-page SEO and schema markup",
  "Google Maps embed",
  "Trust badges and lead capture form",
  "Mobile-optimized and fast-loading",
  "Two revision rounds included",
];

const retainerFeatures = [
  "Everything in the website build",
  "Monthly Google Business profile updates",
  "Seasonal blog posts (2 per month)",
  "Local keyword rank tracking",
  "Monthly performance report",
  "Priority support and site edits",
];

function Check({ highlighted }: { highlighted?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0">
      <circle cx="8" cy="8" r="7" fill="#99E58C" fillOpacity={highlighted ? 0.25 : 0.12} />
      <path d="M5 8l2.5 2.5L11 6" stroke="#99E58C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="bg-surface py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-green-dark font-semibold text-xs tracking-widest uppercase mb-4">Pricing</p>
          <h2 className="text-ink font-extrabold text-4xl md:text-5xl tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            One package. One add-on. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Website Build */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Website Build
            </p>
            <h3 className="text-ink font-extrabold text-4xl mb-1">$1,200</h3>
            <p className="text-slate-400 text-sm mb-6">one-time</p>
            <p className="text-slate-600 leading-relaxed mb-8 text-sm">
              A complete, professional website built to convert irrigation leads. Designed around what homeowners actually need to see before they call.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              {websiteFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check />
                  <span className="text-slate-600 text-sm">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="block w-full text-center bg-ink text-white font-semibold px-6 py-3.5 rounded-full text-sm transition-colors hover:bg-[#1a2b1b] cursor-pointer"
            >
              Get started
            </a>
          </div>

          {/* Website + Retainer */}
          <div className="bg-[#060C07] rounded-3xl p-8 border border-[#99E58C]/20 shadow-2xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#99E58C]/8 rounded-full blur-2xl pointer-events-none" />
            <div className="relative flex flex-col h-full">
              <div className="inline-block bg-[#99E58C]/15 text-green text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3 w-fit">
                Recommended
              </div>
              <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-3">
                Website + Monthly Retainer
              </p>
              <h3 className="text-white font-extrabold text-4xl mb-1">$1,200</h3>
              <p className="text-green text-sm font-semibold mb-6">+ $500 / month</p>
              <p className="text-white/60 leading-relaxed mb-8 text-sm">
                Everything in the website build, plus ongoing SEO, monthly updates, and rank tracking so you stay ahead of every competitor in your market.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {retainerFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <Check highlighted />
                    <span className="text-white/70 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block w-full text-center bg-green text-[#060C07] font-bold px-6 py-3.5 rounded-full text-sm transition-colors hover:bg-green-light cursor-pointer"
              >
                Schedule a free call
              </a>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          50% deposit on design approval. 50% on delivery. Retainer billed monthly, cancel anytime.
        </p>
      </div>
    </section>
  );
}
