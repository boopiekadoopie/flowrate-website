"use client";
import { FlowrateWordmark } from "./FlowrateLogo";

const links = [
  { label: "Work", href: "#portfolio" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#060C07]/92 backdrop-blur-md border-b border-[#99E58C]/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <FlowrateWordmark />

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-white/60 hover:text-white transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="bg-green text-[#060C07] font-bold text-sm px-5 py-2.5 rounded-full hover:bg-green-light transition-colors cursor-pointer"
        >
          Schedule a Call
        </a>
      </div>
    </nav>
  );
}
