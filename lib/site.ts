/* Site-wide constants that both server and client components can import. */
export const CALENDLY_URL = "https://calendly.com/flowrate/30min";
/* Andrew's WhatsApp (his own cell, owner's choice 2026-11-06). The greeting is pre-typed, so a visitor only finishes the sentence. */
export const WHATSAPP_URL = `https://wa.me/27824104936?text=${encodeURIComponent("Hi Andrew, I found Flowrate online. I'd like to chat about ")}`;

/* The default share picture. Pages that set their own openGraph replace the root one entirely (Next merges metadata
 * shallowly), so each of those pages passes this in, or links shared to WhatsApp/LinkedIn show no picture. */
export const OG_IMAGES = [
  {
    url: "/og-home-v2.jpg",
    width: 2400,
    height: 1260,
    alt: "Flowrate: we build the systems your business runs on. Example: a signed job card sent from a phone becomes a draft invoice.",
  },
];
