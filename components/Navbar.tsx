"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FlowrateWordmark } from "./FlowrateLogo";

const links = [
  { label: "Work", href: "#portfolio" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060C07]/96 backdrop-blur-md border-b border-green/8 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" aria-label="Flowrate Agency home">
          <FlowrateWordmark className="h-7 w-auto" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-white/55 text-sm font-medium hover:text-white transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
          className="hidden md:inline-flex items-center bg-green text-[#060C07] font-bold px-5 py-2.5 rounded-full text-sm hover:bg-green-light transition-colors cursor-pointer"
        >
          Schedule a Call
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#060C07]/98 border-t border-green/10 px-6 py-6 flex flex-col gap-4"
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-white/70 text-base font-medium hover:text-white transition-colors py-1"
            >
              {l.label}
            </a>
          ))}
          <a
            href="mailto:andrewedwardmurray@gmail.com?subject=Free%20Mockup%20Request"
            className="mt-2 bg-green text-[#060C07] font-bold px-6 py-3 rounded-full text-sm text-center hover:bg-green-light transition-colors"
          >
            Schedule a Call
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
