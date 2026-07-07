"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const CALENDLY_URL = "https://calendly.com/andrewedwardmurray/30min";
const PHONE_DISPLAY = "+1 (469) 461-4225";
const PHONE_TEL = "tel:+14694614225";

const leftLinks = [
  { label: "Home", href: "/", active: true, chevron: false },
  { label: "About Us", href: "#about", active: false, chevron: true },
  { label: "Services", href: "#services", active: false, chevron: true },
];

function Chevron() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 mt-px">
      <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M4.2 2.6c.4-.4 1-.5 1.5-.2l2.4 1.5c.5.3.7.9.5 1.4l-.7 1.9c-.1.4 0 .8.3 1.1l3.5 3.5c.3.3.7.4 1.1.3l1.9-.7c.5-.2 1.1 0 1.4.5l1.5 2.4c.3.5.2 1.1-.2 1.5l-1.3 1.3c-.5.5-1.2.7-1.9.5-2.6-.8-5-2.3-7.1-4.4-2.1-2.1-3.6-4.5-4.4-7.1-.2-.7 0-1.4.5-1.9l1-1.6z" />
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
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 bg-[#050505]/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-b border-green/10 shadow-lg shadow-black/30" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 lg:h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left: nav links */}
        <nav className="hidden lg:flex items-center gap-7 justify-start">
          {leftLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`inline-flex items-center gap-1 text-[15px] font-semibold transition-colors duration-200 ${
                l.active ? "text-green" : "text-white/85 hover:text-white"
              }`}
            >
              {l.label}
              {l.chevron && <Chevron />}
            </a>
          ))}
        </nav>

        {/* Mobile: hamburger on the left so the mascot stays centered */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden justify-self-start p-2 -ml-2 text-white/80 hover:text-white transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>

        {/* Center: mascot, hangs slightly below the bar like the King Contractor nav */}
        <a href="/" aria-label="Flowrate Agency home" className="justify-self-center relative z-10">
          <Image
            src="/mascot.png"
            alt="Flowrate Agency mascot"
            width={1002}
            height={1530}
            priority
            className="h-16 lg:h-[104px] w-auto lg:-mb-8 drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)]"
          />
        </a>

        {/* Right: contact cluster */}
        <div className="hidden lg:flex items-center gap-6 justify-end">
          <a
            href="#contact"
            className="text-[15px] font-semibold text-white/85 hover:text-white transition-colors duration-200"
          >
            Contact Us
          </a>
          <a
            href={PHONE_TEL}
            className="inline-flex items-center gap-2 text-[15px] font-bold text-white hover:text-green transition-colors duration-200"
          >
            <span className="text-green"><PhoneIcon /></span>
            {PHONE_DISPLAY}
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green text-[#060C07] font-extrabold uppercase tracking-wide px-5 py-3 rounded-lg text-[13px] hover:bg-green-light transition-colors shadow-[0_0_24px_rgba(153,229,140,0.35)] cursor-pointer"
          >
            Free Custom Design
          </a>
        </div>

        {/* Mobile: spacer to balance the grid */}
        <span className="lg:hidden justify-self-end w-6" aria-hidden="true" />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-[#050505]/98 border-t border-green/10 px-6 py-6 flex flex-col gap-4"
        >
          {leftLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`text-base font-medium transition-colors py-1 ${
                l.active ? "text-green" : "text-white/75 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="text-white/75 text-base font-medium hover:text-white transition-colors py-1"
          >
            Contact Us
          </a>
          <a
            href={PHONE_TEL}
            className="inline-flex items-center gap-2 text-base font-bold text-white py-1"
          >
            <span className="text-green"><PhoneIcon /></span>
            {PHONE_DISPLAY}
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 bg-green text-[#060C07] font-extrabold uppercase tracking-wide px-6 py-3.5 rounded-lg text-sm text-center hover:bg-green-light transition-colors"
          >
            Free Custom Design
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
