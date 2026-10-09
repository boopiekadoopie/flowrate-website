"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { MotionToggle } from "./MotionToggle";

const CALENDLY_URL = "https://calendly.com/flowrate/30min";

const leftLinks = [
  { label: "What we build", href: "/#services", active: false, chevron: false },
  { label: "How it works", href: "/#how-it-works", active: false, chevron: false },
  { label: "About", href: "/#about", active: false, chevron: false },
];

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 mt-px">
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
      {open ? (
        <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fr-drop-in fixed top-0 inset-x-0 z-50 bg-paper/90 backdrop-blur-md border-b border-line transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_3px_rgba(0,0,0,0.06)]" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16">
        {/* Mobile bar: mascot on the left, hamburger on the right */}
        <div className="lg:hidden flex items-center justify-between h-full">
          <Link href="/" aria-label="Flowrate home" className="flex items-center">
            <Image
              src="/mascot.png"
              alt="Flowrate"
              width={1002}
              height={1530}
              priority
              sizes="32px"
              className="h-11 w-auto drop-shadow-[0_4px_8px_rgba(16,24,40,0.18)]"
            />
          </Link>
          <div className="flex items-center gap-1">
          <ThemeToggle compact />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 -mr-2 text-body hover:text-heading transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
          </div>
        </div>

        {/* Desktop bar: links / centered mascot / contact cluster */}
        <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-4 h-full">
          <nav className="flex items-center gap-7 justify-start">
            {leftLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={`inline-flex items-center gap-1 text-[14px] font-semibold transition-colors duration-200 ${
                  l.active ? "text-heading" : "text-body hover:text-heading"
                }`}
              >
                {l.label}
                {l.chevron && <Chevron />}
              </a>
            ))}
          </nav>

          <Link href="/" aria-label="Flowrate home" className="justify-self-center relative z-10">
            <Image
              src="/mascot.png"
              alt="Flowrate"
              width={1002}
              height={1530}
              priority
              sizes="64px"
              className="h-[92px] w-auto -mb-9 drop-shadow-[0_8px_14px_rgba(16,24,40,0.22)]"
            />
          </Link>

          <div className="flex items-center gap-6 justify-end">
            <div className="flex items-center gap-2">
              <MotionToggle />
              <ThemeToggle />
            </div>
            <Link
              href="/#contact"
              className="text-[14px] font-semibold text-body hover:text-heading transition-colors duration-200"
            >
              Contact
            </Link>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] px-5 py-2.5 rounded-lg text-[13px] hover:bg-green-light transition-colors cursor-pointer"
            >
              Book a free call
            </a>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-paper border-t border-line px-6 py-6 flex flex-col gap-4"
        >
          {leftLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`text-base font-medium transition-colors py-1 ${
                l.active ? "text-heading" : "text-body hover:text-heading"
              }`}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="text-body text-base font-medium hover:text-heading transition-colors py-1"
          >
            Contact
          </Link>
          <MotionToggle variant="row" />
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] px-6 py-3.5 rounded-lg text-sm text-center hover:bg-green-light transition-colors"
          >
            Book a free call
          </a>
        </motion.div>
      )}
    </header>
  );
}
