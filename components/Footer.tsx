import Image from "next/image";

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
    <footer className="bg-carbon">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-8 gap-y-12 pb-14 border-b border-white/10">
          <div className="col-span-2 lg:col-span-1">
            <Image src="/footer-logo.png" alt="Flowrate" width={900} height={571} className="h-20 w-auto mb-6" />
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
    </footer>
  );
}
