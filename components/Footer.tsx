import Image from "next/image";
import { FooterWordmark } from "./FooterWordmark";

const CALENDLY_URL = "https://calendly.com/flowrate/30min";
const EMAIL = "andrew@flowrate.agency";

const siteLinks = [
  { label: "What we build", href: "#services" },
  { label: "How a build works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Questions", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/flowrate.agency" },
  { label: "TikTok", href: "https://www.tiktok.com/@flowrate.agency" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/flowrate-agency/" },
  { label: "YouTube", href: "https://youtube.com/@flowrateagency" },
  { label: "Facebook", href: "https://www.facebook.com/share/197A29SQvL/" },
];

const policies = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

function Column({ title, links, external = false }: { title: string; links: { label: string; href: string }[]; external?: boolean }) {
  return (
    <div>
      <p className="text-white font-semibold text-[15px] mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-white/60 text-[14px] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-carbon overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-16 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-8 gap-y-12 pb-14 border-b border-white/10">
          <div className="col-span-2 lg:col-span-1">
            {/* Lock-up set in code: the mascot is the mark, the name in Archivo. No colour, like the rest of the footer. */}
            <div data-logo className="flex items-center gap-4 mb-6 w-fit">
              <Image
                src="/mascot.png"
                alt="Flowrate"
                width={1002}
                height={1530}
                className="h-[72px] w-auto drop-shadow-[0_6px_12px_rgba(0,0,0,0.45)]"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display uppercase text-white text-[26px] leading-[0.9] tracking-[-0.02em]">Flowrate</span>
                <span className="mt-1.5 text-white/50 text-[10.5px] font-semibold uppercase tracking-[0.26em] pl-[2px]">Agency</span>
              </div>
            </div>
            <p className="text-white/60 text-[15px] leading-relaxed max-w-[320px] mb-6">
              Custom systems for businesses that have outgrown WhatsApp and spreadsheets.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green text-[#0C1A0D] font-bold uppercase tracking-[0.025em] text-[13px] px-5 py-3 rounded-lg hover:bg-green-light transition-colors w-fit whitespace-nowrap"
              >
                Book a free call
              </a>
              <a href={`mailto:${EMAIL}`} className="text-white/70 text-[14px] hover:text-white transition-colors">
                {EMAIL}
              </a>
            </div>
          </div>
          <Column title="Site" links={siteLinks} />
          <Column title="Follow" links={socials} external />
          <Column title="Legal" links={policies} />
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between gap-3 text-white/40 text-[13px]">
          <p>&copy; {new Date().getFullYear()} Flowrate. All rights reserved.</p>
          <p>Designed and built by Flowrate.</p>
        </div>
      </div>
      <FooterWordmark />
    </footer>
  );
}
