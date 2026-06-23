import { FlowrateMark } from "./FlowrateLogo";

const links = [
  { label: "Work", href: "#portfolio" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-[#060C07] border-t border-[#99E58C]/10 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <FlowrateMark className="h-7 w-auto" />
              <span className="text-white font-extrabold text-base tracking-tight">Flowrate</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Web design for irrigation contractors. Built to convert the homeowner searching at 11pm.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-white/30 text-xs font-semibold tracking-widest uppercase mb-4">Navigation</p>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-white/50 text-sm hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white/30 text-xs font-semibold tracking-widest uppercase mb-4">Get in Touch</p>
            <div className="space-y-3">
              <a
                href="mailto:andrewedwardmurray@gmail.com"
                className="flex items-center gap-2.5 text-white/50 text-sm hover:text-white transition-colors"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-green/70">
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
                andrewedwardmurray@gmail.com
              </a>
              <a
                href="https://youtu.be/P5xOuZLpS34"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-white/50 text-sm hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green/70">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                Watch how we build sites
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#99E58C]/8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            &copy; {new Date().getFullYear()} Flowrate Agency. All rights reserved.
          </p>
          <p className="text-white/25 text-xs">
            Irrigation web design specialist · Austin, TX &amp; beyond
          </p>
        </div>
      </div>
    </footer>
  );
}
