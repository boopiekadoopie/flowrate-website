import { FlowrateWordmark } from "./FlowrateLogo";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <FlowrateWordmark />
        <a
          href="#contact"
          className="bg-gold text-ink font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors hover:bg-gold-light cursor-pointer"
        >
          Book a free call
        </a>
      </div>
    </nav>
  );
}
