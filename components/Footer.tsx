import Image from "next/image";

const CALENDLY_URL = "https://calendly.com/andrewedwardmurray/30min";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Blog", href: "/blog" },
];

const socials = [
  { label: "TikTok", href: "https://www.tiktok.com/@flowrate.agency" },
  { label: "Instagram", href: "https://www.instagram.com/flowrate.agency" },
  { label: "YouTube", href: "https://youtube.com/@flowrateagency" },
  { label: "Facebook", href: "https://www.facebook.com/share/197A29SQvL/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/flowrate-agency/" },
];

const policies = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  const marqueeItems = Array.from({ length: 10 });

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Marquee band */}
      <div className="border-b border-white/8 py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {marqueeItems.map((_, i) => (
            <span
              key={i}
              className="flex items-center flex-shrink-0 text-white uppercase font-extrabold text-3xl md:text-5xl tracking-tight px-4"
              style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
            >
              AI Website &amp; Marketing
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-8 md:h-8 text-green ml-8">
                <path d="M7 3h10v6a5 5 0 01-10 0V3z" />
                <path d="M7 5H4v2a4 4 0 004 3M17 5h3v2a4 4 0 01-4 3" />
                <path d="M12 14v4M8 21h8M9 18h6" />
              </svg>
            </span>
          ))}
        </div>
      </div>

      {/* Gradient body: black fading into deep green toward the bottom */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(37,90,45,0.55)_0%,rgba(10,26,11,0.4)_45%,transparent_75%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-12 mb-14">
            {/* Brand + contact */}
            <div>
              <Image
                src="/footer-logo.png"
                alt="Flowrate Agency"
                width={900}
                height={571}
                className="h-20 w-auto mb-6"
              />
              <div className="space-y-3 text-white/60 text-sm">
                <a href="mailto:andrew@flowrate.agency" className="block hover:text-white transition-colors">
                  andrew@flowrate.agency
                </a>
                <a href="tel:+14694614225" className="block hover:text-white transition-colors">
                  +1 (469) 461-4225
                </a>
                <p>Message us any time, day or night.</p>
                <p className="text-white/45 leading-relaxed max-w-xs pt-2">
                  A website that wins you jobs, not just compliments. That is
                  our promise.
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-white font-bold text-lg mb-5">Quick Links</p>
              <ul className="space-y-3">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-white/55 text-sm hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <p className="text-white font-bold text-lg mb-5">Social</p>
              <ul className="space-y-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/55 text-sm hover:text-white transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies + CTA */}
            <div>
              <p className="text-white font-bold text-lg mb-5">Terms &amp; Policies</p>
              <ul className="space-y-3 mb-9">
                {policies.map((p) => (
                  <li key={p.label}>
                    <a href={p.href} className="text-white/55 text-sm hover:text-white transition-colors">
                      {p.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-white font-bold text-lg mb-4">Let&apos;s Talk</p>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green text-[#060C07] font-bold text-sm px-6 py-3.5 rounded-lg hover:bg-green-light transition-colors shadow-[0_0_28px_rgba(153,229,140,0.3)]"
              >
                Book Your Free Strategy Call
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            <div className="flex items-start gap-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white flex-shrink-0" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
                <path d="M14.8 9.7A3.2 3.2 0 1014.8 14.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <div className="text-white/40 text-xs leading-relaxed max-w-md">
                <p className="text-white/60 mb-1">All rights reserved.</p>
                <p>
                  The imitation or duplication of our media as a representation
                  of your own work is prohibited.
                </p>
              </div>
            </div>
            <p
              className="text-white uppercase text-5xl md:text-6xl leading-none select-none"
              style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
            >
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
