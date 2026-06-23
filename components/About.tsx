export function About() {
  return (
    <section className="bg-navy py-20 md:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text column */}
          <div>
            <p className="text-teal-light font-semibold text-xs tracking-widest uppercase mb-6">
              About Flowrate
            </p>
            <h2 className="text-white font-extrabold text-4xl md:text-5xl tracking-tight leading-[1.08] mb-6">
              I&apos;ve worked in this industry.
              <span className="block text-silver/60 mt-1">
                I know what homeowners are afraid of.
              </span>
            </h2>
            <div className="space-y-4 text-silver leading-relaxed text-[1rem]">
              <p>
                I spent two years as a design draughtsman at an irrigation
                company in Johannesburg. I saw the same problem on repeat:
                great contractors losing work to mediocre ones because their
                website looked untrustworthy.
              </p>
              <p>
                Homeowners do not know which contractor is actually good.
                They judge by the website. A professional site is not a
                nice-to-have. It is the thing that makes the phone ring.
              </p>
              <p>
                I built Flowrate to fix that. Every site I build is designed
                around the specific fears and decision triggers of a homeowner
                choosing an irrigation contractor.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal/20 ring-1 ring-teal/30 flex items-center justify-center flex-shrink-0">
                <span className="text-teal-light font-extrabold text-lg">A</span>
              </div>
              <div>
                <p className="text-white font-semibold">Andrew Murray</p>
                <p className="text-silver/60 text-sm">Founder, Flowrate Agency</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/andrew.jpg"
                alt="Andrew Murray, Founder of Flowrate Agency"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gold/10 rounded-xl -z-10 hidden lg:block" />
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-teal/10 rounded-xl -z-10 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
