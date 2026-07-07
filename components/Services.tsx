"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type SubFeature = { icon: React.ReactNode; title: string; desc: string };
type ServiceCard = {
  title: string;
  image: string;
  imageAlt: string;
  highlight?: { title: string; badge: string; desc: string };
  features: SubFeature[];
};

const iconClass = "w-5 h-5 text-green flex-shrink-0";

const PenIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M13.5 3.5l3 3-9 9H4.5v-3l9-9z" />
    <path d="M11.5 5.5l3 3" />
  </svg>
);
const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <rect x="3" y="4" width="14" height="13" rx="2" />
    <path d="M3 8h14M7 2v4M13 2v4" />
  </svg>
);
const UsersIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <circle cx="7" cy="7" r="3" />
    <path d="M2 17c0-2.8 2.2-5 5-5s5 2.2 5 5" />
    <circle cx="14.5" cy="8" r="2.2" />
    <path d="M14 12.5c2.2.3 4 2.2 4 4.5" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <circle cx="9" cy="9" r="6" />
    <path d="M17 17l-3.5-3.5" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M10 2a5 5 0 015 5c0 4-5 9-5 9s-5-5-5-9a5 5 0 015-5z" />
    <circle cx="10" cy="7" r="2" />
  </svg>
);
const ChartIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M3 17V8M8 17V4M13 17v-6M18 17V7" />
  </svg>
);
const MegaphoneIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M3 8v4l3 .5L14 16V4L6 7.5 3 8z" />
    <path d="M16 8a3 3 0 010 4" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M10 2L4 4.5v4c0 4.1 2.9 7.9 6 8.5 3.1-.6 6-4.4 6-8.5v-4L10 2z" />
  </svg>
);
const CursorIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M4 3l6 14 1.7-5.3L17 10 4 3z" />
  </svg>
);
const StoreIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M3 7l1-4h12l1 4M3 7v10h14V7M3 7h14M8 17v-5h4v5" />
  </svg>
);
const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 14.3l-4.8 2.6.9-5.4L2.2 7.7l5.4-.8L10 2z" />
  </svg>
);
const TrophyIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <path d="M6 3h8v5a4 4 0 01-8 0V3z" />
    <path d="M6 4H3v2a3 3 0 003 3M14 4h3v2a3 3 0 01-3 3M10 12v3M7 17h6" />
  </svg>
);
const MonitorIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <rect x="2" y="3" width="16" height="11" rx="2" />
    <path d="M6 18h8M10 14v4" />
  </svg>
);
const TargetIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
    <circle cx="10" cy="10" r="7" />
    <circle cx="10" cy="10" r="3.5" />
    <circle cx="10" cy="10" r="0.8" fill="currentColor" />
  </svg>
);

const cards: ServiceCard[] = [
  {
    title: "Custom Built Websites",
    image: "/services/custom-websites.png",
    imageAlt: "Irrigation website on a laptop on a mossy stone pedestal",
    highlight: {
      title: "AI Smart Website",
      badge: "Most Popular",
      desc: "Built with smart technology to turn late-night visitors into booked jobs.",
    },
    features: [
      {
        icon: <PenIcon />,
        title: "Signature Custom Website",
        desc: "100% custom design built around your brand. No templates.",
      },
      {
        icon: <TargetIcon />,
        title: "Essential Website",
        desc: "A lean, fast site built to turn visitors into quality leads.",
      },
    ],
  },
  {
    title: "Search Engine Optimization (SEO)",
    image: "/services/seo.png",
    imageAlt: "Google rankings chart climbing to position one for irrigation searches",
    features: [
      {
        icon: <SearchIcon />,
        title: "Technical SEO",
        desc: "Speed, structure, and crawlability tuned so Google takes you seriously.",
      },
      {
        icon: <PinIcon />,
        title: "Local SEO",
        desc: "Rank higher in local searches and the Google Map Pack.",
      },
      {
        icon: <ChartIcon />,
        title: "Content Marketing",
        desc: "Monthly blog posts that rank and bring in qualified leads.",
      },
    ],
  },
  {
    title: "Social Media Growth",
    image: "/services/social-media.png",
    imageAlt: "Stacked social media post mockups for a landscaping brand",
    features: [
      {
        icon: <PenIcon />,
        title: "Content Creation",
        desc: "High-quality posts that build trust with homeowners.",
      },
      {
        icon: <CalendarIcon />,
        title: "Scheduling & Posting",
        desc: "Consistent posting keeps your brand active while you work.",
      },
      {
        icon: <UsersIcon />,
        title: "Community Management",
        desc: "We engage your audience and grow your following for you.",
      },
    ],
  },
  {
    title: "Paid Ads Management",
    image: "/services/paid-ads.png",
    imageAlt: "Advertising dashboard with lead and cost metrics on a dark rock",
    features: [
      {
        icon: <MegaphoneIcon />,
        title: "Facebook & Instagram Ads",
        desc: "Qualified homeowner leads from tightly targeted campaigns.",
      },
      {
        icon: <ShieldIcon />,
        title: "Google Local Service Ads",
        desc: "Show at the top of Google and pay only for valid leads.",
      },
      {
        icon: <CursorIcon />,
        title: "PPC Campaign Management",
        desc: "Ongoing optimization that lowers your cost per lead.",
      },
    ],
  },
  {
    title: "Full Google Coverage",
    image: "/services/google-domination.png",
    imageAlt: "Google Business Profile, map pin, and review cards composite",
    features: [
      {
        icon: <StoreIcon />,
        title: "Google Business Profile",
        desc: "A fully optimized profile that owns your service area searches.",
      },
      {
        icon: <StarIcon />,
        title: "Reviews & Reputation",
        desc: "More 5-star reviews and the homeowner trust that follows.",
      },
      {
        icon: <TrophyIcon />,
        title: "Search, Maps & Ads Together",
        desc: "Hold more than one spot on the results page so you get the call.",
      },
    ],
  },
];

function Card({ card }: { card: ServiceCard }) {
  return (
    <div className="snap-start flex-shrink-0 w-[86vw] sm:w-[420px] bg-white/4 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="p-4 pb-0">
        <div className="relative rounded-2xl overflow-hidden bg-[#0A0A0A] aspect-[3/2]">
          <Image
            src={card.image}
            alt={card.imageAlt}
            fill
            sizes="(max-width: 640px) 86vw, 420px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col gap-5">
        <h3
          className="text-white uppercase text-2xl leading-tight"
          style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
        >
          {card.title}
        </h3>

        {card.highlight && (
          <div className="border border-green/40 bg-green/8 rounded-2xl px-5 py-4">
            <div className="flex items-center gap-3 mb-1.5">
              <MonitorIcon />
              <p className="text-white font-bold text-base">{card.highlight.title}</p>
            </div>
            <span className="inline-block bg-green text-[#060C07] text-[11px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full mb-2">
              {card.highlight.badge}
            </span>
            <p className="text-white/55 text-sm leading-relaxed">{card.highlight.desc}</p>
          </div>
        )}

        <ul className="space-y-5">
          {card.features.map((f) => (
            <li key={f.title} className="flex items-start gap-3.5">
              <span className="mt-0.5">{f.icon}</span>
              <div>
                <p className="text-white font-bold text-base mb-1">{f.title}</p>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Services() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);

  // Native smooth scrollTo gets cancelled by scroll-snap in Chromium, so
  // animate scrollLeft manually and pause snapping while the animation runs.
  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(":scope > div");
    const step = card ? card.offsetWidth + 24 : 440;
    const max = track.scrollWidth - track.clientWidth;
    const targetIndex = Math.round(track.scrollLeft / step) + direction;
    const target = Math.min(max, Math.max(0, targetIndex * step));

    cancelAnimationFrame(animRef.current);
    const start = track.scrollLeft;
    const dist = target - start;
    if (Math.abs(dist) < 1) return;
    if (document.hidden) {
      track.scrollLeft = target;
      return;
    }
    const duration = 420;
    const t0 = performance.now();
    const savedSnap = track.style.scrollSnapType;
    track.style.scrollSnapType = "none";

    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      track.scrollLeft = start + dist * eased;
      if (p < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        track.style.scrollSnapType = savedSnap;
      }
    };
    animRef.current = requestAnimationFrame(frame);
  }

  return (
    <section id="services" className="relative bg-[#050505] py-24 md:py-32 overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#99E58C 1px, transparent 1px), linear-gradient(90deg, #99E58C 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            className="text-white uppercase text-4xl md:text-5xl xl:text-6xl tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display), var(--font-jakarta), sans-serif" }}
          >
            Our <span className="text-green italic">Services</span>
          </h2>
          <p className="text-white font-bold text-xl md:text-2xl mb-5">
            Everything an Irrigation or Landscaping Company Needs to Get Found and Get Called
          </p>
          <p className="text-white/50 text-lg leading-relaxed max-w-3xl mx-auto">
            Great work deserves a brand that shows it. We handle the website,
            the rankings, and the content so homeowners in your area find you
            first, trust you fast, and call you instead of the next company on
            the list.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto snap-x snap-proximity pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {cards.map((c) => (
              <Card key={c.title} card={c} />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Previous service"
              className="w-11 h-11 rounded-full bg-green text-[#060C07] flex items-center justify-center hover:bg-green-light transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Next service"
              className="w-11 h-11 rounded-full bg-green text-[#060C07] flex items-center justify-center hover:bg-green-light transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
