const bullets = [
  "2 years hands-on at Controlled Irrigation CC, Johannesburg",
  "Saw great contractors lose bids to worse ones — bad websites",
  "Built Flowrate to fix that problem for good",
  "Every site is designed around the homeowner's fear, not a template",
];

export function About() {
  return (
    <section id="about" className="bg-[#060C07] py-20 md:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Photo column */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] max-w-sm mx-auto lg:mx-0 rounded-3xl overflow-hidden ring-2 ring-[#99E58C]/20 shadow-2xl relative bg-[#0C1A0D]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/andrew.jpg"
                alt="Andrew Murray, Founder of Flowrate Agency"
                className="w-full h-full object-cover object-top"
              />
              {/* Vignette to blend white bg */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse 82% 78% at 50% 32%, transparent 42%, #060C07 84%)",
                }}
              />
              {/* Name plate */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-[#060C07]/80 backdrop-blur-sm rounded-xl p-4 border border-[#99E58C]/15">
                  <p className="text-white font-bold text-sm">Andrew Murray</p>
                  <p className="text-green text-xs mt-0.5">Founder, Flowrate Agency</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 12 12" fill="#99E58C" className="w-3 h-3">
                        <path d="M6 1l1.29 2.618 2.888.42-2.089 2.037.493 2.875L6 7.618l-2.582 1.332.493-2.875L1.822 4.038l2.888-.42L6 1z" />
                      </svg>
                    ))}
                    <span className="text-white/40 text-[10px] ml-1">Irrigation specialist</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative corner accents */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-green/30 rounded-tl-2xl hidden lg:block" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-green/30 rounded-br-2xl hidden lg:block" />
          </div>

          {/* Text column */}
          <div className="order-1 lg:order-2">
            <p className="text-green font-semibold text-xs tracking-widest uppercase mb-6">About Flowrate</p>
            <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight leading-[1.08] mb-6">
              I&apos;ve worked in this industry.
              <span className="block text-white/40 mt-1 text-3xl md:text-4xl">
                I know what homeowners are afraid of.
              </span>
            </h2>

            <div className="space-y-4 text-white/60 leading-relaxed text-[1rem] mb-8">
              <p>
                I spent two years as a design draughtsman at an irrigation company in Johannesburg. I saw the same problem on repeat: great contractors losing work to mediocre ones because their website looked untrustworthy.
              </p>
              <p>
                Homeowners do not know which contractor is actually good. They judge by the website. A professional site is not a nice-to-have. It is the thing that makes the phone ring.
              </p>
            </div>

            <ul className="space-y-3 mb-10">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 flex-shrink-0 mt-0.5">
                    <circle cx="8" cy="8" r="7" fill="#99E58C" fillOpacity="0.15" />
                    <path d="M5 8l2.5 2.5L11 6" stroke="#99E58C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-white/70 text-sm">{b}</span>
                </li>
              ))}
            </ul>

            <div className="pt-8 border-t border-white/8">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-green text-[#060C07] font-bold px-7 py-3.5 rounded-full text-sm hover:bg-green-light transition-colors cursor-pointer"
              >
                Work with Andrew
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
