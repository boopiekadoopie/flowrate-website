import { FlowrateMark } from "./FlowrateLogo";

export function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5">
              <FlowrateMark className="h-6 w-auto" />
              <span className="text-white font-extrabold text-base tracking-tight">
                Flowrate
              </span>
            </div>
            <p className="text-silver/50 text-sm">
              Web design for irrigation contractors.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <a
              href="mailto:andrewedwardmurray@gmail.com"
              className="text-silver/60 text-sm hover:text-white transition-colors"
            >
              andrewedwardmurray@gmail.com
            </a>
            <a
              href="https://youtu.be/P5xOuZLpS34"
              target="_blank"
              rel="noopener noreferrer"
              className="text-silver/60 text-sm hover:text-white transition-colors flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-teal/70">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              Watch how we build sites
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-silver/30 text-xs">
            &copy; {new Date().getFullYear()} Flowrate Agency. All rights reserved.
          </p>
          <a
            href="#contact"
            className="text-teal-light/60 text-xs hover:text-teal-light transition-colors"
          >
            Book a free call
          </a>
        </div>
      </div>
    </footer>
  );
}
